exports.up = function(knex, Promise) {
	return knex.schema.createTable('users', table => {
		table.increments();
		table.string('email');
		table.string('location');
		table.string('interests');
		table.string('hashed_pw');
		table.string('email_professional');
		table.string('linkedin');
		table.string('facebook');
		table.string('phone');
		table.timestamps(true, true);
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users');
};
