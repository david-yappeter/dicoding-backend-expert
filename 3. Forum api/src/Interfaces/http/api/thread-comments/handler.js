const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');

class ThreadCommentHandler {
  constructor(container) {
    this._container = container;

    this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
  }

  async postThreadCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;

    const addThreadCommentUseCase = this._container.getInstance(
      AddThreadCommentUseCase.name
    );
    const addedThreadComment = await addThreadCommentUseCase.execute({
      ...request.payload,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThreadComment,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadCommentHandler;
