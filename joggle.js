$( document ).ready(
  function() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function(reg) {
          console.log('Service worker registration succeeded');
        })
        .catch(function(error) {
          console.log('Service worker registration failed', error);
        });
    }
    // Initial resize
    resizeReaction();
	
	//listen to shake event
	var shakeEvent = new Shake({threshold: 4});
	shakeEvent.start();
	window.addEventListener('shake', function(){
		changeLetters();
	}, false);

	//stop listening
	function stopShake(){
		shakeEvent.stop();
	}

	//check if shake is supported or not.
	if(!("ondevicemotion" in window)){console.log("Not Supported");}
  }
);

function resizeReaction() {
  if (window.innerWidth + 70 > window.innerHeight) {
    var height = window.innerHeight - 65;
    var adjHeight = height - 15;
    if (adjHeight < 300) {
      var scaleFactor = adjHeight / 305;
      height = window.innerHeight - (scaleFactor * 60) - 10;
    }
    setBoardSize(height);
  }
  else {
    setBoardSize(window.innerWidth);
  }
}

function setBoardSize(sizeInPixels) {
  console.log(sizeInPixels);
  var heightAndWidth = sizeInPixels - 135;
  if (heightAndWidth < 116) {
    heightAndWidth = 116;
  }

  if (heightAndWidth < 300) {
    var scaleFactor = heightAndWidth / 300;
    document.getElementById("gameInfo").style.transform = "scale(" + scaleFactor + ")";
  }

  var fontSize = Math.floor(0.162 * heightAndWidth);


  document.getElementById("boardContainer").style.width = heightAndWidth + "px";
  document.getElementById("boardContainer").style.height = heightAndWidth + "px";

  $('.letterCube').css('font-size', fontSize + "px");
}

var audio;
function changeLetters() {
  audio = new Audio('http://www.noiseaddicts.com/samples_1w72b820/3721.mp3'); audio.play(); audio.pause();
  var orient = true;
  var rotationPosibilities = ["rotate(90deg)", "rotate(180deg)", "rotate(270deg)", "rotate(0deg)"];
  var lettersWithUnderline = ["M", "W", "Z"]; //Sometimes N has an underline
  var cubeArray_newBoggle = [["A", "A", "E", "E", "G", "N"],
                   ["A", "B", "B", "J", "O", "O"],
                   ["A", "C", "H", "O", "P", "S"],
                   ["A", "F", "F", "K", "P", "S"],
                   ["A", "O", "O", "T", "T", "W"],
                   ["C", "I", "M", "O", "T", "U"],
                   ["D", "E", "I", "L", "R", "X"],
                   ["D", "E", "L", "R", "V", "Y"],
                   ["D", "I", "S", "T", "T", "Y"],
                   ["E", "E", "G", "H", "N", "W"],
                   ["E", "E", "I", "N", "S", "U"],
                   ["E", "H", "R", "T", "V", "W"],
                   ["E", "I", "O", "S", "S", "T"],
                   ["E", "L", "R", "T", "T", "Y"],
                   ["H", "I", "M", "N", "U", "Qu"],
                   ["H", "L", "N", "N", "R", "Z"]];
    cubeArray_newBoggle = shuffle(cubeArray_newBoggle);

    var cubeArray_classicBoggle = [["A", "A", "C", "I", "O", "T"],
                   ["A", "B", "I", "L", "T", "Y"],
                   ["A", "B", "J", "M", "O", "Qu"],
                   ["A", "C", "D", "E", "M", "P"],
                   ["A", "C", "E", "L", "R", "S"],
                   ["A", "D", "E", "N", "V", "Z"],
                   ["A", "H", "M", "O", "R", "S"],
                   ["B", "I", "F", "O", "R", "X"],
                   ["D", "E", "N", "O", "S", "W"],
                   ["D", "K", "N", "O", "T", "U"],
                   ["E", "E", "F", "H", "I", "Y"],
                   ["E", "G", "K", "L", "U", "W"],
                   ["E", "G", "I", "N", "T", "V"],
                   ["E", "H", "I", "N", "P", "S"],
                   ["E", "L", "P", "S", "T", "U"],
                   ["G", "I", "L", "R", "U", "W"]];
  cubeArray_classicBoggle = shuffle(cubeArray_classicBoggle);

  var values = $('.letterCube');
  for (var i = 0; i < values.length; i++) {
    var cubeSide = Math.floor(Math.random() * 6);
    var letter = cubeArray_newBoggle[i][cubeSide];
    var html = letter;
    if (contains(lettersWithUnderline, letter) && orient) {
      html += "<div class='underline'></div>";
    }

    values[i].innerHTML = html;
    setupTimer();

    if (orient) {
      var cubeRotation = Math.floor(Math.random() * 4);
      values[i].style.transform = rotationPosibilities[cubeRotation];
    }
  }
}

var overallTimerNumber = 0;

function setupTimer(timerNumber=-1, timeAllowed=120000, startTime=(new Date()).getTime()) {
  if (timerNumber == -1) {
    overallTimerNumber += 1;
    timerNumber = overallTimerNumber;
    $("#timeRemaining").show(80);
    $("#timeRemaining").html("2:00");
    setTimeout(function() { if (timerNumber == overallTimerNumber && audio) {audio.play(); }}, 119050)
  }

  window.setTimeout(
    function(){
      if (timerNumber != overallTimerNumber) {
        return;
      }

      var timeLeft = timeAllowed - ((new Date()).getTime() - startTime);

      if (timeLeft <= 0) {
        $("#timeRemaining").html("0:00");

      }
      else {
        var minutes = Math.floor(timeLeft / 60000);
        var seconds = Math.floor((timeLeft - (60000*minutes))/1000);
        $("#timeRemaining").html(minutes + ":" + pad(seconds, 2));
        setupTimer(timerNumber, timeAllowed, startTime);
      }
    }, 250);
}

//stack overflow
function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}


//stack overflow
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//stackoverflow
function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}
