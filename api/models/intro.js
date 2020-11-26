var mongoose = require('mongoose');

var introSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
});

mongoose.model('Intro', introSchema);