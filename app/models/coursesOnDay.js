
const mongo = require('mongoose');

var coursesOnDaySchema = mongo.Schema({
    idCourse: {
        type: String,
        required: "Se necesita un id de curso",
    },
    start: {
        type: String,
        required: "Se necesita una hora de inicio",
    },
    end: {
        type: String,
        required: "Se necesita una hora de fin",
    }
})

module.exports = mongo.model('coursesOnDay', coursesOnDaySchema)