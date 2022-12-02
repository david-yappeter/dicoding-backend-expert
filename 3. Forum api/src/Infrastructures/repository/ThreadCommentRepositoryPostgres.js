const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RegisteredThreadComment = require('../../Domains/thread-comments/entities/RegisteredThreadComment');
const ThreadCommentRepository = require('../../Domains/thread-comments/ThreadCommentRepository');

class ThreadCommentRepositoryPostgres extends ThreadCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async _verifyThreadExists(threadId) {
    const query = {
      text: 'SELECT EXISTS(SELECT * FROM threads WHERE id = $1)',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result?.rows[0]?.exists) {
      throw new NotFoundError('Thread tidak ada');
    }
  }

  async addThreadComment(registerThread) {
    await this._verifyThreadExists();

    const { content, owner } = registerThread;
    const id = `thread-comments-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3) RETURNING id, content, owner',
      values: [id, content, owner],
    };

    const result = await this._pool.query(query);

    return new RegisteredThreadComment({ ...result.rows[0] });
  }
}

module.exports = ThreadCommentRepositoryPostgres;
