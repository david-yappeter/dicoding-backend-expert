const RegisterThread = require('../RegisterThread');

describe('a RegisterThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'body',
    };

    // Action and Assert
    expect(() => new RegisterThread({ ...payload })).toThrowError(
      'REGISTER_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: true,
      body: 'abc',
      owner: 123,
    };

    // Action and Assert
    expect(() => new RegisterThread({ ...payload })).toThrowError(
      'REGISTER_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create RegisterThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'Dicoding Indonesia',
      body: 'abc',
      owner: 'user-12123',
    };

    // Action
    const { title, body } = new RegisterThread({ ...payload });

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
