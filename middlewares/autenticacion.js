var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//=================================
// Verificar token.
//=================================

exports.verificarToken = function(req, resp, next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return resp.status(401).json({
                ok: false,
                mensaje: 'No autorizado',
                errors: err
            });
        }
        req.usuario = decoded.usuario;
        next();
        // resp.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });

    });
}