var mongoose = require('mongoose');

var calendarSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    mixed: {
        type: Object,
        required: true
    },
    paper: {
        type: Object,
        required: false
    },
    plamet: {
        type: Object,
        required: false
    },
    glass: {
        type: Object,
        required: false
    },
    green: {
        type: Object,
        required: false
    }
});

mongoose.model('Calendar', calendarSchema);