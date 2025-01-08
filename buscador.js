let escribiendo=false;
let barra_busqueda;

window.addEventListener('load', function() {
    barra_busqueda = document.querySelector('#buscador');
});

document.addEventListener("keyup", e=>{
    if(e.target.matches("#buscador")){

        escribiendo=true;

        // Ocultar el teclado al pulsar enter
        if(e.key == 'Enter'){
            e.target.blur();
            escribiendo=false;
        }

        const enlaces = document.querySelector('#enlaces');
        
        // Ocultar los enlaces iniciales al empezar a buscar
        if(e.target.value.toLowerCase() == ""){
            enlaces.classList.remove("filtro");
        } else {
            enlaces.classList.add("filtro");
        }

        // Seleccionar el índice
        const container = document.getElementById('index');

        // Seleccionar todos los <li> dentro del contenedor
        const listItems = container.querySelectorAll('li');

        // Recorrer los elementos <li> y extraer los detalles
        listItems.forEach(li => {
            const titleElement = li.querySelector('#song-title');

            const authorElement = li.querySelector('#author');
            const title = titleElement ? titleElement.textContent.trim() : 'Título no encontrado';
            const author = authorElement ? authorElement.textContent.trim() : 'Autor no encontrado';

            if(title.toLowerCase().includes(e.target.value.toLowerCase()) 
               || author.toLowerCase().includes(e.target.value.toLowerCase())) {
                li.classList.remove("filtro");
            } else {
                li.classList.add("filtro");
            }
        });
        
    } else {

        if(e.key != "Tab" && e.key != "ArrowDown" && e.key != 'ArrowUp'){
            // Si no se pulsa sobre el input, al escribir aparecerá en el input
            barra_busqueda.focus();

            if (/^[a-zA-Z0-9]$/.test(e.key)){
                barra_busqueda.value=e.key;
                escribiendo=true;
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
