const routes = (handler) => [
  {
    method: 'POST',
    path: '/thread-comments',
    handler: handler.postThreadCommentHandler,
    options: {
      auth: '_forumapi_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: handler.postThreadCommentHandler,
    options: {
      auth: '_forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteThreadCommentHandler,
    options: {
      auth: '_forumapi_jwt',
    },
  },
];

module.exports = routes;
