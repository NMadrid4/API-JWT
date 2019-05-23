const mongo = require('mongoose');
var sonScheme = mongo.Schema({
    name: {
        type: String,
        required: "Se necesita un nombre",
    },
    grade: {
        type: String,
        required: "Se necesita un grado de instrucción",
    },
    idFather: {
        type: String,
        required: "Se necesita un padre",
    }
})

module.exports = mongo.model('son', sonScheme);