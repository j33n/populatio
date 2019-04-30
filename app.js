const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.status(200).json('Welcome to populatio 😄'));

app.post('/')

app.listen(port, () => console.log(`App running on port ${port}!`))
