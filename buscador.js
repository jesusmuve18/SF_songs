document.addEventListener("keyup", e=>{
    if(e.target.matches("#buscador")){

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

// document.addEventListener("keyup", (e) => {
//     if (e.target.matches("#buscador")) {
//         const listItems = document.querySelectorAll("#song-list li");

//         // Inicializar el índice de la numeración
//         let index = 1;

//         listItems.forEach((li, originalIndex) => {
//             const titleElement = li.querySelector("#song-title");
//             const authorElement = li.querySelector("#author");

//             const title = titleElement ? titleElement.textContent.trim() : "";
//             const author = authorElement ? authorElement.textContent.trim() : "";

//             if (
//                 title.toLowerCase().includes(e.target.value.toLowerCase()) ||
//                 author.toLowerCase().includes(e.target.value.toLowerCase())
//             ) {
//                 li.classList.remove("filtro"); // Mostrar
//                 li.style.display = ""; // Asegurarse de que esté visible
//                 li.setAttribute("value", originalIndex + 1); // Forzar la numeración
//                 index++;
//             } else {
//                 li.classList.add("filtro"); // Ocultar
//                 li.style.display = "none"; // Ocultar completamente
//             }
//         });
//     }
// });