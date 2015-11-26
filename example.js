var DQ = require('./');

var dq = new DQ({
    "parent": "your_telegram_id",
    "host": "https://api.telegram.org/bot",
    "token": "your_api_token"
});

dq.getUpdates();