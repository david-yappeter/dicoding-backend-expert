const { isNotString } = require('../../../utils/type');

class RegisterThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, owner } = payload;
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new Error('REGISTER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (isNotString(title) || isNotString(body) || isNotString(owner)) {
      throw new Error('REGISTER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisterThread;
