const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RegisteredReply = require('../../../Domains/replies/entities/RegisteredReply');
const RegisterReply = require('../../../Domains/replies/entities/RegisterReply');
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
      const registeredReply = await replyRepositoryPostgres.addReply(
        registerReply
      );

      // Assert
      expect(registeredReply).toStrictEqual(
        new RegisteredReply({
          ...registerReply,
          id: 'reply-123',
        })
      );
    });
  });

  describe('fetchByThreadCommentIds function', () => {
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
      const registeredReply = await replyRepositoryPostgres.addReply(
        registerReply
      );

      // Assert
      expect(registeredReply).toStrictEqual(
        new RegisteredReply({
          ...registerReply,
          id: 'reply-123',
        })
      );
    });
  });
});
