var CronJob = require('cron').CronJob;
var r = require('request');
var async = require('async');

var Offset = require('./bot/models/offset');
var parseMessage = require('./bot/lib/parseMessage');

var Bot = function (params) {

    this.parent = params.parent;
    this.host = params.host;
    this.token = params.token;
};

Bot.prototype.getUpdates = function () {

    var self = this;

    new CronJob('*/5 * * * * *', function() {

        check();

    }, null, true, 'America/Los_Angeles');

    // getUpdates function
    function check(){

        var nUrl = self.host + self.token + "/getUpdates";

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

                    //var to = e.message.from.id;
                    var to = self.parent;
                    var text = e.message.text;

                    // parse messages
                    var responseMessage = parseMessage(text);

                    self.sendMessage(to, responseMessage);
                });
            }
        ]);
    }

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
};

Bot.prototype.sendMessage = function (to, text) {

    var url = this.host + this.token + "/sendMessage";

    var toPrefix = "?chat_id=" + to;
    var messagePrefix = "&text=" + text;
    var nUrl = url + toPrefix + messagePrefix;

    r(nUrl, function(err, response, body){
        if (err) throw err;
    });
};

module.exports = Bot;