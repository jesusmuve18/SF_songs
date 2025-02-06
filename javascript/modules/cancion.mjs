function Cancion(capo = 0, speed = 60, tone = 0) {
    
    let _tone = tone;
    let _speed = speed;
    let _capo = capo;
    let _original_capo = 0;
    let _original_speed = speed;
    let _original_tone = tone;


    const _MIN_TONE = -12;
    const _MAX_TONE = 12;
    const _MIN_CAPO = 0;
    const _MAX_CAPO = 24;
    const _MIN_SPEED = 0;
    const _MAX_SPEED = 100;

    const _TONE_POINTER = document.getElementById("traspose");
    const _CAPO_POINTER = document.getElementById("capo");

    const _INPUT_CAPO_POINTER=document.getElementById('input-ajuste-cejilla');
    const _INPUT_TONE_POINTER=document.getElementById('input-ajuste-tono');
    const _INPUT_SPEED_POINTER=document.getElementById('input-ajuste-velocidad');

    const _NOTES_AMERICAN_SHARP = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const _NOTES_AMERICAN_FLAT = [ "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    const _NOTES_AMERICAN_STANDARD = [ "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "Bb", "B"];
    const _NOTES_EUROPE_SHARP = [ "Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
    const _NOTES_EUROPE_FLAT = [ "Do", "Reb", "Re", "Mib", "Mi", "Fa", "Solb", "Sol", "Lab", "La", "Sib", "Si"];
    const _NOTES_EUROPE_STANDARD = [ "Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "Sib", "Si"];

    const _EUROPE = "europe";
    const _AMERICAN = "american";
    const _SHARP = "sharp";
    const _FLAT = "flat";
    const _STANDARD = "standard"

    const _INICIAL = JSON.stringify([_EUROPE, _STANDARD]);

    localStorage.setItem('notation', localStorage.getItem('notation') || _INICIAL);
    let notation = JSON.parse(localStorage.getItem('notation')); // Cojo la notación de lo que tengo guardado

    const initialize = () => {
        Load();

        updateCapo();
        updateTone();
        updateSpeed();
    }

    /**
     * Actualiza el número de tonos que está transpuesta la canción en la información de la canción
     * y en las herramientas
     */
    const updateTone = () => {
        if (_TONE_POINTER) {
            if(_tone == 0) {
                _TONE_POINTER.innerHTML = 'no';
            } else if (_tone == 1) {
                _TONE_POINTER.innerHTML = `${_tone} semitono`;
            } else {
                _TONE_POINTER.innerHTML = `${_tone} semitonos`;
            }
            
        }

        if(_INPUT_CAPO_POINTER) {
            _INPUT_TONE_POINTER.value = _tone;
        }

        Reload();
    }
    /**
     * Actualiza el número de traste en el que se debe colocar la cejilla en la información de la 
     * canción y en las herramientas
     */
    const updateCapo = () => {
        if (_CAPO_POINTER) {
            if(_capo != 0) {
                _CAPO_POINTER.innerHTML = `traste ${_capo}`;
            } else {
                _CAPO_POINTER.innerHTML = `no`;
            }
            
        }

        if (_INPUT_CAPO_POINTER) {
            _INPUT_CAPO_POINTER.value = _capo;
        }

        Reload();
    }

    /**
     * Actualiza el valor de la velocidad en las herramientas
     */
    const updateSpeed = () => {
        if (_INPUT_SPEED_POINTER) {
            _INPUT_SPEED_POINTER.value = _speed;
        }
    }

    /**
     * Incrementa el tono de la canción (en semitonos)
     * @param {valor} value cantidad que se quiere incrementar (o decrementar si es negativo)
     */
    const incTone = (value=1) => {

        let tmp = _tone + +value;

        if (tmp <= _MAX_TONE && tmp >= _MIN_TONE) {
            _tone = tmp;
            updateTone();
        }
    };

    /**
     * Incrementa la cejilla de la canción (en trastes)
     * @param {valor} value cantidad que se quiere incrementar (o decrementar si es negativo)
     */
    const incCapo = (value=1) => {

        let tmp = _capo + +value;

        if (tmp <= _MAX_CAPO && tmp >= _MIN_CAPO) {
            _capo = tmp;
            updateCapo();
        }
        
    };

    /**
     * Incrementa la velocidad de la canción
     * @param {valor} value cantidad que se quiere incrementar (o decrementar si es negativo)
     */
    const incSpeed = (value=1) => {

        let tmp = _speed + +value;
        
        if (tmp <= _MAX_SPEED && tmp >= _MIN_SPEED) {
            _speed = tmp;
            updateSpeed();
        }
    };

    const getTone = () => _tone;
    const getCapo = () => _capo;
    const getSpeed = () => _speed;

    const setTone = (value) => {

        if (value <= _MAX_TONE && value >= _MIN_TONE) {
            _tone = value; 
        }

        updateTone();
    };

    const setCapo = (value) => {

        if (value <= _MAX_CAPO && value >= _MIN_CAPO) {
            _capo = value; 
        }

        updateCapo();
    };

    const setSpeed = (value) => {

        if (value <= _MAX_SPEED && value >= _MIN_SPEED) {
            _speed = value; 
        }

        updateSpeed();
    };

    const setOriginalCapo = (value) => _original_capo = value;
    const setOriginalSpeed = (value) => _original_speed = value;

    const reset = () => {
        setTone(_original_tone);
        setCapo(_original_capo);
        setSpeed(_original_speed);
    }


    /**
     * Grade
     * @param {*} note 
     * @returns the index of the numeric note (from 0 - 11)
     */
    const Grade = (note) => {
        while (note < 0){
            note += 12;
        }
        return note % 12;
    };

    /**
     * 
     * @param {*} note 
     * @returns the index of the written note (in any notation)
     */
    const Index = (note) => {
        note = note.charAt(0).toUpperCase() + note.slice(1); // Pongo la primera letra en mayúscula

        let num = _NOTES_AMERICAN_SHARP.concat(_NOTES_AMERICAN_FLAT, _NOTES_EUROPE_SHARP, _NOTES_EUROPE_FLAT).indexOf(note);

        if(num!=-1){ // Si se ha encontrado
            return Grade(num);
        } else{
            return undefined
        }
    };

    /**
     * Adjust a written note to the given variations (including notation)
     * @param {*} note 
     */
    const Chord = (note) => {
        let num = Grade(Index(note)+ +cancion.getTone() - +cancion.getCapo());

        // console.log(`El índice es ${num}`);
        if(notation[0]==_EUROPE) {
            if(notation[1]==_SHARP){
                return _NOTES_EUROPE_SHARP[num];
            } else if (notation[1]==_FLAT){
                return _NOTES_EUROPE_FLAT[num];
            } else {
                return _NOTES_EUROPE_STANDARD[num]
            }
        } else {
            if(notation[1]==_SHARP){
                return _NOTES_AMERICAN_SHARP[num];
            } else if (notation[1]==_FLAT){
                return _NOTES_AMERICAN_FLAT[num];
            } else {
                return _NOTES_AMERICAN_STANDARD[num];
            }
        }
    };


    const Load = () => {

        // console.log("Cargando...");
        let chords = document.querySelectorAll("b, #original-tone");
    
        // ajusto la cejilla y el tono
        let capo_pointer = document.getElementById("capo");
        let given_capo_pointer = document.getElementById("cejilla-original");
    
        if(given_capo_pointer) {
            setOriginalCapo(+given_capo_pointer.innerHTML);
        }
        
        if (capo_pointer!=null && given_capo_pointer!=null) {
            given_capo = +given_capo_pointer.innerHTML;
    
            if(given_capo > 0) {
                capo_pointer.innerHTML = `traste ${given_capo}`;
            } else {
                capo_pointer.innerHTML = 'no';
            }
            
            // console.log(`capo por defecto = ${capo}`);
            given_capo_pointer.outerHTML="";
        }
    
        // console.log(`Se han encontrado ${chords.length} acordes ajustables`);
    
        for(let i=0; i<chords.length; i++){
            if(chords[i].getAttribute("id")!="reserved"){
                chords[i].setAttribute("acorde", `${chords[i].innerHTML}`);
            }
        }  
    
    };

    const Reload = () => {

        let chords = document.querySelectorAll("#song-body b, #original-tone");
        let tmp;
        let w_note;
        let variation;
        let chord;
    
        // Ajustar los acordes del cuerpo
        for(let i=0; i<chords.length; i++){
    
            if(chords[i].getAttribute("id")!="reserved"){
                tmp = chords[i].getAttribute("acorde").split(" ");
                w_note = tmp[0];            // Contiene la nota (palabra)
    
                if(tmp.length>1){               // Si la nota tiene variación
                    variation = tmp[1];         // Contiene la variación (inmutable)
                } else {
                    variation = "";
                }
                
                chord = Chord(w_note);      // Contiene el acorde ya transformado
    
                // lo pongo en minúscula si es menor 
                if(variation.length>0 && variation[0]=="m" && notation[0]==_EUROPE){
                    if(!(variation.length>1 && variation[1]=="a")){
                        chord = chord.toLowerCase();
                    }
                }
    
                // Lo pongo temporalmente en Americano para no tener que guardar todas las imágenes 4 veces
                let save_notation = notation;
                notation = [_AMERICAN, _FLAT];
                let american_chord = Chord(w_note);
    
                // Devuelvo la notación
                notation = save_notation;
    
                
                // Si es una nota del tipo nota(variación)/nota
                if(variation.length>0 && variation[variation.length-1]=='/') {
    
                    // Le quito el caracter '/' a la variación anterior
                    variation=variation.slice(0,-1);
    
                    let j=i+1;
                    tmp = chords[j].getAttribute("acorde").split(" ");
                    w_note = tmp[0];            // Contiene la nota (palabra)
    
    
                    let variation2;
                    let chord2;
    
                    if(tmp.length>1){               // Si la nota tiene variación
                        variation2 = tmp[1];         // Contiene la variación (inmutable)
                    } else {
                        variation2 = "";
                    }
                    
                    chord2 = Chord(w_note);      // Contiene el acorde ya transformado
    
                    // lo pongo en minúscula si es menor 
                    if(variation2.length>0 && variation2[0]=="m" && notation[0]==_EUROPE){
                        if(!(variation2.length>1 && variation2[1]=="a")){
                            chord2 = chord2.toLowerCase();
                        }
                    }
    
                    // Lo pongo temporalmente en Americano para no tener que guardar todas las imágenes 4 veces
                    let save_notation = notation;
                    notation = [_AMERICAN, _FLAT];
                    let american_chord2 = Chord(w_note);
                    
                    // Devuelvo la notación
                    notation = save_notation;
    
                    chords[i].innerHTML = `${chord}${variation}/${chord2}${variation2}<img src="../images/svg_chords/${american_chord}${variation}_${american_chord2}${variation2}.svg" alt="Acorde de ${chord}${variation}/${chord2}${variation2}" class="hover-image">`;
                    chords[j].innerHTML = `<img src="../images/svg_chords/${american_chord}${variation}_${american_chord2}${variation2}.svg" alt="Acorde de ${chord}${variation}/${chord2}${variation2}" class="hover-image">`;
    
                    i++;
    
                } else {
                    // Lo pongo temporalmente en Americano para no tener que guardar todas las imágenes 4 veces
                    let save_notation = notation;
                    notation = [_AMERICAN, _FLAT];
                    let american_chord = Chord(w_note);
    
                    // chords[i].innerHTML = `<a title="${chord}${variation}">${chord}${variation}<\a>`
                    chords[i].innerHTML = `${chord}${variation}<img src="../images/svg_chords/${american_chord}${variation}.svg" alt="Acorde de ${chord}${variation}" class="hover-image">`;
                    
                    // Devuelvo la notación
                    notation = save_notation;
                }
            }  
        }  
    };


    return {    initialize, reset,
                incTone, incCapo, incSpeed, 
                getTone, getCapo, getSpeed, 
                setTone, setCapo, setSpeed,};
}


let cancion = new Cancion();
cancion.initialize();

export {cancion}