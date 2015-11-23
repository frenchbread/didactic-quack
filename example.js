var config = require('./config');
var DQ = require('./');

var dq = new DQ({
    "parent": config.get("parent_id"),
    "host": config.get("host"),
    "token": config.get("api_token")
});

dq.getUpdates();