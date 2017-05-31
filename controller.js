var rootFolder = "/mindfullSelector";

var updateTimeline = function () {
  chakraSelection.time = 0;
  $("#time-line").empty();
  for (i = 0; i < chakraSelection.playbackOrder.length; ++i) {

    $( "#time-line" ).append( '<div class="time-line-chakra time-line-chakra-' + chakraSelection.playbackOrder[i] +' show"></div>' );
  }
  for (var key in chakraSelection.chakra) {
    if (chakraSelection.chakra[key]) {
      chakraSelection.time += 2;
    }
  }
  console.log("Time: " + chakraSelection.time);
}

var updateTime = function () {
  $("#time-output").html(chakraSelection.time + " min.");
      //<input id="time-line-range" name="time-line-range" type ="range" min="-2.5" max="3.0" step ="0.1"/>
}

var playShower = function() {
  var audio = new Audio(rootFolder + '/audio/chakra_' + chakraSelection.playbackOrder[0] + '.wav');
  audio.play();
  for (i = 1; i < chakraSelection.playbackOrder.length; ++i) {
    var delay = i * 120000;
    var audioFile = rootFolder + '/audio/chakra_' + chakraSelection.playbackOrder[i] + '.wav';
    setTimeout(function(audioFile){
      var audio = new Audio(audioFile);
      audio.play();
    }, delay, audioFile);
  }

}



var toggleChakra = function (chakraNo) {
  var chakraNumber = parseInt(chakraNo.substring(6,7));
  if ($.inArray( chakraNumber, chakraSelection.playbackOrder ) == -1) {
     chakraSelection.playbackOrder.push(chakraNumber);
  } else {
    var index = chakraSelection.playbackOrder.indexOf(chakraNumber);
    chakraSelection.playbackOrder.splice(index, 1);
  }
  console.log(chakraSelection.playbackOrder);
  for (var key in chakraSelection.chakra) {
    if (chakraSelection.chakra.hasOwnProperty(key)) {
      if (chakraNo == key) {
        if (chakraSelection.chakra[key] == false) {
          chakraSelection.chakra[key] = true;
          $(".chakra-"+chakraNumber).addClass( "selected" );
        } else {
        chakraSelection.chakra[key] = false;
        $(".chakra-"+chakraNumber).removeClass( "selected" )
        }
      }
    }
  }
  updateTimeline();
  updateTime();
}

var updateSelection = function () {
  saveStoneState(chakraSelection);
}

// declare main Object
var chakraSelection = new Object ();
chakraSelection.time = 0;
chakraSelection.chakra = {
  chakra1 : false,
  chakra2 : false,
  chakra3 : false,
  chakra4 : false,
  chakra5 : false,
  chakra6 : false,
  chakra7 : false
}
chakraSelection.playbackOrder = [];

var stoneState = new Object ();
stoneState.zone = "head";
stoneState.vibration = true;


var saveStoneState = function (stoneObject) {
  $.ajax
    ({
        type: "GET",
        dataType : 'json',
        async: false,
        url: 'http://localhost/mindfullSelector/savejson.php',
        data: { data: JSON.stringify(stoneObject) },
        success: function () {alert("Thanks!"); },
        failure: function() {alert("Error!");}
    });
}
