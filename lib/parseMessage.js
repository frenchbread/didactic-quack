var sendMessage = require('./send');
var logHours = require('./logHours');
var m = require('moment');

module.exports = function(text) {

    text = text.trim();

    var splittedText = text.split(" ");

    switch (splittedText[0]) {

        case "/time":

            sendMessage(m().format("h:mma DD/MM/YYYY"));

            break;

        case "/log":

            // logHours
            var response = logHours(text);

            sendMessage(response);

            break;

        default:

            sendMessage("Hi there! \n \n" +
                "/time - returns current time. \n" +
                "/log <project(String)> | <hours(Double)> | <details(String)> - logs hours to db.");

    }
};