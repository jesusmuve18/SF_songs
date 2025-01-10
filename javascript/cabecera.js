let icono_buscar, icono_menu, enlaces_menu, menu, menu_buscar;

let mostrar_menu;
let mostrar_buscar;

let oculto='hidden';

window.addEventListener('load', function(){
    icono_buscar=this.document.querySelector('#icono-buscar');
    icono_menu=this.document.querySelector('#icono-menu');
    menu=this.document.querySelector('#cabecera nav');
    menu_buscar=this.document.querySelector('#cabecera #contenedor-buscador');
    enlaces_menu=this.document.querySelectorAll('#cabecera nav ul li');

    mostrar_menu=false;
    mostrar_buscar=false;

    menu.classList.add(oculto);
    menu_buscar.classList.add(oculto);

    icono_buscar.addEventListener('click', e=>{
        console.log('pulsado sobre buscar');

        // Oculto el menú si está activado
        if(mostrar_menu){
            menu.classList.add(oculto);
            mostrar_menu=false;
        }

        if(mostrar_buscar){
            menu_buscar.classList.add(oculto);
            mostrar_buscar=false;
        } else {
            menu_buscar.classList.remove(oculto);
            mostrar_buscar=true;
        }
    });

    icono_menu.addEventListener('click', e=>{
        console.log('pulsado sobre menu');

        // Oculto el buscador si está activado
        if(mostrar_buscar){
            menu_buscar.classList.add(oculto);
            mostrar_buscar=false;
        }

        if(mostrar_menu){
            menu.classList.add(oculto);
            mostrar_menu=false;
        } else {
            menu.classList.remove(oculto);
            mostrar_menu=true;
        }
    });

    enlaces_menu.forEach(enlace=>{
        enlace.addEventListener('click', e=>{
            this.window.open(enlace.querySelector('a').href, "_self");
        });
    })


})