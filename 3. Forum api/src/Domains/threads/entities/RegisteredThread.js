const { isNotString } = require('../../../utils/type');

class RegisteredThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, owner } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload({ id, title, body, owner }) {
    if (!id || !title || !body || !owner) {
      throw new Error('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      isNotString(id) ||
      isNotString(title) ||
      isNotString(body) ||
      isNotString(owner)
    ) {
      throw new Error('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredThread;
