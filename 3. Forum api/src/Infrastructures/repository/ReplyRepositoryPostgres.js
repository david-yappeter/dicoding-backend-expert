const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RegisteredReply = require('../../Domains/replies/entities/RegisteredReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const thread = require('../../Interfaces/http/api/thread');
const { currentDateIso } = require('../../utils/time');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(registerReply) {
    const { content, thread_comment_id, owner } = registerReply;
    const id = `reply-${this._idGenerator()}`;
    const currentTime = currentDateIso();

    const query = {
      text: 'INSERT INTO replies (id, content, thread_comment_id, owner, created_at, updated_at, deleted_at) VALUES($1, $2, $3, $4, $5, $5, $6) RETURNING id, content, thread_comment_id, owner, created_at, updated_at, deleted_at',
      values: [id, content, thread_comment_id, owner, currentTime, null],
    };

    const result = await this._pool.query(query);

    return new RegisteredReply({ ...result.rows[0] });
  }

  async getById(replyId) {
    const query = {
      text: 'SELECT r.*, u.username FROM replies r LEFT JOIN users u ON u.id = r.owner WHERE r.id = $1',
      values: [replyId],
    };
    const query2 = {
      text: 'SELECT * FROM replies',
    };

    const result = await this._pool.query(query);
    const result2 = await this._pool.query(query2);

    if (result.rowCount === 0) {
      throw new NotFoundError('reply tidak ditemukan');
    }

    return new RegisteredReply({ ...result.rows[0] });
  }

  async fetchByThreadCommentIds(threadCommentIds) {
    if (Array.isArray(threadCommentIds) && threadCommentIds.length === 0) {
      return [];
    }

    const query = {
      text: `SELECT r.*, r.created_at as date, u.username FROM replies r LEFT JOIN users u ON u.id = r.owner WHERE r.thread_comment_id IN (${threadCommentIds
        .map((_, idx) => `$${idx + 1}`)
        .join(',')})
        ORDER BY created_at ASC
        `,
      values: [...threadCommentIds],
    };

    const result = await this._pool.query(query);

    return result.rows.map(
      (reply) =>
        new RegisteredReply({
          ...reply,
        })
    );
  }

  async softDeleteById(replyId) {
    const query = {
      text: 'UPDATE replies SET deleted_at = $1 WHERE id = $2',
      values: [currentDateIso(), replyId],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
