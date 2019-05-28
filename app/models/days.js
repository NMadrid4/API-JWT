const mongo = require('mongoose');
var coursesOnDay = require('./coursesOnDay')
var coursesOnDaySchema = coursesOnDay.model('coursesOnDay').schema

var daysSchema = mongo.Schema({
    day: {
        type: String,
        required: "Se necesita un dia",
    },
    coursesOnDay: [coursesOnDaySchema]
})

module.exports = mongo.model('days', daysSchema)