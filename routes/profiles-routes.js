const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');

router.use((req, res, next) => {
	req.session.returnToPrev = req.session.returnTo;
	req.session.returnTo = req.originalUrl;
	next();
});

router.use('/', (req, res, next) => {
	console.log(`Session user id is: ${res.locals.user}`);
	if (res.locals.user) {
		next();
	} else {
		req.session.message = { type: 'error', text: 'You must be logged in to view event profiles.' };
		res.redirect('/login');
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
			userPhoto: 'users.photo',
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

			let theMessage = req.session.message;
			req.session.message = {};

			res.render('profiles/all', {
				message: theMessage,
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

router.get('/rsvp', (req, res) => {
	let checkIfExisting = knex('users_events')
		.where({
			event_id: req.params.id,
			user_id: res.locals.user
		})
		.first();

	checkIfExisting.then(profile => {
		// If RSVP already exists, just edit it
		if (profile != null) {
			req.session.message = {
				type: 'confirmation',
				text: 'Editing your existing profile.'
			};
			res.redirect(`/events/${req.params.id}/profiles/${profile.id}/edit`);
		} else {
			req.session.message = {
				type: 'warning',
				text: `Okay you're signed up! Please fill in some fields for your new profile.`
			};
			res.redirect(`/events/${req.params.id}/profiles/new`);
		}
	});
});

router.get('/new', (req, res) => {
	console.log(`In the profiles/new route now`);
	console.log(`Res.locals.user is: ${res.locals.user}`);
	console.log(`Req params are: ${JSON.stringify(req.params)}`);

	let newEventID = req.params.id;

	// Create new Profile with correct event_id
	knex('users_events')
		.insert({
			user_id: res.locals.user,
			event_id: newEventID
		}) // Lookup profile that was just created:
		.then(result => {
			knex('users_events')
				.where({
					user_id: res.locals.user,
					event_id: newEventID
				})
				.first()
				.then(newCreatedProfile => {
					console.log(`Profile that got created is: ${newCreatedProfile}`);
					// Lookup id for new Profile and send user to edit it:
					let newProfileID = newCreatedProfile.id;
					req.session.message = {
						type: 'warning',
						text: `Okay you're signed up! Please fill in some fields for your new profile.`
					};
					res.redirect(`/events/${newEventID}/profiles/${newProfileID}/edit`);
				});
		});
});

router.delete('/:profileID', (req, res) => {
	let existingRecord = knex('users_events')
		.where({
			event_id: req.params.id,
			user_id: res.locals.user
		})
		.first();

	existingRecord.then(profileRecord => {
		knex('users_events')
			.where({
				event_id: req.params.id,
				user_id: res.locals.user
			})
			.first()
			.del()
			.then(result => {
				req.session.message = {
					type: 'warning',
					text: 'Deleted your profile and removed your RSVP.'
				};
				console.log(`ReturnToPrev is set to: ${req.session.returnToPrev}`);
				console.log(`ReturnTo is set to: ${req.session.returnTo}`);
				res.redirect(`/events/${req.params.id}`);
				// res.status(200).json('Profile deleted!');
			});
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
			userPhoto: 'users.photo',
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
					let theMessage = req.session.message;
					req.session.message = {};
					res.render('profiles/single', {
						message: theMessage,
						userID: res.locals.user,
						profile: profileData,
						event: eventData,
						connectionData: connectionData
					});
				});
		})
		.catch(err => {
			req.session.message = {
				type: 'error',
				text: 'Hmm, we hit a server error on that one for some reason. Sorry.'
			};
			res.redirect(req.session.returnTo);
			// console.log(err);
			// res.status(500).send(err);
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
			userPhoto: 'users.photo',
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

			let theMessage = req.session.message;
			req.session.message = {};

			res.render('profiles/edit', {
				message: theMessage,
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
					req.session.message = {
						type: 'confirmation',
						text: `Updated profile details.`
					};
					res.redirect(`/events/${req.body.event_id}`);
				});
		} else {
			req.session.message = {
				type: 'warning',
				text: `You can't edit a profile that isn't yours! How did you get there anyway?`
			};
			res.redirect(req.session.returnToPrev);
		}
	});
});

module.exports = router;
