const {
	validationResult
} = require('express-validator/check');

const Location = require('./models/location');

// GET          Fetch all locations
// GET          Fetch by genre
exports.fetchLocations = (req, res) => {
	res.status(200).json({
		message: 'Locations retrieved successfuly'
	})
}

// POST         Create a new location
exports.createNewLocation = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}
	console.log('req.body :', req.body);
	Location.create({
		name: req.body.name,
		male: req.body.male,
		female: req.body.female,
	})
	.then(location => {
		// TODO: Check location should be nested and nest it in parent location
		return res.status(201).json({
			location,
			message: 'Location created successfuly'
		})
	})
	.catch((err) => res.status(400).json({
		errors: {
			plain: 'Unable to save message',
			detailed: err.message,
		}
	}));
}

// GET          Fetch single location data
// GET          Fetch location data by genre
exports.fetchNestedLocation = (req, res) => {
	res.status(200).json({
		message: 'Locations retrieved successfuly'
	})
}

// POST         Create location under location
exports.createNestedLocation = (req, res) => {
	res.status(201).json({
		message: 'Location created successfuly'
	})
}

// PUT          Update location details
exports.updateLocationDetails = (req, res) => {
	res.status(200).json({
		message: 'Location updated successfuly'
	})
}

// DELETE       Delete location and it's details
exports.deleteLocation = (req, res) => {
	res.status(200).json({
		message: 'Location deleted successfuly'
	})
}