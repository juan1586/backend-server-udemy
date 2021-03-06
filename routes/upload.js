// Requires.
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');



// Inicializar variables.
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());  



app.put('/:tipo/:id', (req, resp, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;
    // Tipos de coleccion

    var tiposValidos = ['usuarios', 'medicos', 'hospitales'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { mensaje: 'Tipo no valida' }
        })
    }


    if (!req.files) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'No deleccionó ningun archivo',
            errors: { mensaje: 'Debes seleccionar imagen' }
        })
    }



    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];


    // Nombre archivo
    var nombreArchivo = ` ${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // Solo imagenes
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return resp.status(400).json({
            ok: false,
            mensaje: 'Extensión no valida',
            errors: { mensaje: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        })
    }


    // Mover archivo
    var patch = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(patch, err => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            })
        }

        subirPorTipo(tipo, id, nombreArchivo, resp);
        // resp.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo subido correctamenete',
        // })
    })

    // resp.status(200).json({
    //     ok: true,
    //     mensaje: 'Petición realizada correctamenete',
    //     extensionArchivo: extensionArchivo
    // })
});

function subirPorTipo(tipo, id, nombreArchivo, resp) {
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if(!usuario){
                return resp.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    erros: { message: 'Usuario no existe'}
                })
            }

            var patchViejo = './uploads/usuarios/' + usuario.img;

            if (err) {
                resp.status(500).json({
                    ok: true,
                    mensaje: 'Error al actualizar imagen de usuario',
                    errors: err
                })
            }
            // Si existe se elimina la img anterior.
            if (fs.existsSync(patchViejo)) {
                fs.unlinkSync(patchViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                return resp.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actulaizada',
                    usuarioActualizado: usuarioActualizado
                })
            });
        });
    }
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if(!medico){
                return resp.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    erros: { message: 'Medico no existe'}
                })
            }
            var patchViejo = `./uploads/medicos/${medico.img}`;
            if (err) {
                resp.status(500).json({
                    ok: true,
                    mensaje: 'Error al actualizar imagen de medico',
                    errors: err
                })
            }

            if (fs.existsSync(patchViejo)) {
                fs.unlinkSync(patchViejo);
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return resp.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actulaizada',
                    medicoActualizado: medicoActualizado,
                })
            });

        })
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            if(!hospital){
                return resp.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    erros: { message: 'Hospital no existe'}
                })
            }
            var patchViejo = `./uploads/hospitales/${hospital.img}`;
            if (err) {
                resp.status(500).json({
                    ok: true,
                    mensaje: 'Error al actualizar imagen de hospital',
                    errors: err
                })
            }
            if (fs.existsSync(patchViejo)) {
                fs.unlinkSync(patchViejo);
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                return resp.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospitalActualizado: hospitalActualizado,
                })
            });
        })
    }
}

module.exports = app;