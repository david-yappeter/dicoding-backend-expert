const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');

class GetThreadDetailUseCase {
  constructor({ threadRepository, threadCommentRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
  }

  async loadThreadCommentsIntoThread(thread) {
    const threadComments =
      await this._threadCommentRepository.fetchThreadCommentsByThreadId(
        thread.id
      );

    return {
      ...thread,
      comments: threadComments.map((threadComment) => ({
        id: threadComment.id,
        username: threadComment.username,
        date: threadComment.created_at,
        content: threadComment.content,
      })),
    };
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadDetailById(threadId);

    return this.loadThreadCommentsIntoThread(thread);
  }
}

module.exports = GetThreadDetailUseCase;
