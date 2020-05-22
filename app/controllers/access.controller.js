const Access = require('../models/access.model.js');

const ObjectID = require('mongodb').ObjectID;

exports.create = (req, res) => {
    if(!req.body.fromDate) {
        return res.status(400).send({
            message: "fromDate can not be empty"
        });
    }

    if(!req.body.toDate) {
        return res.status(400).send({
            message: "toDate can not be empty"
        });
    }

    var id = new ObjectID()
    if (req.body._id) {
        id = req.body._id
    }

    const access = new Access({
        fromDate: req.body.fromDate,
        toDate: req.body.toDate,
        _id: id
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
    if(!req.body.fromDate) {
        return res.status(400).send({
            message: "fromDate can not be empty"
        });
    }

    if(!req.body.toDate) {
        return res.status(400).send({
            message: "toDate can not be empty"
        });
    }


    Access.findByIdAndUpdate(req.params.placeId, {
        fromDate: req.body.fromDate,
        toDate: req.body.toDate
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
    Access.findByIdAndRemove(req.params.placeId)
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