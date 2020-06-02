const mongoose = require('mongoose')

const placeSchema = mongoose.Schema({
  _id: String,
  name: String,
  placeTypeId: { type: Number, ref: 'PlaceType' },
  image: String,
  description: String,
  url: String,
  address: String,
  coordinates: String
})

module.exports = mongoose.model('Place', placeSchema)