exports.seed = function(knex, Promise) {
	return knex('events').insert([
		{
			name: 'Christmas Fiasco',
			description: 'See Lupe Fiasco perfom on christmas',
			location: 'Auditorium Shores',
			date: '2018-12-25',
			start_time: '15',
			end_time: '23',
			host_id: '4'
		},
		{
			name: 'Blood Feast',
			description: 'see live cannibals perfom in July',
			location: 'Barton Springs',
			date: '2018-7-13',
			start_time: '10',
			end_time: '19',
			host_id: '2'
		},
		{
			name: "Eeyore's Birthday Party",
			description: 'pointless celebration',
			location: 'Peace District Park',
			date: '2018-4-17',
			start_time: '7',
			end_time: '23',
			host_id: '1'
		},
		{
			name: 'Borat Impression Contest',
			description: 'Celebrate Graduation',
			location: 'PowerPlant',
			date: '2018-6-1',
			start_time: '20',
			end_time: '3',
			host_id: '5'
		}
	]);
};
