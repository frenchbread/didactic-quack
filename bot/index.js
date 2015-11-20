var CronJob = require('cron').CronJob;
var getUpdates = require('./lib/core');

var Bot = function (params) {

    this.host = params.host;
    this.token = params.token;
};

Bot.prototype.getUpdates = function () {

    var self = this;

    new CronJob('*/5 * * * * *', function() {

        getUpdates(self.host, self.token);

    }, null, true, 'America/Los_Angeles');
};

module.exports = Bot;