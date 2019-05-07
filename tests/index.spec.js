const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect
const app = require('../app');

const Location = require('../models/location');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Location", () => {
	let location;
	let childLocation;
	// Create a parent location
	beforeEach((done) => {
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

	// Create a child location under the parent above
	beforeEach((done) => {
		chai.request(app)
			.post('/Nigeria')
			.send({
				name: 'Abidjan',
				male: 23,
				female: 20
			})
			.end((err, res) => {
				if (err) throw err;
				childLocation = res.body.location;
				done();
			});
	});

	// Create a second nested location
	// to test whether stats are added once a nested location is added 😄
	beforeEach((done) => {
		chai.request(app)
			.post('/Nigeria')
			.send({
				name: 'Port Louis',
				male: 50,
				female: 50
			})
			.end((err, res) => {
				if (err) throw err;
				childLocation = res.body.location;
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
					totalResidents: 143,
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

	it('should create location under another location', (done) => {
		chai.request(app)
			.post('/Nigeria')
			.send({
				name: 'Lagos',
				male: 1000,
				female: 10000
			})
			.end((err, res) => {
				if (err) throw err;
				res.should.have.status(201);
				res.body.should.be.a('object');
				expect(res.body).to.deep.include({
					message: 'Location Lagos created under Nigeria successfuly'
				});
				expect(res.body).to.have.property('location').to.deep.include({
					name: 'Lagos',
					male: 1000,
					female: 10000
				});
				done();
			});
	});

	afterEach(() => {
		Location.deleteMany().exec();
	});
});