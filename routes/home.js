const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');
const profiles = require('./profiles-routes');
const methodOverride = require('method-override');

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
		req.session.message = {
			type: 'error',
			text: 'You must be logged in to view event profiles.'
		};
		res.redirect('/login');
	}
});

// Get all user's Events for Home Page stream.
// router.get('/', (req, res) => {
// 	if (req.session.user) {
// 		knex('users_events')
// 			.where('user_id', req.session.user)
// 			.innerJoin('events', 'users_events.event_id', 'events.id')
// 			.select(
// 				'users_events.id',
// 				'users_events.user_id',
// 				'users_events.event_id',
// 				'events.name',
// 				'events.description',
// 				'events.location',
// 				'events.date',
// 				'events.start_time',
// 				'events.end_time'
// 			)
// 			.then(users_events => {
// 				console.log(users_events);
// 				res.render('events/homeTest', { users_events: users_events });
// 			});
// 	} else {
// 		req.session.message = {
// 			type: 'error',
// 			text: 'You must be logged in to view event profiles.'
// 		};
// 		console.log(`Setting req session message to: ${req.session.message.text}`);
// 		res.redirect('/login');
// 	}
// });

router.get('/', (req, res, next) => {
	let eventsQuery = knex('users_events')
		.where('user_id', res.locals.user)
		.innerJoin('events', 'users_events.event_id', 'events.id')
		.select({
			id: 'events.id',
			name: 'events.name',
			location: 'events.location',
			date: 'events.date'
		});

	let userQuery = knex('users')
		.where('id', res.locals.user)
		.first();

	let rsvpCount = knex('users_events')
		.where('user_id', res.locals.user)
		.count('users_events');

	let hostingCount = knex('events')
		.where('host_id', res.locals.user)
		.count('events');

	let connectionCount = knex('connections')
		.where({ user_id_owner: res.locals.user, mutual: true })
		.count();

	Promise.all([userQuery, rsvpCount, hostingCount, connectionCount, eventsQuery])
		.then(data => {
			let userData = data[0];
			// console.log(`UserData: ${JSON.stringify(userData)}`);
			let rsvpData = data[1];
			// console.log(`RSVP Data: ${JSON.stringify(rsvpData)}`);
			let hostingData = data[2];
			// console.log(`Hosting Data: ${JSON.stringify(hostingData)}`);
			let connectionData = data[3];
			// console.log(`Connection Data: ${JSON.stringify(connectionData)}`);
			let eventsData = data[4];

			res.render('events/homeTest', {
				user: userData,
				rsvps: rsvpData[0].count,
				hosting: hostingData[0].count,
				connections: connectionData[0].count,
				events: eventsData
			});
		})
		.catch(error => {
			console.log(error);
			res.status(500).send(error);
		});
});

module.exports = router;
