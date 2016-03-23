/**
 * Created by Nicholai on 3/1/2016.
 */

$(document).ready(function(){
    updateValues();
    setInterval(updateValues, 5000);
});

function updateValues (){
    $.ajax({url: "main.php", success: function(result){
        console.log(result);
        $('#movement').html(result);
    }});
}