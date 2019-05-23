const mongo = require('mongoose');
var fatherScheme = mongo.Schema({
    dni: {
        type: String,
        index: true,
        unique: true,
        required:  "Se necesita un dni",
        minlength: [8, "Se necesita un dni Correcto"],
        maxlength: [8, 'Se necesita un dni Correcto'],
    },
    password: {
        type: String,
        required: [true, "Se necesita password"],
    }
})

module.exports = mongo.model('father', fatherScheme);