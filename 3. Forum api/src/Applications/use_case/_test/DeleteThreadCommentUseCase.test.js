const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const RegisteredThreadComment = require('../../../Domains/thread-comments/entities/RegisteredThreadComment');
const ThreadCommentRepository = require('../../../Domains/thread-comments/ThreadCommentRepository');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const { currentDateIso } = require('../../../utils/time');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
  it('should return Error when execute with empty payload', async () => {
    // Arrange
    const useCasePayload = null;

    const expectedRegisteredThreadComments = [
      new RegisteredThreadComment({
        id: 'thread-comments-123',
        content: 'Content A',
        owner: 'user-123',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
        username: 'johndoe',
        threadId: 'thread-123',
      }),
      new RegisteredThreadComment({
        id: 'thread-comments-1234',
        content: 'Content B',
        owner: 'user-1234',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
        username: 'dicoding',
        threadId: 'thread-123',
      }),
    ];
    const expectedRegisteredThread = new RegisteredThread({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body',
      owner: 'user-123',
      username: 'johndoe',
      created_at: currentDateIso(),
      updated_at: currentDateIso(),
      comments: expectedRegisteredThreadComments,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredThread));
    mockThreadCommentRepository.getById = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedRegisteredThreadComments[0])
      );
    mockThreadCommentRepository.softDeleteThreadCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action & Assert
    expect(async () => {
      await deleteThreadCommentUseCase.execute(useCasePayload);
    }).rejects.toThrow();
  });

  it('should return Authorization Error', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      threadCommentId: 'thread-comments-123',
      credentialId: 'user-1234',
    };

    const expectedRegisteredThreadComments = [
      new RegisteredThreadComment({
        id: 'thread-comments-123',
        content: 'Content A',
        owner: 'user-123',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
        username: 'johndoe',
        threadId: 'thread-123',
      }),
      new RegisteredThreadComment({
        id: 'thread-comments-1234',
        content: 'Content B',
        owner: 'user-1234',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
        username: 'dicoding',
        threadId: 'thread-123',
      }),
    ];
    const expectedRegisteredThread = new RegisteredThread({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body',
      owner: 'user-123',
      username: 'johndoe',
      created_at: currentDateIso(),
      updated_at: currentDateIso(),
      comments: expectedRegisteredThreadComments,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredThread));
    mockThreadCommentRepository.getById = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedRegisteredThreadComments[0])
      );
    mockThreadCommentRepository.softDeleteThreadCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action & Assert
    await expect(
      deleteThreadCommentUseCase.execute(useCasePayload)
    ).rejects.toThrow(AuthorizationError);
  });

  it('should orchestrating delete thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      threadCommentId: 'thread-comments-123',
      credentialId: 'user-123',
    };

    const expectedRegisteredThreadComments = [
      new RegisteredThreadComment({
        id: 'thread-comments-123',
        content: 'Content A',
        owner: 'user-123',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
        username: 'johndoe',
        threadId: 'thread-123',
      }),
      new RegisteredThreadComment({
        id: 'thread-comments-1234',
        content: 'Content B',
        owner: 'user-1234',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
        username: 'dicoding',
        threadId: 'thread-123',
      }),
    ];
    const expectedRegisteredThread = new RegisteredThread({
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body',
      owner: 'user-123',
      username: 'johndoe',
      created_at: currentDateIso(),
      updated_at: currentDateIso(),
      comments: expectedRegisteredThreadComments,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredThread));
    mockThreadCommentRepository.getById = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedRegisteredThreadComments[0])
      );
    mockThreadCommentRepository.softDeleteThreadCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
    });

    // Action & Assert
    expect(async () => {
      await deleteThreadCommentUseCase.execute(useCasePayload);
    }).not.toThrowError();
    await deleteThreadCommentUseCase.execute(useCasePayload);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockThreadCommentRepository.getById).toBeCalledWith(
      useCasePayload.threadCommentId
    );
    expect(
      mockThreadCommentRepository.softDeleteThreadCommentById
    ).toBeCalledWith(useCasePayload.threadCommentId);
  });
});
