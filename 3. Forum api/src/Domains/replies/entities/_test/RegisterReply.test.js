const RegisterReply = require('../RegisterReply');

describe('a RegisterReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'this is content',
    };

    // Action and Assert
    expect(() => new RegisterReply(payload)).toThrowError(
      'REGISTER_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'this is content',
      owner: 123,
      thread_comment_id: 'thread-comments-123',
    };

    // Action and Assert
    expect(() => new RegisterReply(payload)).toThrowError(
      'REGISTER_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create RegisterReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'this is content',
      owner: 'user-12123',
      thread_comment_id: 'thread-comments-123',
    };

    // Action
    const { content, owner, thread_comment_id } = new RegisterReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(thread_comment_id).toEqual(payload.thread_comment_id);
  });
});
