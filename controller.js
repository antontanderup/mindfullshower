var updateTimeline = function () {
  chakraSelection.time = 0;
  for (var key in chakraSelection.chakra) {
    if (chakraSelection.chakra[key]) {
      chakraSelection.time += 2;
      $(".time-line-chakra-" + key.substring(6,7)).addClass("show");
    } else {
      $(".time-line-chakra-" + key.substring(6,7)).removeClass("show");
    }
  }
  console.log("Time: " + chakraSelection.time);
}

var updateTime = function () {
  $("#time-output").html(chakraSelection.time);
      //<input id="time-line-range" name="time-line-range" type ="range" min="-2.5" max="3.0" step ="0.1"/>
}



var toggleChakra = function (chakraNo) {
  var chakraNumber = chakraNo.substring(6,7);
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
