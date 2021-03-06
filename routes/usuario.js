// Requires.
var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;
var mdAutenticacion = require('../middlewares/autenticacion');



// Inicializar variables.
var app = express();
var Usuario = require('../models/usuario');

//===============================
// Obtener todos los usuarios.
//===============================

app.get('/', (req, resp, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img rolea')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar usuarios',
                        errors: err
                    })
                }
                Usuario.count({}, (err, conteo) => {
                    resp.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });
                })

            });

});


//=================================
// Actualizar usuario
//=================================

app.put('/:id', mdAutenticacion.verificarToken, (req, resp) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }

        if (!usuario) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Usuario no existe',
                errors: { message: 'No existe usuario con este id' }
            })
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioActualizado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario.',
                    errors: err
                })
            }
            usuarioActualizado.password = ':)';
            resp.status(200).json({
                ok: true,
                usuario: usuarioActualizado
            });
        })
    })


})

//===============================
// Crear un nuevo usuario..
//===============================
app.post('/', mdAutenticacion.verificarToken, (req, resp) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario.',
                errors: err
            })
        }
        resp.status(201).json({
            ok: true,
            body: usuarioGuardado,
            usuarioToken: req.usuario
        });
    });

});



//=================================
// Borrar usuario por id
//=================================
app.delete('/:id', mdAutenticacion.verificarToken, (req, resp) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar usuario.',
                errors: err
            })
        }
        if (!usuarioBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con este id.',
                errors: { message: 'No exixte usuario' }
            })
        }
        resp.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    })
})


module.exports = app;