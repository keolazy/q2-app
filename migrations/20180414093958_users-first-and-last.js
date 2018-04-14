
exports.up = function(knex, Promise) {
  return knex.schema.table('users', table => {
      table.string('first');
      table.string('last')
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('users', table => {
        table.dropColumn('first');
        table.dropColumn('last')
    })
};
