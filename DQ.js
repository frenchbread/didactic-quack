var r = require('request');
var parseMessage = require('./lib/parseMessage');

var DQ = function (params) {

    this.token = params.token;
    this.host = "https://api.telegram.org/bot";

    if (typeof params.parent === 'undefined')
        this.parent = null;
    else
        this.parent = params.parent;

    this.offset = 0;

};

DQ.prototype.getUpdates = function () {

    var self = this;

    var nUrl = self.host + self.token + "/getUpdates";

    r(nUrl + "?offset="+self.offset, function(err, response, body){

        if (err) throw err;

        var res = JSON.parse(body);

        if (res.ok) {

            var messages = res.result;

            if (messages.length>0) {

                // Updating offset
                self.offset = getHighestOffset(messages) + 1;

                messages.forEach(function(e){

                    var to = (this.parent != null) ? self.parent : e.message.from.id;

                    var text = e.message.text;

                    // parse messages
                    var responseMessage = parseMessage(text);

                    // Sends message.
                    self.sendMessage(to, responseMessage);
                });

            }else{
                console.log("No new messages..");
            }
        }
    });

    // Helper functions

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