// a simple variable will store the GCM-ID for now, will be replaced with a database in the future
var tempGcmId = null;

var express = require('express');
var app = express();
var gcm = require('node-gcm');
var config = require('./config');

// print the current GCM-Id to the browser
app.get('/', function (req, res) {
  if (tempGcmId == null)
  {
 	res.send('Id not set!');
  } else {
  	res.send('Id is ' + tempGcmId);
  }

});

// set the current GCM-ID (will override the old one) 
app.get('/setGcmId', function (req, res) {
  var id = req.param('id');
  tempGcmId = id;

  res.send( 'Id set: ' + id );
});


app.get('/ring', function (req, res) {
  if (tempGcmId == null)
  {
    res.send('Id not set!');
  } else {
    var message = new gcm.Message();

    // ... or some given values
    var message = new gcm.Message({
		    contentAvailable: true,
		    delayWhileIdle: false,
    });

    message.addData('key1','message1');

    var sender = new gcm.Sender(config.gcm.apikey);

    console.log(config.gcm.apikey);
	 
    // Add the registration IDs of the devices you want to send to 
    var registrationIds = [];
    registrationIds.push(tempGcmId);

    // Send the message 
    // ... trying only once 
    sender.sendNoRetry(message, registrationIds, function(err, result) {
	      if (err) 
	      {
	      	console.error(err);
	      	res.send(err);
	      } else {
			console.log(result);
			res.send(result);
	      }    
      });
	}
});

// TODO => create a config file to configure server-port etc.
app.listen(config.port)