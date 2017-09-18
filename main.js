"use strict"; 

process.chdir(__dirname);

const gt = require('./modules/gameTimer.js');
const ginformer = require('./modules/gameInformer.js');
const fs = require ("fs");


function run () {
  gt.init(5000);
  gt.on("game-changed", function(period){
    console.log("on game-changed");
    ginformer.sendReport("game-changed", period.game, period.start, period.end);
  });
}

/*
 @todo send form on shutdown
 @todo send form on start
 @todo tray icon
*/

run();