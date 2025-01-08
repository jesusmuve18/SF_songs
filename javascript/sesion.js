
let list = [];
let primera_vez=true;

function open(href) {
    console.log(`Intentando abrir ${href}`);
}

function add_song() {
    const ventana=document.querySelector('#ventana-emergente');

    if(ventana!=null) {
        ventana.classList.remove('hidden2');

        if(primera_vez) {
            // Evitamos que se abran los enlaces
            let links = document.querySelectorAll('#index ol li a');

            links.forEach(link => {
                link.addEventListener('click', function(event) {
                    event.preventDefault(); // Evita la navegación
                    
                    // Añado la canción a la lista
                    list.push(link.href);

                    // Oculto la ventana emergente
                    ventana.classList.add('hidden2');

                    // Añado la canción a la interfaz
                    const contenedor=document.querySelector('#contenedor-sesiones>ol');
                    contenedor.innerHTML+="<li>"+link.outerHTML+"</li>";

                    // Evitamos que se abran los enlaces
                    let links = document.querySelectorAll('#sesiones ol li a');

                    links.forEach(link => {
                        link.addEventListener('click', function(event) {
                            event.preventDefault(); // Evita la navegación
                            
                            open(link.href);
                        });
                    });
                });
            });

            

            primera_vez=false;
        }
        
    }
}

// Botón de añadir canción
document.addEventListener('click', e=> {
    if(e.target.matches('#add')){
        add_song();;
    } else if(e.target.matches('#ventana-emergente') 
                || e.target.matches('#pie')){
        const ventana=document.querySelector('#ventana-emergente');

        if(ventana!=null) {
            ventana.classList.add('hidden2');
        }
    } else if(e.target.matches('#save')){
        let title=window.prompt("Nombre de la sesión:");
        if(title!=null)
            window.alert(`Sesión \"${title}\" guardada con éxito.\nEl enlace a tu sesión es:\n${window.location.origin}/sesiones/${title}.html`)
        else {
            window.confirm(`¿Está seguro de que quiere cancelar?`);
        }
    }
})

// Barra de Búsqueda
function busqueda(w) {
    const enlaces = document.querySelector('#enlaces');
        
    // Ocultar los enlaces iniciales al empezar a buscar
    if(w.toLowerCase() == ""){
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

        if(title.toLowerCase().includes(w.toLowerCase()) 
            || author.toLowerCase().includes(w.toLowerCase())
            || (`${title.toLowerCase()} ${author.toLowerCase()}`).includes(w.toLowerCase())) {
            li.classList.remove("filtro");
        } else {
            li.classList.add("filtro");
        }
    });
}

document.addEventListener("keyup", e=>{
    if(e.target.matches("#buscador")){

        console.log("buscando-...");

        // Ocultar el teclado al pulsar enter
        if(e.key == 'Enter'){
            e.target.blur();
        } else {
            busqueda(e.target.value);
        }   

    }
})