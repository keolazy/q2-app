const bcrypt = require('bcrypt-as-promised');
const router = require('express').Router();
const knex = require('../db/knex');
const session = require('express-session');

router.get('/', (req, res) => {
	console.log(`About to render signup`);
	res.render('signup', { message: req.session.message });
});

router.post('/', (req, res, next) => {
	let givenEmail = req.body.email;
	let givenPw = req.body.password;

	knex('users')
		.where('email', givenEmail)
		.then(result => {
			if (result.length) {
				req.session.message = { type: 'warning', text: 'Oh, that email already exists.' };
				res.redirect('/signup');
			} else {
				bcrypt.hash(givenPw, 10).then(hash => {
					knex('users')
						.insert({ email: givenEmail, hashed_pw: hash })
						.then(success => {
							req.session.message = {
								type: 'confirmation',
								text: 'Account created! Please sign in.'
							};
							res.redirect('/login');
						})
						.catch(err => {
							req.session.message = {
								type: 'error',
								text: 'We hit an error creating your account.'
							};
							res.redirect('/signup');
						});
				});
			}
		})
		.catch(err => {
			req.session.message = {
				type: 'error',
				text: 'We hit some kind of server error. Perhaps try again?'
			};
			res.redirect('/signup');
		});
});

module.exports = router;
