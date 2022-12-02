const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class DeleteThreadCommentUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async _validateThread(threadId) {
    await this._threadRepository.getThreadDetailById(threadId);
  }

  async _validateOwner(threadCommentId, credentialId) {
    const threadComment = await this._threadCommentRepository.getById(
      threadCommentId
    );
    if (threadComment.owner !== credentialId) {
      throw new AuthorizationError('Bukan pemilik komen');
    }
  }

  async execute(useCasePayload) {
    if (!useCasePayload) {
      throw new Error('REQUEST_PAYLOAD.NULL');
    }

    const { credentialId, threadId, threadCommentId } = useCasePayload;

    // check thread (404)
    await this._validateThread(threadId);

    // check threadComment exist (404) + credentialId is owner (403)
    await this._validateOwner(threadCommentId, credentialId);

    return this._threadCommentRepository.softDeleteThreadCommentById(
      threadCommentId
    );
  }
}

module.exports = DeleteThreadCommentUseCase;
