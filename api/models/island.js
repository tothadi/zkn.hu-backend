var mongoose = require('mongoose');

var islandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
});

mongoose.model('Island', islandSchema);