const express = require('express');
const jwt = require('jsonwebtoken');
const mongo = require('mongoose');
const bodyparser = require('body-parser');
const config = require('./config');
const Father = require('./app/models/father')
const son = require('./app/models/son')

const app = express();
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false})); 

mongo.connect(config.database, {useNewUrlParser: true}, (err) => {
    err ? console.log("no se pudo conectar") :  console.log("conectado")
})

app.get('/', (req, res) => {
    res.status(200).send("Conectado")
})

app.post('/api/father', (req, res) => {
    var newFather = new Father();
    newFather.dni = req.body.dni
    newFather.password = req.body.password
    newFather.save((err) => {
        if (err) {
            console.log(err)
            if (err.name == 'ValidationError') {
                if (typeof err.errors.dni != 'undefined') {
                    return res.status(400).json({"message": err.errors.dni.message})
                }else if (typeof err.errors.password != 'undefined') {
                    return res.status(400).json({"message": err.errors.password.message})
                }
            }else if(err.code === 11000) {
                return res.status(400).json({"message": "El usuario ya se ha registrado anteriormente"})
            }else  {
                res.status(500).json({message: 'error interno'})
            }
        }
        res.status(200).json({"message": "Registro exitoso"}) 
    })
}).get('/api/father', (req, res) => {
    Father.find((err, result) => {
        if (err) {
            return res.sendStatus(500);
        }
        res.status(200).json(result);
    })
})

app.post('/api/login', (req, res) => {
    var newFather = new Father();
    newFather.dni = req.body.dni
    newFather.password = req.body.password
    Father.findOne({dni: newFather.dni, password: newFather.password}, (err, result) => {
        if (err) {
            res.sendStatus(500);
        }else {
            if (result != null) {
                const token = jwt.sign({result}, config.secret);
                res.status(200).json({token})
            } else {
                res.status(400).json({ mensaje: 'Login incorrecto'});
            }
        }
    }).select(["_id","dni"]) 
}) 

app.get('/api/categories', ensureToken,(req,res) => {
    jwt.verify(req.token, config.secret, (err, data) => {
        if(err) {
            res.status(403).json({"message": config.authorizationError})
        }else {
            res.json({
                text: 'acceso a texto protegido'
            })
        }
    })    
    
})

//SON REQUEST
app.post('/api/son', (req, res) => {
    var newSon = new son();
    newSon.name = req.body.name
    newSon.grade = req.body.grade
    newSon.idFather = req.body.idFather
    newSon.save((err) => {
        if (err) {
            console.log(err)
            if (err.name == 'ValidationError') {
                if (typeof err.errors.name != 'undefined') {
                    return res.status(400).json({"message": err.errors.name.message})
                }else if (typeof err.errors.grade != 'undefined') {
                    return res.status(400).json({"message": err.errors.grade.message})
                }else if (typeof err.errors.idFather != 'undefined') {
                    return res.status(400).json({"message": err.errors.idFather.message})
                }else  {
                    return res.status(500).json({message: 'error interno'})
                }
            }
        }
        res.status(200).json({"message": "Registro exitoso"});
    })

}).get('/api/son', ensureToken, (req, res) => {
    //comparar header token con el jwt generado
    jwt.verify((req.token), config.secret, (err) => {
        if (err) {
            return res.status(403).json({"message": config.authorizationError})
        }
        var idFather = req.query.idFather;
        if (typeof idFather != 'undefined') {
            son.find({idFather: idFather}, (err, hijos) => {
                if (err) {
                    return res.status(500).json({message: 'error interno'})
                }
                res.status(200).json({hijos})
            })
        }else{
            return res.status(400).json({message: 'Debe ingresar el id del padre'})
        }
    })    
})

//verifica que se esta mandando un authorization  header
function ensureToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else { 
        res.status(403).json({message: config.authorizationError})
    }
}

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log('Sever on port', app.get('port'))
})