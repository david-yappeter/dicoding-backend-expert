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
];

module.exports = routes;
