var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es requerido'] }
});

medicoSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser unico' });

module.exports = mongoose.model('Medico', medicoSchema);