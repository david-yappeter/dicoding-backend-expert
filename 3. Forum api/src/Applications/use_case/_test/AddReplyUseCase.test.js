const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const RegisterThread = require('@../../../Domains/threads/entities/RegisterThread');
const AddReplyUseCase = require('../AddReplyUseCase');
const RegisteredReply = require('../../../Domains/replies/entities/RegisteredReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadCommentRepository = require('../../../Domains/thread-comments/ThreadCommentRepository');
const RegisterReply = require('../../../Domains/replies/entities/RegisterReply');
const { currentDateIso } = require('../../../utils/time');

describe('AddReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const currentTime = currentDateIso();
    const useCasePayload = {
      content: 'dicoding body',
      owner: 'user-123',
      thread_comment_id: 'thread-comments-123',
      created_at: currentTime,
      updated_at: currentTime,
      deleted_at: null,
    };
    const expectedRegisteredReply = new RegisteredReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'user-123',
      thread_comment_id: 'thread-comments-123',
      created_at: currentTime,
      updated_at: currentTime,
      deleted_at: null,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockThreadCommentRepository = new ThreadCommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadDetailById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadCommentRepository.getById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredReply));

    /** creating use case instance */
    const addThreadUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      threadCommentRepository: mockThreadCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const registeredThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(registeredThread).toStrictEqual(expectedRegisteredReply);
    expect(mockThreadRepository.getThreadDetailById).toBeCalledTimes(1);
    expect(mockThreadCommentRepository.getById).toBeCalledTimes(1);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new RegisterReply({
        ...useCasePayload,
      })
    );
  });
});
