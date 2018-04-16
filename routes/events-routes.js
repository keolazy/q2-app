const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');
const profiles = require('./profiles-routes');
const methodOverride = require('method-override');
// const bodyParser = require('body-parser');
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({extended:true}));


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

router.get('/:id/edit', (req, res) => {
	knex('events')
		.select('*')
		.where({ id: req.params.id })
		.then(oneEvent => {
			res.render('../views/editEvent', {oneEvent:oneEvent})
			console.log(oneEvent)
		});
});

router.put('/:id/edit', (req, res) => {
	router.use(methodOverride('application/x-www-form-urlencoded'))
	knex('events')
		.where({ id: req.params.id })
		.update({
			name: req.body.name,
			description: req.body.description,
			location: req.body.location,
			date: req.body.date,
			start_time: req.body.start_time,
			end_time: req.body.end_time,
			host_id: req.body.host_id
		})
		.then(() => {
			res.send('you just updated the event');
			console.log(req.body.name)
		});
})




router.use('/:id/profiles', profiles);

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
		.then((result) => {
			res.send(result);
		});
});
router.patch('/:id', (req, res) => {
	knex('events')
		.where({ id: req.params.id })
		.update({
			name: req.body.name,
			description: req.body.description,
			location: req.body.location,
			date: req.body.date,
			start_time: req.body.start_time,
			end_time: req.body.start_time,
			host_id: req.body.host_id
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
