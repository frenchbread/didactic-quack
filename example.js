var DQ = require('./');

// Options:
// - token (required)
// - parent (optional)

var dq = new DQ({
    "token": "your_api_token",
    parent : "your_telegram_id"
});

dq.getUpdates();