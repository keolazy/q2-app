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
		table.string('questions');
		table.string('topics');
		table.string('job_status');
		table.string('noise_level');
		table.string('where_to_find');
		table.string('ask_me');
		table.string('personality');
		table.timestamps(true, true);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users_events');
};
