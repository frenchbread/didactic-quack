var config = require('../config');
var r = require('request');
var async = require('async');
var Offset = require('../models/offset');
var parseMessage = require('./parseMessage');

var token = config.get("api_token");
var url = config.get('host')+token;

module.exports = function(){

    var nUrl = url + "/getUpdates";

    async.waterfall([

        function (next) {
            Offset.findOne({}, {}, function (err ,obj) {

                if (obj !== null){

                    var offset = obj.updated_id;

                    next(null, offset);

                }else{

                    var defOffset = new Offset();

                    defOffset.updated_id = 0;

                    defOffset.save(function(err){

                        console.log("Created default offset..");

                    });

                }

            });

        },
        function (offset, next) {

            r(nUrl + "?offset="+offset, function(err, response, body){

                if (err) throw err;

                var res = JSON.parse(body);

                if (res.ok) {

                    var messages = res.result;

                    if (messages.length>0) {

                        updateOffset(messages);

                        next(null, messages);

                    }else{
                        console.log("No new messages..");
                    }
                }
            });
        },
        function (messages, next) {

            messages.forEach(function(e){

                var text = e.message.text;

                // parse messages
                parseMessage(text);

            });

        }
    ]);
};

function updateOffset(messages){

    var offset = getHighestOffset(messages) + 1;

    Offset.findOne({}, {}, function (err, obj) {

        obj.updated_id = offset;

        obj.save(function(err){

            console.log("Updating offset..");
        });
    });
}

function getHighestOffset(obj){

    var arr = [];

    obj.forEach(function(e){

        arr.push(e.update_id);
    });

    return Math.max.apply(null, arr);
}