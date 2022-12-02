const { isNotString } = require('../../../utils/type');

class RegisteredThreadComment {
  static DbConstructor(payload) {
    return new RegisteredThreadComment({
      ...payload,
      threadId: payload.thread_id,
      content: payload.deleted_at
        ? '**komentar telah dihapus**'
        : payload.content,
    });
  }

  constructor(payload) {
    this._verifyPayload(payload);

    const { id, content, owner, threadId, created_at, updated_at, username } =
      payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.username = username;
    this.threadId = threadId;
  }

  _verifyPayload({ id, content, owner, threadId }) {
    if (!id || !content || !owner || !threadId) {
      throw new Error('REGISTERED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      isNotString(id) ||
      isNotString(content) ||
      isNotString(owner) ||
      isNotString(threadId)
    ) {
      throw new Error(
        'REGISTERED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
    }
  }
}

module.exports = RegisteredThreadComment;
