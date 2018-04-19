const express = require('express');
const router = express.Router({ mergeParams: true });
const knex = require('../db/knex');
const methodOverride = require('method-override');

router.use((req, res, next) => {
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
			text: 'You must be logged in to view your account.'
		};
		res.redirect('/login');
	}
});

// return user's account info from users table
router.get('/', (req, res) => {
	knex('users')
		.where('id', req.session.user)
		.select('*')
		.first()
		.then(data => {
			console.log(data);
			res.render('account/view', { user: data, message: req.session.message });
		})
		.catch(error => {
			res.send('didnt render');
		});
});

router.get('/edit', (req, res) => {
	knex('users')
		.select('*')
		.where('id', req.session.user)
		.first()
		.then(data => {
			console.log({ user: data });
			res.render('account/edit', { user: data, message: req.session.message });
		})
		.catch(error => {
			res.send(error);
		});
});

router.put('/edit', (req, res) => {
	knex('users')
		.where({ id: req.session.user })
		.first()
		.then(result => {
			console.log(`Result host ID is: ${result.id}`);
			console.log(`Res.locals.user is: ${res.locals.user}`);
			if (result.id == res.locals.user) {
				knex('users')
					.where({ id: req.session.user })
					.update(req.body)
					.then(result => {
						console.log(`Account Succesfully Updated`);
						res.redirect(`/account`);
					});
			} else {
				res.status(400).json('you have to be the host to edit this account.');
			}
		});
});

module.exports = router;
