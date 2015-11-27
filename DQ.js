var request = require('request');
var _ = require('underscore');
var URL = require('url');
var S = require('string');

var parseMsg = require('./lib/parseMessage');

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


DQ.prototype._reqGet = function (callback) {

    var self = this;

    var url = this.getUpdatesUrl + "?offset=" + this._offset;

    request(url, function (err, res, body) {

        if (err) callback(err, null);

        var bodyObj = JSON.parse(body);

        if (bodyObj.ok) {

            var messages = bodyObj.result;

            if (messages.length > 0) {

                self._updateOffset(messages);

                callback(null, messages);

            } else {

                console.log("No new messages..");

                return callback(undefined, []);
            }

        } else return callback(new Error("Response looks wrong.."), undefined);

    });
};

DQ.prototype.getUpdates = function (callback) {

    var self = this;

    this._reqGet(function (err, messages) {

        if (err) callback(err, undefined);

        self._eachMessage(messages, function (err, response) {

            if (err) callback(err, undefined);

            callback(undefined, response);
        });
    });
};

DQ.prototype._eachMessage = function (messages, callback) {

    var self = this;

    _.each(messages, function (msg) {

        var to = msg.message.from.id; // (self._parent != null) ? self._parent : e.message.from.id;
        var text = msg.message.text;

        var parsed = parseMsg(text);

        callback(undefined, parsed);
    });
};


DQ.prototype._updateOffset = function (messages) {

    this._offset = this._getHighestOffset(messages) + 1;
    console.log("Updating offset..");
};

DQ.prototype._getHighestOffset = function (messages) {

    var arr = [];

    _.map(messages, function (msg) {

        arr.push(msg.update_id);

    });

    return Math.max.apply(null, arr);
};


//// Updating offset
//self._offset = getHighestOffset(messages) + 1;
//
//messages.forEach(function(e){
//
//    var to = (self._parent != null) ? self._parent : e.message.from.id;
//
//    var text = e.message.text;
//
//    return callback(text);
//});

//DQ.prototype.getUpdates = function (callback) {
//
//    var self = this;
//
//    request(self.getUpdatesUrl, function(err, response, body){
//
//        if (err) throw err;
//
//        var res = JSON.parse(body);
//
//        if (res.ok) {
//
//            var messages = res.result;
//
//            if (messages.length>0) {
//
//                // Updating offset
//                self._offset = getHighestOffset(messages) + 1;
//
//                messages.forEach(function(e){
//
//                    var to = (self._parent != null) ? self._parent : e.message.from.id;
//
//                    var text = e.message.text;
//
//                    return callback(text);
//                });
//
//            }else{
//                return callback(null);
//            }
//        }
//    });
//
//    // Helper functions
//    function getHighestOffset(messages){
//
//        var arr = [];
//
//        messages.forEach(function(e){
//
//            arr.push(e.update_id);
//        });
//
//        return Math.max.apply(null, arr);
//    }
//};
//
//DQ.prototype.sendMessage = function (to, text) {
//
//    var prefix = "?chat_id=" + to + "&text=" + text;
//
//    request(this.sendMessageUrl + prefix, function(err, response, body){
//        if (err) throw err;
//    });
//};

module.exports = DQ;