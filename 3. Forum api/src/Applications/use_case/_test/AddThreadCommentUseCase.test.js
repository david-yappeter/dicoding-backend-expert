const ThreadCommentRepository = require('../../../Domains/thread-comments/ThreadCommentRepository');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');

describe('AddThreadCommentUseCase', () => {
  it('should return error when payload empty', async () => {
    // Arrange
    const useCasePayload = null;

    const expectedRegisteredThreadComment = {
      id: 'thread-comments-123',
      content: '',
      threadId: '',
      owner: '',
    };

    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadCommentRepository.addThreadComment = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedRegisteredThreadComment)
      );

    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action & Assert
    expect(async () =>
      addThreadCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError();
  });

  it('should orchestarting add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'comment content',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const expectedRegisteredThreadComment = {
      id: 'thread-comments-123',
      content: useCasePayload.content,
      threadId: useCasePayload.threadId,
      owner: useCasePayload.owner,
    };

    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadCommentRepository.addThreadComment = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedRegisteredThreadComment)
      );

    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action & Assert
    expect(async () =>
      addThreadCommentUseCase.execute(useCasePayload)
    ).not.toThrowError();
    const registeredThreadComment = await addThreadCommentUseCase.execute(
      useCasePayload
    );
    expect(registeredThreadComment).toStrictEqual(
      expectedRegisteredThreadComment
    );
    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith(
      useCasePayload
    );
  });
});
