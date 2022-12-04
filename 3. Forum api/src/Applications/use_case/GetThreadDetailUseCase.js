const RegisteredReply = require('../../Domains/replies/entities/RegisteredReply');
const RegisteredThreadComment = require('../../Domains/thread-comments/entities/RegisteredThreadComment');
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

    const returnedThreadComments = threadComments.map(
      (comment) =>
        new RegisteredThreadComment({
          ...comment,
          replies: Array.isArray(replies)
            ? replies
                .filter((reply) => reply.thread_comment_id === comment.id)
                .map(
                  (reply) =>
                    new RegisteredReply({
                      ...reply,
                    })
                )
            : [],
        })
    );

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
