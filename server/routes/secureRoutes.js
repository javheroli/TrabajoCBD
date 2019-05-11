const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const auth = require('../auth/auth');

//API Route /api/getUserLogged/
//GET: Getting all users from DB
router.route('/getUserLogged').get((req, res) => {
    var id = req.user._id;
    User.findById(id, (err, user) => {
        res.json(user);
        console.log('Getting the user logged');
        res.end();
    });
});

//API Route /api/users/:username
//GET: Getting all users from DB
router.route('/user/:username').get((req, res) => {
    var username = req.params.username;
    User.findOne({
        username: username
    },
        (err, user) => {
            res.json(user);
            console.log('Getting the user with username: ' + username);
            res.end();
        }
    );
});


//API Route /api/users/search?keyword=*
//GET: Getting all users from DB that contain the keyword in their username, first name or last name
router.route('/users/search/:keyword?').get((req, res) => {
    var _id = req.user._id;
    var keyword = req.query.keyword;
    var query;
    if (keyword === undefined || keyword == '') {
        query = {
            _id: {
                $ne: _id
            }
        };
    } else {
        query = {
            $and: [
                {
                    $or: [
                        { username: { $regex: keyword, $options: 'i' } },
                        { firstName: { $regex: keyword, $options: 'i' } },
                        { lastName: { $regex: keyword, $options: 'i' } }]
                },
                {
                    _id: {
                        $ne: _id
                    }
                }
            ]
        };
    }

    User.find(query,
        (err, users) => {
            res.json(users);
            console.log('Getting all but the current user that contain the keyword in their username, first name or last name');
            res.end();
        }
    );
});

//API Route /api/users?degree=*&course=*
//GET: Getting all users from DB filtered by their degree and/or course
router.route('/users/:degree?/:course?').get((req, res) => {
    var _id = req.user._id;
    var degree = req.query.degree;
    var course = req.query.course;
    var query;
    if (degree === undefined && course === undefined) {
        query = {
            _id: {
                $ne: _id
            }
        };
    } else if (degree !== undefined && course === undefined) {
        query = {
            _id: {
                $ne: _id
            },
            degree: degree
        };
    } else if (degree === undefined && course !== undefined) {
        query = {
            _id: {
                $ne: _id
            },
            course: course
        };
    } else {
        query = {
            _id: {
                $ne: _id
            },
            degree: degree,
            course: course
        };
    }

    User.find(query,
        (err, users) => {
            res.json(users);
            console.log('Getting all but the current user filtered by their degree and/or course');
            res.end();
        }
    );
});





//API Route /api/messages/
//POST: Creating a new message and storing it at DB
router.route('/messages').post((req, res) => {
    let message = new Message(req.body);
    var userId = req.user._id;
    User.findById(userId, (error, user) => {
        if (user.username !== message.sender) {
            return res
                .status(500)
                .send('The user logged is not the sender of this message');
        } else {
            if (message.sender === message.receiver) {
                return res.status(500).send('Sender and Receiver can not be the same user');
            }
            message.save(function (err) {
                if (err) return res.status(500).send(err);
                res.status(201).send(message);
                console.log('Message stored successfully');
            });
        }
    });
});



//API Route /api/deleteMessages/:messageId
//DELETE: Delete a message from DB
router.route('/deleteMessages/:messageId').delete((req, res) => {
    var messageId = req.params.messageId;
    var userId = req.user._id;
    User.findById(userId, (error, user) => {
        Message.findById(messageId, (err, message) => {
            if (user.username !== message.sender) {
                return res
                    .status(500)
                    .send('The user is not the sender of this message');
            }
            if (err) return res.status(500).send(err);

            message.delete();
            res.status(204).send('Message deleted succesfully');
        });
    });
});


//API Route /api/editMessages/
//PUT: Edit a message
router.route('/editMessages/:messageId')
    .post((req, res) => {
        var messageId = req.params.messageId;
        var messageBody = new Message(req.body);
        var userId = req.user._id;
        User.findById(userId, (error, user) => {
            Message.findById(messageId, (err, messageDB) => {
                if (user.username !== messageDB.sender) {
                    return res
                        .status(500)
                        .send('The user is not the sender of this message');
                }
                if (err) return res.status(500).send(err);
                messageDB.message = messageBody.message;
                messageDB.save(function (err) {
                    if (err) return res.status(500).send(err);
                    res.status(201).send(messageDB);
                    console.log("Message edit successfully");
                });

            });
        });

    });

//API Route /api/messages/:sender/:receiver
//GET: Getting all messages between sender and receiver ordered by timestamp from DB
router.route('/messages/:sender/:receiver').get((req, res) => {
    var sender = req.params.sender;
    var receiver = req.params.receiver;

    Message.find({
        $or: [{
            $and: [{
                sender: sender
            },
            {
                receiver: receiver
            }
            ]
        },
        {
            $and: [{
                sender: receiver
            },
            {
                receiver: sender
            }
            ]
        }
        ]
    })
        .sort({
            timestamp: 1
        })
        .exec((err, messages) => {
            res.json(messages);
            console.log(
                'Getting all messages between ' + sender + ' and ' + receiver
            );
            res.end();
        });
});

module.exports = router;