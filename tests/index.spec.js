const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect
const app = require('../app');

const Location = require('../models/location');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Location", () => {
	beforeEach((done) => {
		// Create our Adam user 😆
		chai.request(app)
			.post('/')
			.send({
				name: 'Nigeria',
				male: 1000,
				female: 10000
			})
			.end((err, res) => {
				if (err) throw err;
				location = res.body.location;
				done();
			});
	});

	it('should create a location', (done) => {
		chai.request(app)
			.post('/')
			.send({
				name: 'Kenya',
				male: 1000,
				female: 10000
			})
			.end((err, res) => {
				if (err) throw err;
				res.should.have.status(201);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					message: 'Location created successfuly'
				});
				done();
			});
	});

	it('should update a location', (done) => {
		chai.request(app)
			.put('/Nigeria')
			.send({
				name: 'Kenya',
				male: 1000,
				female: 10000
			})
			.end((err, res) => {
				if (err) throw err;
				res.should.have.status(200);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					message: 'Location updated successfuly'
				});
				expect(res.body).to.have.property('location').to.deep.include({
					name: 'Kenya',
					male: 1000,
					female: 10000,
					totalResidents: 11000,
				});
				done();
			});
	});

	it('should alert when trying to update unexisting location', (done) => {
		chai.request(app)
			.put('/x-location')
			.send({
				name: 'Kenya',
				male: 1000,
				female: 10000
			})
			.end((err, res) => {
				if (err) throw err;
				res.should.have.status(422);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					error: 'Location X-location not found in our records'
				});
				done();
			});
	});

	it('should not create location under an unexisting location', (done) => {
		chai.request(app)
			.post('/x-location')
			.send({
				name: 'Kenya',
				male: 1000,
				female: 10000
			})
			.end((err, res) => {
				if (err) throw err;
				res.should.have.status(422);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					message: 'Location X-location not found'
				});
				done();
			});
	});

	afterEach(() => {
		Location.deleteMany().exec();
	});
});