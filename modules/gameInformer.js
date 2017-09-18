"use strict";

var request = require('request');
var dateformat = require('dateformat');

var GameInformer = function(){};

var osHostname = require("os").hostname();


GameInformer.prototype.sendReport = function(action, exe, start, end){
    console.log('Sending report', action, exe, start, end);



    let dateStart = dateformat(new Date(start), "dd.mm.yyyy HH:MM");
    let dateEnd = dateformat(new Date(end), "dd.mm.yyyy HH:MM");
    let period = Math.round((end-start)/1000/60)/60;

    let formData = {
        "entry.1994810600": "".concat(osHostname), // box (computer name)
        "entry.160681180": action?action:"n/a", // action
        "entry.51990253": exe?exe:"n/a", // exe
        "entry.1273322440": start?dateStart:"n/a", // game started
        "entry.89521771": end?dateEnd:"n/a", // game ended
        "entry.1503324095": (end && start) ? period.toString().replace('.', ',') : "n/a"
    }

    console.log(formData);

    request.post({
        url: 'https://docs.google.com/forms/d/1D9ZhcL-7ndvuL7R1jzxMp81GFtT9KScbjGBKZVQ2pz0/formResponse',
        form: formData
    }, function(err, httpResponse, body){
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!');
    })
}


module.exports = new GameInformer();