const moment = require('moment')
const nanoid = require('nanoid')
const Visitor = require('../models/visitor.model')
const Place = require('../models/place.model')
const PlaceType = require('../models/place.type.model')
const Slot = require('../models/slot.model')
const Booking = require('../models/booking.model')
const slotTypes = require('../enums/slot.type.enum')

const ObjectID = require('mongodb').ObjectID

const dateFormat = 'DD.MM.YYYY HH:mm'

exports.generateUserId = (req, res) => {
  let id = nanoid.nanoid()

  new Visitor({
    _id: id,
    priorityId: 0,
    favourites: []
  }).save()
    .then(() => {
      return res.status(200).send({ id })
    })
    .catch(err => {
      return res.status(500).send({ message: 'Could not save user!' })
    })
}

exports.getBookings = async (req, res) => {
  if (!req.params.visitorId) {
    return res.status(400).send({ message: 'Invalid User ID' })
  }

  let bookings = await Booking.find({ visitorId: req.params.visitorId }).populate({
    path: 'slotId',
    populate: { path: 'placeId' }
  })

  let output = bookings.map(booking => ({
    name: booking.slotId.placeId.name,
    type: slotTypes.findById(booking.slotId.typeId).name,
    startTime: moment(booking.slotId.starts).format(dateFormat),
    endTime: moment(booking.slotId.ends).format(dateFormat),
    visitors: booking.slotId.friendsNumber,
    occupiedSlots: booking.slotId.occupiedSlots,
    maxSlots: booking.slotId.maxVisitors
  }))

  return res.status(200).send({
    visits: output
  })
}

exports.getPlaces = async (req, res) => {
  let favourites = []
  if (req.params.visitorId) {
    let visitor = await Visitor.findById(req.params.visitorId)
    if (visitor) favourites = visitor.favourites
  }
  let placeTypes = new Map()
  let types = await PlaceType.find()
  types.map(place => placeTypes.set(place._id, place.name))
  let places = await Place.find()
  let output = places.map(place => ({
    id: place._id,
    name: place.name,
    type: placeTypes.get(place.placeTypeId),
    image: place.image,
    description: place.description,
    www: place.url,
    location: place.coordinates,
    isFavourite: favourites.includes(place._id)
  }))

  return res.status(200).send({
    places: output
  })
}

exports.getPlaceSlots = async (req, res) => {
  if (!req.params.placeId) {
    return res.status(404).send({ message: 'Invalid Place ID' })
  }
  if (!req.params.visitorId) {
    return res.status(404).send({ message: 'Invalid Visitor ID' })
  }

  let slots = await Slot.find({
    placeId: req.params.placeId,
    // starts: { $gte: moment().startOf('day').toDate() }
  }).sort({ starts: 1 })

  let slotIds = slots.map(slot => (slot.id))

  let bookings = await Booking.find({ slotId: { $in: slotIds } })

  let output = slots.map(slot => ({
    id: slot.id,
    type: slotTypes.findById(slot.typeId).name,
    from: moment(slot.starts).format(dateFormat),
    to: moment(slot.ends).format(dateFormat),
    occupiedSlots: slot.occupiedSlots,
    maxSlots: slot.maxVisitors,
    isPlanned: !!bookings.find(booking => booking.slotId === slot._id && booking.visitorId === req.params.visitorId)
  }))

  return res.status(200).send({
    slots: output
  })
}

exports.changeFavourite = async (req, res) => {
  if (!req.params.visitorId)
    return res.status(400).send({ message: 'Invalid User ID' })

  if (!req.params.placeId)
    return res.status(400).send({ message: 'Invalid Place ID' })

  let visitor = await Visitor.findById(req.params.visitorId)

  if (!visitor)
    return res.status(400).send({ message: 'Invalid User ID' })

  if (visitor.favourites.includes(req.params.placeId)) {
    for (let i = 0; i < visitor.favourites.length; i++) {
      if (visitor.favourites[i] === req.params.placeId) {
        visitor.favourites.splice(i, 1);
        break
      }
    }
  } else visitor.favourites.push(req.params.placeId)

  await visitor.save()

  return res.status(204).send()
}

exports.visit = async (req, res) => {
  if (!req.params.visitorId || !req.body.slotId || !req.body.visitors) {
    return res.status(404).send({ message: 'Invalid data!' })
  }

  let people = req.body.visitors

  let booking = await Booking.findOne({ slotId: req.body.slotId, visitorId: req.params.visitorId })
  if (booking) {
    if (booking.friendsNumber !== req.body.visitors) {
      people -= booking.friendsNumber
      booking.friendsNumber = req.body.visitors
      await booking.save()
    }
  } else {
    new Booking({
      _id: nanoid.nanoid(),
      slotId: req.body.slotId,
      visitorId: req.params.visitorId,
      friendsNumber: people
    }).save()
  }

  let slot = await Slot.findById(req.body.slotId)
  slot.occupiedSlots += people
  await slot.save()

  return res.status(204).send()
}

exports.deleteVisit = async (req, res) => {
  if (!req.params.visitorId || !req.params.slotId) {
    return res.status(404).send({ message: 'Invalid data!' })
  }

  let found = await Booking.findOneAndDelete({ visitorId: req.params.visitorId, slotId: req.params.slotId })

  if (found) await Slot.findByIdAndUpdate(req.params.slotId,
    { $inc: { occupiedSlots: (found.friendsNumber * (-1)) } })

  return res.status(204).send()
}