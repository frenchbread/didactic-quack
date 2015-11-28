var request = require('request');
var _ = require('underscore');
var URL = require('url');
var string = require('string');
var logger = require('intel');

var modulesList = require('./lib/modulesList');
var modules = require('./lib/modules');


// Class constructor
var DQ = function (params) {

    this._token = params.token;

    this._host = URL.format({
        protocol: "https",
        host: "api.telegram.org",
        pathname: "bot"
    });

    this._parent = (typeof params.parent === 'undefined') ? null : params.parent;

    this._recipient = null;

    this._offset = 0;

    this.getUpdatesUrl = this._host + this._token + "/getUpdates";

    this.sendMessageUrl = this._host + this._token + "/sendMessage";

    this._moduleList = (typeof params.moduleList === 'undefined') ? modulesList : params.moduleList;

    this._modules = (typeof params.modules === 'undefined') ? modules : params.modules;

};


// Get request
// returns callback with NEW MESSAGES list
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

                logger.info("No new messages..");

                return callback(undefined, []);
            }

        } else return callback(new Error("Response looks wrong.."), undefined);

    });
};

// Send message method
DQ.prototype.sendMessage = function (to, text) {

    var prefix = "?chat_id=" + to + "&text=" + text;

    request(this.sendMessageUrl + prefix, function(err, response, body){
        if (err) logger.error(err);

        logger.info("Message send");
    });
};

// Main method
// get new messages, iterates through each message
DQ.prototype.getUpdates = function () {

    var self = this;

    this._reqGet(function (err, messages) {

        if (err) callback(err, undefined);

        self._eachMessage(messages, function (err, response) {

            if (err) logger.error(err);

            self.sendMessage(self._recipient, response);
        });
    });
};


// Iterates though each message & call a callback with deployed module data
DQ.prototype._eachMessage = function (messages, callback) {

    var self = this;

    _.each(messages, function (msg) {

        self._recipient = msg.message.from.id;
        var text = msg.message.text;


        if (self._hasCommand(text)){

            var moduleName = self._getCommandName(text);

            callback(undefined, self._modules[moduleName](text));
        } else {

            // Call default module
            callback(undefined, self._modules.default());
        }
    });
};

// Parses string & checks if one contains a command listed in modules list
DQ.prototype._hasCommand = function (text) {

    var modules = this._moduleList;

    for (var key in modules) {

        if (modules.hasOwnProperty(key)) {

            if (string(text).contains(modules[key]))
                return true;
        }
    }

    return false;
};

// Same as above but returnes module name
DQ.prototype._getCommandName = function (text) {

    var modules = this._moduleList;

    for (var key in modules) {

        if (modules.hasOwnProperty(key)) {

            if (string(text).contains(modules[key])){

                return key;
            }
        }
    }
};

// Update offset
DQ.prototype._updateOffset = function (messages) {

    this._offset = this._getHighestOffset(messages) + 1;
    logger.info("Updating offset..");
};

// Get highest offset value from an array of objects
DQ.prototype._getHighestOffset = function (messages) {

    var arr = [];

    _.map(messages, function (msg) {

        arr.push(msg.update_id);

    });

    return Math.max.apply(null, arr);
};

module.exports = DQ;