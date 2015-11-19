var r = require('request');
var config = require('../config');

var token = config.get("api_token");
var url = config.get('host')+token;

module.exports = function(msg){

  var to = "?chat_id=" + config.get("parent_id");

  var message = "&text=" + msg;

  var nUrl = url + "/sendMessage" + to + message;

  r(nUrl, function(err, response, body){

    if (err) throw err;

  });
};
