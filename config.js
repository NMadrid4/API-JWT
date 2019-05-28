module.exports = {
    'secret': 'secret_token',
    'authorizationError': 'No autorizado',
    'database':  process.env.MONGODB_URI || 'mongodb://localhost/Test4'
}

// mongodb+srv://dbUser:ESCAMAS@apicluster-dizmk.mongodb.net/test?retryWrites=true