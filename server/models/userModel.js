const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }

});

//Fuction to hash password in text plain
UserSchema.pre('save', async function (next) {
  const user = this;
  //Hash done with 10 rounds, higher number means more secure but slower application
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

//Function to verify a password stored in DB
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  //Hash the password test plain introduced by user and compare with the one stored in DB
  //return boolean result
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;