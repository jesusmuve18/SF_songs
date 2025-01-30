// MODELO
const INICIAL = JSON.stringify([]);
const TITULO = `<h2>Sesiones</h2>`;

localStorage.setItem('sesiones', localStorage.getItem('sesiones') || INICIAL);
// localStorage.setItem('sesiones', INICIAL);

let sesiones = JSON.parse(localStorage.getItem('sesiones'));
let titulo_sesion;


function guardarSesiones(){
    localStorage.setItem('sesiones', JSON.stringify(sesiones));
}

// VISTAS

function indexView(sesiones){
    
    let res = "<ul>";
    let i=0;

    sesiones.forEach(s => {
        res+=`<li> ${s} 
              <button id="editar-sesion" data-my-id="${i}">Editar</button>
              <button id="eliminar-sesion" data-my-id="${i}">Eliminar</button></li>`;
        i++;
    });

    res+=`</ul>`;

    res+=`<button id="nueva-sesion">Nueva</button>`;

    return res;
}

function editSesionView(){
    return `<button id="pagina-principal">Volver</button>`;
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
    document.getElementById("main").innerHTML = editSesionView(titulo_sesion);
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


// EVENTOS
document.addEventListener('click', ev=>{
    if      (ev.target.matches('#nueva-sesion')) newSesionContr();
    else if (ev.target.matches('#editar-titulo-sesion')) editTitleContr(ev.target.dataset.myId);
    else if (ev.target.matches('#actualizar-titulo-sesion')) updateTitleContr(ev.target.dataset.myId);
    else if (ev.target.matches('#pagina-principal')) indexContr();
    else if (ev.target.matches('#editar-sesion')) editSesionContr(ev.target.dataset.myId);
    else if (ev.target.matches('#eliminar-sesion'))  deleteSesionContr(ev.target.dataset.myId);
})

document.addEventListener('DOMContentLoaded', ev=> indexContr());