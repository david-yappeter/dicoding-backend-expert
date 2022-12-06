const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const TokenTestHelper = require('../../../../tests/TokenTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and new replies', async () => {
      // Arrange
      const requestPayload = {
        content: 'My random comment of reply is real/',
      };
      const threadId = 'thread-12345';
      const owner = 'user-1234';
      const commentId = 'thread-comments-1234';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: commentId,
        threadId,
        owner,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual(
        requestPayload.content
      );
    });

    it('should response 400 if thread payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const threadId = 'thread-123';
      const owner = 'user-1234';
      const commentId = 'thread-comments-1234';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: commentId,
        threadId,
        owner,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 if thread payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        content: 9999999999,
      };
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'thread-comments-1234';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: commentId,
        threadId,
        owner,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat reply baru karena tipe data tidak sesuai'
      );
    });

    it('should response 404 if threadId not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'My random comment is real/',
      };
      const owner = 'user-123';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-notexistss/comments/comments-notexist/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 401 if without token', async () => {
      // Arrange
      const requestPayload = {
        content: 'Any comment please',
      };
      const threadId = 'thread-123';
      const owner = 'user-1234';
      const commentId = 'thread-comments-123';
      await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: commentId,
        threadId,
        owner,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete the reply', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'thread-comments-123';
      const replyId = 'reply-123';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: commentId,
        threadId,
        owner,
      });
      await ReplyTableTestHelper.addReply({
        id: replyId,
        commentId,
        threadId,
        owner,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 if not reply owner', async () => {
      // Arrange
      const threadId = 'thread-123';
      const owner = 'user-1234';
      const commentId = 'thread-comments-123';
      const replyId = 'reply-12';
      await TokenTestHelper.getAccessToken(owner);
      const accessToken = await TokenTestHelper.getAccessToken(
        'random-user',
        'randomuser'
      );
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: commentId,
        threadId,
        owner,
      });
      await ReplyTableTestHelper.addReply({
        id: replyId,
        commentId,
        threadId,
        owner,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Bukan pemilik reply');
    });

    it('should response 404 if reply not found', async () => {
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'thread-comments-123';
      const replyId = 'reply-xxx123';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: commentId,
        threadId,
        owner,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply tidak ditemukan'); // TODO: CHECK
    });

    it('should response 404 if threadId not found', async () => {
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'thread-comments-123';
      const replyId = 'reply-1234';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 404 if commentId not found', async () => {
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'thread-comments-1234';
      const replyId = 'reply-1234';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ditemukan');
    });

    it('should response 401 if without token', async () => {
      // Arrange
      const requestPayload = {
        content: 'Any comment please',
      };
      const threadId = 'thread-123';
      const owner = 'user-123';
      const commentId = 'thread-comments-123';
      const replyId = 'reply-125';
      await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: commentId,
        threadId,
        owner,
      });
      await ReplyTableTestHelper.addReply({
        id: replyId,
        commentId,
        threadId,
        owner,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });
});
