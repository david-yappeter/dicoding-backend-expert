const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteReplyUseCase {
  constructor({ threadRepository, threadCommentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._replyRepository = replyRepository;
  }

  async _verifyThreadAvailability(threadId) {
    await this._threadRepository.getThreadDetailById(threadId);
  }

  async _verifyThreadCommentAvailability(threadCommentId) {
    await this._threadCommentRepository.getById(threadCommentId);
  }

  async _verifyReplyOwner(replyId, credentialId) {
    const reply = await this._replyRepository.getById(replyId);

    if (reply.owner !== credentialId) {
      throw new AuthorizationError('Bukan pemilik reply');
    }
  }

  async execute(useCasePayload) {
    const { owner, reply_id, thread_comment_id, thread_id } = useCasePayload;

    // check thread (404)
    await this._verifyThreadAvailability(thread_id);

    // check comment (404)
    await this._verifyThreadCommentAvailability(thread_comment_id);

    // check owner
    await this._verifyReplyOwner(reply_id, owner);

    return this._replyRepository.softDeleteById(reply_id);
  }
}

module.exports = DeleteReplyUseCase;
