module.exports = (app) => {
  const access = require('../controllers/access.controller.js')

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
   *                           location:
   *                               type: string
   *                           isFavourite:
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
   *          description: Slot is full | Visitors more than 7 or less than 1
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
   * todo document userId when added
   * @swagger
   * /api/place:
   *  post:
   *    description: create a new place
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
   *                name:
   *                  type: string
   *                placeTypeId:
   *                  type: integer
   *                imageBase64:
   *                  type: string
   *                description:
   *                  type: string
   *                url:
   *                  type: string
   *                address:
   *                  type: string
   *                coordinates:
   *                  type: string
   *    responses:
   *      201:
   *        description: created
   *      400:
   *        description: missing body param
   */
  app.post('/api/place', access.addPlace)

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
   * /api/slot/{placeId}:
   *  post:
   *    description: create a new slot
   *    parameters:
   *          - visitorId: placeId
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
   *                type:
   *                  type: string
   *                date:
   *                  type: string
   *                startTime:
   *                  type: string
   *                endTime:
   *                  type: string
   *                max:
   *                  type: integer
   *                repeat:
   *                  type: boolean
   *    responses:
   *      201:
   *        description: created
   *      400:
   *        description: missing body param
   */
  app.post('/api/slot/:placeId', access.addSlot)
}