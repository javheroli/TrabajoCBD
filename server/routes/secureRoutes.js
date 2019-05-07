const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const auth = require('../auth/auth');

//API Route /api/getUserLogged/
//GET: Getting all users from DB
router.route('/getUserLogged')
    .get((req, res) => {
        var id = req.user._id;
        User.findById(id, (err, user) => {
            res.json(user);
            console.log("Getting the user logged");
            res.end();
        })
    })

//API Route /api/users/
//GET: Getting all users from DB
router.route('/users')
    .get((req, res) => {
        var _id = req.user._id;

        User.find({
            '_id': {
                $ne: _id
            }
        }, (err, users) => {
            res.json(users)
            console.log("Getting all users without user logged");
            res.end();
        })
    })

//API Route /api/messages/
//POST: Creating a new message and storing it at DB
router.route('/messages')
    .post((req, res) => {
        let message = new Message(req.body);
        if (message.sender === message.receiver) {
            return res.status(500).send("Sender and Receiver can not be the same user")
        }
        message.save(function (err) {
            if (err) return res.status(500).send(err);
            res.status(201).send(message);
            console.log("Message stored successfully");

        })

    })

//API Route /api/messages/:sender/:receiver
//GET: Getting all messages between sender and receiver ordered by timestamp from DB
router.route('/messages/:sender/:receiver')
    .get((req, res) => {
        var sender = req.params.sender;
        var receiver = req.params.receiver;

        Message.find({
            $or: [{
                $and: [{
                    sender: sender
                }, {
                    receiver: receiver
                }]
            }, {
                $and: [{
                    sender: receiver
                }, {
                    receiver: sender
                }]
            }]

        }).sort({
            timestamp: 1
        }).exec((err, messages) => {
            res.json(messages)
            console.log("Getting all messages between " + sender + " and " + receiver);
            res.end();
        });

    })






module.exports = router;