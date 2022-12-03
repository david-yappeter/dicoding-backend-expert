const RegisterReply = require('../../Domains/replies/entities/RegisterReply');

class AddReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const registerReply = new RegisterReply(useCasePayload);
    return this._replyRepository.addReply(registerReply);
  }
}

module.exports = AddReplyUseCase;
