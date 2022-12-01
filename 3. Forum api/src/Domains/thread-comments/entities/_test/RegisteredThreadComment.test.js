const RegisteredThreadComment = require('../RegisteredThreadComment');

describe('a RegisteredThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'this is content',
    };

    // Action and Assert
    expect(() => new RegisteredThreadComment(payload)).toThrowError(
      'REGISTERED_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'content',
      owner: 123,
    };

    // Action and Assert
    expect(() => new RegisteredThreadComment(payload)).toThrowError(
      'REGISTERED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create RegisteredThreadComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-99sdb9hg09ersgh90ers',
      content: 'content',
      owner: 'user-ejiwag12',
    };

    // Action
    const { id, content, owner } = new RegisteredThreadComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
