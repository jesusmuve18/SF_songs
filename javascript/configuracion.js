const NOTES_AMERICAN_SHARP = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_AMERICAN_FLAT = [ "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const NOTES_AMERICAN_STANDARD = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
const NOTES_EUROPE_SHARP = [ "Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
const NOTES_EUROPE_FLAT = [ "Do", "Reb", "Re", "Mib", "Mi", "Fa", "Solb", "Sol", "Lab", "La", "Sib", "Si"];
const NOTES_EUROPE_STANDARD = [ "Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "Sib", "Si"];

const EUROPE = "europe";
const AMERICAN = "american";

const SHARP = "sharp";
const FLAT = "flat";
const STANDARD = "standard";

const CIFRADO = "#cifrado";
const NOTACION = "#notacion";

const INICIAL = JSON.stringify([EUROPE, STANDARD]);

localStorage.setItem('notation', localStorage.getItem('notation') || INICIAL);

// localStorage.setItem('notation', INICIAL);

let notation = JSON.parse(localStorage.getItem('notation'));

function guardarNotacion(){
    localStorage.setItem('notation', JSON.stringify(notation));
}

function activar(checkbox) {

    let opcion=checkbox.closest('span');
    let configuracion=checkbox.closest('div');

    if(configuracion.matches(CIFRADO)) {

        if(opcion.matches('#cifrado-europeo')) {
            notation[0]=EUROPE;
        } else if(opcion.matches('#cifrado-americano')) {
            notation[0]=AMERICAN;
        }
    } else if(configuracion.matches(NOTACION)) {
        if(opcion.matches('#notacion-estandar')) {
            notation[1]=STANDARD;
        } else if(opcion.matches('#notacion-sostenidos')) {
            notation[1]=SHARP;
        } else if(opcion.matches('#notacion-bemoles')) {
            notation[1]=FLAT;
        }
    }

    console.log(notation);

}

function inicializar() {

    if(notation[0]==EUROPE){
        document.querySelector('#cifrado-europeo input').checked = true;
    } else if (notation[0]==AMERICAN) {
        document.querySelector('#cifrado-americano input').checked = true;
    }

    if(notation[1]==STANDARD) {
        document.querySelector('#notacion-estandar input').checked = true;
    } else if(notation[1]==SHARP) {
        document.querySelector('#notacion-sostenidos input').checked = true;
    } else if(notation[1]==FLAT) {
        document.querySelector('#notacion-bemoles input').checked = true;
    }
}

function preView(){

    let selected_notation;

    if(notation[0]==EUROPE) {
        if(notation[1]==STANDARD) {
            selected_notation = NOTES_EUROPE_STANDARD;
        } else if(notation[1]==SHARP) {
            selected_notation = NOTES_EUROPE_SHARP;
        } else if(notation[1]==FLAT) {
            selected_notation = NOTES_EUROPE_FLAT;
        }
    } else if(notation[0]==AMERICAN) {
        if(notation[1]==STANDARD) {
            selected_notation = NOTES_AMERICAN_STANDARD;
        } else if(notation[1]==SHARP) {
            selected_notation = NOTES_AMERICAN_SHARP;
        } else if(notation[1]==FLAT) {
            selected_notation = NOTES_AMERICAN_FLAT;
        }
    }

    let res="";

    selected_notation.forEach(note =>{
        res+=`<span id="note">${note}</span>`
    })

    document.getElementById('vista-previa').innerHTML=res;


}

function clickSpanContr(item){

    let checkbox=item.querySelector('input');

    if(!checkbox.checked){ // Si estaba desactivado (postclick)

        activar(checkbox);

        let container=checkbox.closest('div');

        container.querySelectorAll('input').forEach(i=>i.checked=false);

        checkbox.checked=true;
        guardarNotacion();
        preView();
    };
}

function clickCheckboxContr(item) {
    let checkbox=item;

    if(checkbox.checked){ // Si estaba desactivado (preclick)

        activar(checkbox);

        let container=checkbox.closest('div');

        container.querySelectorAll('input').forEach(i=>i.checked=false);

        checkbox.checked=true;
        guardarNotacion();
        preView();
    } else {
        checkbox.checked=true;
    }
}


document.addEventListener('click', ev=>{
    if (ev.target.matches('#configuraciones span')){
        clickSpanContr(ev.target);
    } else if (ev.target.matches('#configuraciones span input')){
        clickCheckboxContr(ev.target);
    }
})

document.addEventListener('DOMContentLoaded', ev=>{

    console.log(notation);

    inicializar();

    preView();
})