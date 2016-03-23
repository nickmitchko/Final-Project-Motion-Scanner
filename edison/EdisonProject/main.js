// Author       : Nicholai Mitchko
// Date         : 3/16/2016
// File         : main.js
// Description  : javascript file that collects motion sensor data and inputs it into a database
// Platform     : Intel Edison

var MotionSensorPin = 13;                                   // Run the motion sensor on pin 13
var mraa = require('mraa');                                 // Setup Code to Include The GPIO Library
var motionInputSensor = new mraa.Gpio(MotionSensorPin);     // Get the MotionSensor input on whatever pin in defined in MotionSensorPin
motionInputSensor.dir(mraa.DIR_IN);                         // Make Sure the GPIO Pin in set on input mode
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
        if (!err)
            console.log('Values Updated: ' + zones[0]);
        else
            console.log("Query Error" + err);
    });
}

function resetZones(){
    zones = new Array(false, false, false, false, false);
}

function checkForMotion(){
    if(motionInputSensor.read() == 1){
          zones[0] = true;
    }
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

setInterval(checkForMotion, 10);
setInterval(updateDatabase,5000);
setInterval(resetZones, 5000);

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
