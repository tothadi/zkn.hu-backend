var mongoose = require('mongoose');

var introSchema = new mongoose.Schema({
  id: {},
  text: {
    type: String,
    required: true
  }
});

mongoose.model('Intro', introSchema);