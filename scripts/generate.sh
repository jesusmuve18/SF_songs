#!/bin/bash

# Se le deberá asignar un archivo con el formato: Titulo_de_canción-Artista.dat   (sin extensión)
#
# Previamente deberá existir el archivo Titulo_de_canción-Artista.dat en el directorio pasado como primer argumento
# Se recomienda no superar el límite de 39 caracteres por línea (para evitar problemas en la visualización)

get_directory_and_filename() {
    local filepath="$1"
    local directory
    local filename_with_extension
    local filename

    # Obtener el directorio de la ruta
    directory=$(dirname "$filepath")

    # Obtener el nombre del archivo con la extensión
    filename_with_extension=$(basename "$filepath")

    # Obtener solo el nombre del archivo sin la extensión
    filename=$(echo "$filename_with_extension" | sed 's/\.[^.]*$//')

    # Devolver los valores separados usando echo
    echo "$directory"
    echo "$filename"
}

song_dir="./songs";

if [ $# -eq 1 ]
then
    # dir=$1
    # song=get_filename

    result=$(get_directory_and_filename "$1")
    dir=$(echo "$result" | head -n 1)   # Primer línea es el directorio
    song=$(echo "$result" | tail -n 1)    # Segunda línea es el nombre del archivo

    # echo "Directorio: $dir"
    # echo "Canción: $song"

    touch $song_dir/$song.html
    touch ./cpp/out/$song.out

    ./cpp/process $dir/$song.dat > ./cpp/out/$song.out
    ./cpp/hacer_plantilla ./cpp/out/$song.out > $song_dir/$song.html


else
    echo "Error. Número de parámetros incorrecto"
fi