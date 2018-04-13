exports.up = function(knex, Promise) {
<<<<<<< HEAD
  return knex.schema.createTable("connections", table => {
    table.increments();
    table
      .foreign("user_id_owner")
      .references("users.id")
      .onDelete("CASCADE");
    table
      .foreign("user_id_friend")
      .references("users.id")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("connections");
=======
	return knex.schema.createTable('connections', table => {
		table.increments();
		table.integer('user_id_owner');
		table.integer('user_id_friend');
		table
			.foreign('user_id_owner')
			.references('users.id')
			.onDelete('CASCADE');
		table
			.foreign('user_id_friend')
			.references('users.id')
			.onDelete('CASCADE');
		table.timestamps(true, true);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('connections');
>>>>>>> 35be6442dca64d079053376812c11bb2e5d30476
};
