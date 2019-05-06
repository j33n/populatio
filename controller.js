const {
	validationResult
} = require('express-validator/check');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Location = require('./models/location');

const formatLocation = (name) => name.charAt(0).toUpperCase() + name.slice(1);

// GET          Fetch all locations
exports.fetchLocations = (req, res) => {
	Location.find({}).then((locations) => {
		if (locations.length > 0) {
			return res.status(200).json({
				locations,
				message: 'Locations retrieved successfuly'
			})
		}
		return res.status(200).json({
			locations,
			message: 'No locations recorded yet'
		})
	}).catch((error) => {
		return res.status(400).json({
			errors: {
				plain: 'Invalid request',
				detailed: error.message
			},
		});
	});
}

// POST         Create a new location
exports.createNewLocation = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}
	const locationName = formatLocation(req.body.name);
	Location.find({
			name: locationName
		}).then((location) => {
			if (location.length > 0) {
				return res.status(422).json({
					error: 'Location already recorded',
				});
			}
			Location.create({
					name: locationName,
					male: req.body.male,
					female: req.body.female,
					total: req.body.male + req.body.female,
				})
				.then(createdLocation => {
					return res.status(201).json({
						createdLocation,
						message: 'Location created successfuly'
					})
				})
				.catch((error) => res.status(400).json({
					errors: {
						plain: 'Unable to save message',
						detailed: error.message,
					}
				}));
		})
		.catch((error) => {
			return res.status(400).json({
				errors: {
					plain: 'Unable to save message',
					detailed: error.message
				},
			});
		});
}

// GET          Fetch single location data
exports.fetchNestedLocation = (req, res) => {
	const formattedLocation = formatLocation(req.params.location_name);
	Location.findOne({
			name: formattedLocation
		}).then((locations) => {
			const childLocations = [];
			if (locations) {
				locations.infantLocations.forEach((location) => {
					childLocations.push(Location.findOne({
						name: location.locationName
					}))
				});
				return Promise.all(childLocations);
			}
			return res.status(422).json({
				error: `Location ${formattedLocation} not found!`,
			})
		}).then((allNestedLocation) => {
			return res.status(200).json({
				locations: allNestedLocation,
				message: 'Locations retrieved successfuly'
			})
		})
		.catch((error) => {
			return res.status(400).json({
				errors: {
					plain: 'Invalid request',
					detailed: error.message
				},
			});
		});
}

// POST         Create location under location
exports.createNestedLocation = (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}
	const {
		name,
		male,
		female
	} = req.body;
	const locationName = formatLocation(name);
	const parentLocation = formatLocation(req.params.location_name);

	Location.findOne({
			name: parentLocation
		}).then((parentLoc) => {
			if (!parentLoc) {
				return res.status(422).json({
					message: `Location ${parentLocation} not found`,
				})
			}
			Location.find({
					name: locationName
				}).then((location) => {
					if (location.length > 0) {
						return res.status(422).json({
							error: `Location ${locationName} already recorded`,
						});
					}
					Location.create({
							name: locationName,
							male: male,
							female: female,
							total: male + female,
						})
						.then(locationCreated => {
							parentLoc.infantLocations.push({
								locationName
							})
							const subdoc = parentLoc.infantLocations[0];
							subdoc.isNew;
							parentLoc.save((error) => {
								if (error) {
									return res.status(422).json({
										errors: {
											plain: `Unable to save location ${locationName}`,
											detailed: error.message,
										}
									})
								}
								return res.status(201).json({
									locationCreated,
									message: `Location ${locationName} created under ${parentLocation} successfuly`,
								})
							});
						})
						.catch((error) => res.status(400).json({
							errors: {
								plain: 'Unable to save location',
								detailed: error.message,
							}
						}));
				})
				.catch((error) => {
					return res.status(400).json({
						errors: {
							plain: 'Unable to save location',
							detailed: error.message
						},
					});
				});

		})
		.catch((error) => {
			return res.status(400).json({
				errors: {
					plain: 'Invalid request',
					detailed: error.message
				},
			});
		});
}

// PUT          Update location details
exports.updateLocationDetails = (req, res) => {
	const formattedLocation = formatLocation(req.params.location_name);
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array()
		});
	}
	const locationName = formatLocation(req.body.name);
	Location.updateOne({
			name: formattedLocation
		}, {
			$set: {
				name: locationName,
				male: req.body.male,
				female: req.body.female,
			}
		}).then((location) => {
			if (location.nModified === 0) {
				return res.status(422).json({
					error: `Unable to update location ${formattedLocation}`,
				});
			}
			Location.findOne({
					name: locationName
				}).then((updatedLocation) => {
					return res.status(200).json({
						location: updatedLocation,
						message: 'Location updated successfuly'
					})
				})
				.catch((error) => {
					return res.status(400).json({
						errors: {
							plain: 'Invalid request',
							detailed: error.message
						},
					});
				});
		})
		.catch((error) => {
			return res.status(400).json({
				errors: {
					plain: 'Invalid request',
					detailed: error.message
				},
			});
		});
}

// DELETE       Delete location and it's details
exports.deleteLocation = (req, res) => {
	const formattedLocation = formatLocation(req.params.location_name);
	Location.deleteOne({
			name: formattedLocation
		}).then((location) => {
			if (location.deletedCount === 0) {
				return res.status(422).json({
					error: `Unable to delete location ${formattedLocation}`,
				});
			}
			// Delete where the location was nested
			Location.find({}).then((locations) => {
				locations.forEach((locationWithNested) => {
					const childrenLength = locationWithNested.infantLocations.length
					if (childrenLength > 0) {
						locationWithNested.infantLocations.find((nestedLocation, index) => {
							if (nestedLocation.locationName === formattedLocation) {
								locationWithNested.infantLocations.splice(index, 1);
								locationWithNested.save((error) => {
									if (error) {
										return res.status(422).json({
											errors: {
												plain: 'Unable to delete location',
												detailed: error.message,
											}
										})
									}
									return res.status(200).json({
										message: `Location ${formattedLocation} deleted successfuly`,
									})
								});
							}
						})
					}
				});
			})
		})
		.catch((error) => {
			return res.status(400).json({
				errors: {
					plain: 'Invalid request',
					detailed: error.message
				},
			});
		});
}