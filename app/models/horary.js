const mongo = require('mongoose');

var days = require('./days')
var daysSchema = days.model('days').schema



var horarySchema = mongo.Schema({
    idGrade: {
        type: String,
        required: "Se necesita un id grado",
    },
    days: [daysSchema]
})


module.exports = mongo.model('horary', horarySchema)


