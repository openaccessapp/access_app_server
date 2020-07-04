require('dotenv').config()

module.exports = {
    url: 'mongodb://localhost:27017/access-app',
    accessToken: process.env.ACCESS_TOKEN,
    placesToken: process.env.PLACES_TOKEN,
    adminToken: process.env.ADMIN_TOKEN,
    port: process.env.PORT || 8080
}