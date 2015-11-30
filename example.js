var DQ = require('./');

var dq = new DQ({
    token: "",
    parent: ""
});

setInterval(function () {

    dq.getUpdates();

}, 3000);