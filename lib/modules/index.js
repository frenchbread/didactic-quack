var m = require('moment');

exports.time = function (text) {
    return "Current time is: " + m().format("h:mma DD/MM/YYYY");
};

exports.log = function (text) {

    var data = text.split("|");

    var project = data[0].replace('/log', '');
    var hours = data[1];
    var details = data[2];

    if (project) {

        project = project.trim();

        if (hours) {

            hours = hours.trim();

            if (isFloat(hours)){

                if (details) {

                    details = details.trim();

                    var hour = {
                        project : project,
                        hours : hours,
                        details : details
                    };

                    return "project: " + hour.project + "\nhours: " + hour.hours + "\ndetails: " + hour.details;

                }else return "<details> missing.";

            }else return "<hours> must be <double> e.g 1.5"

        }else return "<hours> missing.";

    }else return "<project> missing.";
};

exports.default = function () {

    return "Hi there! \n \n" +
        "/time - returns current time. \n" +
        "/log <project(String)> | <hours(Double)> | <details(String)> - logs hours to db.";
};

function isFloat(value) {
    var x = parseFloat(value);
    return !isNaN(x);
}