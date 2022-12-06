const { currentDateIso } = require('../../../../utils/time');
const RegisteredThread = require('../RegisteredThread');

describe('a RegisteredThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'body',
    };

    // Action and Assert
    expect(() => new RegisteredThread({ ...payload })).toThrowError(
      'REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      body: 'abc',
      owner: 123,
    };

    // Action and Assert
    expect(() => new RegisteredThread({ ...payload })).toThrowError(
      'REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create RegisteredThread object correctly', () => {
    // Arrange
    const currentTime = currentDateIso();
    const payload = {
      id: 'thread-99sdb9hg09ersgh90ers',
      title: 'Dicoding Indonesia',
      body: 'abc',
      owner: 'user-ejiwag12',
      username: 'user-123',
      created_at: currentTime,
      updated_at: currentTime,
      comments: [],
    };

    // Action
    const {
      id,
      title,
      body,
      owner,
      created_at,
      updated_at,
      username,
      comments,
    } = new RegisteredThread({ ...payload });

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(owner).toEqual(payload.owner);
    expect(created_at).toEqual(payload.created_at);
    expect(updated_at).toEqual(payload.updated_at);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
