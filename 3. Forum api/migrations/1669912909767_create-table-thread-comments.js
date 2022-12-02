/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('thread_comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
    },
    updated_at: {
      type: 'TEXT',
    },
    deleted_at: {
      type: 'TEXT',
    },
  });

  // owner
  pgm.addConstraint(
    'thread_comments',
    'thread_comments_users_fk',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
  // threadId
  pgm.addConstraint(
    'thread_comments',
    'thread_comments_threads_fk',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('thread_comments', 'thread_comments_users_fk');
  pgm.dropConstraint('thread_comments', 'thread_comments_threads_fk');
  pgm.dropTable('thread_comments');
};
