// a simple variable will store the GCM-ID for now, will be replaced with a database in the future
var tempGcmId = null;

var express = require('express');
var app = express();
var gcm = require('node-gcm');
var config = require('./config');

// print the current GCM-Id to the browser
app.get('/', function(req, res) {
    if (tempGcmId == null) {
        res.send('Id not set! Just run the app and reload the page. You should see a GCM-id after that.');
    } else {
        res.send('Id is ' + tempGcmId);
    }

});

// set the current GCM-ID (will override the old one) 
app.get('/setGcmId', function(req, res) {
    var id = req.param('id');
    tempGcmId = id;

    res.send('Id set: ' + id);
});


app.post('/ring', function(req, res) {
	// check if a GCM-client id is known to the server.
	// The BigRedButton-App will tell the server the GCM-id via the route /setGcmId and only after this happened
	// the /ring-action can be executed successfully. Currently the GCM-ID will be lost if the server is restarted, because it's not stored persistent.
    if (tempGcmId == null) {
    	 // internal server error
    	res.statusCode = 500;
        res.send('Id not set!');
        return;
    }

    // Preparing the GCM message which will be delivered to the device via Google Servers
    // Look here for more information on the parameters: https://github.com/ToothlessGear/node-gcm
    var message = new gcm.Message({
        priority: 10,
        timeToLive: 0,
        delayWhileIdle: false
    });

    // It is required to obtain a API-Key from Google to use GCM.
    // More information are available here: https://support.google.com/googleplay/android-developer/answer/2663268
    var sender = new gcm.Sender(config.gcm.apikey);

    // Adding the registration IDs of the devices we want to send to
    // The alarm could possibilty go to more than one device, but at the current stage we are sending it
    // to exactly one. 
    var registrationIds = [];
    registrationIds.push(tempGcmId);

    // Send the message 
    sender.send(message, registrationIds, function(err, result) {
        if (err) {
            console.error(err);

            // Oops... something went wrong!
            res.statusCode = 500; // internal server error
            res.send(err);
        } else {
        	res.statusCode = 200; // OK

            console.log(result);
            res.send(result);
        }
    });
});

// TODO => create a config file to configure server-port etc.
app.listen(config.port)