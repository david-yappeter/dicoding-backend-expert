const ServerError = require('./ServerError');

class InternalServerError extends ServerError {
  constructor() {
    super('internal server error');
    this.name = 'InternalServerError';
  }
}

module.exports = InternalServerError;
