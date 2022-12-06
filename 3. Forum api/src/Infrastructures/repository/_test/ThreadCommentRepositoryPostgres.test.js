const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RegisteredThreadComment = require('../../../Domains/thread-comments/entities/RegisteredThreadComment');
const RegisterThreadComment = require('../../../Domains/thread-comments/entities/RegisterThreadComment');
const { currentDateIso } = require('../../../utils/time');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostgres = require('../ThreadCommentRepositoryPostgres');

describe('ThreadCommentRepositoryPostgres', () => {
  const userA = {
    id: 'user-123A',
    fullname: 'User A',
    password: 'usera-123',
    username: 'user_a',
  };
  const userB = {
    id: 'user-123B',
    fullname: 'User B',
    password: 'usera-123',
    username: 'user_b',
  };
  const threadA = {
    id: 'thread-123',
    title: 'Thread A',
    body: 'thread body A',
    owner: userA.id,
  };
  const threadB = {
    id: 'thread-1234',
    title: 'Thread B',
    body: 'thread body B',
    owner: userB.id,
  };

  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await UsersTableTestHelper.addUser(userA);
    await UsersTableTestHelper.addUser(userB);

    await ThreadTableTestHelper.cleanTable();
    await ThreadTableTestHelper.addThread(threadA);
    await ThreadTableTestHelper.addThread(threadB);
  });

  afterAll(async () => {
    pool.end();
  });

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
  });

  // describe('verifyThreadExists function', () => {
  //   it('should return thread not exist', async () => {
  //     const threadCommentRepositoryPostgres =
  //       new ThreadCommentRepositoryPostgres(pool, {});

  //     // Action & assert
  //     await expect(
  //       threadCommentRepositoryPostgres.verifyThreadExists('xxx')
  //     ).rejects.toThrow(NotFoundError);
  //   });

  //   it('should return thread exist', async () => {
  //     // Arrange
  //     const threadCommentRepositoryPostgres =
  //       new ThreadCommentRepositoryPostgres(pool, {});

  //     // Action & assert
  //     await expect(
  //       threadCommentRepositoryPostgres.verifyThreadExists(threadA.id)
  //     ).resolves.not.toThrow(Error);
  //   });
  // });

  describe('addThreadComment function', () => {
    it('should persist register thread comment and return registered thread correctly', async () => {
      // Arrange
      const registerThreadComment = new RegisterThreadComment({
        content: 'Content A',
        threadId: threadA.id,
        owner: userA.id,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadCommentRepositoryPostgres.addThreadComment(
        registerThreadComment
      );

      // Assert
      const threadComments = await ThreadCommentsTableTestHelper.getByThreadId(
        registerThreadComment.threadId
      );
      expect(threadComments).toHaveLength(1);
    });

    it('should return registered thread comment', async () => {
      // Arrange
      const registerThreadComment = new RegisterThreadComment({
        content: 'Content A',
        threadId: threadA.id,
        owner: userA.id,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredThreadComment =
        await threadCommentRepositoryPostgres.addThreadComment(
          registerThreadComment
        );

      // Assert
      expect(registeredThreadComment).toStrictEqual(
        new RegisteredThreadComment({
          ...registerThreadComment,
          id: 'thread-comments-123',
        })
      );
    });
  });

  describe('getById function', () => {
    it('should throw Not Found', async () => {
      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadCommentRepositoryPostgres.getById('xxx')
      ).rejects.toThrow(NotFoundError);
    });

    it('should get registered thread correctly', async () => {
      const currentTime = currentDateIso();
      // Arrange
      const threadComment = {
        id: 'thread-comments-123',
        content: 'content',
        owner: userA.id,
        threadId: threadA.id,
        created_at: currentTime,
        updated_at: currentTime,
      };

      await ThreadCommentsTableTestHelper.addThreadComment(threadComment);

      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const response = await threadCommentRepositoryPostgres.getById(
        threadComment.id
      );

      // Assert
      expect(response).toStrictEqual(
        new RegisteredThreadComment(threadComment)
      );
    });
  });

  describe('fetchThreadCommentsByThreadId function', () => {
    it('should return array length 0', async () => {
      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      const threadComments =
        await threadCommentRepositoryPostgres.fetchThreadCommentsByThreadId(
          'xxx'
        );

      expect(threadComments).toHaveLength(0);
    });

    it('should return array length 1', async () => {
      const currentTime = currentDateIso();
      // Arrange
      const threadComment = {
        id: 'thread-comments-123',
        content: 'content',
        owner: userA.id,
        threadId: threadA.id,
        username: userA.username,
        created_at: currentTime,
        updated_at: currentTime,
      };

      await ThreadCommentsTableTestHelper.addThreadComment(threadComment);

      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, {});

      // Action
      const response =
        await threadCommentRepositoryPostgres.fetchThreadCommentsByThreadId(
          threadComment.threadId
        );

      // Assert
      expect(response).toHaveLength(1);
      expect(response[0]).toStrictEqual(
        new RegisteredThreadComment(threadComment)
      );
    });
  });

  describe('softDeleteThreadCommentById function', () => {
    it('should soft', async () => {
      const currentTime = currentDateIso();
      // Arrange
      const threadComment = {
        id: 'thread-comments-123',
        content: 'content',
        owner: userA.id,
        threadId: threadA.id,
        username: userA.username,
        created_at: currentTime,
        updated_at: currentTime,
      };

      await ThreadCommentsTableTestHelper.addThreadComment(threadComment);

      const threadCommentRepositoryPostgres =
        new ThreadCommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadCommentRepositoryPostgres.softDeleteThreadCommentById(
          threadComment.threadId
        )
      ).resolves.not.toThrow(Error);
    });
  });
});
