module.exports = (app) => {
  const access = require('../controllers/access.controller.js')
  const config = require('../config/config.js')
  const jwt = require('express-jwt')

  /**
   * @swagger
   *
   * /api/user:
   *  get:
   *      description: Generate a new user id and save it in the db
   *      responses:
   *          200:
   *              schema:
   *                  type: object
   *                  properties:
   *                      id:
   *                          type: string
   */
  app.get('/api/user', access.generateUserId)

  /**
   * @swagger
   * /api/user/{visitorId}/visits:
   *  get:
   *      description: Get the booked visits of the user
   *      parameters:
   *          - visitorId: visitorId
   *            name: visitorId
   *            description: user's id
   *            in: path
   *            required: true
   *            type: string
   *          - skip: skip
   *            name: skip
   *            description: how many to skip
   *            in: query
   *            required: false
   *            type: integer
   *          - load: load
   *            name: load
   *            description: how many to load
   *            in: query
   *            required: false
   *            type: integer
   *      responses:
   *          200:
   *              schema:
   *                  type: array
   *                  items:
   *                      type: object
   *                      properties:
   *                          name:
   *                              type: string
   *                          type:
   *                              type: string
   *                          starTime:
   *                              type: string
   *                          endTime:
   *                              type: string
   *                          visitors:
   *                              type: integer
   *                          occupiedSlots:
   *                              type: integer
   *                          maxSlots:
   *                              type: integer
   *                          slotId:
   *                              type: string
   *                          placeId:
   *                              type: string
   *          400:
   *              schema:
   *                  type: object
   *                  properties:
   *                    message:
   *                        type: string
   */
  app.get('/api/user/:visitorId/visits', access.getBookings)

  /**
   * @swagger
   * /api/place/{visitorId}:
   *  get:
   *      description: Get all places
   *      parameters:
   *          - visitorId: visitorId
   *            name: visitorId
   *            description: the user's id
   *            in: path
   *            required: true
   *            type: string
   *          - skip: skip
   *            name: skip
   *            description: how many to skip
   *            in: query
   *            required: false
   *            type: integer
   *          - load: load
   *            name: load
   *            description: how many to load
   *            in: query
   *            required: false
   *            type: integer
   *          - typeId: typeId
   *            name: typeId
   *            description: the id of the place type
   *            in: query
   *            required: false
   *            type: number
   *          - n: n
   *            name: name
   *            description: part of the place's name
   *            in: query
   *            required: false
   *            type: string
   *          - own: own
   *            name: own
   *            description: get only places created by user
   *            in: query
   *            required: false
   *            type: boolean
   *          - onlyFavourites: onlyFavourites
   *            name: onlyFavourites
   *            description: filter only favourites
   *            in: query
   *            required: false
   *            type: boolean
   *          - approved: approved
   *            name: approved
   *            description: returns enabled/disabled entities
   *            in: query
   *            required: false
   *            type: boolean
   *      responses:
   *          200:
   *              schema:
   *                type: object
   *                properties:
   *                  places:
   *                    type: array
   *                    items:
   *                        type: object
   *                        properties:
   *                           id:
   *                              type: string
   *                           name:
   *                              type: string
   *                           type:
   *                               type: string
   *                           image:
   *                               type: string
   *                           description:
   *                               type: string
   *                           www:
   *                               type: string
   *                           address:
   *                               type: string
   *                           location:
   *                               type: string
   *                           isFavourite:
   *                               type: boolean
   *                           approved:
   *                               type: boolean
   */
  app.get('/api/place/:visitorId', access.getPlaces)

  /**
   * @swagger
   * /api/place/{visitorId}/{placeId}:
   *  get:
   *      description: Get slots of a place
   *      parameters:
   *          - visitorId: visitorId
   *            name: visitorId
   *            description: the user's id
   *            in: path
   *            required: true
   *            type: string
   *          - placeId: placeId
   *            name: placeId
   *            description: the place's id
   *            in: path
   *            required: true
   *            type: string
   *          - skip: skip
   *            name: skip
   *            description: how many to skip
   *            in: query
   *            required: false
   *            type: integer
   *          - load: load
   *            name: load
   *            description: how many to load
   *            in: query
   *            required: false
   *            type: integer
   *      responses:
   *          200:
   *              schema:
   *                type: object
   *                properties:
   *                  places:
   *                    type: array
   *                    items:
   *                        type: object
   *                        properties:
   *                           id:
   *                              type: string
   *                           type:
   *                               type: string
   *                           from:
   *                               type: string
   *                           to:
   *                               type: string
   *                           occupiedSlots:
   *                               type: integer
   *                           maxSlots:
   *                               type: integer
   *                           isPlanned:
   *                               type: boolean
   *                           friends:
   *                               type: integer
   */
  app.get('/api/place/:visitorId/:placeId', access.getPlaceSlots)

  /**
   * @swagger
   * /api/user/{visitorId}/favourites/{placeId}:
   *  get:
   *      description: Add/remove a favourite from the user
   *      parameters:
   *          - visitorId: visitorId
   *            name: visitorId
   *            description: the user's id
   *            in: path
   *            required: true
   *            type: string
   *          - placeId: placeId
   *            name: placeId
   *            description: the place's id
   *            in: path
   *            required: true
   *            type: string
   *      responses:
   *        204:
   *          description: ok
   */
  app.get('/api/user/:visitorId/favourites/:placeId', access.changeFavourite)

  /**
   * @swagger
   * /api/user/{visitorId}/visit:
   *  post:
   *      description: Add/update a visit
   *      parameters:
   *          - visitorId: visitorId
   *            name: visitorId
   *            description: the user's id
   *            in: path
   *            required: true
   *            type: string
   *          - body: body
   *            name: body
   *            description: the body
   *            in: body
   *            required: true
   *            type: application/json
   *            schema:
   *              type: object
   *              properties:
   *                slotId:
   *                  type: string
   *                visitors:
   *                  type: integer
   *      responses:
   *        204:
   *          description: ok
   *        400:
   *          description: Slot is full | Visitors more than 7 or less than 1 | Booking overlaps with another booking
   *        404:
   *          description: Invalid data
   */
  app.post('/api/user/:visitorId/visit', access.visit)

  /**
   * @swagger
   * /api/user/{visitorId}/visit/{slotId}:
   *  delete:
   *      description: Remove a visit
   *      parameters:
   *          - visitorId: visitorId
   *            name: visitorId
   *            description: the user's id
   *            in: path
   *            required: true
   *            type: string
   *          - slotId: slotId
   *            name: slotId
   *            description: the slot's id
   *            in: path
   *            required: true
   *            type: string
   *      responses:
   *        204:
   *          description: ok
   */
  app.delete('/api/user/:visitorId/visit/:slotId', access.deleteVisit)

  /**
   * @swagger
   * /api/place-types:
   *  get:
   *    description: Get all place types
   *    responses:
   *      200:
   *        schema:
   *          type: array
   *          items:
   *            type: object
   *            properties:
   *              id:
   *                type: integer
   *              name:
   *                type: string
   */
  app.get('/api/place-types', access.getPlaceTypes)

  /**
   * @swagger
   * /api/image/{placeId}:
   *  get:
   *    description: Get a place's image
   *    parameters:
   *        - placeId: placeId
   *          name: placeId
   *          description: the place's id
   *          in: path
   *          required: true
   *          type: string
   *    responses:
   *      200:
   *        schema:
   *          type: string
   */
  app.get('/api/image/:placeId', access.getImage)

  /**
   * @swagger
   * /api/place/{userId}:
   *  post:
   *    description: create a new place
   *    parameters:
   *          - userId: userId
   *            name: userId
   *            description: the user's id
   *            in: path
   *            required: true
   *            type: string
   *          - body: body
   *            name: body
   *            description: the body
   *            in: body
   *            required: true
   *            type: application/json
   *            schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                typeId:
   *                  type: integer
   *                description:
   *                  type: string
   *                www:
   *                  type: string
   *                address:
   *                  type: string
   *                location:
   *                  type: string
   *    responses:
   *      201:
   *        description: created
   *      400:
   *        description: missing body param
   */
  app.post('/api/place/:userId', access.addPlace)

  /**
   * @swagger
   * /api/place/{userId}/{placeId}:
   *  put:
   *    description: edit a place
   *    parameters:
   *          - userId: userId
   *            name: userId
   *            description: the user's id
   *            in: path
   *            required: true
   *            type: string
   *          - placeId: placeId
   *            name: placeId
   *            description: the place's id
   *            in: path
   *            required: true
   *            type: string
   *          - body: body
   *            name: body
   *            description: the body
   *            in: body
   *            required: true
   *            type: application/json
   *            schema:
   *              type: object
   *              properties:
   *                name:
   *                  type: string
   *                typeId:
   *                  type: integer
   *                description:
   *                  type: string
   *                www:
   *                  type: string
   *                address:
   *                  type: string
   *                location:
   *                  type: string
   *    responses:
   *      201:
   *        description: created
   *      400:
   *        description: missing body param
   */
  app.put('/api/place/:userId/:placeId', access.editPlace)

  /**
   * @swagger
   * /api/coordinates:
   *  post:
   *    description: get the coordinates of a location
   *    parameters:
   *          - body: body
   *            name: body
   *            description: the body
   *            in: body
   *            required: true
   *            type: application/json
   *            schema:
   *              type: object
   *              properties:
   *                address:
   *                  type: string
   *                userId:
   *                  type: userId
   *    responses:
   *      200:
   *        description: Returned location
   *        schema:
   *          type: object
   *          properties:
   *            location:
   *              type: string
   *      400:
   *        description: missing address parameter
   *      404:
   *        description: location not found
   *      500:
   *        description: No connection to server
   */
  app.post('/api/coordinates', access.getCoordinates)

  /**
   * @swagger
   * /api/slot/{placeId}/{userId}:
   *  post:
   *    description: create a new slot
   *    parameters:
   *          - placeId: placeId
   *            name: placeId
   *            description: the place's id
   *            in: path
   *            required: true
   *            type: string
   *          - userId: userId
   *            name: userId
   *            description: the user's id
   *            in: path
   *            required: true
   *            type: string
   *          - body: body
   *            name: body
   *            description: the body
   *            in: body
   *            required: true
   *            type: application/json
   *            schema:
   *              type: object
   *              properties:
   *                type:
   *                  type: string
   *                from:
   *                  type: string
   *                to:
   *                  type: string
   *                maxSlots:
   *                  type: integer
   *                repeat:
   *                  type: boolean
   *    responses:
   *      201:
   *        description: created
   *      400:
   *        description: missing body param
   */
  app.post('/api/slot/:placeId/:userId', access.addSlot)

  /**
   * @swagger
   * /api/slot/{slotId}/{userId}:
   *  delete:
   *    description: delete slot
   *    parameters:
   *          - placeId: slotId
   *            name: slotId
   *            description: the slot's id
   *            in: path
   *            required: true
   *            type: string
   *          - userId: userId
   *            name: userId
   *            description: the user's id
   *            in: path
   *            required: true
   *            type: string
   *    responses:
   *      201:
   *        description: created
   *      400:
   *        description: missing param
   */
  app.delete('/api/slot/:slotId/:userId', access.deleteSlot)

  /**
   * @swagger
   * /api/place/{placeId}/approve/{approvedStatus}:
   *  get:
   *    description: approve the place
   *    parameters:
   *          - visitorId: placeId
   *            name: placeId
   *            description: the place's id
   *            in: path
   *            required: true
   *            type: string
   *          - approvedStatus: approvedStatus
   *            name: approvedStatus
   *            description: is approved or not
   *            in: path
   *            required: true
   *            type: boolean
   *    responses:
   *      201:
   *        description: changed approved status
   */
  app.get('/api/place/:placeId/approve/:approvedStatus',
    jwt({
      secret: config.adminToken,
      getToken: getSecondToken,
      algorithms: ['HS256']
    }), access.approve)

  /**
   * @swagger
   * /api/place/{placeId}:
   *  delete:
   *    description: delete a place
   *    parameters:
   *          - visitorId: placeId
   *            name: placeId
   *            description: the place's id
   *            in: path
   *            required: true
   *            type: string
   *    responses:
   *      204:
   *        description: deleted
   */
  app.delete('/api/place/:placeId',
    jwt({
      secret: config.adminToken,
      getToken: getSecondToken,
      algorithms: ['HS256']
    }), access.deletePlace)

  /**
   * @swagger
   * /api/user/is-authorised:
   *  get:
   *    description: check if authorised
   *    responses:
   *      201:
   *        description: authorised
   */
  app.get('/api/user/is-authorised',
    jwt({
      secret: config.adminToken,
      getToken: getSecondToken,
      algorithms: ['HS256']
    }), access.isAuthorised)
}

function getSecondToken (req) {
  if (req.headers.authorization) {
    let header = req.headers.authorization.split(' ')
    if (header[0] === 'Bearer' && header.length === 3) return header[2]
  }
  return null
}