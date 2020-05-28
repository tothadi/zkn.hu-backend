var mongoose = require('mongoose');

var newsSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  sign: {
    type: String,
    required: false,
  },
  rank: {
    type: String,
    required: false,
  },
  pics: {
    type: Array,
    required: true
  }
});

mongoose.model('News', newsSchema);
