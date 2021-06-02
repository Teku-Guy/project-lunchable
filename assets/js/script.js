var startBtn = $("#start");
var pauseBtn = $("#pause");
var resetBtn = $("#reset");
var timerEl = $("#timer");

var timer;

var apiKeyYT = 'AIzaSyDlaG8-63OAjGuE5gbPJQILNHz2fGH1qC8';
var q = makeid(3);
var ytURL = 'https://www.googleapis.com/youtube/v3/search?key='+ apiKeyYT +'&maxResults=1&part=snippet&type=video&q='+ q;
var dadJokeURL = 'https://dad-jokes.p.rapidapi.com/random/joke';

function makeid(length = 10) {
  //gen random string to look into youtubes api
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
 return result.join('');
}

function startTimer() {
  var presentTime = timerEl.text(); //set 25min timer
  var timeArry = presentTime.split(/[:]+/); //split the the time into min and sec in an array
  var m = timeArry[0]; //set min to 25
  var s = checkSecond(timeArry[1] - 1); //we check if sec is 00 then reset to 59
  if (s == 59) {
    m = m - 1;
  }

  if (m == 0) {
    m = "00";
  }

  timerEl.text(m + ":" + s);

  if (m == 0 && s == 00) {
    clearInterval(timer);
    console.log("times up!");
    alertUser();
  }
}

function checkSecond(sec) {
  // add zero in front of numbers < 10
  if (sec < 10 && sec >= 0) {
    sec = "0" + sec;
  }
  if (sec < 0) {
    sec = "59";
  }
  return sec;
}

function pauseTimer() {
  startBtn.prop("disabled", false);
  clearInterval(timer);
}

function resetTimer() {
  startBtn.prop("disabled", false);
  clearInterval(timer);
  timerEl.text("25:00");
}

function alertUser() {
  var alarm = new Audio("./assets/mp3/siren.mp3");
  alarm.loop = true;
  alarm.play();
  //opens modal
  $('.modal').modal('open');
  $('#dismiss').on('click', function(){
    genDadJoke();
    genYTVid();
    alarm.pause();
  });
}

startBtn.on("click", function () {
  startBtn.prop("disabled", true);
  timer = setInterval(startTimer, 1000);
});
pauseBtn.on("click", pauseTimer);
resetBtn.on("click", resetTimer);

$(document).ready(function(){
  $('.modal').modal();
  $('.sidenav').sidenav();
});

function genDadJoke() {
  fetch(dadJokeURL, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "7b1a003bf5msh1ca0da65978ae8cp106aebjsn81c5d0c4c3de",
      "x-rapidapi-host": "dad-jokes.p.rapidapi.com"
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(response) {
    console.log(response);
    $('#t').text(response.body[0].setup);
    $('#p').text(response.body[0].punchline);
  })
  .catch(function(err) {
    console.error(err);
  });
}

function genYTVid() {
  fetch(ytURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(response) {
    console.log(response);
    vidID = response.items[0].id.videoId;
    $('#p1').append("<iframe height='200px' width='200px' src='https://www.youtube.com/embed/"+response.items[0].id.videoId +"'></iframe>");
    //$('#p1').text(response);
  })
  .catch(function(err) {
    console.error(err);
  });
}
