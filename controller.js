var rootFolder = "";

$(".shower-start-blur").hide();

var updateTimeline = function () {
  chakraSelection.time = 1 + .56;
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
  $("#time-output").html(chakraSelection.time.toFixed(2) + " min.");
      //<input id="time-line-range" name="time-line-range" type ="range" min="-2.5" max="3.0" step ="0.1"/>
}

var showerInit = function() {
  $(".shower-start-blur").show();
  var timer = setInterval(function() {
    if (stoneInput.pressed) {
      playShower();
      clearInterval(timer);
    }
  }, 1000); // call every 1000 milliseconds
}

var playShower = function() {
  var intro =  new Audio(rootFolder + 'audio/intro.mp3');
  intro.play();
  saveStoneState();
  setTimeout(function(){
    var audio = new Audio(rootFolder + 'audio/chakra_' + chakraSelection.playbackOrder[0] + '.mp3');
    audio.play(); stoneState.chakra = chakraSelection.playbackOrder[0];
    saveStoneState();
  }, 60000);
  for (i = 1; i < chakraSelection.playbackOrder.length; ++i) {
    var delay = (i * 120000) + 60000;
    var audioFile = rootFolder + 'audio/chakra_' + chakraSelection.playbackOrder[i] + '.mp3';
    setTimeout(function(audioFile, i){
      var audio = new Audio(audioFile);
      stoneState.chakra = chakraSelection.playbackOrder[i];
      audio.play();
      saveStoneState();
    }, delay, audioFile, i);
  }
  var outroDelay = (chakraSelection.playbackOrder.length * 120000) + 60000;
  setTimeout(function(){
    var outro = new Audio(rootFolder + 'audio/outro.mp3');
    outro.play();
    stoneState.chakra = 0;
    saveStoneState();
  }, outroDelay);
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
stoneState.chakra = 0;
stoneState.vibration = 0;


var stoneInput = new Object ();
stoneInput.pressed = false;

var getStoneInput = function() { // Get input from stone
  $.getJSON( "php/button.json", function( data ) {
    $.each( data, function( key, val ) {
      if (key == "button" && val) {
        stoneInput.pressed = true;
      } else {
        stoneInput.pressed = false;
      }
    });
  });
}


var saveStoneState = function () {
  console.log("savingState");
  var ajaxString = JSON.stringify(stoneState);
  console.log(ajaxString);
  $.ajax
    ({
        type: "GET",
        dataType : 'json',
        async: false,
        url: 'savejson.php',
        data: { data: ajaxString },
        success: function() {console.log("Thanks!"); },
        failure: function() {console.log("Error!");}
    });
}

window.setInterval(function(){ // Update input from stone
  getStoneInput();
}, 1000);

saveStoneState();
