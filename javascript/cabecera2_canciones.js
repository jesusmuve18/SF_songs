let icono_buscar='#icono-buscar, #icono-buscar *';
let icono_menu='#icono-menu, #icono-menu *';
let icono_tool='#icono-tools, #icono-tools *';

let menu=document.querySelector('#cabecera nav');
let menu_buscar=document.querySelector('#cabecera #contenedor-buscador');
let menu_tools=document.querySelector('#contenedor-tools');

let enlaces_menu='#cabecera nav ul li, #cabecera nav ul li *';

let oculto='hidden';
let visible_tools='visible-tools';

let menus = [menu, menu_buscar, menu_tools];
let iconos = [icono_menu, icono_buscar, icono_tool];
let mostrando = [false, false, false]; // Estado inicial de cada menú

function ocultar(elemento) {
    elemento.classList.add(oculto);
}

function mostrar(elemento) {
    elemento.classList.remove(oculto);
}

function ocultarTodo(){
    for(let i=0; i<menus.length; i++){
        ocultar(menus[i]);
    }
}

document.addEventListener('click', ev=>{

    let encontrado=false;

    for(let i=0; i<iconos.length; i++) {

        if(ev.target.matches(iconos[i])){
            ocultarTodo();

            if(!mostrando[i]){
                mostrar(menus[i]);
                mostrando[i] = true;
            } else {
                mostrando[i] = false;
            }

            encontrado=true;
        }
    }

    if(!encontrado) {
        
        
        if(ev.target.matches(enlaces_menu)){
            let link =ev.target.querySelector("a")??ev.target.parentElement.querySelector("a");
            window.open(link.href, "_self");
            encontrado=true;
        }

        // No ocultar los menús si es uno de ellos
        if(ev.target.matches('#contenedor-buscador *') ||
           ev.target.matches('#contenedor-tools *')){
            encontrado=true;
        };

        if(!encontrado) {
            ocultarTodo();

            for(let i=0; i<mostrando.length; i++){
                mostrando[i]=false;
            }
        }
        
    }
})

document.addEventListener('DOMContentLoaded', ev=>{

    // Compruebo los menús disponibles
    for(let i=0; i<menus.length; i++){

        if(!menus[i]){
            menus.splice(i, 1);
            iconos.splice(i,1);
            mostrando.splice(i, 1);
            i--;
        }
    }

    // Oculto los menús disponibles
    ocultarTodo();

    document.querySelector('#cabecera nav').innerHTML = 
    `<ul>
        <li><a href="../index.html">Inicio</a><img src="../images/right-arrow.svg"></li>
        <li><a href="../indice.html">Indice</a><img src="../images/right-arrow.svg"></li>
        <li><a href="../sesiones.html">Sesiones</a><img src="../images/right-arrow.svg"></li>
        <li><a href="../acordes.html">Acordes</a><img src="../images/right-arrow.svg"></li>
        <li><a href="../about.html">Acerca de</a><img src="../images/right-arrow.svg"></li>
    </ul>`;
})