exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex(`users_events`)
		.del()
		.then(function() {
			// Inserts seed entries
			return knex(`users_events`).insert([
				{
					user_id: 8,
					event_id: 2,
					questions: `Has anybody played with TensorFlow?`,
					topics: `Physics, machine learning, really nerdy stuff like Quidditch`,
					noise_level: `Quiet or loud is fine`,
					where_to_find: `Probably 3rd floor shmoozing in the kitchen`,
					ask_me: `Really interested in side projects in ML, let me know if you have any ideas or proposals in mind.`,
					personality: `Friendly! Kind of awkward.`
				},
				{
					user_id: 1,
					event_id: 4,
					job_status: `Code school student, interested in startups and mid-size companies`,
					questions: `What kind of candidates do you see coming out of code schools? What are you looking for?`,
					where_to_find: `Roaming, shmoozing, etc`
				},
				{
					user_id: 3,
					event_id: 2,
					questions: `Really curious to know more about ML. Seems pretty relevant to current events in my sector.`,
					topics: `Kite surfing, general effortless eloquence with a few stutters, and ... cats?`,
					job_status: `Semi-retired`,
					noise_level: `Pretty comfortable with it all`,
					where_to_find: `Working the room`,
					ask_me: `.. How many times Joe B. and I have exchanged dank memes`,
					personality: `ex-Presidential`
				},
				{
					user_id: 2,
					event_id: 1,
					questions: `What does everyone want to DO with their lives?`,
					topics: `Political movements, psychotherapy, Jungian symbology`,
					job_status: `Tenured`,
					noise_level: `Quiet to moderate`,
					where_to_find: `In a quiet corner somewhere`,
					ask_me: `I don't really know about Python per se, but I can tell you all about the archetypal symbolism of *pythons* and other serpentine creatures`,
					personality: `Medium-Canadian basically (eh?)`
				},
				{
					user_id: 5,
					event_id: 3,
					questions: `What are the best and worst questions to ask in an interview?`,
					topics: `Prepping for a small career change -- otherwise, all kinds of stuff! Sports, music, rescue animals, etc.`,
					job_status: `Soon to be seeking`,
					where_to_find: `Cruising around`,
					personality: `Bubbly, outgoing, ask me anything`
				},
				{
					user_id: 1,
					event_id: 1,
					questions: `Best ways to break into Python from a background in JavaScript?`,
					topics: `Social media marketing, freelancing and entrepreneurship, ... back surgeries ... `,
					job_status: `Soon to be seeking`,
					noise_level: `All kinds`,
					where_to_find: `2nd floor probably near the snacks and beer`,
					ask_me: `About my freelancing background and my most wacky past clients`,
					personality: `Fast talker, likes new people`
				}
			]);
		});
};
