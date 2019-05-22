const express = require('express');
const jwt = require('jsonwebtoken');
const mongo = require('mongoose');
const bodyparser = require('body-parser');
const app = express();
const secret = 'secret_token'
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ 
    extended: true
  })); 

var fatherScheme = mongo.Schema({
    dni: {
        type: String,
        index: true,
        unique: true,
        required: [true, "Se necesita un dni"],
        minlength: [8, "Se necesita un dni Correcto"],
        maxlength: [8, 'Se necesita un dni Correcto'],
    },
    password: {
        type: String,
        required: [true, "Se necesita password"],

    }
})

var father = mongo.model('father', fatherScheme);

mongo.connect("mongodb://localhost/Test2", {useNewUrlParser: true}, (err) => {
    err ? console.log("no se pudo conectar") :  console.log("conectado")
})

app.post('/api/father', (req, res) => {
    var newFather = new father();
    newFather.dni = req.body.dni
    newFather.password = req.body.password
    newFather.save((err) => {
        if (err) {
            console.log(err)
            // return res.json({err})
            if (err.name == 'ValidationError') {
                if (typeof err.errors["dni"] != 'undefined') {
                    return res.status(400).json({"message": err.errors["dni"]["message"]})
                }else if (typeof err.errors["password"] != 'undefined') {
                    return res.status(400).json({"message": err.errors["password"]["message"]})
                }else  {
                    res.status(500).json({message: 'error interno'})
                }
            }else if(err.code === 11000) {
                return res.status(400).json({"message": "El usuario ya se ha registrado anteriormente"})
            }
        }
        res.status(200).json({"message": "Registro exitoso"}) 
    })
})

app.post('/api/login', (req, res) => {
    var newFather = new father();
    newFather.dni = req.body.dni
    newFather.password = req.body.password
    father.findOne({dni: newFather.dni, password: newFather.password}, (err, result) => {
        if (err) {
            res.sendStatus(500);
        }else {
            if (result != null) {
                const token = jwt.sign({result}, secret);
                res.status(200).json({"token": token})
            } else {
                res.status(400).json({ mensaje: 'Login incorrecto'});
            }
        }
    })
}) 

app.get('/api/categories', ensureToken,(req,res) => {
    jwt.verify(req.token, secret, (err, data) => {
        if(err) {
            res.status(403).json({"message": "no aturoziado"})
        }else {
            res.json({
                text: 'acceso a texto protegido'
            })
        }
    })    
    
})

function ensureToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else { 
        res.status(403).json({message: 'no autorizado'})
    }
}

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log('Sever on port', app.get('port'))
})