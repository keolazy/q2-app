const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');

router.use('/', (req, res, next) => {
	console.log(`Session user id is: ${res.locals.user}`);
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
			let eventData = data[1];

			knex('connections')
				.where('user_id_owner', res.locals.user)
				.andWhere('user_id_friend', profileData.userID)
				.then(connectionData => {
					res.render('profiles/single', {
						userID: res.locals.user,
						profile: profileData,
						event: eventData,
						connectionData: connectionData
					});
				});
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err);
		});
});

router.get('/:profileID/edit', (req, res, next) => {
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
			let eventData = data[1];

			res.render('profiles/edit', {
				userID: res.locals.user,
				profile: profileData,
				event: eventData
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err);
		});
});

router.put('/:profileID/edit', (req, res, next) => {
	let theProfile = knex('users_events')
		.where('users_events.id', req.params.profileID)
		.first();

	theProfile.then(profile => {
		if (res.locals.user == profile.user_id) {
			knex('users_events')
				.where('users_events.id', req.params.profileID)
				.first()
				.update({
					questions: req.body.questions,
					topics: req.body.topics,
					job_status: req.body.job_status,
					noise_level: req.body.noise_level,
					where_to_find: req.body.where_to_find,
					ask_me: req.body.ask_me,
					personality: req.body.personality
				})
				.then(result => {
					res.redirect(`/events/${req.body.event_id}/profiles/${req.params.profileID}`);
				});
		} else {
			res.status(400).json(`You can't edit a profile that isn't yours`);
		}
	});
});

module.exports = router;
