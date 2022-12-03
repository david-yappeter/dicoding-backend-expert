const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const RegisteredReply = require('../../../Domains/replies/entities/RegisteredReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const RegisteredThreadComment = require('../../../Domains/thread-comments/entities/RegisteredThreadComment');
const ThreadCommentRepository = require('../../../Domains/thread-comments/ThreadCommentRepository');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const { currentDateIso } = require('../../../utils/time');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
  it('should return Authorization Error', async () => {
    // Arrange
    const useCasePayload = {
      thread_id: 'thread-123',
      thread_comment_id: 'thread-comments-123',
      reply_id: 'reply-123',
      credential_id: 'user-1234',
    };

    const expectedReplies = [
      new RegisteredReply({
        id: 'reply-123',
        content: 'this is reply',
        owner: 'user-123',
        thread_comment_id: 'thread-comments-123',
        username: 'johndoe',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
      }),
    ];

    const expectedRegisteredThreadComments = [
      new RegisteredThreadComment({
        id: 'thread-comments-123',
        content: 'Content A',
        owner: 'user-123',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
        username: 'johndoe',
        threadId: 'thread-123',
        replies: expectedReplies,
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
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredThread));
    mockThreadCommentRepository.getById = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedRegisteredThreadComments[0])
      );
    mockReplyRepository.getById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedReplies[0]));
    mockReplyRepository.softDeleteById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload)).rejects.toThrow(
      AuthorizationError
    );
  });

  it('should orchestrating delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread_id: 'thread-123',
      thread_comment_id: 'thread-comments-123',
      reply_id: 'reply-123',
      credential_id: 'user-123',
    };

    const expectedReplies = [
      new RegisteredReply({
        id: 'reply-123',
        content: 'this is reply',
        owner: 'user-123',
        thread_comment_id: 'thread-comments-123',
        username: 'johndoe',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
      }),
    ];

    const expectedRegisteredThreadComments = [
      new RegisteredThreadComment({
        id: 'thread-comments-123',
        content: 'Content A',
        owner: 'user-123',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
        username: 'johndoe',
        threadId: 'thread-123',
        replies: expectedReplies,
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
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredThread));
    mockThreadCommentRepository.getById = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedRegisteredThreadComments[0])
      );
    mockReplyRepository.getById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedReplies[0]));
    mockReplyRepository.softDeleteById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(
      deleteReplyUseCase.execute(useCasePayload)
    ).resolves.not.toThrowError();
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
      useCasePayload.thread_id
    );
    expect(mockThreadCommentRepository.getById).toBeCalledWith(
      useCasePayload.thread_comment_id
    );
    expect(mockReplyRepository.getById).toBeCalledWith(useCasePayload.reply_id);
    expect(mockReplyRepository.softDeleteById).toBeCalledWith(
      useCasePayload.reply_id
    );
  });
});
