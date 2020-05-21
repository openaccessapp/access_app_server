module.exports = (app) => {
    const access = require('../controllers/access.controller.js');

    app.post('/access', access.create);
    app.get('/access', access.findAll);
    app.get('/access/:placeId', access.findOne);
    app.put('/access/:placeId', access.update);
    app.delete('/access/:placeId', access.delete);
}