var getUpdates = require('./lib/core');

var CronJob = require('cron').CronJob;

new CronJob('*/5 * * * * *', function() {

    getUpdates();

}, null, true, 'America/Los_Angeles');

