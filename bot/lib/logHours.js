var Hours = require('../models/hours');

module.exports = function (text) {

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

                    var hour = new Hours({
                        project : project,
                        hours : hours,
                        details : details
                    });

                    hour.save(function (err) {

                        if (err) console.log(err);

                    });

                    return "project: " + hour.project + "\nhours: " + hour.hours + "\ndetails: " + hour.details;

                }else return "<details> missing.";

            }else return "<hours> must be <double> e.g 1.5"

        }else return "<hours> missing.";

    }else return "<project> missing.";
};

function isFloat(value) {
    var x = parseFloat(value);
    return !isNaN(x);
}