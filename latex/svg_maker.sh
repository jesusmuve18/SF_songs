#!/bin/bash

generator=./diagram_maker.pdf
out_dir=../images/svg_chords

pdftocairo -svg -r 1000 -nocrop -nocenter -x 50 -y 35 -W 80 -H 120 $generator $out_dir/$1.svg

linea1="<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
linea2="<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"130pt\" height=\"150pt\" viewBox=\"0 0 70 90\" version=\"1.2\">"

# Crear un archivo temporal
archivo_tmp=$(mktemp)
archivo=$out_dir/$1.svg

# Guardar las líneas nuevas en el archivo temporal
echo "$linea1" > "$archivo_tmp"
echo "$linea2" >> "$archivo_tmp"

# Agregar el resto del archivo original desde la línea 3 en adelante al archivo temporal
tail -n +3 "$archivo" >> "$archivo_tmp"

# Mover el archivo temporal al archivo original
mv "$archivo_tmp" "$archivo"