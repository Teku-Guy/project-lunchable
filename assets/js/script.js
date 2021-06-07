var startBtn = $("#start");
var pauseBtn = $("#pause");
var resetBtn = $("#reset");
var timerEl = $("#timer");

var pName = $('#pName');
var pTime = $('#pTime');
var pSubmitBtn = $('#pSubmit');
var savedPresets = JSON.parse(localStorage.getItem("presets")) || [];
var presetsArry = [];

var timer;
var sessionTypeEl = $('#sessionType');
var workStatus = true;
var counter = 0;

var pomoCounter = 0;

var apiKeyYT = 'AIzaSyDlaG8-63OAjGuE5gbPJQILNHz2fGH1qC8';
var q = makeid(3);
var ytURL = 'https://www.googleapis.com/youtube/v3/search?key=' + apiKeyYT + '&maxResults=1&part=snippet&type=video&q=' + q;
var dadJokeURL = 'https://dad-jokes.p.rapidapi.com/random/joke';

function makeid(length = 10) {
  //gen random string to look into youtubes api
  var result = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
}

function startTimer() {
  loadPreset();
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
    startBtn.prop("disabled", false);
    if(counter == 0){
      checkStatus(true);
      debugger
      counter++;
    } else if(counter == 1){
      checkStatus(false);
      counter--;
    }
  }
}

function checkStatus(a){
  pomoCounter--;
  if(pomoCounter = 0){
    alert('done');
  }
  if(a){
    return workStatus = false;
  }
  if(!a) {
    sessionTypeEl.text('Work');
    return workStatus = true;
  }
}

function setBreakTimer(){
  timerEl.text('00:02');
  sessionTypeEl.text('Break Time!');
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
  $('#dismiss').on('click', function () {
    genDadJoke();
    genYTVid();
    alarm.pause();
    if(!workStatus){
      genDadJoke();
      genYTVid();
      setBreakTimer();
    }
    if(workStatus) {
      timerEl.text('25:00')
    }
  });
}

function genDadJoke() {
  // $('#t').remove();
  // $('#p').remove();
  fetch(dadJokeURL, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": "7b1a003bf5msh1ca0da65978ae8cp106aebjsn81c5d0c4c3de",
      "x-rapidapi-host": "dad-jokes.p.rapidapi.com"
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      $('#t').text(response.body[0].setup);
      $('#p').text(response.body[0].punchline);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function genYTVid() {
 //$('#p1').remove();
  fetch(ytURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(response) {
    console.log(response);
    $('#p1').append("<iframe height='200px' width='200px' src='https://www.youtube.com/embed/"+response.items[0].id.videoId +"'></iframe>");
    //$('#p1').text(response);
  })
  .catch(function(err) {
    console.error(err);
  });
}

function createPreset() {
  presetsArry = savedPresets;
  presetsArry.push([pName.val(), pTime.val()]);
  localStorage.setItem("presets",JSON.stringify(presetsArry));
  console.log(presetsArry);
  loadPreset((presetsArry.length-1));
}

function loadPreset(id) {
  console.log(savedPresets[id]);
  var tempArry = savedPresets[id];
  var presetName = tempArry[0];
  var presetTime = tempArry[1];
  var timeArry = presetTime.split(/[:]+/);
  var hours = timeArry[0];
  var mins = timeArry[1];
  var pomoTime = parseInt(hours) * 60; //convert hours to min and get total mins

  if(savedPresets){
    $('#presets').append("<select id='savedPresets'>");
    $('#savedPresets').append("<option value='' disabled selected>Choose your preset</option>");
    for(var i = 0; i < savedPresets.length; i++){
      var tempArry = savedPresets[i];
      $('#savedPresets').append(`<option value='${tempArry[1]}'>${tempArry[0]}`);
    }
  }
  if(parseInt(hours) < 4){
    //work for 8 25 min periods then have 8 5 min periods
    pomoCounter = pomoTime/60; //8

    timerEl.text("25:00");
  
  } else if(parseInt(hours) > 4){
    // work for 8 25 min periods have 8 5 min breaks periods and then take a half hour lunch then for for another same
    console.log(pomoTime / 60)
    pomoCounter = pomoTime/60; //16

    timerEl.text("25:00");
  }
}

startBtn.on("click", function () {
  startBtn.prop("disabled", true);
  timer = setInterval(startTimer, 1000);
});
pauseBtn.on("click", pauseTimer);
resetBtn.on("click", resetTimer);

pSubmitBtn.on("click", function(e){
  e.preventDefault();
  if (pName.val() === "" || pTime.val() === "") {
    console.log("You must enter a name for both"); //eventuall create modal
    return;
  }
  createPreset();
});

$(document).ready(function () {
  loadPreset(savedPresets.length-1);
  $('select').formSelect();
  $('.modal').modal();
  $('.sidenav').sidenav();
});
