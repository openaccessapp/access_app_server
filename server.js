const express = require('express')
const bodyParser = require('body-parser')

const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const Place = require('./app/models/place.model')

const migration = require('./app/migrations/dummy.migration')

// create express app
const app = express()

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json({ limit: '10mb' }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
const config = require('./app/config/config.js')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
const jwt = require('express-jwt')
const { UnauthorizedError } = require('express-jwt')

app.use(
  jwt({
    secret: config.accessToken,
    getToken: getUserToken,
    algorithms: ['HS256']
  })
    .unless({path: [/^\/doc(.*)$/, /^\/api\/image\/(.*)$/]}))

function getUserToken (req) {
  if (req.headers.authorization) {
    let header = req.headers.authorization.split(' ')
    if (header[0] === 'Bearer' && header.length > 1) return header[1]
  }
  return null
}

// Connecting to the database
mongoose.connect(config.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log('Successfully connected to the database')
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...', err)
  process.exit()
})

migration.fillDatabase()

app.get('/', (req, res) => {
  res.redirect('/doc')
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
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

Place.updateMany({ approved: { $exists: false } }, { approved: true }, function () {})


app.use(function errorHandler(err, req, res, next) {
  if (err instanceof UnauthorizedError) return res.status(401).send({message: 'Unauthorised'})
  next();
});


// listen  for requests
app.listen(config.port, () => {
  console.log(`Server is listening on port ${config.port}`)
})
