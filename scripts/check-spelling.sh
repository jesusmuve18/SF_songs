#!/bin/bash

directorios=("./cpp/songs/" "./cpp/songs/1-Oración" "./cpp/songs/2-Dios_mío_y_todas_mis_cosas" "./cpp/songs/3-Qué_noche_tan_grande" "./cpp/songs/4-Te_llena_de_vida")


for dir in "${directorios[@]}"; do
    for file in $dir/*.dat; do
        echo "revisando $dir/$file"
        aspell check "$file"
    done
done