const RegisterThreadComment = require('../../Domains/thread-comments/entities/RegisterThreadComment');

class AddThreadCommentUseCase {
  constructor({ threadCommentRepository }) {
    this._threadCommentRepository = threadCommentRepository;
  }

  async execute(useCasePayload) {
    if (!useCasePayload) {
      throw new Error('REQUEST_PAYLOAD.NULL');
    }
    const registerThreadComment = new RegisterThreadComment(useCasePayload);
    return this._threadCommentRepository.addThreadComment(
      registerThreadComment
    );
  }
}

module.exports = AddThreadCommentUseCase;
