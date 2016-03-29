// Author       : Nicholai Mitchko
// Date         : 3/16/2016
// File         : main.js
// Description  : javascript file that collects motion sensor data and inputs it into a database
// Platform     : Intel Edison

var mraa = require('mraa');                                 // Setup Code to Include The GPIO Library

var motionInput1 = new mraa.Gpio(13);                       // Pin: 13 Get the MotionSensor input on certain physical pins
var motionInput2 = new mraa.Gpio(7);                        // Pin: 7
var motionInput3 = new mraa.Gpio(8);                        // Pin: 8
var motionInput4 = new mraa.Gpio(9);                        // Pin: 9
var motionInput5 = new mraa.Gpio(10);                       // Pin: 10

motionInput1.dir(mraa.DIR_IN);                              // Make Sure the GPIO Pins in set on input mode
motionInput2.dir(mraa.DIR_IN);
motionInput3.dir(mraa.DIR_IN);
motionInput4.dir(mraa.DIR_IN);
motionInput5.dir(mraa.DIR_IN);

// Tunnel to CSCILAB so we can connect to the database
var tunnel = require('tunnel-ssh');

// Get credentials to login and run sql commands
var credentials = require('./credentials');

// Get library to connect to the database
var mysql = require('mysql');                               // Setup code to include database functionality

// SSH configuration:
// Maps local intel edison port to remote sql port for ease of use
//      * means we can connect to a remote sql server on the local internet ports
var config = {
    host: credentials.sshCredentials[0],
    username: credentials.sshCredentials[1],
    dstPort: 3306,
    password: credentials.sshCredentials[2]
};

// After setup open ssh connection
var server = tunnel(config, function (error, result) {
    if(error){

        process.quit();
    }
    console.log('connected');
});

// Once tunneled setup the database connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: credentials.databaseCredentials[0],
    password: credentials.databaseCredentials[1],
    database: credentials.databaseCredentials[0]
});

// Connect to the DB
connection.connect();

// Variable to hold movement values
var zones = new Array(false, false, false, false, false);

// Function to insert the values to a database
function updateDatabase() {
    connection.query('UPDATE mitchko.motion SET zone1=' + (zones[0] ? 'TRUE' : 'FALSE') +
        ' zone2=' + (zones[1] ? 'TRUE' : 'FALSE') +
        ' zone3=' + (zones[2] ? 'TRUE' : 'FALSE') +
        ' zone4='+(zones[3] ? 'TRUE': 'FALSE') +
        ' zone5='+(zones[4] ? 'TRUE': 'FALSE') +
        ' where id=1', function (err, rows, fields) {
        if(err){
            console.log("Error: Bad Value Update, Shutting Down");
            end();
        }
    });
    resetZones();
}

// Adds to the motion History
function insertIntoHistory(){
    var id = "";
    connection.query('SELECT id from mitchko.motionHistory order by motionTime asc limit 1', function(err, rows, fields){
        if(!err){
            id = rows[0][0];
        } else {
            console.log("Error: couldn't Access motion History");
            end();
        }
    });
    connection.query('INSERT INTO mitchko.motionHistory (id, bitId, motionTime) VALUES()',
        function (err, rows, fields){
            if(err){
                console.log("Error: Bad Motion Insert, Shutting Down");
                end();
            }
    });
}

// Reset Movement Data, called in zones
function resetZones() {
    zones = new Array(false, false, false, false, false);
}

// Reads the IO pin for motion values from the sensor
function checkForMotion() {
    // If the zone had motion in it (zone[n] == true) keep the zone true
    // OR
    // If the motion sensor shows motion (motionInput1.read() == 1)
    zones[0] = zones[0] == true || motionInput1.read() == 1 ? true : false;
    zones[1] = zones[1] == true || motionInput2.read() == 1 ? true : false;
    zones[2] = zones[2] == true || motionInput3.read() == 1 ? true : false;
    zones[3] = zones[3] == true || motionInput4.read() == 1 ? true : false;
    zones[4] = zones[4] == true || motionInput5.read() == 1 ? true : false;
}
// Give the Sensors 15 seconds to warm up :)
setTimeout(function () {
    setInterval(checkForMotion, 5);     // Run Motion check every 5 milliseconds
    setInterval(updateDatabase, 15000);  // Update the database every 15 seconds, (15 second Motion-Window)
}, 15000);

// The following code is for proper shutdown functions regarding SSH & SQL Tunneling

function end() {
    /*    lcd.clear();
     lcd.close();*/
    connection.end(function (err) {
        if(err){
            console.log("Error: Couldn't close MySQL connection");
        }
        // Closes the mysql connection
    });
    server.close();
    process.quit();
}

process.on('SIGINT', function () {
    end();
});

process.on('SIGTSTP', function () {
    end();
});

/* LCD Code if I want to add it
 lcd.on('ready', function(){
 lcd.setCursor(16,0);
 lcd.autoscrool();
 lcd.print('Hello', 0);
 });*/
