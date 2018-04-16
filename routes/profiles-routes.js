const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');

router.get('/', (req, res, next) => {
	// let profiles = knex('users_events')
	// 	.where('event_id', req.params.id)
	// 	.innerJoin('users', 'users_events.user_id', 'users.id')
	// 	.select(
	// 		'users.id',
	// 		'users.first',
	// 		'users.last',
	// 		'users_events.questions',
	// 		'users_events.topics',
	// 		'users_events.job_status',
	// 		'users_events.noise_level',
	// 		'users_events.where_to_find',
	// 		'users_events.ask_me',
	// 		'users_events.personality'
	// 	);
	//
	// let event = knex('events')
	// 	.where('id', req.params.id)
	// 	.first();
	//
	// let connections = knex('connections')

	knex('users_events')
		.where('event_id', req.params.id)
		.innerJoin('users', 'users_events.user_id', 'users.id')
		.select(
			'users.id',
			'users.first',
			'users.last',
			'users_events.questions',
			'users_events.topics',
			'users_events.job_status',
			'users_events.noise_level',
			'users_events.where_to_find',
			'users_events.ask_me',
			'users_events.personality'
		)
		.then(profiles => {
			knex('events')
				.where('id', req.params.id)
				.first()
				.then(event => {
					res.render('profiles/all', { event: event, profiles: profiles });
				});
			// res.status(200).json(profiles);
		});
});

module.exports = router;
