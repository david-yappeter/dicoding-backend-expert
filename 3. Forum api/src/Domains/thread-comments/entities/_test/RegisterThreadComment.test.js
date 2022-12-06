const RegisterThreadComment = require('../RegisterThreadComment');

describe('a RegisterThreadComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'this is content',
    };

    // Action and Assert
    expect(() => new RegisterThreadComment({ ...payload })).toThrowError(
      'REGISTER_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'this is content',
      owner: 123,
      threadId: 'thread-123',
    };

    // Action and Assert
    expect(() => new RegisterThreadComment({ ...payload })).toThrowError(
      'REGISTER_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create RegisterThreadComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'this is content',
      owner: 'user-12123',
      threadId: 'thread-123',
    };

    // Action
    const { content, owner, threadId } = new RegisterThreadComment({
      ...payload,
    });

    // Assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
  });
});
