const express = require('express')
const bodyParser = require('body-parser')

const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

const migration = require('./app/migrations/dummy.migration')

require('dotenv').config()

// create express app
const app = express()

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./app/config/database.config.js')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

// Connecting to the database
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log('Successfully connected to the database')
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err)
  process.exit()
})

migration.fillDatabase();

app.get('/', (req, res) => {
  res.json({ 'message': 'Welcome to Access App. CHANGEEE.' })
})

require('./app/routes/access.routes.js')(app)

//initialise swagger
const options = {
  definition: {
    swagger: '2.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Access Swagger', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  // Path to the API docs
  apis: ['./app/routes/**.*'],
}
const swaggerSpec = swaggerJSDoc(options)
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// listen for requests
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})
