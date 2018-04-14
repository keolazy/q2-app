exports.seed = function(knex, Promise) {
	return knex('users_events')
		.del()
		.then(() => {
			knex('connections')
				.del()
				.then(() => {
					knex('events')
						.del()
						.then(() => {
							knex('users').del();
						});
				});
		});
};
