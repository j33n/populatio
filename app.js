const express = require('express')
const logger = require('morgan');

const app = express()
const port = process.env.PORT || 3000

app.use(logger('dev'));
app.use(express.json());

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

app.get('/', fetchLocations);
app.post('/', validateLocation, createNewLocation);
app.get('/:location-name', fetchNestedLocation);
app.post('/:location-name', createNestedLocation);
app.put('/:location-name', updateLocationDetails);
app.delete('/:location-name', deleteLocation);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// respond when we have error page
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
});

app.listen(port, () => console.log(`App running on port ${port}!`))