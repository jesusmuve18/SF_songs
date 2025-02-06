import {cancion} from './cancion.mjs'


document.addEventListener('click', ev=> {
    if(ev.target.matches('#dim-capo')) {
        cancion.incCapo(-1);
    } else if(ev.target.matches('#inc-capo')) {
        cancion.incCapo(1);
    } else if(ev.target.matches('#inc-tone')) {
        cancion.incTone(1);
    } else if(ev.target.matches('#dim-tone')) {
        cancion.incTone(-1);
    } else if(ev.target.matches('#inc-velocidad')) {
        cancion.incSpeed(1);
    } else if(ev.target.matches('#dim-velocidad')) {
        cancion.incSpeed(-1);
    } else if(ev.target.matches('#reestablecer')) {
        cancion.reset();
    }
});

document.addEventListener('keyup', ev=> {
    if(ev.key == 'Enter'){
        ev.target.blur();

        if(ev.target.matches('#input-ajuste-tono')){
            cancion.setTone(document.getElementById('input-ajuste-tono').value);
            
        } else if (ev.target.matches('#input-ajuste-cejilla')) {
            cancion.setCapo(document.getElementById('input-ajuste-cejilla').value);
        } else if (ev.target.matches('#input-ajuste-velocidad')) {
            cancion.setSpeed(document.getElementById('input-ajuste-velocidad').value);
        }
    }
});

// Funciones multimedia
document.addEventListener('keydown', ev=>{
    if(ev.key == '2') {
        cancion.incCapo(1);
    } else if(ev.key == '1') {
        cancion.incCapo(-1);
    } else if(ev.key == '4') {
        cancion.incTone(1);
    } else if(ev.key == '3') {
        cancion.incTone(-1);
    } else if(ev.key == '5') {
        cancion.reset();
    }
})