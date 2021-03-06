var mongoose = require('mongoose');

var selectiveSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
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
  pic: {
    type: String,
    required: true,
  },
  maxW: {
    type: String,
    required: true
  }
});

mongoose.model('Selective', selectiveSchema);