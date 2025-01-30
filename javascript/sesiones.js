// MODELO
const INICIAL = JSON.stringify([]);
const TITULO = `<h2>Sesiones</h2>`;

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

    console.log(w);

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
        res+=`<li><a id="entrada-sesion" data-my-id=${i}>${s[0]}</a>
              <button id="editar-sesion" data-my-id="${i}">Editar</button>
              <button id="eliminar-sesion" data-my-id="${i}">Eliminar</button></li>`;
        i++;
    });

    res+=`</ul>`;

    res+=`<button id="nueva-sesion">Nueva</button>`;

    return res;
}

function editSesionView(id){

    let res=`<ol>`;

    for(let i=1; i<sesiones[id].length; i++) {
        res+=`<li>${sesiones[id][i].titulo} ${sesiones[id][i].autor} <button id="eliminar-cancion" data-my-sesion="${id}" data-my-id="${i}">Eliminar</button></li>`;
    }

    res += `</ol>`;
    res += `<button id="add-cancion" data-my-id="${id}">Añadir</button>`
    res += `<button id="pagina-principal">Volver</button>`;
    return res;
}

function editTitleView(id) {
    return `<input type="text" id="titulo-sesion-input" value="${sesiones[id][0]}">
            <button id="actualizar-titulo-sesion" data-my-id="${id}">Aceptar</button>`;
}

function updateTitleView(id) {

    titulo_sesion = document.getElementById("titulo-sesion-input").value;

    if(titulo_sesion!="") {
        console.log(`Actualizando el titulo de la sesion ${id}`);

        console.log(`Se quiere actualizar ${sesiones[id][0]} a ${titulo_sesion}`);

        sesiones[id][0]=titulo_sesion;
        guardarSesiones();
    }

    return `<h2 id="titulo-sesion">${sesiones[id][0]}</h2>
            <button id="editar-titulo-sesion" data-my-id="${id}">Editar</button>`;
}

async function addSongView(id) {

    let res = `<input id="barra-busqueda-canciones-sesion" placeholder="Buscar canciones...">`
    res += `<button id="cancelar-add-cancion" data-my-id="${id}">Cancelar</button>`;
    // console.log(res);

    res += `<div id="lista-canciones-add">`;
    res += await loadIndex("./songs/0-data.txt");
    res += `</div>`;


    return res;
}

function loadSesionView(id){
    let res=`<ol>`;

    for(let i=1; i<sesiones[id].length; i++){
        res+=`<li><a href="${sesiones[id][i].href}"><span id="song-title">${sesiones[id][i].titulo}</span> <span id="author">${sesiones[id][i].autor}</span></a></li>`
    }

    res+=`</ol>`

    res += `<!--button id="editar-sesion" data-my-id="${id}">Editar</button-->`;
    res += `<button id="pagina-principal">Volver</button>`;

    return res;
}

// CONTROLADORES

function indexContr() {
    document.getElementById("titulo").innerHTML = TITULO;
    document.getElementById("main").innerHTML = indexView(sesiones);
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
                                                   <button id="editar-titulo-sesion" data-my-id="${id}">Editar</button>`;
    document.getElementById("main").innerHTML = editSesionView(id);
}

function editTitleContr(id) {
    document.getElementById("titulo").innerHTML = editTitleView(id);
}

function updateTitleContr(id) {
    document.getElementById("titulo").innerHTML = updateTitleView(id);
}


function deleteSesionContr(id) {
    console.log(`Se quiere eliminar la sesion ${id}`);
    if(window.confirm(`Está seguro de eliminar la sesión "${sesiones[id][0]}".\n\nAVISO: esta acción no se puede deshacer`)){
        sesiones.splice(id,1);
        guardarSesiones();
        indexContr();
    }
}

async function addSongContr(id) {
    console.log("click");

    // Cargo el índice
    document.getElementById("main").innerHTML = await addSongView(id);

    // Elimino los enlaces del principio
    // document.getElementById("enlaces").outerHTML = "";

    // Formateo toda la lista
    let list = document.querySelectorAll("#lista-canciones-add li");

    list.forEach(li =>{
        li.dataset.myId = id; 
        li.querySelector("#song-title").dataset.myId = id;
        li.querySelector("#author").dataset.myId = id;
    })
}

function updateSongContr(id, target) {

    let link =target.closest("a");

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

    sesiones[sesion].splice(id, 1);
    guardarSesiones();

    editSesionContr(sesion);
}

function loadSesionContr(id) {
    document.getElementById("titulo").innerHTML = `<h2>${sesiones[id][0]}</h2>`
    document.getElementById("main").innerHTML = loadSesionView(id);
}


// EVENTOS
document.addEventListener('click', ev=>{
    if      (ev.target.matches('#nueva-sesion')) newSesionContr();
    else if (ev.target.matches('#editar-titulo-sesion')) editTitleContr(ev.target.dataset.myId);
    else if (ev.target.matches('#actualizar-titulo-sesion')) updateTitleContr(ev.target.dataset.myId);
    else if (ev.target.matches('#pagina-principal')) indexContr();
    else if (ev.target.matches('#editar-sesion')) editSesionContr(ev.target.dataset.myId);
    else if (ev.target.matches('#eliminar-sesion'))  deleteSesionContr(ev.target.dataset.myId);
    else if (ev.target.matches("#add-cancion")) addSongContr(ev.target.dataset.myId);
    else if (ev.target.matches("#cancelar-add-cancion")) editSesionContr(ev.target.dataset.myId);
    else if (ev.target.matches("#lista-canciones-add *")) {
        ev.preventDefault();
        updateSongContr(ev.target.dataset.myId, ev.target);
    } else if (ev.target.matches("#eliminar-cancion")) removeSongContr(ev.target.dataset.mySesion, ev.target.dataset.myId)
    else if (ev.target.matches("#entrada-sesion")) loadSesionContr(ev.target.dataset.myId);
})

document.addEventListener('keyup', ev => {
    if (ev.target.matches("#barra-busqueda-canciones-sesion")){
        busqueda(ev.target.value);
    }
})

document.addEventListener('DOMContentLoaded', ev=> indexContr());