const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');

class ThreadCommentHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    this.deleteThreadCommentHandler =
      this.deleteThreadCommentHandler.bind(this);
  }

  async postThreadCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;

    const addThreadCommentUseCase = this._container.getInstance(
      AddThreadCommentUseCase.name
    );

    const addedComment = await addThreadCommentUseCase.execute({
      ...request.payload,
      threadId,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteThreadCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    const deleteThreadCommentUseCase = this._container.getInstance(
      DeleteThreadCommentUseCase.name
    );

    await deleteThreadCommentUseCase.execute({
      credentialId,
      threadId,
      threadCommentId: commentId,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadCommentHandler;
