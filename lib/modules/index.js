var m = require('moment');

exports.time = function (text) {
    return "Current time is: " + m().format("h:mma DD/MM/YYYY");
};

exports.log = require('./log');

exports.default = function () {

    return "Hi there! \n \n" +
        "/time - returns current time. \n" +
        "/log <project(String)> | <hours(Double)> | <details(String)> - logs hours to db.";
};