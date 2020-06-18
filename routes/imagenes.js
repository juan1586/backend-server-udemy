// Requires.
var express = require('express');



// Inicializar variables.
var app = express();

const patch = require('path');
const fs = require('fs');



app.get('/:tipo/:img', (req, resp, next) => {
    
    var tipo = req.params.tipo;
    var img = req.params.img;

    var patchImagen = patch.resolve( __dirname, `..uploads/${ tipo }/${img}`);

    if(fs.existsSync(patchImagen)){
        resp.sendFile( patchImagen );
    }else{
        var patchNoImage = patch.resolve( __dirname, '../assets/no-img.jpg');
        resp.sendFile( patchNoImage );
    }
});

module.exports = app;