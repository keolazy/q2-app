const bcrypt = require('bcrypt-as-promised');
const router = require('express').Router();
const knex = require('../db/knex');
const session = require('express-session');

router.post('/', (req, res, next) => {
	console.log(req.body);
	let givenEmail = req.body.email;
	let givenPw = req.body.password;
	knex('users')
		.where('email', givenEmail)
		.first()
		.then(userOnFile => {
			bcrypt
				.compare(givenPw, userOnFile.hashed_pw)
				.then(success => {
					req.session.user = userOnFile.id;
					if (req.session.returnTo) {
						req.session.message = {};
						res.redirect(req.session.returnTo);
					} else {
						res.redirect('/events');
					}
				})
				.catch(mismatch => {
					req.session.message = { type: 'warning', text: 'Sorry, that password was incorrect.' };
					res.redirect('/login');
					// res.status(400).json('Wrong password');
				});
		})
		.catch(notRegistered => {
			req.session.message = { type: 'warning', text: 'That email is not on file.' };
			res.redirect('/login');
		});
});

module.exports = router;
