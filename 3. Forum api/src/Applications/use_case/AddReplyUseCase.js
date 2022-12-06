const RegisterReply = require('../../Domains/replies/entities/RegisterReply');

class AddReplyUseCase {
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

  async execute(useCasePayload) {
    const { owner, thread_id, thread_comment_id } = useCasePayload;

    // check thread (404)
    await this._verifyThreadAvailability(thread_id);

    // check comment (404)
    await this._verifyThreadCommentAvailability(thread_comment_id);

    return this._replyRepository.addReply(
      new RegisterReply({ ...useCasePayload, owner })
    );
  }
}

module.exports = AddReplyUseCase;
