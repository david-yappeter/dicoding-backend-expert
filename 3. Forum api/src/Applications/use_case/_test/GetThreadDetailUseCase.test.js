const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/thread-comments/ThreadCommentRepository');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const RegisteredThreadComment = require('../../../Domains/thread-comments/entities/RegisteredThreadComment');
const { currentDateIso } = require('../../../utils/time');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const RegisteredReply = require('../../../Domains/replies/entities/RegisteredReply');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get registered thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';

    const expectedRepliesThreadA = [];
    const expectedRegisteredThreadComments = [
      new RegisteredThreadComment({
        id: 'thread-comments-123',
        content: 'Content A',
        owner: 'user-123',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
        username: 'johndoe',
        threadId: 'thread-123',
        replies: expectedRepliesThreadA,
      }),
      new RegisteredThreadComment({
        id: 'thread-comments-1234',
        content: 'Content B',
        owner: 'user-1234',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
        username: 'dicoding',
        threadId: 'thread-123',
        replies: [],
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
    mockThreadCommentRepository.fetchThreadCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedRegisteredThreadComments)
      );
    mockReplyRepository.fetchByThreadCommentIds = jest
      .fn()
      .mockImplementation(() => Promise.resolve(null));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const registeredThread = await getThreadDetailUseCase.execute(
      useCasePayload
    );

    // Assert
    expect(registeredThread).toStrictEqual(expectedRegisteredThread);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
      'thread-123'
    );
    expect(
      mockThreadCommentRepository.fetchThreadCommentsByThreadId
    ).toBeCalledWith('thread-123');
  });

  it('should orchestrating the get registered thread action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-123';

    const expectedRepliesThreadA = [
      new RegisteredReply({
        id: 'reply-123',
        content: 'content',
        owner: 'user-123',
        username: 'johndoe',
        thread_comment_id: 'thread-comments-123',
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
        replies: expectedRepliesThreadA,
      }),
      new RegisteredThreadComment({
        id: 'thread-comments-1234',
        content: 'Content B',
        owner: 'user-1234',
        created_at: currentDateIso(),
        updated_at: currentDateIso(),
        username: 'dicoding',
        threadId: 'thread-123',
        replies: [],
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
    mockThreadCommentRepository.fetchThreadCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedRegisteredThreadComments)
      );
    mockReplyRepository.fetchByThreadCommentIds = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedRepliesThreadA));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const registeredThread = await getThreadDetailUseCase.execute(
      useCasePayload
    );

    // Assert
    expect(registeredThread).toStrictEqual(expectedRegisteredThread);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
      'thread-123'
    );
    expect(
      mockThreadCommentRepository.fetchThreadCommentsByThreadId
    ).toBeCalledWith('thread-123');
  });
});
