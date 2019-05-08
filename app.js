const express = require('express')
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const app = express()
const port = process.env.PORT || 3000
require('dotenv').config();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const swaggerDocument = YAML.load('./swagger.yaml');

const locationRouter = require('./locationRouter');

// Connect to DB
// Import the mongoose module
const mongoose = require('mongoose');

// Mongoose connection
let mongoDB = process.env.MONGODB_URI;
if (process.env.NODE_ENV === "test") mongoDB = process.env.MONGODB_URI + '_test';

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

// Documentation routing
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// All routes live here
app.use('/', locationRouter);

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

if (!module.parent) {
	app.listen(port, () => console.log(`App running on port ${port}!`))
}

module.exports = app
