const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

router.get('/', (req, res) => {
	// res.status(200).json(`The events are here.`)
		knex('events').select('*')
		.then( (events) => {
			res.send(events)
		})
});
router.get('/:id', (req, res) => {
	knex('events').select('*')
	.where({id:req.params.id}).then( (oneEvent) => {
		res.send(oneEvent[0])
	})
})
module.exports = router;
