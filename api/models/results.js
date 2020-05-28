var mongoose = require('mongoose');

var resultSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

mongoose.model('Result', resultSchema);
