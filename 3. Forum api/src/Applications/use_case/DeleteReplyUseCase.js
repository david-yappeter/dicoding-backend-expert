const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteReplyUseCase {
  constructor({ threadRepository, threadCommentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._replyRepository = replyRepository;
  }

  async _validateThread(threadId) {
    await this._threadRepository.getThreadDetailById(threadId);
  }

  async _validateThreadComment(threadCommentId) {
    await this._threadCommentRepository.getById(threadCommentId);
  }

  async _validateOwner(replyId, credentialId) {
    const reply = await this._replyRepository.getById(replyId);

    if (reply.owner !== credentialId) {
      throw new AuthorizationError('Bukan pemilik reply');
    }
  }

  async execute(useCasePayload) {
    const { owner, reply_id, thread_comment_id, thread_id } = useCasePayload;

    // check thread (404)
    await this._validateThread(thread_id);

    // check comment (404)
    await this._validateThreadComment(thread_comment_id);

    // check owner
    await this._validateOwner(reply_id, owner);

    return this._replyRepository.softDeleteById(reply_id);
  }
}

module.exports = DeleteReplyUseCase;
