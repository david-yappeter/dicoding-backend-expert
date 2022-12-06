const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadCommentRepository = require('../../../Domains/thread-comments/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const { currentDateIso } = require('../../../utils/time');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');

describe('AddThreadCommentUseCase', () => {
  it('should return error when payload empty', async () => {
    // Arrange
    const useCasePayload = null;

    // const expectedRegisteredThreadComment = {
    //   id: 'thread-comments-123',
    //   content: '',
    //   threadId: '',
    //   owner: '',
    // };

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadCommentRepository.addThreadComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action & Assert
    await expect(
      addThreadCommentUseCase.execute(useCasePayload)
    ).rejects.toThrowError('REQUEST_PAYLOAD.NULL');
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

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.addThreadComment = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedRegisteredThreadComment)
      );

    const addThreadCommentUseCase = new AddThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action & Assert
    await expect(
      addThreadCommentUseCase.execute({ ...useCasePayload })
    ).resolves.not.toThrow(Error);
    const registeredThreadComment = await addThreadCommentUseCase.execute({
      ...useCasePayload,
    });
    expect(registeredThreadComment).toStrictEqual(
      expectedRegisteredThreadComment
    );
    expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith({
      ...useCasePayload,
    });
  });
});
