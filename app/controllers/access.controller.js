const Access = require('../models/access.model.js');

exports.create = (req, res) => {
    if(!req.body.dateTime) {
        return res.status(400).send({
            message: "dateTime can not be empty"
        });
    }

    const access = new Access({
        dateTime: req.body.dateTime
    });

    access.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while saving date time."
        });
    });
};

exports.findAll = (req, res) => {
    Access.find()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving data."
        });
    });
};

exports.findOne = (req, res) => {
    Access.findById(req.params.placeId)
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Place not found with id " + req.params.placeId
            });            
        }
        res.send(data);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Place not found with id " + req.params.placeId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving place with id " + req.params.placeId
        });
    });
};

exports.update = (req, res) => {
    if(!req.body.dateTime) {
        return res.status(400).send({
            message: "dateTime can not be empty"
        });
    }

    Access.findByIdAndUpdate(req.params.placeId, {
        dateTime: req.body.dateTime
    }, {new: true})
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Place not found with id " + req.params.placeId
            });
        }
        res.send(data);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Place not found with id " + req.params.placeId
            });                
        }
        return res.status(500).send({
            message: "Error updating place with id " + req.params.placeId
        });
    });
};

exports.delete = (req, res) => {
    Note.findByIdAndRemove(req.params.noteId)
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Place not found with id " + req.params.placeId
            });
        }
        res.send({message: "Place deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Place not found with id " + req.params.placeId
            });                
        }
        return res.status(500).send({
            message: "Could not delete place with id " + req.params.placeId
        });
    });
};