const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist register thread and return registered thread correctly', async () => {
      // Arrange
      const registerThread = new RegisterThread({
        title: 'thread title',
        body: 'thread body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(registerThread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return registered thread correctly', async () => {
      // Arrange
      const registerThread = new RegisterThread({
        title: 'thread title',
        body: 'thread body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const registeredThread = await threadRepositoryPostgres.addThread(
        registerThread
      );

      // Assert
      expect(registeredThread).toStrictEqual(
        new RegisteredThread({
          id: 'thread-123',
          title: 'thread title',
          body: 'thread body',
        })
      );
    });
  });
});
