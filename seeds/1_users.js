exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex('users')
		.del()
		.then(function() {
			// Inserts seed entries
			return knex('users').insert([
				{
					email: 'nathanK@gmail.com',
					location: 'austin',
					interests: 'Paintball',
					profession: 'Web Development/Marketing',
					hashed_pw: '',
					email_professional: 'nathanK@dropbox.com',
					linkedin: 'NathanK777',
					facebook: 'none',
					phone: '512-364-6188'
				},
				{
					email: 'JordanPeterson@gmail.com',
					location: 'austin',
					interests: 'philosophy',
					profession: 'Clinical Psychologist',
					hashed_pw: '',
					email_professional: 'JordanP@utoronto.edu',
					linkedin: 'JordanP1980',
					facebook: 'JordanP',
					phone: '512-777-6677'
				},
				{
					email: 'BarackObama@yahoo.com',
					location: 'austin',
					interests: 'politics',
					profession: 'Public Speaker',
					hashed_pw: '',
					email_professional: 'potus@whitehouse.gov',
					linkedin: 'BarackO000',
					facebook: 'Barack0bama',
					phone: '469-398-1036'
				},
				{
					email: 'HenryLee@gmail.com',
					location: 'austin',
					interests: 'dogs',
					profession: 'Web Developer',
					hashed_pw: '',
					email_professional: 'yakko@nationslending.com',
					linkedin: 'HenryLee17',
					facebook: 'Henry.Lee17',
					phone: '512-835-9485'
				},
				{
					email: 'maggiesin@chinasbank.com',
					location: 'Los Angeles',
					interests: 'Bottle service',
					profession: 'Business Analyst',
					hashed_pw: '',
					email_professional: 'maggiesin@gmail.com',
					linkedin: 'maggieSin13',
					facebook: 'maggie.sin1993',
					phone: '512-777-6677'
				},
				{
					email: 'davidchen@gmail.com',
					location: 'Los Angeles',
					interests: 'physics',
					profession: 'Accountant',
					hashed_pw: '',
					email_professional: 'dchen@ey.com',
					linkedin: 'dchen91',
					facebook: 'david.chen91',
					phone: '832-364-5522'
				},
				{
					email: 'miguelvazquez@gmail.com',
					location: 'Los Angeles',
					interests: 'memes',
					profession: 'Restaurants',
					hashed_pw: '',
					email_professional: 'miguelvazquez@yahoo.com',
					linkedin: 'miguelv92',
					facebook: 'none',
					phone: '210-888-3942'
				},
				{
					email: 'daniel.wang@gmail.com',
					location: 'Austin',
					interests: 'Business',
					profession: 'Affiliate Marketing',
					hashed_pw: '',
					email_professional: 'danie.wang.consulting@uprisermarketing.com',
					linkedin: 'daniel.wang.050493',
					facebook: 'daniel.wang93',
					phone: '469-562-9938'
				}
			]);
		});
};
