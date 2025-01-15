/**************************************************************************************************************/
// SCROLLING

// Inicializar la variable con el valor del deslizable
let speed;
let isScrolling = false;
let scrollInterval;

document.addEventListener('DOMContentLoaded', function() {
    

    function startScrolling() {
        speed = speed = document.getElementById("scroll-speed-bar").value;

        let time = speed * (-190/99) + (19990/99); // Interpolación lineal: 1->200, 100->10

        // console.log(`time: ${time}`);

        console.log("Iniciando")
        scrollInterval = setInterval(() => {
            window.scrollBy(0, 1); // Desplaza 1 píxel hacia abajo
        }, time);
    }

    function stopScrolling() {
        clearInterval(scrollInterval);
    }

    document.getElementById("pauseButton").addEventListener('click', function () {
        if (isScrolling) {
            stopScrolling();
            // this.textContent = '►';
            let img = document.getElementById("pauseButton");
            img.setAttribute("src", "../images/play_2.svg");
            img.setAttribute("alt", "play");

            console.log("pausando scroll");
        } else {
            startScrolling();
            // this.textContent = '⏸';//'⏸︎'; ⏸
            let img = document.getElementById("pauseButton");
            img.setAttribute("src", "../images/pause_2.svg");
            img.setAttribute("alt", "pause");

            console.log("reanudando scroll");
        }
        isScrolling = !isScrolling;
    });

});

function ajustarVelocidad(){
    speed = document.getElementById("scroll-speed-bar").value;
    this.document.querySelector('#input-ajuste-velocidad').value=speed;
    document.getElementById("scroll-speed-value").innerHTML = speed;
    clearInterval(scrollInterval);
    isScrolling=false;

    let img = document.getElementById("pauseButton");
    img.setAttribute("src", "../images/play.svg");
    img.setAttribute("alt", "play");

    console.log("pausando scroll");
}