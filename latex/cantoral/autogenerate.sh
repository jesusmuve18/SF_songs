#!/bin/bash

# Script que añade todas las canciones de $dir_origin al documento $out

# cd ./latex/cantoral

#Parámetros
out=./cantoral.tex
dir_origin=../../cpp/songs
script=../../cpp/to_latex

################################################################################
# Obtengo el array de archivos ordenado como si '_' fuera ' '

archivos=($(find "$dir_origin" -maxdepth 1 -type f -exec basename {} \;))

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

# Ya están ordenados y listos para su uso (devueltos al formato original)
################################################################################

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

echo "    \end{multicols*}

\end{document}" >> $out