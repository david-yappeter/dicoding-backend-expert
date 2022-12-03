const { isNotString } = require('../../../utils/type');

class RegisterReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, thread_comment_id, owner } = payload;
    this.content = content;
    this.thread_comment_id = thread_comment_id;
    this.owner = owner;
  }

  _verifyPayload({ content, thread_comment_id, owner }) {
    if (!content || !owner || !thread_comment_id) {
      throw new Error('REGISTER_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      isNotString(content) ||
      isNotString(owner) ||
      isNotString(thread_comment_id)
    ) {
      throw new Error('REGISTER_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisterReply;
