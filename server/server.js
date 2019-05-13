const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
var routes = require('./routes/routes.js');
var secureRoutes = require('./routes/secureRoutes.js');
var bodyParser = require('body-parser');
require('./auth/auth');
require('dotenv').config();
var multer = require('multer');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");




//Connection to DataBase:
//To connect to Development environment DB (Comment line below if not using it)
mongoose.connect('mongodb://localhost:27017/TrabajoCBD', {
  useNewUrlParser: true
});

//To connect to DB in Mlab
//mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;


const app = express();

//For parsing body with Content-Type application/json
app.use(bodyParser.json());
//For parsing body with Content-Type application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));
//For parsing multipart/form-data
//Parser to upload an image to Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "userImages",
  allowedFormats: ["jpg", "png", "jpeg", "gif"],
  transformation: [{
    width: 500,
    height: 500,
    crop: "limit"
  }]
});
const parser = multer({
  storage: storage
});
app.use(parser.single('image'));

//Allowing Cross-Origin Request
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS, PUT, DELETE');
  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.sendStatus(200);
  } else {
    //move on
    next();
  }
});



//Server path to user login routes
app.use('/api', routes);

//Server path to responses secured routes
app.use('/api', passport.authenticate('jwt', {
  session: false
}), secureRoutes);


// The 'catchall' handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


const port = process.env.PORT || 5000;
app.listen(port);

console.log(`API listening on ${port}`);


module.exports = app;