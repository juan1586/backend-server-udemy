// Requires.
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


// Inicializar variables.
var app = express();

var Hospital = require('../models/hospital');

//=================================
// Obtener la lista de hospitales
//=================================
app.get('/', (req, resp, next) => {

    Hospital.find()
        .exec(
            (err, hospital) => {
                if (err) {
                    return resp.status(500).json({
                        ok: false,
                        mensaje: 'Error al cargar hospitales',
                        errors: err
                    })
                }

                resp.status(200).json({
                    ok: true,
                    hospital: hospital
                });
            });

});

//=================================
// Crear hospital.
//=================================

app.post('/', mdAutenticacion.verificarToken, (req, resp) => {
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital.',
                errors: err
            })
        }
        resp.status(201).json({
            ok: true,
            body: hospitalGuardado,
            usuarioToken: req.usuario
        });
    });

});

//=================================
// Actualizar un hospital
//=================================

app.put('/:id', mdAutenticacion.verificarToken, (req, resp) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            })
        }

        if (!hospital) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'Hospital no existe',
                errors: { message: 'No existe hospital con este id' }
            })
        }
        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id;



        hospital.save((err, hospitalActualizado) => {
            if (err) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital.',
                    errors: err
                })
            }
            resp.status(200).json({
                ok: true,
                hospital: hospitalActualizado
            });
        })
    })


});

//=================================
// Borrar usuario por id
//=================================
app.delete('/:id', mdAutenticacion.verificarToken, (req, resp) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar hospital.',
                errors: err
            })
        }
        if (!hospitalBorrado) {
            return resp.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con este id.',
                errors: { message: 'No exixte medico' }
            })
        }
        resp.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    })
})


module.exports = app;