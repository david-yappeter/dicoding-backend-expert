class ThreadCommentRepository {
  async addThreadComment(registerThreadComment) {
    throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getById(id) {
    throw new Error(
      'THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED.NOT_FOUND'
    );
  }

  async fetchThreadCommentsByThreadId(threadId) {
    throw new Error(
      'THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED.NOT_FOUND'
    );
  }

  async softDeleteThreadCommentById(threadCommentId) {
    throw new Error(
      'THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED.NOT_FOUND'
    );
  }
}

module.exports = ThreadCommentRepository;
