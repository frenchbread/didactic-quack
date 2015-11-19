var mongoose = require('mongoose');
var config = require('../config');

var URI = config.get('ENV') == 'development' ? config.get('mongoose:uriDev') : config.get('mongoose:uriProd');

mongoose.connect(URI, config.get('mongoose:options'));

module.exports = mongoose;
