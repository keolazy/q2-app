exports.up = function(knex, Promise) {
	return knex.schema.createTable('connections', table => {
		table.increments();
		table.integer('user_id_owner');
		table
			.foreign('user_id_owner')
			.references('users.id')
			.onDelete('CASCADE');
		table.integer('user_id_friend');
		table
			.foreign('user_id_friend')
			.references('users.id')
			.onDelete('CASCADE');
		table.timestamps(true, true);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('connections');
};
