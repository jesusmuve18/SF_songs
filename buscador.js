document.addEventListener("keyup", e=>{
    if(e.target.matches("#buscador")){

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

            console.log(titleElement.innerHTML);

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

document.getElementById('buscador').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        this.blur(); // Esto quita el foco del input, lo que oculta el teclado
    }
});