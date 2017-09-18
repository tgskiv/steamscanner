"use strict";

const psTree = require('ps-tree')
const psNode = require('ps-node')

const notAGames = ["steamwebhelper.exe", "GameOverlayUI.exe", "steamerrorreporter.exe"];


var GameScanner = function() {};



GameScanner.prototype.scan = function(multiple, callback){


  psNode.lookup({
    command: 'Steam.exe',
  }, (err, resultList) => {

      if (err) {
          callback(err, false);
          return;
      }
  
      if (!resultList || resultList.length===0) {
          callback(null, false);
      }

      resultList.forEach(( process ) => {
          // each Steam.exe process
          if( process ){
                console.log( "Steam process found with pid = ", process.pid );

                this.getChildGame(process.pid, (err, child) => {
                    if (err) {
                        return;
                    }
                    
                    callback(null, child);
                });
          }
      });
  });

}


GameScanner.prototype.getChildGame = function(pid, callback){
    psTree(pid, (err, children) => {
        if (err) {
            callback(err, false);
            return;
        }

        if (!children.some((child, index) => {
            if (!(notAGames.indexOf(child.COMMAND) >= 0)) {
                callback(null, child.COMMAND)
                return true;
            }
        })) {
            callback(null, false); // if not found
        }

        
    });
}

module.exports = new GameScanner();