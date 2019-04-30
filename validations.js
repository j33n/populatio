const { check, validationResult } = require('express-validator/check');

exports.validateLocation = [
	check('name', 'Location name should be at least 2 characters').trim().isLength({ min: 2 }),
	check('male', 'Please enter a valid number of male people').isNumeric(),
	check('female', 'Please enter a valid number of male people').isNumeric(),
];
