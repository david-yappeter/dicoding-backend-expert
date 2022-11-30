const RegisteredThread = require('@Domains/threads/entities/RegisteredThread');
const ThreadRepository = require('@Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const RegisterThread = require('@Domains/threads/entities/RegisterThread');

describe('AddUserUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'dicoding title',
      body: 'dicoding body',
    };
    const expectedRegisteredThread = new RegisteredThread({
      id: 'thread-123',
      title: useCasePayload.title,
      body: useCasePayload.body,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedRegisteredThread));

    /** creating use case instance */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const registeredThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(registeredThread).toStrictEqual(expectedRegisteredThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new RegisterThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      })
    );
  });
});
