const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const User = require('../models/userModel');

//API Route /api/chat/users/
//GET: Getting all responses from DB
//POST: Creating a new response and storing it at DB
router.route('/users')
    .get((req, res) => {
        User.find({}, (err, users) => {
            res.json(users)
            console.log("Getting all users");
            res.end();
        })
    })




module.exports = router;