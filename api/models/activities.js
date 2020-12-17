var mongoose = require('mongoose');

var activitiesSchema = new mongoose.Schema({
  sort: {
    type: Number,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  subs: {
    type: Array,
    required: false
  }
});

mongoose.model('Activities', activitiesSchema);