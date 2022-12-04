const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const TokenTestHelper = require('../../../../tests/TokenTestHelper');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and new comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'content',
      };
      const threadId = 'thread-12366669';
      const owner = 'user-1233414';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
      expect(responseJson.data.addedComment.content).toEqual(
        requestPayload.content
      );
    });

    it('should response 400 if thread payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const threadId = 'thread-12366669';
      const owner = 'user-1233414';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      );
    });

    it('should response 400 if thread payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        content: 9999999999,
      };
      const threadId = 'thread-12366669';
      const owner = 'user-1233414';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      );
    });

    it('should response 404 if threadId not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'My random comment is real/',
      };
      const owner = 'user-1233414';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-notexistss/comments',
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
      const threadId = 'thread-12366669';
      const owner = 'user-1233414';
      await TokenTestHelper.getAccessToken(owner); // just for create user
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
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

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete the comment', async () => {
      // Arrange
      const threadId = 'thread-12366669';
      const owner = 'user-1233414';
      const commentId = 'comment-12344';
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
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 403 if not comment owner', async () => {
      // Arrange
      const threadId = 'thread-12366669';
      const owner = 'user-1233414';
      const commentId = 'comment-12344';
      await TokenTestHelper.getAccessToken(owner);
      const accessToken = await TokenTestHelper.getAccessToken(
        'user-external',
        'externaluser'
      );
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
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Bukan pemilik komen');
    });

    it('should response 404 if comment not found', async () => {
      const threadId = 'thread-12366669';
      const owner = 'user-1233414';
      const commentId = 'comment-12344';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      await ThreadTableTestHelper.addThread({ id: threadId, owner });
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
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

    it('should response 404 if threadId not found', async () => {
      const threadId = 'thread-12366669';
      const owner = 'user-1233414';
      const commentId = 'comment-12344';
      const accessToken = await TokenTestHelper.getAccessToken(owner);
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
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
      const threadId = 'thread-12366669';
      const owner = 'user-1233414';
      const commentId = 'comment-9999';
      await TokenTestHelper.getAccessToken(owner); // just for create user
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
        url: `/threads/${threadId}/comments/${commentId}`,
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

  // describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
  //   it('should response 200 and like the comment', async () => {
  //     // Arrange
  //     const threadId = 'thread-12366669';
  //     const owner = 'user-1233414';
  //     const commentId = 'comment-12344';
  //     const accessToken = await TokenTestHelper.getAccessToken(owner);
  //     await ThreadTableTestHelper.addThread({ id: threadId, owner });
  //     await ThreadCommentsTableTestHelper.addThreadComment({
  //       id: commentId,
  //       threadId,
  //       owner,
  //     });
  //     const server = await createServer(container);

  //     // Action
  //     const response = await server.inject({
  //       method: 'PUT',
  //       url: `/threads/${threadId}/comments/${commentId}/likes`,
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     // Assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(200);
  //     expect(responseJson.status).toEqual('success');
  //   });

  //   it('should response 404 if comment not found', async () => {
  //     const threadId = 'thread-12366669';
  //     const owner = 'user-1233414';
  //     const commentId = 'comment-12344';
  //     const accessToken = await TokenTestHelper.getAccessToken(owner);
  //     await ThreadTableTestHelper.addThread({ id: threadId, owner });
  //     const server = await createServer(container);

  //     // Action
  //     const response = await server.inject({
  //       method: 'PUT',
  //       url: `/threads/${threadId}/comments/${commentId}/likes`,
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     // Assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(404);
  //     expect(responseJson.status).toEqual('fail');
  //     expect(responseJson.message).toEqual('comment tidak ditemukan');
  //   });

  //   it('should response 404 if threadId not found', async () => {
  //     const threadId = 'thread-12366669';
  //     const owner = 'user-1233414';
  //     const commentId = 'comment-12344';
  //     const accessToken = await TokenTestHelper.getAccessToken(owner);
  //     const server = await createServer(container);

  //     // Action
  //     const response = await server.inject({
  //       method: 'PUT',
  //       url: `/threads/${threadId}/comments/${commentId}/likes`,
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     // Assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(404);
  //     expect(responseJson.status).toEqual('fail');
  //     expect(responseJson.message).toEqual('thread tidak ditemukan');
  //   });

  //   it('should response 401 if without token', async () => {
  //     // Arrange
  //     const requestPayload = {
  //       content: 'Any comment please',
  //     };
  //     const threadId = 'thread-12366669';
  //     const owner = 'user-1233414';
  //     const commentId = 'comment-9999';
  //     await TokenTestHelper.getAccessToken(owner); // just for create user
  //     await ThreadTableTestHelper.addThread({ id: threadId, owner });
  //     await ThreadCommentsTableTestHelper.addThreadComment({
  //       id: commentId,
  //       threadId,
  //       owner,
  //     });
  //     const server = await createServer(container);

  //     // Action
  //     const response = await server.inject({
  //       method: 'PUT',
  //       url: `/threads/${threadId}/comments/${commentId}/likes`,
  //       payload: requestPayload,
  //     });

  //     // Assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(401);
  //     expect(responseJson.statusCode).toEqual(401);
  //     expect(responseJson.error).toEqual('Unauthorized');
  //     expect(responseJson.message).toEqual('Missing authentication');
  //   });
  // });
});
