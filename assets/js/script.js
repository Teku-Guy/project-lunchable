var startBtn = $('#start');
var pauseBtn = $('#pause');
var resetBtn = $('#reset');
var timerEl = $('#timer');

var chunckTime = 25;
var timer;

function startTimer() {
    var presentTime = timerEl.text(); //set 25min timer
    var timeArry = presentTime.split(/[:]+/); //split the the time into min and sec in an array
    var m = timeArry[0]; //set min to 25
    var s = checkSecond((timeArry[1] - 1)); //we check if sec is 00 then reset to 59
    if(s == 59){
        m = m - 1;
    }

    if(m == 0){
        m = '00';
    }

    timerEl.text(m + ":" + s);

    if(m == 0 && s == 00){
        clearInterval(timer);
        console.log('times up!');
        alertUser();
    }
}

function checkSecond(sec) {
    // add zero in front of numbers < 10
    if (sec < 10 && sec >= 0) {
        sec = "0" + sec
    }
    if (sec < 0) {
        sec = "59"
    }
    return sec;
}

function pauseTimer() {
    startBtn.prop('disabled', false);
    clearInterval(timer);
}

function resetTimer() {
    startBtn.prop('disabled', false);
    clearInterval(timer);
    timerEl.text('25:00');
}

function alertUser() {
    var alarm = new Audio('./assets/mp3/siren.mp3');
    alarm.play();
}


startBtn.on('click', function(){
    startBtn.prop('disabled', true);
    timer = setInterval(startTimer, 1000);
});
pauseBtn.on('click', pauseTimer);
resetBtn.on('click', resetTimer);