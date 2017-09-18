"use strict";

var gs = require('./gameScanner.js');


var GameTimer = function() {};

var checkTimeoutObj;
var gameWasRunning = false;
var scanPeriodMS = 5000;

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();




GameTimer.prototype.periods = [];
GameTimer.prototype.on = function(event, callback) {
    myEmitter.on(event, callback);
}

GameTimer.prototype.tick = function() {
    console.log('Scanning...');


    this.getCurrentGame((err, game) => {

        
        console.log("Periods", this.periods);


        if (err) {
            console.log('err');
            return;
        }

        if (!game) { // game stopped?

            if (gameWasRunning) {
                console.log("emit game-changed");
                myEmitter.emit('game-changed', this.periods[this.periods.length-1]);
            }

            gameWasRunning = false;
            return;

        } else if (
            (this.periods.length === 0) // empty periods
        ) {
            this.periods.push({
                game: game,
                start: Date.now(),
                end: Date.now()
            });
            
            gameWasRunning = true;
        } else if (
            (this.periods[this.periods.length-1].game !== game) // not the same game
        ) {
            myEmitter.emit('game-changed', this.periods[this.periods.length-1]);

            this.periods.push({
                game: game,
                start: Date.now(),
                end: Date.now()
            });

            gameWasRunning = true;
        } else if (this.periods[this.periods.length-1].game === game) {

            // if last game was running more than 5 minute ago
            // then start new period

            if (this.periods[this.periods.length-1].end < (Date.now() - 60*1000)) { 
                this.periods.push({
                    game: game,
                    start: Date.now(),
                    end: Date.now()
                });
            } else {
                this.periods[this.periods.length-1].end = Date.now();
            }

            gameWasRunning = true;
        }

        
        
    });
}

GameTimer.prototype.setNewTimeout = function() {
    checkTimeoutObj = setTimeout(()=>{
        this.tick();
        this.setNewTimeout();
    }, scanPeriodMS);
}

GameTimer.prototype.getCurrentGame = function(callback){
    gs.scan(false, (err, process) => {
        if (err) {
            console.error("Error", err);
            callback(err, null)
        }
        console.log('scan complete', process);

        callback(null, process);
    });

}

GameTimer.prototype.init = function (period){
    if (period) {
        scanPeriodMS = period;
    }
    this.setNewTimeout();
}



module.exports = new GameTimer();