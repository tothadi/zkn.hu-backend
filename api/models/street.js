var mongoose = require('mongoose');

var streetSchema = new mongoose.Schema({
    index: {
        type: Number,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: false
    },
    single: {
        type: Number,
        required: true
    },
    multi: {
        type: Array,
        required: true
    },
    yellow: {
        type: Number,
        required: true
    },
    blue: {
        type: Number,
        required: true
    },
    green: {
        type: Number,
        required: true
    }
});

mongoose.model('Street', streetSchema);