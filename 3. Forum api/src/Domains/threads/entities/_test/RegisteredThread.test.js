const RegisteredThread = require('../RegisteredThread');

describe('a RegisteredThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'body',
    };

    // Action and Assert
    expect(() => new RegisteredThread(payload)).toThrowError(
      'REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      body: 'abc',
    };

    // Action and Assert
    expect(() => new RegisteredThread(payload)).toThrowError(
      'REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create RegisteredThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-99sdb9hg09ersgh90ers',
      title: 'Dicoding Indonesia',
      body: 'abc',
    };

    // Action
    const { id, title, body } = new RegisteredThread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
