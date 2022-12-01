const { isNotString } = require('../../../utils/type');

class RegisterThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, owner } = payload;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ content, owner }) {
    if (!content || !owner) {
      throw new Error('REGISTER_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (isNotString(content) || isNotString(owner)) {
      throw new Error(
        'REGISTER_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = RegisterThreadComment;
