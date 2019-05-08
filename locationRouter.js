const express = require('express');
const router = express.Router({
	mergeParams: true
});

const {
	fetchLocations,
	createNewLocation,
	fetchNestedLocation,
	createNestedLocation,
	updateLocationDetails,
	deleteLocation,
} = require('./controller');

const {
	validateLocation
} = require('./validations');

router.get('/', fetchLocations);
router.post('/', validateLocation, createNewLocation);
router.get('/:location_name', fetchNestedLocation);
router.post('/:location_name', createNestedLocation);
router.put('/:location_name', updateLocationDetails);
router.delete('/:location_name', deleteLocation);

module.exports = router;