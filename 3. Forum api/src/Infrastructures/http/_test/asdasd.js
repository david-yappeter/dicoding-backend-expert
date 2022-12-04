const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  describe('test', () => {
    it('s', async () => {});
  });
  // describe('when POST /threads', () => {
  //   it('should response 201 and persisted thread', async () => {
  //     // Arrange
  //     const requestPayload = {
  //       title: 'this title',
  //       body: 'body',
  //     };
  //     // eslint-disable-next-line no-undef
  //     const server = await createServer(container);

  //     // Action
  //     const response = await server.inject({
  //       method: 'POST',
  //       url: '/threads',
  //       payload: requestPayload,
  //     });

  //     // Assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(201);
  //     expect(responseJson.status).toEqual('success');
  //     expect(responseJson.data.addedThread).toBeDefined();
  //   });

  //   it('should response 400 when request payload not contain needed property', async () => {
  //     // Arrange
  //     const requestPayload = {
  //       title: 'this title',
  //     };
  //     const server = await createServer(container);

  //     // Action
  //     const response = await server.inject({
  //       method: 'POST',
  //       url: '/threads',
  //       payload: requestPayload,
  //     });

  //     // Assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(400);
  //     expect(responseJson.status).toEqual('fail');
  //     expect(responseJson.message).toEqual(
  //       'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
  //     );
  //   });

  //   it('should response 400 when request payload not meet data type specification', async () => {
  //     // Arrange
  //     const requestPayload = {
  //       title: 'this title',
  //       body: 123,
  //     };
  //     const server = await createServer(container);

  //     // Action
  //     const response = await server.inject({
  //       method: 'POST',
  //       url: '/threads',
  //       payload: requestPayload,
  //     });

  //     // Assert
  //     const responseJson = JSON.parse(response.payload);
  //     expect(response.statusCode).toEqual(400);
  //     expect(responseJson.status).toEqual('fail');
  //     expect(responseJson.message).toEqual(
  //       'tidak dapat membuat thread baru karena tipe data tidak sesuai'
  //     );
  //   });
  // });
});
