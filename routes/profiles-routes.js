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
		.select({
			userID: 'users.id',
			userFirst: 'users.first',
			userLast: 'users.last',
			profileID: 'users_events.id',
			profileQuestions: 'users_events.questions',
			profileTopics: 'users_events.topics',
			profileJob: 'users_events.job_status',
			profileNoise: 'users_events.noise_level',
			profileWhereToFind: 'users_events.where_to_find',
			profileAskMe: 'users_events.ask_me',
			profilePersonality: 'users_events.personality'
		});

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
			// console.log(`Profiles: ` + JSON.stringify(profileData));
			// console.log(`Event: ` + JSON.stringify(eventData));
			// console.log(`Connections: ` + JSON.stringify(connectionData));
			res.render('profiles/all', {
				userID: res.locals.user,
				event: eventData,
				profiles: profileData,
				connections: connectionData
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err);
		});
});

router.get('/:profileID', (req, res, next) => {
	let theProfile = knex('users_events')
		.where('users_events.id', req.params.profileID)
		.innerJoin('users', 'users_events.user_id', 'users.id')
		.first()
		.select({
			userID: 'users.id',
			userFirst: 'users.first',
			userLast: 'users.last',
			profileID: 'users_events.id',
			profileQuestions: 'users_events.questions',
			profileTopics: 'users_events.topics',
			profileJob: 'users_events.job_status',
			profileNoise: 'users_events.noise_level',
			profileWhereToFind: 'users_events.where_to_find',
			profileAskMe: 'users_events.ask_me',
			profilePersonality: 'users_events.personality'
		});

	let theEvent = knex('events').where('id', req.params.id);

	Promise.all([theProfile, theEvent])
		.then(data => {
			let profileData = data[0];
			// console.log(`Profile data: ${JSON.stringify(profileData)}`);
			let eventData = data[1];
			// console.log(`Event Data: ${eventData}`);

			knex('connections')
				.where('user_id_owner', req.session.user)
				.andWhere('user_id_friend', profileData.userID)
				.then(connectionData => {
					// res.json({
					// 	profile: profileData,
					// 	event: eventData,
					// 	connection: connectionData
					// });
					res.render('profiles/single', {
						userID: res.locals.user,
						profile: profileData,
						event: eventData,
						connectionData: connectionData
					});
				});

			// res.render('profiles/single', {
			// 	event: eventData,
			// 	profile: profileData,
			// 	connections: connectionData
			// });
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err);
		});
});

module.exports = router;
