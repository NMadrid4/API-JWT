const mongo = require('mongoose');
var coursesOnDay = require('./coursesOnDay')
var coursesOnDaySchema = coursesOnDay.model('coursesOnDay').schema

var daysSchema = mongo.Schema({
    day: {
        type: String,
        required: "Se necesita un dia",
    },
    coursesOnDay:{
        type: [coursesOnDaySchema],
        validate: [(value) => value.length > 0, 'Se requiere al menos un curso por día'],
    }
    
})

module.exports = mongo.model('days', daysSchema)