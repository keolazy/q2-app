const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bodyParser = require('body-parser');

// Returns all connections *for this user*
router.get('/', (req, res) => {
	if (res.locals.user) {
		knex('connections')
			.where({ user_id_owner: +res.locals.user, mutual: true })
			.innerJoin('users', 'users.id', 'connections.user_id_friend')
			.select({
				userID: 'users.id',
				userFirst: 'users.first',
				userLast: 'users.last',
				userEmail: 'users.email',
				userLocation: 'users.location',
				userInterests: 'users.interests',
				userProfession: 'users.profession',
				userProfEmail: 'users.email_professional',
				userLinkedIn: 'users.linkedin',
				userFacebook: 'users.facebook',
				userPhone: 'users.phone'
			})
			.then(connections => {
				res.send(connections);
			});
	} else {
		res.status(400).json(`Can't get connections without being logged in`);
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
// router.post('/:userId', (req, res) => {
// 	if (req.session.user) {
// 		knex('connections')
// 			.where('user_id_owner', req.session.user)
// 			.andWhere('user_id_friend', req.params.userId)
// 			.then(result => {
// 				// If record already exists:
// 				if (result.length) {
// 					console.log(result);
// 					res.status(400).json('This connection was already in the DB');
// 				} else {
// 					// Insert new record:
// 					knex('connections')
// 						.insert({
// 							user_id_owner: req.session.user,
// 							user_id_friend: req.params.userId
// 						})
// 						.then(() => {
// 							res.send(
// 								`Made a new connection between you (ID #${req.session.user}) and ID #${
// 									req.params.userId
// 								}`
// 							);
// 						});
// 				}
// 			})
// 			.catch(error => {
// 				console.log('Found Connection Error:', error);
// 				res.send(error);
// 			});
// 	} else {
// 		res.redirect('/login.html');
// 	}
// });

// // Delete single connection (only if this user is 'owner')
// router.delete('/:id', (req, res) => {
// 	// if (req.session.user) {
// 	knex('connections')
// 		.where('id', req.params.id) // req.params.id refers to URL input
// 		// .where("user_id_owner", req.session.user)
// 		.first()
// 		.del()
// 		.then(result => {
// 			console.log(result);
// 			res.send(`Deleted ${result} record(s)`);
// 		})
// 		.catch(error => {
// 			console.log('Found Connection Error:', error);
// 			res.send(error);
// 		});
// 	// }
// });

router.post('/:id/:friend_id', (req, res) => {
	let intended = knex('connections').where({
		user_id_owner: req.params.id,
		user_id_friend: req.params.friend_id
	});

	let reciprocal = knex('connections').where({
		user_id_owner: req.params.friend_id,
		user_id_friend: req.params.id
	});

	Promise.all([intended, reciprocal]).then(result => {
		let recordExists = result[0].length > 0;
		let reciprocalExists = result[1].length > 0;

		if (reciprocalExists && recordExists) {
			knex('connections')
				.where({
					user_id_owner: req.params.id,
					user_id_friend: req.params.friend_id
				})
				.orWhere({
					user_id_owner: req.params.friend_id,
					user_id_friend: req.params.id
				})
				.update({ mutual: true })
				.then(result => {
					res.status(200).json('You are already mutually connected to this person.');
				});
		} else if (reciprocalExists) {
			knex('connections')
				.insert({
					user_id_owner: req.params.id,
					user_id_friend: req.params.friend_id,
					mutual: true
				})
				.then(result => {
					knex('connections')
						.where({
							user_id_owner: req.params.friend_id,
							user_id_friend: req.params.id
						})
						.update({ mutual: true })
						.then(result => {
							res.status(200).json('Created a new mutual connection');
						});
				});
		} else if (recordExists) {
			res.status(400).json('You already requested to connect with this person.');
		} else {
			knex('connections')
				.insert({
					user_id_owner: req.params.id,
					user_id_friend: req.params.friend_id,
					mutual: true
				})
				.then(result => {
					res.status(200).json('New connection created.');
				});
		}
	});

	// knex('connections')
	// 	.where({ user_id_owner: req.params.id, user_id_friend: req.params.friend_id })
	// 	.orWhere({ user_id_owner: req.params.friend_id, user_id_friend: req.params.id })
	// 	.then(result => {
	// 		if (result.length == 1) {
	// 			// If record already exists, don't insert it.
	// 			res.status(400).json(`This connection already exists`);
	// 		} else {
	// 			// Else, go ahead and create new connection:
	// 			knex('connections')
	// 				.insert({
	// 					user_id_owner: req.params.id,
	// 					user_id_friend: req.params.friend_id,
	// 					mutual: false
	// 				})
	// 				.then(connections => {
	// 					// currentConnectionId = connections[0].id;
	// 					knex('connections')
	// 						.where({ user_id_owner: req.params.friend_id })
	// 						.andWhere({ user_id_friend: req.params.id })
	// 						.then(mutualConnections => {
	// 							if (mutualConnections.length) {
	// 								// THERE IS A MUTUAL CONNECTION!!!
	// 								knex('connections')
	// 									.update({ mutual: true })
	// 									.where({
	// 										user_id_owner: req.params.friend_id,
	// 										user_id_friend: req.params.id
	// 									})
	// 									.then(connections => {
	// 										knex('connections')
	// 											.update({ mutual: true })
	// 											.where({
	// 												user_id_friend: req.params.friend_id,
	// 												user_id_owner: req.params.id
	// 											})
	// 											.then(connections => {
	// 												res.send("you've been matched");
	// 											});
	// 									})
	// 									.catch(err => res.send(err));
	// 							} else {
	// 								res.send('you like them more than they like you');
	// 							}
	// 						});
	// 				});
	// 		}
	// 	});
});

router.delete('/:owner_id/:friend_id', (req, res) => {
	console.log('hi there');
	knex('connections')
		.where({ user_id_owner: req.params.friend_id, user_id_friend: req.params.owner_id })
		.update({ mutual: false })
		.then(updateResult => {
			console.log(`Results of update: ${updateResult}`);
			knex('connections')
				.where({ user_id_owner: req.params.owner_id, user_id_friend: req.params.friend_id })
				.del()
				.then(deleteResult => {
					console.log(`Result of delets: ${deleteResult}`);
					res.status(200).json('Record deleted for you');
				});
		});
});

module.exports = router;
