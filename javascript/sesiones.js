// MODELO
const INICIAL = JSON.stringify([]);
const TITULO = `<h2>Sesiones</h2>`;
const ADD_SESION = `<img src="images/add.svg" id="add-sesion-icon">`;
const EDIT = `images/edit.svg`;
const ID_EDIT = `edit-sesion-icon`;
const ID_EDIT_TITLE = `edit-title-icon`;
const REMOVE = `images/bin.svg`;
const ID_REMOVE_SESION = `remove-sesion-icon`;
const ID_REMOVE_SONG = `remove-song-icon`;
const ADD_SONG = `images/add.svg`;
const ID_ADD_SONG = `add-song-icon`;
const SAVE_SESION = `images/save.svg`;
const ID_SAVE_SESION = `save-sesion-icon`;
const ICONO_VOLVER = `<img src="images/left-arrow.svg" id="pagina-principal">`
const ACCEPT = `images/accept.svg`
const ID_ACCEPT = `accept-icon`
const CANCEL = `images/cancel.svg`
const ID_CANCEL = `cancel-icon`

const SELECTED_STYLE='selected';
const NOT_SELECTED_STYLE='not-selected';



let visible='visible-list-item';
let oculto='hidden';

localStorage.setItem('sesiones', localStorage.getItem('sesiones') || INICIAL);
// localStorage.setItem('sesiones', INICIAL);

let sesiones = JSON.parse(localStorage.getItem('sesiones'));
let titulo_sesion;


function guardarSesiones(){
    localStorage.setItem('sesiones', JSON.stringify(sesiones));
}

async function loadIndex(filename) {
    let text;
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error('Error al cargar el archivo');
        }
        text = await response.text();

    } catch (error) {
        text = 'Error al cargar el archivo: ' + error.message;
    }

    return text;
}

function busqueda(w) {

    // console.log(w);

    const enlaces = document.querySelector('#enlaces');
        
    // Ocultar los enlaces iniciales al empezar a buscar
    if(w.toLowerCase() == ""){
        enlaces.classList.remove(oculto);
    } else {
        enlaces.classList.add(oculto);
    }

    // Seleccionar el índice
    const container = document.getElementById('lista-canciones-add');

    // Seleccionar todos los <li> dentro del contenedor
    const listItems = container.querySelectorAll('li');

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
}

// VISTAS

function indexView(sesiones){
    
    let res = "<ul>";
    let i=0;

    sesiones.forEach(s => {
        res+=`<li id="entrada-sesion" data-my-id=${i}><a id="entrada-sesion" data-my-id=${i}>${s[0]}</a>
              <button id="editar-sesion" data-my-id="${i}"><img src="${EDIT}" id="${ID_EDIT}" data-my-id="${i}"></button>
              <button id="eliminar-sesion" data-my-id="${i}"><img src="${REMOVE}" id="${ID_REMOVE_SESION}" data-my-id="${i}"></button></li>`;
        i++;
    });

    res+=`</ul>`;

    // res+=`<button id="nueva-sesion">Nueva</button>`;

    return res;
}

function editSesionView(id){

    let res = `<button id="add-cancion" data-my-id="${id}"><img src=${ADD_SONG} data-my-id="${id}" id=${ID_ADD_SONG}></button>`
    res += `<button id="guardar-sesion" data-my-id="${id}"><img src=${SAVE_SESION} data-my-id="${id}" id=${ID_SAVE_SESION}></button>`;

    res += `<ol>`;

    for(let i=1; i<sesiones[id].length; i++) {
        res+=`<li id="lista-canciones"><span id="list-number">${i}</span><span id="info-cancion"><span id="song-title">${sesiones[id][i].titulo}</span><span id="author">${sesiones[id][i].autor}</span></span> <button id="eliminar-cancion" data-my-sesion="${id}" data-my-id="${i}"><img src="${REMOVE}" id="${ID_REMOVE_SONG}" data-my-sesion="${id}" data-my-id="${i}"></button></li>`;
    }

    res += `</ol>`;
    
    return res;
}

function editTitleView(id) {
    return `<input type="text" id="titulo-sesion-input" value="${sesiones[id][0]}">
            <button id="actualizar-titulo-sesion" data-my-id="${id}"><img src="${ACCEPT}" id="${ID_ACCEPT}" data-my-id="${id}"</button>`;
}

function updateTitleView(id) {

    titulo_sesion = document.getElementById("titulo-sesion-input").value;

    if(titulo_sesion!="") {
        // console.log(`Actualizando el titulo de la sesion ${id}`);

        // console.log(`Se quiere actualizar ${sesiones[id][0]} a ${titulo_sesion}`);

        sesiones[id][0]=titulo_sesion;
        guardarSesiones();
    }

    return `<h2 id="titulo-sesion">${sesiones[id][0]}</h2>
            <button id="editar-titulo-sesion" data-my-id="${id}"><img src="${EDIT}" id="${ID_EDIT_TITLE}" data-my-id="${id}">`;
}

async function addSongView(id) {

    let res = `<input id="barra-busqueda-canciones-sesion" placeholder="Buscar canciones...">`
    res += `<button id="cancelar-add-cancion" data-my-id="${id}"><img src="${CANCEL}" data-my-id="${id}" id="${ID_CANCEL}"></button>`;
    // console.log(res);

    res += `<div id="lista-canciones-add">`;
    res += await loadIndex("./songs/0-data.txt");
    res += `</div>`;


    return res;
}

function loadSesionView(id){
    let res = `<button id="editar-sesion" data-my-id="${id}"><span id="editar-sesion-icon" data-my-id="${id}">Editar</span></button>`;
    // res += `<button id="pagina-principal">Volver</button>`;

    res += `<ol>`;

    if(sesiones[id].length>1) {
        for(let i=1; i<sesiones[id].length; i++){
            res+=`<li id="lista-canciones"><span id="list-number">${i}</span><a id="info-cancion" href="${sesiones[id][i].href}"><span id="song-title">${sesiones[id][i].titulo}</span> <span id="author">${sesiones[id][i].autor}</span></a></li>`           
        }
    } else {
        res+= `<br>No hay canciones aún`;
    }

    res+=`</ol>`
    return res;
}

// CONTROLADORES

function indexContr() {
    document.getElementById("titulo").innerHTML = TITULO + `<button id="nueva-sesion">${ADD_SESION}</button>`;
    document.getElementById("main").innerHTML = indexView(sesiones);
    document.getElementById("boton-volver-pagina-principal").innerHTML = "";
}

function newSesionContr() {
    do {
        titulo_sesion = window.prompt(`Título para la nueva sesión: `);
    } while (titulo_sesion=="");

    if(titulo_sesion){
        sesiones.push([`${titulo_sesion}`]);
        guardarSesiones();
    }

    indexContr();
}

function editSesionContr(id) {
    titulo_sesion=sesiones[id][0];

    document.getElementById("titulo").innerHTML = `<h2 id="titulo-sesion">${titulo_sesion}</h2>
                                                   <button id="editar-titulo-sesion" data-my-id="${id}"><img src="${EDIT}" id="${ID_EDIT_TITLE}" data-my-id="${id}"></button>`;

    document.getElementById("main").innerHTML = editSesionView(id);
    

    document.getElementById("boton-volver-pagina-principal").innerHTML = ICONO_VOLVER;
}

function editTitleContr(id) {
    document.getElementById("titulo").innerHTML = editTitleView(id);

    // Hago que el puntero se active automáticamente y se coloque al final de la entrada
    document.getElementById("titulo-sesion-input").focus();
    let longitud_entrada = document.getElementById("titulo-sesion-input").value.length;
    document.getElementById("titulo-sesion-input").setSelectionRange(longitud_entrada, longitud_entrada);
}

function updateTitleContr(id) {
    document.getElementById("titulo").innerHTML = updateTitleView(id);
}


function deleteSesionContr(id) {
    // console.log(`Se quiere eliminar la sesion ${id}`);
    if(window.confirm(`Está seguro de eliminar la sesión "${sesiones[id][0]}".\n\nAVISO: esta acción no se puede deshacer`)){
        sesiones.splice(id,1);
        guardarSesiones();
        indexContr();
    }
}

async function addSongContr(id) {
    // console.log("click");

    // Cargo el índice
    document.getElementById("main").innerHTML = await addSongView(id);


    // Formateo toda la lista
    let list = document.querySelectorAll("#lista-canciones-add li");

    list.forEach(li =>{
        li.dataset.myId = id; 
        li.querySelector("#song-title").dataset.myId = id;
        li.querySelector("#author").dataset.myId = id;
    })

    let selected;

    let enlaces=document.querySelectorAll('#enlaces a');
    let secciones_indice=document.querySelectorAll('.seccion-indice');

    enlaces.forEach(enlace=>{

        // console.log("Accediendo a enlaces");

        // Al principio se selecciona 'Todas'
        if(enlace.innerHTML=='Todas'){
            enlace.classList.add(SELECTED_STYLE);
            selected=enlace;
        } else {
            // console.log(enlace.innerHTML);
            enlace.classList.add(NOT_SELECTED_STYLE);
        }
        

        enlace.addEventListener('click', e=>{
            e.preventDefault();

            // Si el enlace no es el que había seleccionado
            if(enlace!=selected){

                // Cambio los estilo de la caja
                selected.classList.remove(SELECTED_STYLE);
                selected.classList.add(NOT_SELECTED_STYLE);

                enlace.classList.remove(NOT_SELECTED_STYLE);
                enlace.classList.add(SELECTED_STYLE);
                
                selected=enlace;

                if(enlace.innerHTML=="Todas"){
                    // Muestro todas las secciones
                    secciones_indice.forEach(seccion=>{
                        seccion.classList.remove(oculto);
                    })
                } else {
                    // Oculto todas las secciones que no sean esta
                    secciones_indice.forEach(seccion=>{
                        if(seccion.id!=enlace.innerHTML){
                            console.log(`ocultando ${seccion.id}`);
                            seccion.classList.add(oculto);
                        } else {
                            console.log(`mostrando ${seccion.id}`);
                            seccion.classList.remove(oculto);
                        }
                    })
                }

                
            }

        })
    })
}

function updateSongContr(id, target) {

    let link =target.closest("a")??target.querySelector("a");

    console.log(link);

    let title = link.querySelector("#song-title").innerHTML;
    let author = link.querySelector("#author").innerHTML;
    let ref = link.href;

    sesiones[id].push({titulo:title, autor:author, href:ref});
    guardarSesiones();
    editSesionContr(id);
}

function removeSongContr(sesion, id) {

    console.log(sesion);

    if(window.confirm(`Está seguro de querer eliminar la canción "${sesiones[sesion][id].titulo}" de la sesión "${sesiones[sesion][0]}"?\nAVISO: Esta acción no se puede deshacer`)) {
        sesiones[sesion].splice(id, 1);
        guardarSesiones();

        editSesionContr(sesion);
    }    
}

function loadSesionContr(id) {
    document.getElementById("titulo").innerHTML = `<h2>${sesiones[id][0]}</h2>`
    document.getElementById("main").innerHTML = loadSesionView(id);

    let entradas = document.querySelectorAll("#lista-canciones");

    console.log(entradas.length)

    entradas.forEach(entrada => {
        entrada.addEventListener('click', ev => {
            let href = entrada.querySelector('a');
            window.open(href.href, "_self");
        })
    })

    document.getElementById("boton-volver-pagina-principal").innerHTML = ICONO_VOLVER;
}


// EVENTOS
document.addEventListener('click', ev=>{
    if      (ev.target.matches('#nueva-sesion, #nueva-sesion *')) newSesionContr();
    else if (ev.target.matches('#editar-titulo-sesion, #editar-titulo-sesion *')) editTitleContr(ev.target.dataset.myId);
    else if (ev.target.matches('#actualizar-titulo-sesion *, #actualizar-titulo-sesion')) updateTitleContr(ev.target.dataset.myId);
    else if (ev.target.matches('#pagina-principal, #pagina-principal *')) indexContr();
    else if (ev.target.matches('#editar-sesion, #editar-sesion *')) editSesionContr(ev.target.dataset.myId);
    else if (ev.target.matches('#eliminar-sesion, #eliminar-sesion *'))  deleteSesionContr(ev.target.dataset.myId);
    else if (ev.target.matches("#add-cancion, #add-cancion *")) addSongContr(ev.target.dataset.myId);
    else if (ev.target.matches("#cancelar-add-cancion, #cancelar-add-cancion *")) editSesionContr(ev.target.dataset.myId);
    else if (ev.target.matches("#lista-canciones-add .seccion-indice *")) {
        ev.preventDefault();
        updateSongContr(ev.target.dataset.myId, ev.target);
    } else if (ev.target.matches("#eliminar-cancion, #eliminar-cancion *")) removeSongContr(ev.target.dataset.mySesion, ev.target.dataset.myId)
    else if (ev.target.matches("#entrada-sesion")) loadSesionContr(ev.target.dataset.myId);
    else if (ev.target.matches("#guardar-sesion, #guardar-sesion *")) loadSesionContr(ev.target.dataset.myId);
})

document.addEventListener('keyup', ev => {
    if (ev.target.matches("#barra-busqueda-canciones-sesion")){
        busqueda(ev.target.value);
    }
})

document.addEventListener('DOMContentLoaded', ev=> indexContr());