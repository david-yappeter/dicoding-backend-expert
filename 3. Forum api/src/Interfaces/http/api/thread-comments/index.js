const ThreadCommentHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'thread-comments',
  register: async (server, { container }) => {
    const threadCommentHandler = new ThreadCommentHandler(container);
    server.route(routes(threadCommentHandler));
  },
};
