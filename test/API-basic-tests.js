const chai = require('chai');
const expect = chai.expect;
const app = require('../app.js');
const request = require('supertest')(app);
const knex = require('../db/knex.js');

app.set('env', 'test');
app.listen(8000);

let users = knex('users').select('*');
let events = knex('events').select('*');
let connections = knex('connections').select('*');
let users_events = knex('users_events').select('*');

// describe('This is a sample test', () => {
// 	it('And it should pass', () => {
// 		expect(true).to.equal(true);
// 	});
// });

describe(`/events`, () => {
	it(`Returned events should include ALL events`, done => {
		request
			.get('/events')
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				events
					.then(events => {
						expect(response.body.length).to.equal(events.length);
						done();
					})
					.catch(err => {
						done(err);
					});
			})
			.catch(err => {
				done(err);
			});
	});
	it(`First event returned should be first event from DB`, done => {
		request
			.get('/events')
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				events
					.then(events => {
						expect(response.body[0].description).to.equal(events[0].description);
						done();
					})
					.catch(err => {
						done(err);
					});
			})
			.catch(err => {
				done(err);
			});
	});
	it(`Last event returned should be last event from DB`, done => {
		request
			.get('/events')
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				events
					.then(events => {
						let lastIndex = events.length - 1;
						expect(response.body[lastIndex].description).to.equal(events[lastIndex].description);
						done();
					})
					.catch(err => {
						done(err);
					});
			})
			.catch(err => {
				done(err);
			});
	});
});

describe(`/connections`, () => {
	it(`Returned connections should include ALL connections`, done => {
		request
			.get('/connections')
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				connections
					.then(connections => {
						expect(response.body.length).to.equal(connections.length);
						done();
					})
					.catch(err => {
						done(err);
					});
			})
			.catch(err => {
				done(err);
			});
	});
	it(`First connection returned should be first connection from DB`, done => {
		request
			.get('/connections')
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				connections
					.then(connections => {
						expect(response.body[0]).to.equal(connections[0]);
						done();
					})
					.catch(err => {
						done(err);
					});
			})
			.catch(err => {
				done(err);
			});
	});
	it(`Last connection returned should be last connection from DB`, done => {
		request
			.get('/connections')
			.expect('Content-Type', /json/)
			.expect(200)
			.then(response => {
				connections
					.then(connections => {
						let lastIndex = connections.length - 1;
						expect(response.body[lastIndex]).to.equal(connections[lastIndex]);
						done();
					})
					.catch(err => {
						done(err);
					});
			})
			.catch(err => {
				done(err);
			});
	});
});
