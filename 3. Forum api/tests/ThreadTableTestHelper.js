/* istanbul ignore file */
const { currentDateIso } = require('../src/utils/time');
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadTableTestHelper = {
  async addThread({
    id = 'thread-123',
    title = 'dicoding',
    body = 'body',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads(id, title, body, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $5)',
      values: [id, title, body, owner, currentDateIso()],
    };

    await pool.query(query);
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads where id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadTableTestHelper;
