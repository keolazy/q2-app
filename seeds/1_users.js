const bcrypt = require('bcrypt');

exports.seed = function(knex, Promise) {
	return knex('users').insert([
		{
			first: 'Nathan',
			last: 'Keolasy',
			email: 'nathank@gmail.com',
			location: 'austin',
			interests: 'Paintball',
			profession: 'Web Development/Marketing',
			hashed_pw: '',
			email_professional: 'nathanK@dropbox.com',
			linkedin: 'NathanK777',
			facebook: 'none',
			hashed_pw: bcrypt.hashSync('nathan', 10),
			phone: '512-364-6188'
		},
		{
			first: 'Jordan',
			last: 'Peterson',
			email: 'jordanpeterson@gmail.com',
			location: 'austin',
			interests: 'philosophy',
			profession: 'Clinical Psychologist',
			hashed_pw: '',
			email_professional: 'JordanP@utoronto.edu',
			linkedin: 'JordanP1980',
			facebook: 'JordanP',
			hashed_pw: bcrypt.hashSync('jordan', 10),
			phone: '512-777-6677'
		},
		{
			first: 'Barack',
			last: 'Obama',
			email: 'barackobama@yahoo.com',
			location: 'austin',
			interests: 'politics',
			profession: 'Public Speaker',
			hashed_pw: '',
			email_professional: 'potus@whitehouse.gov',
			linkedin: 'BarackO000',
			facebook: 'Barack0bama',
			hashed_pw: bcrypt.hashSync('barack', 10),
			phone: '469-398-1036'
		},
		{
			first: 'Henry',
			last: 'Lee',
			email: 'henrylee@gmail.com',
			location: 'austin',
			interests: 'dogs',
			profession: 'Web Developer',
			hashed_pw: '',
			email_professional: 'yakko@nationslending.com',
			linkedin: 'HenryLee17',
			facebook: 'Henry.Lee17',
			hashed_pw: bcrypt.hashSync('henry', 10),
			phone: '512-835-9485'
		},
		{
			first: 'Maggie',
			last: 'Sin',
			email: 'maggiesin@chinasbank.com',
			location: 'Los Angeles',
			interests: 'Bottle service',
			profession: 'Business Analyst',
			hashed_pw: '',
			email_professional: 'maggiesin@gmail.com',
			linkedin: 'maggieSin13',
			facebook: 'maggie.sin1993',
			hashed_pw: bcrypt.hashSync('maggie', 10),
			phone: '512-777-6677'
		},
		{
			first: 'David',
			last: 'Chen',
			email: 'davidchen@gmail.com',
			location: 'Los Angeles',
			interests: 'physics',
			profession: 'Accountant',
			hashed_pw: '',
			email_professional: 'dchen@ey.com',
			linkedin: 'dchen91',
			facebook: 'david.chen91',
			hashed_pw: bcrypt.hashSync('david', 10),
			phone: '832-364-5522'
		},
		{
			first: 'Miguel',
			last: 'Vasquez',
			email: 'miguelvazquez@gmail.com',
			location: 'Los Angeles',
			interests: 'memes',
			profession: 'Restaurants',
			hashed_pw: '',
			email_professional: 'miguelvazquez@yahoo.com',
			linkedin: 'miguelv92',
			facebook: 'none',
			hashed_pw: bcrypt.hashSync('miguel', 10),
			phone: '210-888-3942'
		},
		{
			first: 'Daniel',
			last: 'Wang',
			email: 'daniel.wang@gmail.com',
			location: 'Austin',
			interests: 'Business',
			profession: 'Affiliate Marketing',
			hashed_pw: '',
			email_professional: 'danie.wang.consulting@uprisermarketing.com',
			linkedin: 'daniel.wang.050493',
			facebook: 'daniel.wang93',
			hashed_pw: bcrypt.hashSync('daniel', 10),
			phone: '469-562-9938'
		}
	]);
};
