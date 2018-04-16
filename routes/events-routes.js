const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const profiles = require('./profiles-routes');

// const bodyParser = require('body-parser');
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({extended:true}));

router.use('/profiles', profiles);

router.get('/', (req, res, next) => {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login.html');
	}
});

router.get('/', (req, res) => {
	// res.status(200).json(`The events are here.`)
	knex('events')
		.select('*')
		.then(events => {
			res.send(events);
		});
});

router.get('/:id', (req, res) => {
	knex('events')
		.select('*')
		.where({ id: req.params.id })
		.then(oneEvent => {
			res.send(oneEvent);
		});
});

router.post('/', (req, res) => {
	knex('events')
		.insert({
			name: req.query.name,
			description: req.query.description,
			location: req.query.location,
			date: req.query.date,
			start_time: req.query.start_time,
			end_time: req.query.start_time,
			host_id: req.query.host_id
		})
		.then(() => {
			res.send('its party time');
		});
});
router.patch('/:id', (req, res) => {
	knex('events')
		.where({ id: req.params.id })
		.update({
			name: req.query.name,
			description: req.query.description,
			location: req.query.location,
			date: req.query.date,
			start_time: req.query.start_time,
			end_time: req.query.start_time,
			host_id: req.query.host_id
		})
		.then(() => {
			res.send('dang fool');
		});
});
router.delete('/:id', (req, res) => {
	knex('events')
		.where({ id: req.params.id })
		.del()
		.then(() => {
			res.send('party times over');
		});
});

module.exports = router;
