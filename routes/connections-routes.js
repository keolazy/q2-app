const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bodyParser = require('body-parser');

// router.use((req, res, next) => {
// 	req.session.returnTo = req.originalUrl;
// 	next();
// });

router.use('/', (req, res, next) => {
	console.log(`Session user id is: ${res.locals.user}`);
	if (res.locals.user) {
		next();
	} else {
		req.session.message = {
			type: 'error',
			text: 'You must be logged in to view event connections.'
		};
		res.redirect('/login');
	}
});

// Returns all connections *for this user*
router.get('/', (req, res) => {
	if (res.locals.user) {
		knex('connections')
			.where({ user_id_owner: +res.locals.user, mutual: true })
			.innerJoin('users', 'users.id', 'connections.user_id_friend')
			.select({
				id: 'users.id',
				first: 'users.first',
				last: 'users.last',
				email: 'users.email',
				location: 'users.location',
				interests: 'users.interests',
				profession: 'users.profession',
				profEmail: 'users.email_professional',
				linkedIn: 'users.linkedin',
				facebook: 'users.facebook',
				phone: 'users.phone'
			})
			.then(connections => {
				theMessage = req.session.message;
				req.session.message = {};
				res.render('connections', {
					message: theMessage,
					userID: res.locals.user,
					connections: connections
				});
				// res.send(connections);
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
		req.session.message = { type: 'error', text: 'You must be logged in to view connections.' };
		res.redirect('/login');
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
					req.session.message = {
						type: 'warning',
						text: 'You are already mutually connected with this person.'
					};
					res.redirect(req.session.returnTo);
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
							// res.status(200).json('Created a new mutual connection');
							req.session.message = {
								type: 'confirmation',
								text:
									"Friendship established! You can now see this person's full info on the Connections page."
							};
							res.redirect(req.session.returnTo);
						});
				});
		} else if (recordExists) {
			req.session.message = {
				type: 'warning',
				text: 'You already requested to connect with this person.'
			};
			res.redirect(req.session.returnTo);
		} else {
			knex('connections')
				.insert({
					user_id_owner: req.params.id,
					user_id_friend: req.params.friend_id,
					mutual: false
				})
				.then(result => {
					req.session.message = {
						type: 'confirmation',
						text:
							"Created new one-way connection! If this person reciprocates, you'll see their full info on the Connections page."
					};
					res.redirect(req.session.returnTo);
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
	knex('connections')
		.where({ user_id_owner: req.params.friend_id, user_id_friend: req.params.owner_id })
		.update({ mutual: false })
		.then(updateResult => {
			console.log(`Results of update: ${updateResult}`);
			knex('connections')
				.where({ user_id_owner: req.params.owner_id, user_id_friend: req.params.friend_id })
				.del()
				.then(deleteResult => {
					console.log(`Result of delete: ${deleteResult}`);
					req.session.message = {
						type: 'warning',
						text: 'Removed your connection with this person.'
					};
					res.redirect('/connections');
				});
		});
});

module.exports = router;
