const RegisterReply = require('../../Domains/replies/entities/RegisterReply');

class AddReplyUseCase {
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

  async execute(useCasePayload) {
    const { owner, thread_id, thread_comment_id } = useCasePayload;

    // check thread (404)
    await this._validateThread(thread_id);

    // check comment (404)
    await this._validateThreadComment(thread_comment_id);

    return this._replyRepository.addReply(
      new RegisterReply({ ...useCasePayload, owner })
    );
  }
}

module.exports = AddReplyUseCase;
