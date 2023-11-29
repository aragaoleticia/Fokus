
const titles = document.querySelectorAll('.app__title');
const banner = document.querySelector('.app__image');
const html = document.querySelector('html');
const buttonsList = document.querySelectorAll('.app__card-button');
const inputMusicFokus = document.querySelector('#alternar-musica');
const startButton = document.querySelector('#start-pause');
const startOrPauseButton = document.querySelector('#start-pause span');
const imgPause = document.querySelector('.app__card-primary-button-icon');
const screenTimer = document.querySelector('#timer');


const music = new Audio('/sons/luna-rise-part-one.mp3');
const soundPlay = new Audio('/sons/play.wav');
const soundPause = new Audio('/sons/pause.mp3');
const soundBeep = new Audio('/sons/beep.mp3');

let secondsTimer = null;
let timerBreak = null;


function musicStatusChange(){
    if(music.paused){
        music.loop = true
        music.currentTime = 5;
        music.play();
    } else{
        music.pause();
    }
}

inputMusicFokus.addEventListener('change', musicStatusChange);


buttonsList.forEach(button => {
    const buttonClass = button.classList[2];
    button.onclick = function() {
        html.setAttribute('data-contexto', buttonClass);
        banner.src = `/imagens/${buttonClass}.png`

        button.classList.add('active');

        buttonsList.forEach(inactiveButton =>{
            if(button != inactiveButton){
                inactiveButton.classList.remove('active');
            }
        })


        titles.forEach(title => {
            const titleClass = title.classList[1];
            if(titleClass === buttonClass){
                title.classList.remove('hidden');
            } else{
                title.classList.add('hidden');
            }
           
        });
        const minutes = button.getAttribute('minutes');
        secondsTimer = minutes * 60;
        showTimer();
    }
});



const countDown = () => {
    if(secondsTimer <= 0){
        // soundBeep.play();
        stopCounter();
        reset();
        const focoAtivo = html.getAttribute('data-contexto') === 'foco'
        if (focoAtivo) {            
            var event = new CustomEvent("taskCompleted", {
                detail: {
                    message: "The task was completed!",
                    time: new Date(),
                },
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
            showTimer();
        }
        return
    }
    secondsTimer -= 1
    showTimer();
}

startButton.addEventListener('click', startAndPause);

function startAndPause(){
    if(timerBreak){
        soundPause.play();
        inputMusicFokus.checked = false;
        music.pause();
        stopCounter();
        return
    }
    soundPlay.play();
    timerBreak = setInterval(countDown, 1000);
    startOrPauseButton.textContent = 'Pause';
    imgPause.src = '/imagens/pause.png';
}

function stopCounter(){
    clearInterval(timerBreak);
    timerBreak = null;
    soundBeep.play();  
    startOrPauseButton.textContent = 'Start';
    imgPause.src = '/imagens/play_arrow.png';

}

function reset(){
    buttonsList.forEach(button =>{
        if(button.classList.contains('active')) {
            secondsTimer = button.getAttribute('minutes') * 60;
            showTimer();
        }

    }) 
}

function showTimer() {
    console.log('seconds ' + secondsTimer)
    const time = new Date(secondsTimer * 1000);
    const formatTime = time.toLocaleTimeString('en', {minute:'2-digit', second: '2-digit'});
    screenTimer.innerHTML = `${formatTime}`;
}


secondsTimer = buttonsList[0].getAttribute('minutes') * 60;
showTimer();

