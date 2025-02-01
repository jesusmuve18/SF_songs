let escribiendo=false;
let barra_busqueda;
let visible='visible-list-item';
let oculto=`hidden`;

window.addEventListener('load', function() {
    barra_busqueda = document.querySelector('#buscador');
});

function busqueda(w) {
    const enlaces = document.querySelector('#enlaces');
        
    // Ocultar los enlaces iniciales al empezar a buscar
    if(w.toLowerCase() == ""){
        enlaces.classList.remove(oculto);
    } else {
        enlaces.classList.add(oculto);
    }

    // Seleccionar el índice
    const container = document.getElementById('indice');

    // Seleccionar todos los <li> dentro del contenedor
    const listItems = container.querySelectorAll('#indice li');

    // Recorrer los elementos <li> y extraer los detalles
    listItems.forEach(li => {
        const titleElement = li.querySelector('#song-title');

        const authorElement = li.querySelector('#author');
        const title = titleElement ? titleElement.textContent.trim() : 'Título no encontrado';
        const author = authorElement ? authorElement.textContent.trim() : 'Autor no encontrado';

        console.log(`${title}, ${author}`);

        if(title.toLowerCase().includes(w.toLowerCase()) 
            || author.toLowerCase().includes(w.toLowerCase())
            || (`${title.toLowerCase()} ${author.toLowerCase()}`).includes(w.toLowerCase())) {
            li.classList.remove(oculto);
            li.classList.add(visible);
        } else {
            li.classList.remove(visible);
            li.classList.add(oculto);
        }
    });
}



document.addEventListener("keyup", e=>{
    if(e.target.matches("#buscador")){

        escribiendo=true;

        // Ocultar el teclado al pulsar enter
        if(e.key == 'Enter'){
            e.target.blur();
            escribiendo=false;
        } else {
            busqueda(e.target.value);
        }   

    } else {

        if(e.key != "Tab" && e.key != "ArrowDown" && e.key != 'ArrowUp'){
            // Si no se pulsa sobre el input, al escribir aparecerá en el input
            // Mostraré el input
            if(!mostrar_buscar){
                menu_buscar.classList.remove(oculto);
                mostrar_buscar=true;
                this.document.querySelector('#buscador').focus();
            }

            barra_busqueda.focus();

            if (/^[a-zA-Z0-9]$/.test(e.key)){
                barra_busqueda.value=e.key;
                escribiendo=true;
                busqueda(e.key);
            } else 
                barra_busqueda.select();
        }
    }
})

let primera_vez=true;

// La primera vez que se clica en la página se empieza a escuchar el click en la barra de busqueda
document.addEventListener('click', e => {
    if(primera_vez){
            barra_busqueda.addEventListener('click', function() {
            // Si no se está escribiendo se selecciona el texto
            if(!escribiendo){
                barra_busqueda.select();
            }
        })

        primera_vez=false;
    }
})
