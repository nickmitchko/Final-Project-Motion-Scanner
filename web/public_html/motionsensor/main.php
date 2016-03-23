<?php

@include '../../include/dbconn.php';

$dbc = connect_to_db('mitchko');
$var = perform_query_select($dbc, 'SELECT * FROM mitchko.motion where id="1"',array());
print_r($var);