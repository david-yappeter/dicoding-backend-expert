const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');

class GetThreadDetailUseCase {
  constructor({ threadRepository, threadCommentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._threadCommentRepository = threadCommentRepository;
    this._replyRepository = replyRepository;
  }

  async loadThreadCommentsAndRepliesIntoThread(thread) {
    const threadComments =
      await this._threadCommentRepository.fetchThreadCommentsByThreadId(
        thread.id
      );

    const threadCommentIds = threadComments.map((comment) => comment.id);

    const replies = await this._replyRepository.fetchByThreadCommentIds(
      threadCommentIds
    );

    const returnedThreadComments = threadComments.map((comment) => ({
      ...comment,
      replies:
        replies
          .filter((reply) => reply.thread_comment_id === comment.id)
          .map((reply) => ({
            id: reply.id,
            content: reply.content,
            date: reply.created_at,
            username: reply.username,
          })) || [],
    }));

    return new RegisteredThread({
      ...thread,
      comments: returnedThreadComments,
    });
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadDetailById(threadId);

    return this.loadThreadCommentsAndRepliesIntoThread(thread);
  }
}

module.exports = GetThreadDetailUseCase;
