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
    this._httpGetUpdatesUrl = this._host + this._token + "/getUpdates";
    this._sendMessageUrl = this._host + this._token + "/sendMessage";
    this._moduleList = (typeof params.moduleList === 'undefined') ? modulesList : params.moduleList;
    this._modules = (typeof params.modules === 'undefined') ? modules : params.modules;

    this.listen = (cb) => {

      setInterval(() => {

        this._getUpdates((err) => {
          if (err) cb(er);
        });

      }, 3000);
    }

    this.send = (data, cb) => {

      const to = data.to;
      const text = data.text;

      const url = this._sendMessageUrl + "?chat_id=" + to + "&text=" + text;

      request(url, (err, response, body) => {

          if (err) cb(err);
      });
    }

    this._httpGet = (cb) => {

      const url = this._httpGetUpdatesUrl + "?offset=" + this._offset;

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

                  return cb(null);
              }

          } else return cb("Response looks wrong..");

      });
    }

    this._getUpdates = (cb) => {

      this._httpGet((err, messages) => {

          if (err) cb(err);

          this._eachMessage(messages, (err, message) => {

              if (err) logger.error(err);

              this.emit('message', message);
          });
      });
    }

    this._eachMessage = (msgs, cb) => {

      _.each(msgs, (msg) => {

          const to = this._recipient = msg.message.from.id;
          const text = msg.message.text;

          let obj = {
            to,
            text
          }

          if (this._hasCommand(text)){

              const moduleName = this._getCommandName(text);

              obj.module = this._modules[moduleName](text);

              cb(null, obj);
          } else {

              obj.module = this._modules.default();

              // Call default module
              cb(null, obj);
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
