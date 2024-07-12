const NOTES_AMERICAN_SHARP = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTES_AMERICAN_FLAT = [ "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const NOTES_EUROPE_SHARP = [ "Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
const NOTES_EUROPE_FLAT = [ "Do", "Reb", "Re", "Mib", "Mi", "Fa", "Solb", "Sol", "Lab", "La", "Sib", "Si"];

const EUROPE = "europe";
const AMERICAN = "american";
const SHARP = "sharp";
const FLAT = "flat";

// PARAMETERS FOR TONE ADJUSTMENTS
let tone = +0 ;  // variation (traspose)
let capo = +0 ;  // fret of the capo
let notation = [EUROPE, SHARP];
let loaded = false;


/**
 * Grade
 * @param {*} note 
 * @returns the index of the numeric note (from 0 - 11)
 */
function Grade (note){
    while (note < 0){
        note += 12;
    }

    return note % 12;
    
}

/**
 * 
 * @param {*} note 
 * @returns the index of the written note (in any notation)
 */
function Index (note) {
    note = note.charAt(0).toUpperCase() + note.slice(1); // Pongo la primera letra en mayúscula

    let num = NOTES_AMERICAN_SHARP.concat(NOTES_AMERICAN_FLAT, NOTES_EUROPE_SHARP, NOTES_EUROPE_FLAT).indexOf(note);

    if(num!=-1){ // Si se ha encontrado
        return Grade(num);
    } else{
        return undefined
    }
}

/**
 * Adjust a written note to the given variations (including notation)
 * @param {*} note 
 */
function Chord (note) {
    num = Grade(Index(note)+tone-capo);
    // console.log(`El índice es ${num}`);
    if(notation[0]==EUROPE) {
        if(notation[1]==SHARP){
            return NOTES_EUROPE_SHARP[num];
        } else {
            return NOTES_EUROPE_FLAT[num];
        }
    } else {
        if(notation[1]==SHARP){
            return NOTES_AMERICAN_SHARP[num];
        } else {
            return NOTES_AMERICAN_FLAT[num];
        }
    }
}

function AdjustOriginalTone(first_time=false) {
    

    let tone_pointer = document.getElementById("original-tone");

    if(tone_pointer!=null){

        if(!first_time) {
            let tmp;
            let w_note;
            let variation;
            let chord;

            tmp = tone_pointer.getAttribute("acorde").split(" ");
            w_note = tmp[0];            // Contiene la nota (palabra)

            if(tmp.length>1){               // Si la nota tiene variación
                variation = tmp[1];         // Contiene la variación (inmutable)
            } else {
                variation = "";
            }

            let num = Grade(Index(w_note)+tone);

            if(notation[0]==EUROPE) {
                if(notation[1]==SHARP){
                    chord = NOTES_EUROPE_SHARP[num];
                } else {
                    chord = NOTES_EUROPE_FLAT[num];
                }
            } else {
                if(notation[1]==SHARP){
                    chord = NOTES_AMERICAN_SHARP[num];
                } else {
                    chord = NOTES_AMERICAN_FLAT[num];
                }
            }

            if(variation.length>0 && variation[0]=="m" && notation[0]==EUROPE){
                chord = chord.toLowerCase();
            }

            // tone_pointer.innerHTML = `<a title="${chord}${variation}">${chord}${variation}<\a>`;
            tone_pointer.innerHTML = `${chord}${variation}<img src="../images/chords/${NOTES_AMERICAN_SHARP[num]}${variation}.png" alt="Acorde de ${chord}${variation}" class="hover-image">`;
        } else {
            tone_pointer.setAttribute("acorde", `${tone_pointer.innerHTML}`);
        }
    }
    
}

function Reload() {

    let chords = document.querySelectorAll("b");
    let tmp;
    let w_note;
    let variation;
    let chord;

    AdjustOriginalTone();

    // Ajustar los acordes del cuerpo
    for(let i=0; i<chords.length; i++){
        tmp = chords[i].getAttribute("acorde").split(" ");
        w_note = tmp[0];            // Contiene la nota (palabra)

        if(tmp.length>1){               // Si la nota tiene variación
            variation = tmp[1];         // Contiene la variación (inmutable)
        } else {
            variation = "";
        }
        
        chord = Chord(w_note);      // Contiene el acorde ya transformado

        if(variation.length>0 && variation[0]=="m" && notation[0]==EUROPE){
            chord = chord.toLowerCase();
        }

        // Lo pongo temporalmente en Americano para no tener que guardar todas las imágenes 4 veces
        let save_notation = notation;
        notation = [AMERICAN, FLAT];
        let american_chord = Chord(w_note);
        // chords[i].innerHTML = `<a title="${chord}${variation}">${chord}${variation}<\a>`
        chords[i].innerHTML = `${chord}${variation}<img src="../images/chords/${american_chord}${variation}.png" alt="Acorde de ${chord}${variation}" class="hover-image">`;
        notation = save_notation;
    }  

}

function Load() {

    // console.log("Cargando...");
    let chords = document.querySelectorAll("b");

    // console.log(`Se han encontrado ${chords.length} acordes ajustables`);

    AdjustOriginalTone(true);

    for(let i=0; i<chords.length; i++){
        chords[i].setAttribute("acorde", `${chords[i].innerHTML}`);
    }  

}


window.onload = function() {
    let capo_pointer = document.getElementById("capo");
    let traspose_pointer = document.getElementById("traspose");
    let notation_pointer = document.getElementById("notation");

    if (capo_pointer!=null) {
        capo = +capo_pointer.innerHTML;
        console.log(`capo = ${capo}`);
    }
        

    if (traspose_pointer!=null) {
        tone = +traspose_pointer.innerHTML;
        console.log(`traspose = ${tone}`);
    }

    if(notation_pointer!=null) {
        notation_pointer = +notation_pointer.innerHTML.split(" ");
        if(notation_pointer.length >0){
            notation[0] = notation_pointer[0];
            if(notation_pointer.length > 1){
                notation[1] = notation_pointer[1];
            }
        }

        console.log(`notation = ${notation}`);
    }
       
    Load();
    Reload();

    ajustarColumnas();
};

function incCapo(value=1){

    if(capo + value >=0  && capo + value <= 24)
        capo += +value;
    let capo_pointer = document.getElementById("capo");
    capo_pointer.innerHTML = capo;
    console.log(`capo = ${capo}`);

    Reload();
}

function incTone(value=1){
    tone += +value;
    let tone_pointer = document.getElementById("traspose");
    tone_pointer.innerHTML = tone;
    console.log(`tone = ${tone}`);

    Reload();
}

function ajustarColumnas() {
    const textoPrincipal = document.getElementById('song-body');
    textoPrincipal.classList.remove('dos-columnas');

    if (textoPrincipal.scrollHeight > 0.57*window.innerHeight) {
        console.log("2 columnas");
        textoPrincipal.classList.add('dos-columnas');
    } else {
        console.log("1 columna");
    }
}

// Ejecutar al redimensionar la ventana
window.onresize = ajustarColumnas;


