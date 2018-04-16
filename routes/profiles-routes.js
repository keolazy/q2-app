const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');

router.get('/', (req, res, next) => {
	knex('users_events')
		.where('event_id', req.params.id)
		.then(response => {
			res.status(200).json(response);
		});
	// res.status(200).send(`You're asking for profile for event ID: ${req.params.id}`);
});

module.exports = router;
