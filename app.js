// Requires.
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar variables.
var app = express();

// Body parser
// parse application/x-www-form-urlencoded
// Toma informacion del post y lo convierte en objeto javascript.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importar rutas.

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');


// Coneccion DB

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[36m%s\x1b[0m', 'online');
})


// Rutas.
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);




// Escuchar peticiones.
app.listen(3000, () => {
    console.log('Node/Express: \x1b[36m%s\x1b[0m', 'online');
});