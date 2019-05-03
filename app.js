const express = require('express')
const logger = require('morgan');

const app = express()
const port = process.env.PORT || 3000
require('dotenv').config();

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

// Connect to DB
// Import the mongoose module
const mongoose = require('mongoose');

// Mongoose connection
const mongoDB = process.env.DB_NAME;

mongoose.connect(mongoDB, {
	useNewUrlParser: true,
});

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
	console.log(`Database connected at ${mongoDB}!!`)
});

app.get('/', fetchLocations);
app.post('/', validateLocation, createNewLocation);
app.get('/:location_name', fetchNestedLocation);
app.post('/:location_name', createNestedLocation);
app.put('/:location_name', updateLocationDetails);
app.delete('/:location_name', deleteLocation);


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