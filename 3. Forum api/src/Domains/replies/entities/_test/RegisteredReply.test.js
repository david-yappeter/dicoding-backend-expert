const { currentDateIso } = require('../../../../utils/time');
const RegisteredReply = require('../RegisteredReply');

describe('a RegisteredReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'this is content',
    };

    // Action and Assert
    expect(() => new RegisteredReply(payload)).toThrowError(
      'REGISTERED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'content',
      owner: 123,
      thread_comment_id: 325,
    };

    // Action and Assert
    expect(() => new RegisteredReply(payload)).toThrowError(
      'REGISTERED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should hide content when deleted', () => {
    // Arrange
    const payload = {
      id: 'reply-99sdb9hg09ersgh90ers',
      content: 'content',
      owner: 'user-ejiwag12',
      thread_comment_id: 'thread-comments-123',
      deleted_at: currentDateIso(),
    };

    // Action
    const { id, content, owner, thread_comment_id } = new RegisteredReply(
      payload
    );

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**balasan telah dihapus**');
    expect(owner).toEqual(payload.owner);
    expect(thread_comment_id).toEqual(payload.thread_comment_id);
  });

  it('should create RegisteredReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-99sdb9hg09ersgh90ers',
      content: 'content',
      owner: 'user-ejiwag12',
      thread_comment_id: 'thread-comments-123',
    };

    // Action
    const { id, content, owner, thread_comment_id } = new RegisteredReply(
      payload
    );

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(thread_comment_id).toEqual(payload.thread_comment_id);
  });
});
