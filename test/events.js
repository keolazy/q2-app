const chai = require('chai');
const expect = chai.expect;
const app = require('../app.js');
const request = require('supertest')(app);

describe('This is a sample test', () => {
	it('And it should pass', () => {
		expect(true).to.equal(true);
	});
});
