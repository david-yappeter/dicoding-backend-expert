const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const TokenTestHelper = require('../../../../tests/TokenTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const { currentDateIso } = require('../../../utils/time');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and new threads', async () => {
      // Arrange
      const requestPayload = {
        title: 'Help Me to Find Good Title',
        body: "I don't know what should I write here. Please tell me.",
      };
      const accessToken = await TokenTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
      expect(responseJson.data.addedThread.id).toContain('thread-');
    });

    it('should response 400 if thread payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'Help Me to Find Good Title',
      };
      const accessToken = await TokenTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 if thread payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        title: 9999999999,
        body: "I don't know what should I write here. Please tell me.",
      };
      const accessToken = await TokenTestHelper.getAccessToken();
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      );
    });

    it('should response 401 if without token', async () => {
      // Arrange
      const requestPayload = {
        title: 'Any title please',
        body: "I don't know what should I write here. Please tell me.",
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 for existing', async () => {
      // Arrange
      const threadId = 'thread-12345';
      const owner = 'user-123333';
      const threadTitle = 'title is good';
      await TokenTestHelper.getAccessToken(owner); // just create user
      await ThreadTableTestHelper.addThread({
        id: threadId,
        title: threadTitle,
        owner,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.title).toEqual(threadTitle);
      expect(responseJson.data.thread.id).toContain('thread-');
    });

    it('should response 404 if thread not found', async () => {
      // Arrange
      const threadId = 'thread-randomly';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should return deleted comment correctly', async () => {
      // Arrange
      const threadId = 'thread-12345';
      const owner = 'user-123333';
      const threadTitle = 'title is good';
      const commentId = 'comment-1999';
      await TokenTestHelper.getAccessToken(owner); // just create user
      await ThreadTableTestHelper.addThread({
        id: threadId,
        title: threadTitle,
        owner,
      });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: commentId,
        threadId,
        owner,
        deleted_at: currentDateIso(),
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.title).toEqual(threadTitle);
      expect(responseJson.data.thread.id).toContain('thread-');
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(responseJson.data.thread.comments[0].content).toEqual(
        '**komentar telah dihapus**'
      );
    });

    it('should have likeCount and bring the calculation correctly', async () => {
      // Arrange
      const threadId = 'thread-12345';
      const owner = 'user-123333';
      const threadTitle = 'title is good';
      const commentId = 'comment-1999';
      await TokenTestHelper.getAccessToken(owner); // just create user
      await ThreadTableTestHelper.addThread({
        id: threadId,
        title: threadTitle,
        owner,
      });
      await ThreadCommentsTableTestHelper.addThreadComment({
        id: commentId,
        threadId,
        owner,
      });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.title).toEqual(threadTitle);
      expect(responseJson.data.thread.comments).toBeDefined();
    });
  });
});
