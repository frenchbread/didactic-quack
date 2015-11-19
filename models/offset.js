var mongoose = require('../config/mongoose');
var Schema = mongoose.Schema;

var offset = new Schema({
    updated_id: {
        type        : String,
        max         : 30,
        required    : true
    }
});

module.exports = mongoose.model('Offset', offset);
