const bcrypt = require('bcrypt-as-promised');
const router = require('express').Router();
const knex = require('../db/knex');

router.post('/', (req, res, next) => {
	console.log(req.body);
	let givenEmail = req.body.email;
	let givenPw = req.body.password;
	knex('users')
		.where('email', givenEmail)
		.first()
		.then(userOnFile => {
			// check for bcrypt match
			bcrypt
				.compare(givenPw, userOnFile.hashed_pw)
				.then(success => {
					res.status(200).json('This is the right password!');
				})
				.catch(failure => {
					res.status(400).json('Wrong password');
				});
		})
		.catch(err => {
			res.status(400).json('That email is not on file');
		});
	// res.status(200).json('All clear here');
});

module.exports = router;
