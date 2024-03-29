const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Event = require('../models/event');
const Set = require('../models/set');

const querySelect = '_id name location date topic';
const querySelectSets = '_id name description';

router.get('/', (req, res, next) => {
	Event.find().select(querySelect).exec().then(events => {
		res.status(200).json(({
			status: { status_code: 200, status_text: 'OK' },
			result: events
		}));
	}).catch(err => {
		console.log(err);
		res.status(500).json({
			status: { status_code: 500, status_text: 'Internal Server Error' },
			error: err
		});
	});
});

router.get('/:eventID', (req, res, next) => {
	if (eventID = req.params.eventID) {
		if (mongoose.Types.ObjectId.isValid(eventID)) {
			Event.findById(eventID).select(querySelect).exec().then(event => {
				if (event) {
					Set.find({ event: mongoose.Types.ObjectId(eventID) }).select(querySelectSets).exec().then(sets => {
						res.status(200).json({
							status: { status_code: 200, status_text: 'OK' },
							result: {
								_id: event._id,
								name: event.name,
								location: event.location,
								date: event.date,
								topic: event.topic,
								sets: sets
							}
						});
					}).catch(err => {
						console.log(err);
						res.status(500).json({
							status: { status_code: 500, status_text: 'Internal Server Error' },
							error: err
						});
					});
				} else {
					res.status(404).json({
						status: { status_code: 404, status_text: 'Not Found' },
						error: 'Invalid Property: eventID'
					});
				}
			}).catch(err => {
				console.log(err);
				res.status(500).json({
					status: { status_code: 500, status_text: 'Internal Server Error' },
					error: err
				});
			});
		} else {
			res.status(400).json({
				status: { status_code: 400, status_text: 'Bad Request' },
				error: 'Invalid Property: eventID'
			});
		}
	} else {
		res.status(400).json({
            status: { status_code: 400, status_text: 'Bad Request' },
            error: 'Missing Property: eventID'
        });
	}
});

router.post('/', (req, res, next) => {
	if ((name = req.body.name) && (location = req.body.location) && (date = req.body.date) && (topic = req.body.topic)) {
		const event = new Event({
			_id: mongoose.Types.ObjectId(),
			name: name,
			location: location,
			date: date,
			topic: topic
		});

		event.save().then(result => {
			res.status(201).json({
				status: { status_code: 200, status_text: 'OK' },
				result: { 
					_id: result.id,
					name: result.name,
					location: result.location,
					date: result.date,
					topic: result.topic
				}
			});
		}).catch(err => {
			console.log(err);
			res.status(500).json({
				status: { status_code: 500, status_text: 'Internal Server Error' },
				error: err
			});
		});
	} else {
		var missing = [];
		if (!req.body.name) {
			missing.push('name');
		}
		if (!req.body.location) {
			missing.push('location');
		}
		if (!req.body.date) {
			missing.push('date');
		}
		if (!req.body.topic) {
			missing.push('topic');
		}
        res.status(400).json({
            status: { status_code: 400, status_text: 'Bad Request' },
            error: 'Missing Property: ' + missing.join(', ')
        });
	}
});

router.patch('/:eventID', (req, res, next) => {
	if (eventID = req.params.eventID) {
		if (mongoose.Types.ObjectId.isValid(eventID)) {
			const updateVariables = {};
			for (const variables of req.body) {
				updateVariables[variables.propName] = variables.value;
			}
	
			Event.updateOne({ _id: mongoose.Types.ObjectId(eventID) }, { $set: updateVariables }).exec().then(result => {
				if (result.nModified > 0) {
					res.status(200).json({
						status: { status_code: 200, status_text: 'OK' },
						result: 'Event Updated.'
					});
				} else {
					res.status(400).json({
						status: { status_code: 400, status_text: 'Bad Request' },
						result: 'Invalid Property: eventID'
					});
				}
			}).catch(err => {
				console.log(err);
				res.status(500).json({
					status: { status_code: 500, status_text: 'Internal Server Error' },
					error: err
				});
			});
		} else {
			res.status(400).json({
				status: { status_code: 400, status_text: 'Bad Request' },
				error: 'Invalid Property: eventID'
			});
		}
	} else {
		res.status(400).json({
            status: { status_code: 400, status_text: 'Bad Request' },
            error: 'Missing Property: eventID'
        });
	}
});

router.delete('/', (req, res, next) => {
	if (eventID = req.body.eventID) {
		if (mongoose.Types.ObjectId.isValid(eventID)) {
			Event.deleteOne({ _id: mongoose.Types.ObjectId(eventID) }).exec().then(result => {
				if (result.deletedCount > 0) {
					res.status(200).json({
						status: { status_code: 200, status_text: 'OK' },
						result: 'Event Deleted.'
					});
				} else {
					res.status(400).json({
						status: { status_code: 400, status_text: 'Bad Request' },
						result: 'Invalid Property: eventID'
					});
				}
			}).catch(err => {
				console.log(err);
				res.status(500).json({
					status: { status_code: 500, status_text: 'Internal Server Error' },
					error: err
				});
			});
		} else {
			res.status(400).json({
				status: { status_code: 400, status_text: 'Bad Request' },
				result: 'Invalid Property: eventID'
			});
		}
	} else {
		res.status(400).json({
            status: { status_code: 400, status_text: 'Bad Request' },
            error: 'Missing Property: eventID'
        });
	}
});

module.exports = router;