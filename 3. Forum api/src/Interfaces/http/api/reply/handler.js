const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ReplyHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { thread_id, thread_comment_id } = request.params;

    // const getThreadDetailUseCase = this._container.getInstance(
    //   GetThreadDetailUseCase.name
    // );
    // const thread = await getThreadDetailUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread: {
          id: thread.id,
          title: thread.title,
          body: thread.body,
          date: thread.created_at,
          username: thread.username,
          comments: thread.comments.map((comment) => ({
            id: comment.id,
            username: comment.username,
            date: comment.created_at,
            content: comment.content,
          })),
        },
      },
    });
    response.code(200);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { thread_id, thread_comment_id, reply_id } = request.params;

    // const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    // const addedThread = await addThreadUseCase.execute({
    //   ...request.payload,
    //   owner: credentialId,
    // });

    const response = h.response({
      status: 'success',
      data: {
        addedThread: {
          id: addedThread.id,
          title: addedThread.title,
          owner: addedThread.owner,
        },
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ReplyHandler;
