const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should have function', () => {
    const threadRepository = new ThreadRepository();
    expect(threadRepository).toHaveProperty('addThread');
    expect(threadRepository.addThread).toBeInstanceOf(Function);
  });

  it('should throw new error when invoke abstract behavior', async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action and Assert
    await expect(threadRepository.addThread({})).rejects.toThrowError(
      'THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
