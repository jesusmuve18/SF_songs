import {cancion} from './cancion.mjs'

const BUTTON_ID = 'pauseButton';
const BUTTON_FRAME_ID = 'pauseButton-frame';

const PAUSE_ICON = "../images/pause_2.svg";
const PLAY_ICON = "../images/play_2.svg";
const OCULTO = 'hidden-fade-out';
const VISIBLE = 'shown';

let scrollInterval;
let scrolling = false;


function setIcon(img) {
    let icon = document.getElementById(BUTTON_ID);

    if(icon) {
        icon.setAttribute("src", img);
    }
}

function fadeIcon() {
    let icon_frame = document.getElementById(BUTTON_FRAME_ID);
    
    if(icon_frame) {
        icon_frame.classList.remove(VISIBLE);
        icon_frame.classList.add(OCULTO);
    }
}

function showIcon() {
    let icon_frame = document.getElementById(BUTTON_FRAME_ID);
    
    if(icon_frame) {
        icon_frame.classList.remove(OCULTO);
        icon_frame.classList.add(VISIBLE);
    }
}

function startScrolling(speed) {

    let time = speed * (-190/99) + (19990/99); // Interpolación lineal: 1->200, 100->10

    scrolling = true;

    scrollInterval = setInterval(() => {
        window.scrollBy(0, 1); // Desplaza 1 píxel hacia abajo cada time
    }, time);
}

function stopScrolling() {
    clearInterval(scrollInterval);
    scrolling = false;
}

function updateScroll() {

    if(scrolling) {
        stopScrolling();
        startScrolling(cancion.getSpeed());
    }
}

document.addEventListener('click', ev=>{
    if  (ev.target.matches(`#${BUTTON_ID}`)) {
        if(scrolling) {
            stopScrolling();
            setIcon(PLAY_ICON);
            showIcon();
        } else {
            startScrolling(cancion.getSpeed());
            setIcon(PAUSE_ICON);
            fadeIcon();
        }
    } else {
        stopScrolling();
        setIcon(PLAY_ICON);
        showIcon();
    }
})

// Funciones multimedia
document.addEventListener('keydown', ev=>{
    if(ev.key == ' ') {
        ev.preventDefault();
        
        if(scrolling) {
            stopScrolling();
            setIcon(PLAY_ICON);
            showIcon();
        } else {
            startScrolling(cancion.getSpeed());
            setIcon(PAUSE_ICON);
            fadeIcon();
        }
    } else if(ev.key == '+') {

        if(cancion.getSpeed() < 100) {
            cancion.incSpeed(5);
            updateScroll();
            console.log(`Velocidad: ${cancion.getSpeed()}`);
        }
        
    } else if(ev.key == '-') {

        if(cancion.getSpeed() > 0) {
            cancion.incSpeed(-5);
            updateScroll();
            console.log(`Velocidad: ${cancion.getSpeed()}`);
        }
    }
})

document.addEventListener('DOMContentLoaded', ev=>{
    showIcon();
})

export {updateScroll};