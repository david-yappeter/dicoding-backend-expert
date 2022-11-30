const { isNotString } = require('@utils/type');

class RegisteredThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
  }

  _verifyPayload({ id, title, body }) {
    if (!id || !title || !body) {
      throw new Error('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (isNotString(id) || isNotString(title) || isNotString(body)) {
      throw new Error('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredThread;
