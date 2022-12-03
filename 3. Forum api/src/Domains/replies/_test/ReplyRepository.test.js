const ThreadCommentRepository = require('../ReplyRepository');

describe('ThreadCommentRepository interface', () => {
  it('should have function', () => {
    const threadCommentRepository = new ThreadCommentRepository();
    expect(threadCommentRepository).toHaveProperty('addReply');
    expect(threadCommentRepository.addReply).toBeInstanceOf(Function);
    expect(threadCommentRepository).toHaveProperty('fetchByThreadCommentIds');
    expect(threadCommentRepository.fetchByThreadCommentIds).toBeInstanceOf(
      Function
    );
    expect(threadCommentRepository).toHaveProperty('softDeleteById');
    expect(threadCommentRepository.softDeleteById).toBeInstanceOf(Function);
  });

  it('should throw new error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository();

    // Action and Assert
    await expect(threadCommentRepository.addReply({})).rejects.toThrowError(
      'THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(
      threadCommentRepository.fetchByThreadCommentIds({})
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadCommentRepository.softDeleteById({})
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
