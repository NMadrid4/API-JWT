const mongo = require('mongoose');

var days = require('./days')
var daysSchema = days.model('days').schema



var horarySchema = mongo.Schema({
    idGrade: {
        type: String,
        required: "Se necesita un id grado",
        index: true,
        unique: true,
    },
    days: {
        type: [daysSchema],
        required: "Se requiere al menos un día de estudio",
        validate: [(value) => value.length > 0, 'Se requiere al menos un día de estudio'],
    }, 
})


module.exports = mongo.model('horary', horarySchema)


