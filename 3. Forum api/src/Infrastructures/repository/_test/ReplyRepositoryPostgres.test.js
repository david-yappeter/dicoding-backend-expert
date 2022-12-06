const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const RegisteredReply = require('../../../Domains/replies/entities/RegisteredReply');
const RegisterReply = require('../../../Domains/replies/entities/RegisterReply');
const { currentDateIso } = require('../../../utils/time');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
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

  const commentA = {
    id: 'thread-comments-123',
    content: 'This is comment of A',
    owner: userA.id,
    thread_comment_id: threadA.id,
  };

  beforeAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await UsersTableTestHelper.addUser(userA);
    await UsersTableTestHelper.addUser(userB);

    await ThreadTableTestHelper.cleanTable();
    await ThreadTableTestHelper.addThread(threadA);
    await ThreadTableTestHelper.addThread(threadB);

    await ThreadCommentsTableTestHelper.addThreadComment(commentA);
  });

  afterAll(async () => {
    pool.end();
  });

  beforeEach(async () => {
    await ReplyTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ReplyTableTestHelper.cleanTable();
  });

  describe('addReply function', () => {
    it('should persist register reply and return registered reply', async () => {
      // Arrange
      const registerReply = new RegisterReply({
        content: 'Reply Content A',
        thread_comment_id: commentA.id,
        owner: userA.id,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(registerReply);

      // Assert
      const replies = await ReplyTableTestHelper.findByThreadCommentId(
        registerReply.thread_comment_id
      );

      expect(replies).toHaveLength(1);
    });

    it('should return registered reply', async () => {
      // Arrange
      const currentTime = currentDateIso();
      const registerReply = new RegisterReply({
        content: 'Reply Content A',
        thread_comment_id: commentA.id,
        owner: userA.id,
        created_at: currentTime,
        updated_at: currentTime,
        deleted_at: null,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const registeredReply = await replyRepositoryPostgres.addReply({
        ...registerReply,
      });

      // Assert
      expect(registeredReply).toStrictEqual(
        new RegisteredReply({
          ...registerReply,
          id: 'reply-123',
        })
      );
    });
  });

  describe('getById function', () => {
    it('should return Not Found Error', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.getById('xxx')).rejects.toThrow(
        NotFoundError
      );
    });

    it('should success', async () => {
      // Arrange
      const currentTime = currentDateIso();
      const registerReply = {
        id: 'reply-1234',
        content: 'Reply Content A',
        thread_comment_id: commentA.id,
        owner: userA.id,
        created_at: currentTime,
        updated_at: currentTime,
        deleted_at: null,
        username: userA.username,
      };

      await ReplyTableTestHelper.addReply({ ...registerReply });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.getById(registerReply.id)
      ).resolves.toStrictEqual(
        new RegisteredReply({
          ...registerReply,
        })
      );
    });
  });

  describe('fetchByThreadCommentIds function', () => {
    it('should return array length 0', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const response = await replyRepositoryPostgres.fetchByThreadCommentIds([
        commentA,
      ]);

      // Assert
      expect(response).toHaveLength(0);
    });

    it('should return array length 1', async () => {
      // Arrange
      const currentTime = currentDateIso();
      const registerReply = {
        id: 'reply-123',
        content: 'Reply Content A',
        thread_comment_id: commentA.id,
        owner: userA.id,
        created_at: currentTime,
        updated_at: currentTime,
        deleted_at: null,
        username: userA.username,
      };

      await ReplyTableTestHelper.addReply(registerReply);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const response = await replyRepositoryPostgres.fetchByThreadCommentIds([
        commentA.id,
      ]);

      // Assert
      expect(response).toHaveLength(1);
      expect(response[0]).toStrictEqual(
        new RegisteredReply({
          ...registerReply,
        })
      );
    });
  });

  describe('softDeleteById function', () => {
    it('should success', async () => {
      // Arrange
      const currentTime = currentDateIso();
      const registerReply = {
        id: 'reply-123',
        content: 'Reply Content A',
        thread_comment_id: commentA.id,
        owner: userA.id,
        created_at: currentTime,
        updated_at: currentTime,
        deleted_at: null,
        username: userA.username,
      };

      await ReplyTableTestHelper.addReply(registerReply);
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.softDeleteById(registerReply.id)
      ).resolves.not.toThrow(Error);
    });
  });
});
