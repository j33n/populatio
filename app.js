const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const {
	fetchLocations,
	createNewLocation,
	fetchNestedLocation,
	createNestedLocation,
	updateLocationDetails,
	deleteLocation,
} = require('./controller')

app.get('/', fetchLocations);
app.post('/', createNewLocation);
app.get('/:location-name', fetchNestedLocation);
app.post('/:location-name', createNestedLocation);
app.put('/:location-name', updateLocationDetails);
app.delete('/:location-name', deleteLocation);

app.listen(port, () => console.log(`App running on port ${port}!`))
