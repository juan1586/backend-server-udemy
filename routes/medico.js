// Requires.
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


// Inicializar variables.
var app = express();
//var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

//=================================
// Obtener la lista de medicos
//=================================
app.get('/', (req, resp) => {

    Medico.find()
        .exec(
            (err, medico) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar medicos',
                        errors: err
                    })
                }

                resp.status(200).json({
                    ok: true,
                    medico: medico
                });
            });

});

//===============================
// Crear un nuevo medico..
//===============================
app.post('/', mdAutenticacion.verificarToken, (req, resp) => {
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico.',
                errors: err
            })
        }
        resp.status(201).json({
            ok: true,
            body: medicoGuardado,
            usuarioToken: req.usuario
        });
    });

});

//=================================
// Actualizar un medico
//=================================

app.put('/:id', mdAutenticacion.verificarToken, (req, resp) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            })
        }

        if (!medico) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Medico no existe',
                errors: { message: 'No existe medico con este id' }
            })
        }
        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.hospital = body.hospital
        medico.usuario = req.usuario._id;



        medico.save((err, medicoActualizado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico.',
                    errors: err
                })
            }
            resp.status(200).json({
                ok: true,
                medico: medicoActualizado
            });
        })
    })


});
//=================================
// Borrar usuario por id
//=================================
app.delete('/:id', mdAutenticacion.verificarToken, (req, resp) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar medico.',
                errors: err
            })
        }
        if (!medicoBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con este id.',
                errors: { message: 'No exixte medico' }
            })
        }
        resp.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    })
})


module.exports = app;