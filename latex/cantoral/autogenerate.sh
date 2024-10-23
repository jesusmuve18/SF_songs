#!/bin/bash

# Script que añade todas las canciones de $dir_origin al documento $out

# cd ./latex/cantoral

lista_directorio() {

    # Dado un directorio pasado como parámetro obtiene la lista de archivos ordenada 
    # por orden alfabético como si '_' fuese ' '

    local dir_origin=$1
    local archivos=($(find "$dir_origin" -maxdepth 1 -type f -exec basename {} \;))

    # Reemplazar '_' por ' ' en cada elemento del array
    for i in "${!archivos[@]}"; do
        archivos[$i]=$(echo "${archivos[$i]}" | sed 's/_/ /g')
    done

    # Ordeno los archivos por orden alfabético
    mapfile -t archivos < <(printf "%s\n" "${archivos[@]}" | sort)

    # Recorro los archivos y le vuelvo a cambiar ' ' por '_'
    for i in "${!archivos[@]}"; do
        archivos[$i]=$(echo "${archivos[$i]}" | sed 's/ /_/g')
    done

    echo "${archivos[@]}"
}

obtener_subcarpetas() {
    # Dado un directorio pasado como parámetro devuelve un array con todas
    # las subcarpetas que contiene
    local directorio="$1"
    subcarpetas=()
    for dir in "$directorio"/*/; do
        [ -d "$dir" ] && subcarpetas+=("$(basename "$dir")")
    done
    echo "${subcarpetas[@]}"
}

#Parámetros
out=./tmp.tex
dir_origin=../../cpp/songs
script=../../cpp/to_latex

archivos=($(lista_directorio $dir_origin))
carpetas=($(obtener_subcarpetas $dir_origin))

# Vacío el archivo de salida y lo relleno con la plantilla
echo "\documentclass[12pt]{article}
\usepackage[margin=2cm]{geometry} % Establece todos los márgenes en 2cm

\input{style.tex}

% \renewcommand{\chord}[3]{#3} % Quitar acordes

\begin{document}
 
    % helvetica en el cuerpo del documento
    \sffamily

    \portada[titulo=Cantoral, subtitulo=Grupo San Francisco]
    \newpage
    \tableofcontents
    \newpage

    \seccion{General}

    \begin{multicols*}{2}
    " > $out

# Añado los archivos del directorio principal
for file in "${archivos[@]}"; 
do  
    
    if [ -f "$dir_origin/$file" ]; then
        echo "Archivo: $(basename "$file")"

        $script $dir_origin/$file >> $out
        echo >> $out

    elif [ -d "$dir_origin/$file" ]; then
        echo "Carpeta: $(basename "$dir_origin/$file")"
    fi
done

# Añado el resto de archivos de las carpetas

for dir in "${carpetas[@]}";
do
    # Le quito el número y cambio '_' por ' '
    sub_dir_name=$(echo "$(echo $dir | tr '_' ' ')" | cut -d '-' -f 2-)

    if [ "${sub_dir_name}" != "Otras" ]; then
        archivos=($(lista_directorio $dir_origin/$dir))

        echo "\\end{multicols*}" >> $out
        echo "\\newpage" >> $out
        echo "\\seccion{$sub_dir_name}" >> $out
        echo "\\begin{multicols*}{2}" >> $out

        echo "-----------------------------------------------------------------"
        echo "Carpeta: $sub_dir_name"
        echo "................................................................."

        for file in "${archivos[@]}"; 
        do  
            if [ -f "$dir_origin/$dir/$file" ]; then
                echo "Archivo: $(basename "$file")"

                $script $dir_origin/$dir/$file >> $out
                echo >> $out

            elif [ -d "$dir_origin/$dir/$file" ]; then
                echo "Carpeta: $(basename "$dir_origin/$dir/$file")"
            fi
        done
    fi
done

echo "    \end{multicols*}

\end{document}" >> $out