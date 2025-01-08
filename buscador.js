document.addEventListener("keyup", e=>{
    if(e.target.matches("#buscador")){

        // Ocultar el teclado al pulsar enter
        if(e.key == 'Enter'){
            e.target.blur();
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
        
    }
})