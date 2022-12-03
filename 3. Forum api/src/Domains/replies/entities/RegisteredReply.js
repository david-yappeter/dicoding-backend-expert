const { isNotString } = require('../../../utils/type');

class RegisteredReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      content,
      owner,
      thread_comment_id,
      username,
      created_at,
      updated_at,
      deleted_at,
    } = payload;
    this.id = id;
    // this.content = payload.deleted_at ? '**komentar telah dihapus**' : content;
    this.content = content;
    this.owner = owner;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.deleted_at = deleted_at;
    this.username = username;
    this.thread_comment_id = thread_comment_id;
  }

  _verifyPayload({ id, content, owner, thread_comment_id }) {
    if (!id || !content || !owner || !thread_comment_id) {
      throw new Error('REGISTERED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      isNotString(id) ||
      isNotString(content) ||
      isNotString(owner) ||
      isNotString(thread_comment_id)
    ) {
      throw new Error('REGISTERED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredReply;
