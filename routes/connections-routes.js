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
						.then( () => {
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
	knex('connections')
	.where({user_id_owner: req.params.id})
	.andWhere({user_id_friend:req.params.friend_id})
	.then( connections => {
		if(connections.length) {
			res.send('connection already exists')
			return;
		}
		// Insert connection since it doesn't already exist.
		knex('connections')
		.insert({user_id_owner:req.params.id, user_id_friend:req.params.friend_id, mutual:false})
		.then( connections => {
			// currentConnectionId = connections[0].id;
			knex('connections')
			.where({user_id_owner:req.params.friend_id})
			.andWhere({user_id_friend:req.params.id})
			.then( mutualConnections => {
				if(mutualConnections.length){ // THERE IS A MUTUAL CONNECTION!!!
					knex('connections')
					.update({mutual:true})
					.where({
						user_id_owner:req.params.friend_id,
						user_id_friend:req.params.id
					})
					.then( (connections) => {
						knex('connections')
						.update({mutual:true})
						.where({
							user_id_friend:req.params.friend_id,
							user_id_owner:req.params.id
						})
						.then(connections => {
							res.send('you\'ve been matched')
						})
					})
					.catch( err => res.send(err));
				} else {
					res.send('you like them more than they like you');
				}
			})
		})
	})
})

router.delete('/:id/:friend_id', (req, res) => {
	knex('connections')
	.update({mutual:false})
	.where({user_id_owner:req.params.friend_id})
	.then( (stuff) => {
		knex('connections')
		.where({user_id_owner:req.params.id})
		.del()
		.then( (stuff) => {
			res.send('cool')
		})
	})
})



module.exports = router;


// ~ when a user adds a connection...
// check if 2 users are friends with each other:
//  their ID and FRIENDS_ID are added to connections table with MUTUAL set to false
// check OWNER_IDs for FRIENDS_ID, if equal, check FRIENDS_ID for OWNER_ID, if equal, set MUTAL to true

// ~ when a user deletes a connection...

//  delete row where session user == OWNER_ID, and where OWNER_ID == FRIENDS_ID, set mutual to false
