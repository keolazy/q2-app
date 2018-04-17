exports.seed = function(knex, Promise) {
	return knex('events').insert([
		{
			name: 'A Night of Python Coding',
			description:
				'Galvanize will be hosting Python coders on the third Tuesday every month. Bring your laptops and join the coding.',
			location: 'Galvanize Campus',
			date: '2018-10-25',
			start_time: '18:30',
			end_time: '21:00',
			host_id: '4'
		},
		{
			name: 'Machine Learning and AI Q&A Session',
			description: `Know ML or Math? Want to give back? We need more mentors/teachers. :)
Before attending, please read this entire website >> http://CppMSG.com << especially the meeting protocols and rules page since we are unique/unusual. ;)`,
			location: 'ATX Hackerspace Co-op',
			date: '2018-7-13',
			start_time: '19:30',
			end_time: '21:30',
			host_id: '2'
		},
		{
			name: 'Applications, Interviews, and Everything In-Between: A Career Bootcamp',
			description: `We’ll spend the day approaching the job search from a practical and bite-sized perspective.`,
			location: 'General Assembly Austin',
			date: '2018-4-17',
			start_time: '18:00',
			end_time: '21:00',
			host_id: '1'
		},
		{
			name: 'Austin Digital Jobs Mixer',
			description: `This is the highly anticipated Austin Digital Jobs Group analog event, bringing the city's most desirable employers and qualified candidates together over a beer. `,
			location: 'Rattle Inn',
			date: '2018-6-1',
			start_time: '18:45',
			end_time: '22:00',
			host_id: '5'
		}
	]);
};
