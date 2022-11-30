class ServerError extends Error {
  constructor(message, statusCode = 500) {
    super(message);

    if (this.constructor.name === 'ServerError') {
      throw new Error('cannot instantiate abstract class');
    }

    this.statusCode = statusCode;
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
