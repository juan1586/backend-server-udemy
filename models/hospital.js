var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'Hospitales' });

hospitalSchema.plugin(uniqueValidator, { message: 'El {PATH} debe de ser unico' });

module.exports = mongoose.model('Hospital', hospitalSchema);