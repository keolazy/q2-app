const bcrypt = require('bcrypt-as-promised');
const router = require('express').Router();
const knex = require('../db/knex');
const session = require('express-session');

router.post('/', (req, res, next) => {
	let givenEmail = req.body.email;
	let givenPw = req.body.password;

	knex('users')
		.where('email', givenEmail)
		.then(result => {
			if (result.length) {
				res.status(400).send('This email already exists');
			} else {
				bcrypt.hash(givenPw, 10).then(hash => {
					knex('users')
						.insert({ email: givenEmail, hashed_pw: hash })
						.then(success => {
							// res.status(200).send('Ok we created your account!');
								res.redirect('/login')
						})
						.catch(err => {
							res.status(500).send(`We hit an error saving the user`);
						});
				});
			}
		})
		.catch(err => {
			res.status(500).send('We hit an error in the lookup');
		});
});

module.exports = router;
