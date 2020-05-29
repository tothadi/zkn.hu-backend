var mongoose = require('mongoose');

var weightSchema = new mongoose.Schema({
  weight: Number,
  date: Date
});

mongoose.model('Weight', weightSchema);
