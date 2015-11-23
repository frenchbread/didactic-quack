var config = require('./config');
var Bot = require('./');

var b = new Bot({
    "parent": config.get("parent_id"),
    "host": config.get("host"),
    "token": config.get("api_token")
});

b.getUpdates();