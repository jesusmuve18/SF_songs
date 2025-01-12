let icono_buscar, icono_menu, icono_tool, enlaces_menu, menu, menu_buscar, menu_tools;

let mostrar_menu;
let mostrar_buscar;
let mostrar_tools;

let oculto='hidden';
let visible_tools='visible-tools';

window.addEventListener('load', function(){
    icono_buscar=this.document.querySelector('#icono-buscar');
    icono_menu=this.document.querySelector('#icono-menu');
    icono_tool=this.document.querySelector('#icono-tools');

    menu=this.document.querySelector('#cabecera nav');
    menu_buscar=this.document.querySelector('#cabecera #contenedor-buscador');
    enlaces_menu=this.document.querySelectorAll('#cabecera nav ul li');
    menu_tools=this.document.querySelector('#contenedor-tools');

    mostrar_menu=false;
    mostrar_buscar=false;
    mostrar_tools=false;

    menu.classList.add(oculto);
    menu_buscar.classList.add(oculto);
    menu_tools.classList.add(oculto);

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
            this.document.querySelector('#buscador').focus();
        }
    });

    icono_menu.addEventListener('click', e=>{
        console.log('pulsado sobre menu');

        // Oculto el buscador si está activado
        if(mostrar_buscar){
            menu_buscar.classList.add(oculto);
            mostrar_buscar=false;
        }

        // Oculto las herramientas si están activadas
        if(mostrar_tools){
            menu_tools.classList.remove(visible_tools);
            menu_tools.classList.add(oculto);
            mostrar_tools=false;
        }

        if(mostrar_menu){
            menu.classList.add(oculto);
            mostrar_menu=false;
        } else {
            menu.classList.remove(oculto);
            mostrar_menu=true;
        }
    });

    icono_tool.addEventListener('click', e=>{
        console.log("pulsado sobre herramientas");

        // Oculto el menú si está activado
        if(mostrar_menu){
            menu.classList.remove(visible_tools);
            menu.classList.add(oculto);
            mostrar_tools=false;
        }

        if(mostrar_tools){
            menu_tools.classList.remove(visible_tools);
            menu_tools.classList.add(oculto);
            mostrar_tools=false;
        } else {
            menu_tools.classList.remove(oculto);
            menu_tools.classList.add(visible_tools);
            mostrar_tools=true;
        }
    })

    enlaces_menu.forEach(enlace=>{
        enlace.addEventListener('click', e=>{
            this.window.open(enlace.querySelector('a').href, "_self");
        });
    })


})