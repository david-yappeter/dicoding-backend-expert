/* istanbul ignore file */
const { currentDateIso } = require('../src/utils/time');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
  async addThreadComment({
    id = 'thread-comments-123',
    content = 'content',
    threadId = 'thread-123',
    owner = 'user-123,',
    created_at = currentDateIso(),
  }) {
    const query = {
      text: 'INSERT INTO thread_comments (id, content, thread_id, owner, created_at, updated_at, deleted_at) VALUES($1, $2, $3, $4, $5, $5, $6)',
      values: [id, content, threadId, owner, created_at, null],
    };

    await pool.query(query);
  },

  async getById(id) {
    const query = {
      text: 'SELECT * FROM thread_comments where id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getByThreadId(id) {
    const query = {
      text: 'SELECT * FROM thread_comments where thread_id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM thread_comments WHERE 1=1');
  },
};

module.exports = ThreadCommentsTableTestHelper;
