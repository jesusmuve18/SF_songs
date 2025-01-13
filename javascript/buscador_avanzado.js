let escribiendo=false;
let barra_busqueda;
let visible=('visible-list-item')

window.addEventListener('load', function() {
    barra_busqueda = document.querySelector('#buscador');
});

// Levenshtein(String, String) -> Integer
function Levenshtein(a, b) {
    var n = a.length;
    var m = b.length;

    // matriz de cambios mínimos
    var d = [];

    // si una de las dos está vacía, la distancia
    // es insertar todas las otras
    if(n == 0)
        return m;
    if(m == 0)
        return n;

    // inicializamos el peor caso (insertar todas)
    for(var i = 0; i <= n; i++)
        (d[i] = [])[0] = i;
    for(var j = 0; j <= m; j++)
        d[0][j] = j;

    // cada elemento de la matriz será la transición con menor coste
    for(var i = 1, I = 0; i <= n; i++, I++)
      for(var j = 1, J = 0; j <= m; j++, J++)
          if(b[J] == a[I])
              d[i][j] = d[I][J];
          else
              d[i][j] = Math.min(d[I][j], d[i][J], d[I][J]) + 1;

    // el menor número de operaciones
    return d[n][m];
}

function similar (A, B){

    let result=(A.length==0);
    const umbral=2;

    // Hago minúsculas las palabras
    A=A.toLowerCase();
    B=B.toLowerCase();

    if(B.length>0 && A.length>=1){

        // Compruebo si está contenida alguna en la otra
        result=B.includes(A);

        if(result){
            console.log(`${B} incluye ${A}`);
        }

        if(!result && B.length>umbral && A.length>umbral){
            result=(+Levenshtein(A,B.substr(0,A.length))<=umbral);
        }

        if(result){
            console.log(`Comparando ${A} con ${B.substr(0,A.length)}`);
            console.log(`Distancia: ${+Levenshtein(A,B.substr(0,A.length+umbral))}`);
        }
    }

    return result;
}


function busqueda(w) {
    const enlaces = document.querySelector('#enlaces');
        
    // Ocultar los enlaces iniciales al empezar a buscar
    if(w.toLowerCase() == ""){
        enlaces.classList.remove(oculto);
    } else {
        enlaces.classList.add(oculto);
    }

    // Seleccionar el índice
    const container = document.getElementById('indice');

    // Seleccionar todos los <li> dentro del contenedor
    const listItems = container.querySelectorAll('#indice li');

    // Recorrer los elementos <li> y extraer los detalles
    listItems.forEach(li => {
        const titleElement = li.querySelector('#song-title');

        const authorElement = li.querySelector('#author');
        const title = titleElement ? titleElement.textContent.trim() : 'Título no encontrado';
        const author = authorElement ? authorElement.textContent.trim() : 'Autor no encontrado';

        // console.log(`${title}, ${author}`);

        if( similar(w, title)
            || similar(w, author)
            || similar(w, (`${title} ${author}`))) {
            li.classList.remove(oculto);
            li.classList.add(visible);
        } else {
            li.classList.remove(visible);
            li.classList.add(oculto);
        }
    });
}



document.addEventListener("keyup", e=>{
    if(e.target.matches("#buscador")){

        escribiendo=true;

        // Ocultar el teclado al pulsar enter
        if(e.key == 'Enter'){
            e.target.blur();
            escribiendo=false;
        } else {
            busqueda(e.target.value);
        }   

    } else {

        if(e.key != "Tab" && e.key != "ArrowDown" && e.key != 'ArrowUp'){
            // Si no se pulsa sobre el input, al escribir aparecerá en el input
            // Mostraré el input
            if(!mostrar_buscar){
                menu_buscar.classList.remove(oculto);
                mostrar_buscar=true;
                this.document.querySelector('#buscador').focus();
            }

            barra_busqueda.focus();

            if (/^[a-zA-Z0-9]$/.test(e.key)){
                barra_busqueda.value=e.key;
                escribiendo=true;
                busqueda(e.key);
            } else 
                barra_busqueda.select();
        }
    }
})

let primera_vez=true;

// La primera vez que se clica en la página se empieza a escuchar el click en la barra de busqueda
document.addEventListener('click', e => {
    if(primera_vez){
            barra_busqueda.addEventListener('click', function() {
            // Si no se está escribiendo se selecciona el texto
            if(!escribiendo){
                barra_busqueda.select();
            }
        })

        primera_vez=false;
    }
})
