import {selected} from './indice.js'

let escribiendo=false;
let barra_busqueda;
let visible='visible-list-item';
let oculto=`hidden`;
const mensaje_vacio='No se han encontrado resultados';

window.addEventListener('load', function() {
    barra_busqueda = document.querySelector('#buscador');
});

export function busqueda(w) {
    const enlaces = document.querySelector('#enlaces');
        
    // Ocultar los enlaces iniciales al empezar a buscar
    if(w.toLowerCase() == ""){
        enlaces.classList.remove(oculto);
    } else {
        enlaces.classList.add(oculto);
    }
    /*
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

        // console.log(`${title}, ${author}`);

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
    */

    // Selecciono cada una de las secciones del índice
    const indexSections = document.querySelectorAll('.seccion-indice');

    // Recorro cada una de las secciones
    indexSections.forEach(sec => {

        // Seleccionar todos los <li> dentro de la sección
        const listItems = sec.querySelectorAll('li');

        // Recorrer los elementos <li> y extraer los detalles
        listItems.forEach(li => {
            const titleElement = li.querySelector('#song-title');

            const authorElement = li.querySelector('#author');
            const title = titleElement ? titleElement.textContent.trim() : 'Título no encontrado';
            const author = authorElement ? authorElement.textContent.trim() : 'Autor no encontrado';

            if(title.toLowerCase().includes(w.toLowerCase()) 
                || author.toLowerCase().includes(w.toLowerCase())
                || (`${title.toLowerCase()} ${author.toLowerCase()}`).includes(w.toLowerCase())) {

                // Si se encuentra

                // Compruebo si está oculta
                if(sec.classList.contains(oculto)) { 
                    if(selected.innerHTML==sec.id) {
                       sec.classList.remove(oculto); 
                    }
                }

                li.classList.remove(oculto);
                li.classList.add(visible);
            } else {
                // Si no se encuentra
                li.classList.remove(visible);
                li.classList.add(oculto);
            }
        });
    })

    comprobarVacio();
}

export function comprobarVacio() {

    let m = 0;

    const indice_vacio = document.getElementById('indice-vacio');

    // Selecciono cada una de las secciones del índice
    const indexSections = document.querySelectorAll('.seccion-indice');

    // Recorro cada una de las secciones
    indexSections.forEach(sec => {

        // Si se está mostrando el título de la sección
        if(!sec.classList.contains(oculto)) {

            let n = 0;

            // Seleccionar todos los <li> dentro de la sección
            const listItems = sec.querySelectorAll('li');

            // Recorrer los elementos <li>
            listItems.forEach(li => {
                if(!li.classList.contains(oculto)) {
                    n++;
                }
            });

            // Si se está mostrando alguno
            if (n!=0) {
                m++;
            } else {
                sec.classList.add(oculto);
            }
        }

    })

    console.log(m);

    if(m==0){
        // Todo el índice está vacío
        indice_vacio.innerHTML = mensaje_vacio;

    } else {
        indice_vacio.innerHTML = '';
    }
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
