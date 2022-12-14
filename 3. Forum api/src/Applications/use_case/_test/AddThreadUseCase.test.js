const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const RegisterThread = require('@../../../Domains/threads/entities/RegisterThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'dicoding title',
      body: 'dicoding body',
      owner: 'user-123',
      threadId: 'thread-123',
    };
    const expectedRegisteredThread = new RegisteredThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: 'user-123',
      threadId: 'thread-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new RegisteredThread({ ...expectedRegisteredThread }))
      );

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const registeredThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(registeredThread).toStrictEqual(expectedRegisteredThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new RegisterThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
        threadId: useCasePayload.threadId,
      })
    );
  });
});
