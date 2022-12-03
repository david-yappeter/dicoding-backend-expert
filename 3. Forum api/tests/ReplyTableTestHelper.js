/* istanbul ignore file */
const { currentDateIso } = require('../src/utils/time');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
  async addReply({
    id = 'reply-123',
    content = 'content',
    thread_comment_id = 'thread-comments-123',
    owner = 'user-123',
    created_at = currentDateIso(),
    updated_at = currentDateIso(),
  }) {
    const query = {
      text: 'INSERT INTO replies (id, content, thread_comment_id, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, thread_comment_id, owner, created_at, updated_at,  deleted_at',
      values: [id, content, thread_comment_id, owner, created_at, updated_at],
    };

    await pool.query(query);
  },

  async findById(id) {
    const query = {
      text: 'SELECT * FROM replies where id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findByThreadCommentId(threadCommentId) {
    const query = {
      text: 'SELECT * FROM replies where thread_comment_id = $1',
      values: [threadCommentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = ReplyTableTestHelper;
