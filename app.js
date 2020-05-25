// Requires.
var express = require('express');
var mongoose = require('mongoose');


// Inicializar variables.
var app = express();


// Coneccion DB

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[36m%s\x1b[0m', 'online');
})


// Rutas.
app.get('/', (req, resp, next) => {
    resp.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamenete'
    })
});



// Escuchar peticiones.
app.listen(3000, () => {
    console.log('Node/Express: \x1b[36m%s\x1b[0m', 'online');
});