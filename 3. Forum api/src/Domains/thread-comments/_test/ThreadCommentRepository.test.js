const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository interface', () => {
  it('should have function', () => {
    const threadCommentRepository = new ThreadCommentRepository();
    expect(threadCommentRepository).toHaveProperty('addThreadComment');
    expect(threadCommentRepository.addThreadComment).toBeInstanceOf(Function);
    expect(threadCommentRepository).toHaveProperty(
      'fetchThreadCommentsByThreadId'
    );
    expect(
      threadCommentRepository.fetchThreadCommentsByThreadId
    ).toBeInstanceOf(Function);
  });

  it('should throw new error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository();

    // Action and Assert
    await expect(
      threadCommentRepository.addThreadComment({})
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadCommentRepository.fetchThreadCommentsByThreadId({})
    ).rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
