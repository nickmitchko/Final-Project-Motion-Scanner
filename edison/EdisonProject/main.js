// Author       : Nicholai Mitchko
// Date         : 3/16/2016
// File         : main.js
// Description  : javascript file that collects motion sensor data and inputs it into a database
// Platform     : Intel Edison
var mraa = require('mraa');                                 // Setup Code to Include The GPIO Library
var motionInputSensor = new mraa.Gpio(13);                  // Get the MotionSensor input on whatever pin in defined in MotionSensorPin
var motionInput2      = new mraa.Gpio(7);
var motionInput3      = new mraa.Gpio(8);
motionInputSensor.dir(mraa.DIR_IN);                         // Make Sure the GPIO Pin in set on input mode
motionInput2.dir(mraa.DIR_IN);
motionInput3.dir(mraa.DIR_IN);
var tunnel = require('tunnel-ssh');
var credentials = require('./credentials');
/*var ContrastPin = 10;
var contrastPinopt = new mraa.Pwm(10);
contrastPinopt.enable(true);
contrastPinopt.write(70);*/
var mysql = require('mysql');                               // Setup code to include database functionality
/*var LCDEnabled = true;
var lcd = require('lcd'),
    lcd = new lcd({rs: 3, e: 2, data:[4,5,6,7], cols: 16, rows: 2});*/
var config = {
        host: credentials.sshCredentials[0],
        username: credentials.sshCredentials[1],
        dstPort: 3306,
        password: credentials.sshCredentials[2]
};
var server = tunnel(config, function (error, result) {
        console.log('connected');
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     :  credentials.databaseCredentials[0],
  password : credentials.databaseCredentials[1],
  database : credentials.databaseCredentials[0]
});

connection.connect();

var zones = new Array(false, false, false, false, false);

function updateDatabase(){
    connection.query('UPDATE mitchko.motion SET zone1=' + (zones[0] ? 'TRUE': 'FALSE') + ' where id=1', function(err, rows, fields) {
    });
}

function resetZones(){
    zones = new Array(false, false, false, false, false);
}

function checkForMotion(){
    zones[0]= motionInputSensor.read() == 1? true: false;
    zones[1]= motionInput2.read() == 1? true: false;
    zones[2]= motionInput3.read() == 1? true: false;

}

function end(){
/*    lcd.clear();
    lcd.close();*/
    connection.end(function (err){
        // Closes the mysql connection
    });
    server.close();
    process.exit();
}

setTimeout(function(){
    setInterval(checkForMotion, 100);
    setInterval(updateDatabase,5000);
    setInterval(resetZones, 5000);
    setInterval(function (){console.log(zones);}, 5001);
}, 15000);

process.on('SIGINT', function () {
    end();
});

process.on('SIGTSTP', function(){
    end();
});

/*
lcd.on('ready', function(){
    lcd.setCursor(16,0);
    lcd.autoscrool();
    lcd.print('Hello', 0);
});*/
