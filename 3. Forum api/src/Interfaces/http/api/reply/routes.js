const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{thread_id}/comments/{thread_comment_id}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: '_forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{thread_id}/comments/{thread_comment_id}/replies/{reply_id}',
    handler: handler.deleteReplyHandler,
    options: {
      auth: '_forumapi_jwt',
    },
  },
];

module.exports = routes;
