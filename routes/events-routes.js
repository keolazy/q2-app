const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');
const profiles = require('./profiles-routes');
const methodOverride = require('method-override');
// const bodyParser = require('body-parser');
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({extended:true}));

// router.get("/", (req, res, next) => {
//   if (req.session.user) {
//     next();
//   } else {
//     res.redirect("/login.html");
//   }
// });

// Nathan was here
// Should only return events that user is attending.

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
				// res.json(user_events);
				res.render('events/home', { users_events: users_events });
			});
	} else {
		res.redirect('/');
	}
});

// Return all events
router.get('/all', (req, res) => {
	if (req.session.user) {
		knex('events')
			.select('*')
			.then(events => {
				if (events) {
					// res.send(events);
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
		res.redirect('/');
	}
});

// Returns single event. No attendees
router.get('/:id', (req, res) => {
	knex('events')
		.select('*')
		.where({ id: req.params.id })
		.first()
		.then(event => {
			// res.send(event);
			res.render('events/single', { event });
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
