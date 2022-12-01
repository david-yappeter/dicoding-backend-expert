const { isNotString } = require('../../../utils/type');

class RegisteredThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new Error('REGISTERED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (isNotString(id) || isNotString(content) || isNotString(owner)) {
      throw new Error(
        'REGISTERED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = RegisteredThreadComment;
