class DeleteReplyUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // const registerThread = new RegisterThread(useCasePayload);
    // return this._threadRepository.addThread(registerThread);
  }
}

module.exports = DeleteReplyUseCase;
