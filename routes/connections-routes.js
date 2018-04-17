const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bodyParser = require('body-parser');

// Returns all connections *for this user*
router.get('/', (req, res) => {
	if (req.session.user) {
		knex('connections')
			.select('*')
			.where('user_id_owner', req.session.user)
			.then(connections => {
				res.send(connections);
			});
	} else {
		console.log('You need to login BRO');
		res.redirect('/');
	}
});

// Return a single connection ONLY if user is owner. (connection id )
router.get('/:id', (req, res) => {
	if (req.session.user) {
		knex('connections')
			.where('id', req.params.id)
			.where('user_id_owner', req.session.user)
			.first()
			.then(connection => {
				console.log('Found connection:', connection);
				if (connection) {
					// Connection exists!
					res.send(connection);
				} else {
					// Connection doesn't belong to this user.
					res.send("That's not your connection biotch!");
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

// Make a new "one-way" connection.
router.post('/:userId', (req, res) => {
	if (req.session.user) {
		knex('connections')
			.where('user_id_owner', req.session.user)
			.andWhere('user_id_friend', req.params.userId)
			.then(result => {
				// If record already exists:
				if (result.length) {
					console.log(result);
					res.status(400).json('This connection was already in the DB');
				} else {
					// Insert new record:
					knex('connections')
						.insert({
							user_id_owner: req.session.user,
							user_id_friend: req.params.userId
						})
						.then(() => {
							res.send(
								`Made a new connection between you (ID #${req.session.user}) and ID #${
									req.params.userId
								}`
							);
						});
				}
			})
			.catch(error => {
				console.log('Found Connection Error:', error);
				res.send(error);
			});
	} else {
		res.redirect('/login.html');
	}
});

// Delete single connection (only if this user is 'owner')
router.delete('/:id', (req, res) => {
	// if (req.session.user) {
	knex('connections')
		.where('id', req.params.id) // req.params.id refers to URL input
		// .where("user_id_owner", req.session.user)
		.first()
		.del()
		.then(result => {
			console.log(result);
			res.send(`Deleted ${result} record(s)`);
		})
		.catch(error => {
			console.log('Found Connection Error:', error);
			res.send(error);
		});
	// }
});

module.exports = router;
