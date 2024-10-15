#!/bin/bash

cd ./latex/cantoral

#Parámetros
out=./cantoral.tex
dir_origin=../../cpp/songs
script=../../cpp/to_latex


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

for file in "$dir_origin"/*; do
    if [ -f "$file" ]; then
        echo "Archivo: $(basename "$file")"

        $script $file >> $out
        echo >> $out

    elif [ -d "$file" ]; then
        echo "Carpeta: $(basename "$file")"
    fi
done

echo "    \end{multicols*}

\end{document}" >> $out