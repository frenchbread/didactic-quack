var r = require('request');
var async = require('async');
var fs = require('fs');
var parseMessage = require('./lib/parseMessage');

var DQ = function (params) {

    this.parent = params.parent;
    this.host = params.host;
    this.token = params.token;
};

DQ.prototype.getUpdates = function () {

    var self = this;

    var fileWithOffet = 'config/offset.txt';

    var nUrl = self.host + self.token + "/getUpdates";

    async.waterfall([

        function (next) {

            fs.readFile(fileWithOffet, 'utf8', function (err, data) {

                if (err) throw err;

                var offset = 0;

                if (!data || data != parseInt(data, 10)) {

                    fs.writeFile(fileWithOffet, offset, function (err) {
                        if (err) throw err;
                        console.log('Default offset is set.');
                    });

                }else offset = data;

                next(null, offset);
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

                // Sends message to the client (uncomment if bot goes public)
                //var to = e.message.from.id;

                // Sends message to bot "owner" (parent id)
                var to = self.parent;
                var text = e.message.text;

                // parse messages
                var responseMessage = parseMessage(text);

                // Sends message.
                self.sendMessage(to, responseMessage);
            });
        }
    ]);

    // Helper functions
    function updateOffset(messages){

        var offset = getHighestOffset(messages) + 1;

        fs.writeFile(fileWithOffet, offset, function (err) {
            if (err) throw err;
            console.log('Offset updated.');
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

DQ.prototype.sendMessage = function (to, text) {

    var toPrefix = "?chat_id=" + to;
    var messagePrefix = "&text=" + text;

    var nUrl = this.host + this.token + "/sendMessage" + toPrefix + messagePrefix;

    r(nUrl, function(err, response, body){
        if (err) throw err;
    });
};

module.exports = DQ;