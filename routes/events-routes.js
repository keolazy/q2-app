const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');
const profiles = require('./profiles-routes');
const methodOverride = require('method-override');

router.use((req, res, next) => {
	req.session.returnTo = req.originalUrl;
	next();
});

router.use('/', (req, res, next) => {
	console.log(`Session user id is: ${res.locals.user}`);
	if (res.locals.user) {
		next();
	} else {
		req.session.message = { type: 'error', text: 'You must be logged in to view events.' };
		res.redirect('/login');
	}
});

// Get all user's events
router.get('/', (req, res) => {
	if (req.session.user) {
		knex('users_events')
			.where('user_id', req.session.user)
			.innerJoin('events', 'users_events.event_id', 'events.id')
			.select(
				'users_events.id',
				'users_events.user_id',
				'users_events.event_id',
				'events.name',
				'events.description',
				'events.location',
				'events.date',
				'events.start_time',
				'events.end_time'
			)
			.then(users_events => {
				res.render('events/home', { users_events: users_events });
			});
	} else {
		req.session.message = { type: 'error', text: 'You must be logged in to view event profiles.' };
		console.log(`Setting req session message to: ${req.session.message.text}`);
		res.redirect('/login');
	}
});

// Return all events
router.get('/all', (req, res) => {
	if (req.session.user) {
		knex('events')
			.select('*')
			.then(events => {
				if (events) {
					res.render('events/all', { events: events });
				} else {
					res.send('Connection invalid');
				}
			})
			.catch(error => {
				console.log('Finding Connection Error:', error);
				res.send(error);
			});
	} else {
		req.session.message = { type: 'error', text: 'You must be logged in to view event profiles.' };
		res.redirect('/login');
	}
});

// Get form to create new Event
router.get('/new', (req, res) => {
	if (res.locals.user) {
		res.render('events/new');
	} else {
		res.status(400).json('You must be logged in to create a new event');
	}
});

// Create new event -- redirects to edit your profile for it
router.post('/', (req, res) => {
	knex('events')
		.insert({
			name: req.body.name,
			description: req.body.description,
			location: req.body.location,
			date: req.body.date,
			start_time: req.body.start_time,
			end_time: req.body.start_time,
			host_id: res.locals.user
		})
		.then(result => {
			// Lookup the new event that was just created:
			let newEvent = knex('events')
				.select('*')
				.where({ host_id: res.locals.user, name: req.body.name })
				.first();

			// Get the Event ID from new event, then create a new Profile for it:
			newEvent.then(event => {
				res.redirect(`/events/${event.id}/profiles/new`);
			});
		});
});

// Returns detail for single event
router.get('/:id', (req, res) => {
	knex('events')
		.select('*')
		.where({ id: req.params.id })
		.first()
		.then(event => {
			knex('users_events')
				.where({ user_id: res.locals.user, event_id: req.params.id })
				.first()
				.then(profile => {
					console.log(JSON.stringify(profile));
					let theMessage = req.session.message;
					req.session.message = {};
					res.render('events/single', { event: event, profile: profile, message: theMessage });
				});
		});
});

router.use('/:id/profiles', profiles);

router.get('/:id/edit', (req, res) => {
	knex('events')
		.select('*')
		.where({ id: req.params.id })
		.first()
		.then(result => {
			console.log(result);
			if (result.host_id == res.locals.user) {
				res.render('events/edit', { event: result });
			} else {
				res.status(400).json('You have to be the host to edit an event.');
			}
		});
});

router.put('/:id/edit', (req, res) => {
	knex('events')
		.where({ id: req.params.id })
		.first()
		.then(result => {
			console.log(`Result host ID is: ${result.host_id}`);
			console.log(`Res.locals.user is: ${res.locals.user}`);
			if (result.host_id == res.locals.user) {
				knex('events')
					.where({ id: req.params.id })
					.update(req.body)
					.then(result => {
						console.log(`Event updated.`);
						req.session.message = {
							type: 'confirmation',
							text: 'Event details updated.'
						};
						res.redirect(`/events/${req.params.id}`);
					});
			} else {
				res.status(400).json('You have to be the host to edit an event.');
			}
		});
});

router.post('/', (req, res) => {
	knex('events')
		.insert({
			name: req.body.name,
			description: req.body.description,
			location: req.body.location,
			date: req.body.date,
			start_time: req.body.start_time,
			end_time: req.body.start_time,
			host_id: req.body.host_id
		})
		.then(result => {
			res.send(result);
		});
});

// router.patch('/:id', (req, res) => {
// 	knex('events')
// 		.where({ id: req.params.id })
// 		.update({
// 			name: req.body.name,
// 			description: req.body.description,
// 			location: req.body.location,
// 			date: req.body.date,
// 			start_time: req.body.start_time,
// 			end_time: req.body.start_time,
// 			host_id: req.body.host_id
// 		})
// 		.then(() => {
// 			res.send('dang fool');
// 		});
// });

router.delete('/:id', (req, res) => {
	knex('events')
		.where({ id: req.params.id })
		.first()
		.then(result => {
			if (result.host_id == res.locals.user) {
				knex('events')
					.where({ id: req.params.id })
					.del()
					.then(deleteResult => {
						res.status(200).json('Event deleted!');
					});
			} else {
				res.status(400).json('You have to be the host to delete an event');
			}
		});
});

module.exports = router;
