/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    thread_comment_id: {
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
    'replies',
    'replies_users_fk',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );
  // threadId
  pgm.addConstraint(
    'replies',
    'replies_thread_comments_fk',
    'FOREIGN KEY(thread_comment_id) REFERENCES thread_comments(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('replies', 'replies_users_fk');
  pgm.dropConstraint('replies', 'replies_thread_comments_fk');
  pgm.dropTable('replies');
};
