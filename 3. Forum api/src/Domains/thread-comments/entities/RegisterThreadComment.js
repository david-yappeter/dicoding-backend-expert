const { isNotString } = require('../../../utils/type');

class RegisterThreadComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, threadId, owner } = payload;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _verifyPayload({ content, threadId, owner }) {
    if (!content || !owner || !threadId) {
      throw new Error('REGISTER_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (isNotString(content) || isNotString(owner) || isNotString(threadId)) {
      throw new Error(
        'REGISTER_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = RegisterThreadComment;
