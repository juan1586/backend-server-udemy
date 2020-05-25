// Requires.
var express = require('express');



// Inicializar variables.
var app = express();



app.get('/', (req, resp, next) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamenete'
    })
});

module.exports = app;