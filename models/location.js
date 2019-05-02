const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const infantLocationSchema = new Schema({
	locationName: {
		type: String,
		max: 100
	}
});

const LocationSchema = new Schema({
	name: {
		type: String,
		required: true,
		max: 100
	},
	male: {
		type: Number,
		required: true,
		max: 100,
	},
	female: {
		type: Number,
		required: true,
		max: 100,
	},
	infantLocations: [infantLocationSchema],
});

// Export Location model.
module.exports = mongoose.model('Location', LocationSchema);