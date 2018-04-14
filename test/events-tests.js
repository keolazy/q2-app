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

describe('This is a sample test', () => {
	it('And it should pass', () => {
		expect(true).to.equal(true);
	});
});

describe(`'/events' root`, () => {
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
						expect(response.body[0]).to.equal(events[0]);
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
