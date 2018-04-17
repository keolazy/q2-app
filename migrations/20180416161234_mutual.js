
exports.up = function(knex, Promise) {
  return knex.schema.table('connections', table => {
    table.boolean('mutual')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('mutual', table => {
    table.dropColumn('mutual')
  })
};
