const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const { currentDateIso } = require('../../../utils/time');

describe('ThreadRepositoryPostgres', () => {
  const userA = {
    id: 'user-123A',
    fullname: 'User A',
    password: 'usera-123',
    username: 'user_a',
  };

  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await UsersTableTestHelper.addUser(userA);
  });

  afterAll(async () => {
    pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  describe('addThread function', () => {
    it('should persist register thread and return registered thread correctly', async () => {
      // Arrange
      const registerThread = new RegisterThread({
        title: 'First Thread',
        body: 'body of first thread',
        owner: userA.id,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(registerThread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadById('thread-123');

      expect(threads).toHaveLength(1);
    });

    it('should return registered thread correctly', async () => {
      // Arrange
      const registerThread = new RegisterThread({
        title: 'First Thread',
        body: 'body of first thread',
        owner: userA.id,
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
          title: registerThread.title,
          body: registerThread.body,
          owner: registerThread.owner,
        })
      ); // Arrange
    });

    it('should return NotFound error when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & assert
      return expect(
        threadRepositoryPostgres.getThreadDetailById('xxx')
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe('getThreadDetailById function', () => {
    it('should return registered thread', async () => {
      // Arrange
      const currentTime = currentDateIso();
      const thread = {
        id: 'thread-123',
        title: 'First Thread',
        body: 'body of first thread',
        username: 'user_a',
        owner: userA.id,
        created_at: currentTime,
        updated_at: currentTime,
      };

      await ThreadTableTestHelper.addThread(thread);

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const response = await threadRepositoryPostgres.getThreadDetailById(
        thread.id
      );

      // Assert
      expect(response).toStrictEqual(new RegisteredThread(thread));
    });

    it('should return registered thread correctly', async () => {
      // Arrange
      const registerThread = new RegisterThread({
        title: 'First Thread',
        body: 'body of first thread',
        owner: userA.id,
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
          title: registerThread.title,
          body: registerThread.body,
          owner: registerThread.owner,
        })
      ); // Arrange
    });

    it('should return NotFound error when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & assert
      return expect(
        threadRepositoryPostgres.getThreadDetailById('xxx')
      ).rejects.toThrowError(NotFoundError);
    });
  });
});
