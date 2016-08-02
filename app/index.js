// Require moment.js
const moment = require('moment');
// Require ipcRender
const {
    ipcRenderer
} = require('electron');

let modeObject = {
    'pomodoro': 1500,
    'break': 300,
    'longBreak': 900
}
let mode = 'pomodoro';
let currentTime = 1500;
let alarm = new Audio('./alarm.mp3');
let startTimer = false;



// Helper function, to format the time
const secondsToTime = (s) => {
    let momentTime = moment.duration(s, 'seconds');
    let sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds();
    let min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes();

    return `${min}:${sec}`;
};

playAudio = () => {

}

$('.btn').click((e) => {
    btnId = e.target.id;
    if (btnId == 'pomodoro'){
        startTimer = false;
        currentTime = 1500;
        mode = 'pomodoro';
    } else if (btnId == 'break') {
        startTimer = false;
        currentTime = 300;
        mode = 'break';
    } else if (btnId == 'longBreak') {
        startTimer = false;
        currentTime = 900;
        mode = 'longBreak';
    } else if (btnId == 'start') {
        startTimer = true;
    } else if (btnId == 'stop') {
        startTimer = false;
    } else if (btnId == 'reset') {
        startTimer = false;
        currentTime = modeObject[mode];
    }
    timerDiv.innerHTML = secondsToTime(currentTime);
});

// Listen to the 'timer-change' event
ipcRenderer.on('timer-change', (event, t) => {
    // Print out the time

    // Execute every second
    let timer = setInterval(() => {

        // Remove one second
        if (currentTime > 0 && startTimer) {
            currentTime = currentTime - 1;
        }

        // Print out the time
        timerDiv.innerHTML = secondsToTime(currentTime);

        // When reaching 0. Stop.
        if (currentTime <= 0 && startTimer) {
            startTimer = false;
            currentTime = modeObject[mode];
            new Notification("Simple Pomodoro", {
                body: "Finished!"
            });
            alarm.play();
        }
    }, 1000); // 1 second
});