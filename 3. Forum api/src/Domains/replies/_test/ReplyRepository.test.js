const ThreadCommentRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
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
    expect(threadCommentRepository).toHaveProperty('getById');
    expect(threadCommentRepository.getById).toBeInstanceOf(Function);
  });

  it('should throw new error when invoke abstract behavior', async () => {
    // Arrange
    const threadCommentRepository = new ThreadCommentRepository();

    // Action and Assert
    await expect(threadCommentRepository.addReply({})).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
    await expect(
      threadCommentRepository.fetchByThreadCommentIds({})
    ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(
      threadCommentRepository.softDeleteById({})
    ).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(threadCommentRepository.getById({})).rejects.toThrowError(
      'REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED'
    );
  });
});
