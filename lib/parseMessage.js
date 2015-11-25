var logHours = require('./commands/logHours');
var m = require('moment');

module.exports = function(text) {

    text = text.trim();

    var toRespond = "";

    var splittedText = text.split(" ");

    switch (splittedText[0]) {

        case "/time":

            // return time
            toRespond = m().format("h:mma DD/MM/YYYY");

            return toRespond;

            break;

        case "/log":

            // logHours
            toRespond = logHours(text);

            return toRespond;

            break;

        default:

            // default message
            toRespond = "Hi there! \n \n" +
                "/time - returns current time. \n" +
                "/log <project(String)> | <hours(Double)> | <details(String)> - logs hours to db.";

            return toRespond;

    }
};