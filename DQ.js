var request = require('request');
var _ = require('underscore');
var URL = require('url');
var parseMessage = require('./lib/parseMessage');

var DQ = function (params) {

    this._token = params.token;

    this._host = URL.format({
        protocol: "https",
        host: "api.telegram.org",
        pathname: "bot"
    });

    this._parent = (typeof params.parent === 'undefined') ? null : params.parent;

    this._offset = 0;

    this.getUpdatesUrl = this._host + this._token + "/getUpdates";

    this.sendMessageUrl = this._host + this._token + "/sendMessage";

};

DQ.prototype.getUpdates = function () {

    var self = this;

    request(self.getUpdatesUrl + "?offset=" + self._offset, function(err, response, body){

        if (err) throw err;

        var res = JSON.parse(body);

        if (res.ok) {

            var messages = res.result;

            if (messages.length>0) {

                // Updating offset
                self._offset = getHighestOffset(messages) + 1;

                console.log(self._offset);

                messages.forEach(function(e){

                    var to = (self._parent != null) ? self._parent : e.message.from.id;

                    var text = e.message.text;

                    // parse messages
                    var responseMessage = parseMessage(text);

                    // Sends message
                    self.sendMessage(to, responseMessage);
                });

            }else{
                console.log("No new messages..");
            }
        }
    });

    // Helper functions
    function getHighestOffset(messages){

        var arr = [];

        messages.forEach(function(e){

            arr.push(e.update_id);
        });

        return Math.max.apply(null, arr);
    }
};

DQ.prototype.sendMessage = function (to, text) {

    var prefix = "?chat_id=" + to + "&text=" + text;

    request(this.sendMessageUrl + prefix, function(err, response, body){
        if (err) throw err;
    });
};

module.exports = DQ;