'use strict';

const util = require('util');

const _ = require('underscore');
const request = require('request');
const URL = require('url');
const string = require('string');
const logger = require('intel');

const modulesList = require('./lib/modulesList');
const modules = require('./lib/modules');

// Class constructor
const DQ = function (params) {

    this._token = params.token;

    this._host = URL.format({
        protocol: "https",
        host: "api.telegram.org",
        pathname: "bot"
    });

    this._parent = (typeof params.parent === 'undefined') ? null : params.parent;

    this._recipient = null;

    this._offset = 0;

    this._getUpdatesUrl = this._host + this._token + "/getUpdates";

    this._sendMessageUrl = this._host + this._token + "/sendMessage";

    this._moduleList = (typeof params.moduleList === 'undefined') ? modulesList : params.moduleList;

    this._modules = (typeof params.modules === 'undefined') ? modules : params.modules;

    this._reqGet = (cb) => {

      const url = this._getUpdatesUrl + "?offset=" + this._offset;

      request(url, (err, res, body) => {

          if (err) cb(err);

          const bodyObj = JSON.parse(body);

          if (bodyObj.ok) {

              const messages = bodyObj.result;

              if (messages.length > 0) {

                  this._updateOffset(messages);

                  cb(null, messages);

              } else {

                  logger.info("No new messages..");

                  return cb(undefined, []);
              }

          } else return cb(new Error("Response looks wrong.."), undefined);

      });
    }

    this.sendMessage = (to, text) => {

      const prefix = "?chat_id=" + to + "&text=" + text;

      request(this._sendMessageUrl + prefix, (err, response, body) => {

          if (err) logger.error(err);

          logger.info("Message sent.");
      });
    }

    this.getUpdates = (cb) => {

      this._reqGet((err, messages) => {

          if (err) cb(err);

          if (messages.length > 0) {

            this._eachMessage(messages, (err, msgs) => {

                if (err) logger.error(err);

                this.sendMessage(this._recipient, msgs);
            });
          }
      });
    }

    this._eachMessage = (msgs, cb) => {

      _.each(msgs, (msg) => {

          this._recipient = msg.message.from.id;

          const text = msg.message.text;

          if (this._hasCommand(text)){

              const moduleName = this._getCommandName(text);

              cb(null, this._modules[moduleName](text));
          } else {

              // Call default module
              cb(null, this._modules.default());
          }
      });
    }

    this._hasCommand = (text) => {

      const modules = this._moduleList;

      for (let key in modules) {

          if (modules.hasOwnProperty(key)) {

              if (string(text).contains(modules[key])) return true;
          }
      }

      return false;
    }

    this._getCommandName = (text) => {

      const modules = this._moduleList;

      for (let key in modules) {

          if (modules.hasOwnProperty(key)) {

              if (string(text).contains(modules[key])) return key;
          }
      }
    }

    this._updateOffset = (messages) => {

      this._offset = this._getHighestOffset(messages) + 1;
      logger.info("Updating offset..");
    }

    this._getHighestOffset = (messages) => {

      let arr = [];

      _.map(messages, (msg) => {

          arr.push(msg.update_id);
      });

      return Math.max.apply(null, arr);
    }
};

util.inherits(DQ, require('events').EventEmitter);

module.exports = DQ;
