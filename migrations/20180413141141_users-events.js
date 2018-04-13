exports.up = function(knex, Promise) {
	return knex.schema.createTable('users_events', table => {
		table.increments();
		table
			.foreign('user_id')
			.references('users.id')
			.onDelete('CASCADE');
		table
			.foreign('event_id')
			.references('events.id')
			.onDelete('CASCADE');

		table.string('phone');
		table.timestamps(true, true);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users_events');
};
