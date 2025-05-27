import {busqueda, comprobarVacio} from './buscador_new.js';

let enlaces;
let entradas_indice;
let selected_style='selected';
let not_selected_style='not-selected';
let secciones_indice;

let oculto='hidden';

let selected;

window.addEventListener('load', async function(){

    await loadIndex("./songs/0-data.txt");

    enlaces=this.document.querySelectorAll('#indice #enlaces a');
    secciones_indice=this.document.querySelectorAll('.seccion-indice');

    entradas_indice=this.document.querySelectorAll('.seccion-indice ol li')

    enlaces.forEach(enlace=>{

        console.log("Accediendo a enlaces");

        // Al principio se selecciona 'Todas'
        if(enlace.innerHTML=='Todas'){
            enlace.classList.add(selected_style);
            selected=enlace;
        } else {
            console.log(enlace.innerHTML);
            enlace.classList.add(not_selected_style);
        }
        

        enlace.addEventListener('click', e=>{
            e.preventDefault();

            // Si el enlace no es el que había seleccionado
            if(enlace!=selected){

                // Cambio los estilo de la caja
                selected.classList.remove(selected_style);
                selected.classList.add(not_selected_style);

                enlace.classList.remove(not_selected_style);
                enlace.classList.add(selected_style);
                
                selected=enlace;

                if(enlace.innerHTML=="Todas"){
                    // Muestro todas las secciones
                    secciones_indice.forEach(seccion=>{
                        // Muestro todas
                        seccion.classList.remove(oculto);

                        // Oculto las que no se correspondan con el criterio de búsqueda
                        if(this.document.getElementById('buscador').value != '') {
                            busqueda(this.document.getElementById('buscador').value);
                        }
                    })
                } else {
                    // Oculto todas las secciones que no sean esta
                    secciones_indice.forEach(seccion=>{

                        // Muestro solo la seccion correspondiente
                        if(seccion.id!=enlace.innerHTML){
                            // console.log(`ocultando ${seccion.id}`);
                            seccion.classList.add(oculto);
                        } else {
                            // console.log(`mostrando ${seccion.id}`);
                            seccion.classList.remove(oculto);
                        }
                    })

                    comprobarVacio();
                }

                
            }

        })
    })

    entradas_indice.forEach(entrada=>{
        let href=entrada.querySelector('a');

        if(href){
            entrada.addEventListener('click', e=>{
                this.window.open(href.href, "_self");
            })
        }
    })
});

async function loadIndex(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error('Error al cargar el archivo');
        }
        const text = await response.text();
        document.getElementById('indice').innerHTML = text;

    } catch (error) {
        document.getElementById('indice').innerHtml = 'Error al cargar el archivo: ' + error.message;
    }
}
