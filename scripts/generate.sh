#!/bin/bash

# Se le deben pasar 2 parámetros:
# - Directorio donde se encuentra la canción
# - Nombre de la canción: Con el formato: Titulo_de_canción-Artista   (sin extensión)
#
# Previamente deberá existir el archivo Titulo_de_canción-Artista.dat en el directorio pasado como primer argumento

song_dir="./songs";

if [ $# -eq 2 ]
then
    dir=$1
    song=$2

    echo "Directorio: $dir"
    echo "Canción: $song"

    touch $song_dir/$song.html
    touch ./cpp/out/$song.out

    ./cpp/process $dir/$song.dat > ./cpp/out/$song.out
    ./cpp/hacer_plantilla ./cpp/out/$song.out > $song_dir/$song.html


else
    echo "Error. Número de parámetros incorrecto"
fi