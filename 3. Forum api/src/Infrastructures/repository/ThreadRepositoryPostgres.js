const { currentDateIso } = require('../../utils/time');
const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(registerThread) {
    const { title, body, owner } = registerThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads(id, title, body, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $5) RETURNING id, title, body, owner',
      values: [id, title, body, owner, currentDateIso()],
    };

    const result = await this._pool.query(query);

    return new RegisteredThread({ ...result.rows[0] });
  }

  async getThreadDetailById(id) {
    const query = {
      text: 'SELECT t.*, u.username FROM threads t LEFT JOIN users u ON u.id = t.owner WHERE t.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new RegisteredThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
