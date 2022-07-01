const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profilePic: {
    type: String
  },
  rollNum: {
    type: String
  },

  slotsJSON: {
    type: String,
  },

});

module.exports = mongoose.model('User', usersSchema);


