const { check, validationResult } = require('express-validator/check');

exports.validateLocation = [
	check('name').isLength({ min: 2 }),
	check('male').isNumeric(),
	check('female').isNumeric(),
];
