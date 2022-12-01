const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: '_forumapi_jwt',
    },
  },
];

module.exports = routes;
