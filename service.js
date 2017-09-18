"use strict"; 



function usage () {
	console.log ("usage: node periodic-logger --add <name>");
	console.log ("       node periodic-logger --remove <name>");
	console.log ("       node periodic-logger --run");
	process.exit (-1);
}

/*
 @todo send form on shutdown
 @todo send form on start
 @todo tray icon
*/


var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'SteamLogger',
  description: 'SteamLoggerService',
  script: require('path').join(__dirname,'main.js')
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

svc.on('alreadyinstalled',function(){
  console.log('This service is already installed.');
});

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start',function(){
    console.log("Started.");
});

svc.install();