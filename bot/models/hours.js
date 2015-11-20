var mongoose = require('../../config/mongoose');
var Schema = mongoose.Schema;

var hours = new Schema({
    project : String,
    hours : Number,
    details : String,
    date : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hours', hours);