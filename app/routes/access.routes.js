module.exports = (app) => {
    const access = require('../controllers/access.controller.js');

    app.post('/access', access.create);
    app.get('/access', access.findAll);
    app.get('/access/:placeId', access.findOne);
    app.put('/access/:placeId', access.update);
    app.delete('/access/:placeId', access.delete);

    /**
     * @swagger
     *
     * /api/user:
     *  get:
     *      description: Generate a new user id and save it in the db
     *      responses:
     *          200: {id: "user's id"}
     */
    app.get('/api/user', access.generateUserId);

    /**
     * @swagger
     * /api/user/:visitorId/visits:
     *  get:
     *      description: Get the booked visits of the user
     *      parameters:
     *          - visitorId: visitorId
     *            name: visitorId
     *            description: user's id
     *            in: query
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
    app.get('/api/user/:visitorId/visits', access.getBookings);

    /**
     * @swagger
     * /api/place:
     *  get:
     *
     */
    app.get('/api/place', access.getPlaces);

    /**
     * @swagger
     * /api/place/:placeId:
     *  get:
     *
     */
    app.get('/api/place/:placeId', access.getPlace);

    /**
     * @swagger
     * /api/user/:visitorId/favourites/:placeId:
     *  get:
     *
     */
    app.get('/' +
      'api/user/:visitorId/favourites/:placeId', access.changeFavourite);

    /**
     * @swagger
     * /api/user/:visitorId/visit:
     *  post:
     *
     */
    app.post('/api/user/:visitorId/visit', access.visit);

    /**
     * @swagger
     * /api/user/:visitorId/visit/:slotId:
     *  delete:
     *
     */
    app.delete('/api/user/:visitorId/visit/:slotId', access.deleteVisit);
}