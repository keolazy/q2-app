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
						res.redirect(req.session.returnTo);
					} else {
						res.redirect('/events');
					}
				})
				.catch(mismatch => {
					res.status(400).json('Wrong password');
				});
		})
		.catch(notRegistered => {
			res.status(400).json('That email is not on file');
		});
});

module.exports = router;
