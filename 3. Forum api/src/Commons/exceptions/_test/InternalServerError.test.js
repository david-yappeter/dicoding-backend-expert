const InternalServerError = require('../InternalServerError');
const ServerError = require('../ServerError');

describe('ServerError', () => {
  it('should create an error correctly', () => {
    const internalServerError = new InternalServerError();

    expect(internalServerError).toBeInstanceOf(InternalServerError);
    expect(internalServerError).toBeInstanceOf(ServerError);
    expect(internalServerError).toBeInstanceOf(Error);

    expect(internalServerError.statusCode).toEqual(500);
    expect(internalServerError.message).toEqual('internal server error');
    expect(internalServerError.name).toEqual('InternalServerError');
  });
});
