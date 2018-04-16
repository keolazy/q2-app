const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');

router.use('/', (req, res, next) => {
	console.log(`Session user id is: ${req.session.user}`);
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login.html');
	}
});

router.get('/', (req, res, next) => {
	let theProfiles = knex('users_events')
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
		);

	let theEvent = knex('events')
		.where('id', req.params.id)
		.first();

	let theConnections = [];

	if (req.session.user) {
		theConnections = knex('connections').where('user_id_owner', req.session.user);
	}

	Promise.all([theProfiles, theEvent, theConnections])
		.then(data => {
			let profileData = data[0];
			let eventData = data[1];
			let connectionData = data[2];
			console.log(`Profiles: ` + JSON.stringify(profileData));
			console.log(`Event: ` + JSON.stringify(eventData));
			console.log(`Connections: ` + JSON.stringify(connectionData));
			res.render('profiles/all', {
				event: eventData,
				profiles: profileData,
				connections: connectionData
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err);
		});

	// knex('users_events')
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
	// 	)
	// 	.then(profiles => {
	// 		knex('events')
	// 			.where('id', req.params.id)
	// 			.first()
	// 			.then(event => {
	// 				console.log(`Profiles: ` + JSON.stringify(profiles));
	// 				console.log(`Event: ` + JSON.stringify(event));
	// 				res.render('profiles/all', { event: event, profiles: profiles });
	// 			});
	// res.status(200).json(profiles);
	// });
});

module.exports = router;
