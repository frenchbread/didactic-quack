var config = require('./config');
var Bot = require('./bot');

var b = new Bot({
    "host": config.get("host"),
    "token": config.get("api_token")
});

b.getUpdates();