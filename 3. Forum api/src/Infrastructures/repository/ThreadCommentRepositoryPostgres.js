const { currentDateIso } = require('../../utils/time');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RegisteredThreadComment = require('../../Domains/thread-comments/entities/RegisteredThreadComment');
const ThreadCommentRepository = require('../../Domains/thread-comments/ThreadCommentRepository');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyThreadExists(threadId) {
    const query = {
      text: 'SELECT EXISTS(SELECT * FROM threads WHERE id = $1)',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result?.rows[0]?.exists) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }

  async addThreadComment(registerThreadComment) {
    const { content, threadId, owner } = registerThreadComment;
    await this.verifyThreadExists(threadId);

    const id = `thread-comments-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, thread_id, owner',
      values: [id, content, threadId, owner, currentDateIso()],
    };

    const result = await this._pool.query(query);

    return RegisteredThreadComment.DbConstructor({ ...result.rows[0] });
  }

  async getById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return RegisteredThreadComment.DbConstructor({ ...result.rows[0] });
  }

  async fetchThreadCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT tc.*, u.username FROM thread_comments tc INNER JOIN users u ON u.id = tc.owner WHERE tc.thread_id = $1',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((row) =>
      RegisteredThreadComment.DbConstructor({ ...row })
    );
  }

  async softDeleteThreadCommentById(threadCommentId) {
    const query = {
      text: 'UPDATE thread_comments SET deleted_at = $1 WHERE id = $2',
      values: [currentDateIso(), threadCommentId],
    };

    await this._pool.query(query);
  }
}

module.exports = ThreadCommentRepositoryPostgres;
