import {cancion} from './cancion.mjs'
import { updateScroll } from './scroll.mjs';

document.addEventListener("DOMContentLoaded", () => {
    if (!("ontouchstart" in window)) return; // Solo en pantallas táctiles

    const TIME = 1000;
    const DEFAULT_VALUE = cancion.getSpeed();
    const HIDDEN = "hidden";
    const VISIBLE = "flex";

    let mostrar=false;
    let pulsando=false;

    const PANTALLA=document.getElementById("contenedor-ajuste-velocidad-tactil");
    const VALOR = document.getElementById("valor");

    VALOR.innerHTML = DEFAULT_VALUE;

    let touchTimeout;
    let initValue;
    let initPulse;

    document.addEventListener("touchstart", (event) => {
        if (event.touches.length !== 1) return; // Se pulsa con un solo dedo

        touchTimeout = setTimeout(() => {
            mostrar = true;

            PANTALLA.classList.remove(HIDDEN);
            PANTALLA.classList.add(VISIBLE);
        }, TIME); // Mantener presionado por 500ms

        
    });

    document.addEventListener("touchmove", (event) => {
        if (!mostrar){
             return
        }

        const touch = event.touches[0];

        if(!pulsando){
            
            initValue = cancion.getSpeed();
            initPulse = touch.pageX;
            pulsando = true;
        }
        
        // Interpolación
        // 25 -> 0
        // 75 -> 100
        // let newValue = Math.round(((((touch.pageX - initPulse) / screen.width))*200)-50);

        let newValue = Math.round((touch.pageX - initPulse)/2 + initValue);

        newValue = (Math.max(0, Math.min(100, newValue)));

        // Ajusto la velocidad
        cancion.setSpeed(newValue);
        updateScroll();
        

        // Ajusto el valor para que sea visible
        VALOR.innerHTML = newValue; 
    });

    document.addEventListener("touchend", () => {
        clearTimeout(touchTimeout);

        mostrar = false;
        pulsando = false;

        PANTALLA.classList.remove(VISIBLE);
        PANTALLA.classList.add(HIDDEN);
    });
});

/*
document.addEventListener("DOMContentLoaded", () => {
    if (!("ontouchstart" in window)) return; // Solo en pantallas táctiles

    const TIME = 1000;
    const DEFAULT_VALUE = 60;

    let touchTimeout;
    let inputRange;

    

    inputRange = document.createElement("input");
                inputRange.type = "range";
                inputRange.min = 0;
                inputRange.max = 100;
                inputRange.value = 50;
                inputRange.style.position = "fixed";
                inputRange.style.left = "50%";
                inputRange.style.top = "80%";
                inputRange.style.width = "200px";
                inputRange.style.transform = "translateX(-50%)";
                inputRange.classList.add("hidden");

    document.body.appendChild(inputRange);

    document.addEventListener("touchstart", (event) => {
        if (event.touches.length !== 1) return; // Solo un dedo

        touchTimeout = setTimeout(() => {
            inputRange.classList.remove("hidden");
        }, TIME); // Mantener presionado por 500ms

        
    });

    document.addEventListener("touchmove", (event) => {
        if (inputRange.classList.contains("hidden")) return;
        
        const touch = event.touches[0];
        let newValue = 50 + ((touch.pageX - inputRange.offsetLeft) / inputRange.offsetWidth) * 100;
        inputRange.value = Math.max(0, Math.min(100, newValue));

        document.getElementById("valor").innerHTML = inputRange.value;
    });

    document.addEventListener("touchend", () => {
        clearTimeout(touchTimeout);
        document.querySelector("input").classList.add("hidden");
    });
});
*/