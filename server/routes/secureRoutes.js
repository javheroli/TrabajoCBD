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






module.exports = router;