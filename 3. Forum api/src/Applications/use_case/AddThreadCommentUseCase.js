const RegisterThreadComment = require('../../Domains/thread-comments/entities/RegisterThreadComment');

class AddThreadCommentUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async verifyThreadExists(threadId) {
    // Throw Error 404 Not Found if not found
    await this._threadRepository.getThreadDetailById(threadId);
  }

  async execute(useCasePayload) {
    if (!useCasePayload) {
      throw new Error('REQUEST_PAYLOAD.NULL');
    }
    await this.verifyThreadExists(useCasePayload.threadId);

    const registerThreadComment = new RegisterThreadComment(useCasePayload);
    return this._threadCommentRepository.addThreadComment(
      registerThreadComment
    );
  }
}

module.exports = AddThreadCommentUseCase;
