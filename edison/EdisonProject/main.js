// Author       : Nicholai Mitchko
// Date         : 3/16/2016
// File         : main.js
// Description  : javascript file that collects motion sensor data and inputs it into a database
// Platform     : Intel Edison

var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { console.log(stdout); }

var MotionSensorPin = 13;                                   // Run the motion sensor on pin 13
var mraa = require('mraa');                                 // Setup Code to Include The GPIO Library
var motionInputSensor = new mraa.Gpio(MotionSensorPin);     // Get the MotionSensor input on whatever pin in defined in MotionSensorPin
motionInputSensor.dir(mraa.DIR_IN);                         // Make Sure the GPIO Pin in set on input mode

var mysql = require('mysql');                               // Setup code to include database functionality
var connection = mysql.createConnection({
  host     : 'localhost:3306',
  user     : 'mitchko',
  password : 'mMpGCQAH',
  database : 'mitchko'
});

connection.connect();

connection.query('SELECT * from `boringclub`', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log(err);
});

connection.end();