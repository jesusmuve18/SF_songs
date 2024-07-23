#!/bin/bash

dir=./cpp/songs

title=$1
author=$2
song="$3"
folder=$4
separator=/
union=-

if [ "$folder" = "General" ]; then
    echo Categoría: General
	folder=""
    separator=""
fi

if [ "$author" = "" ]; then
	union=""
fi
# Sustituyo ' ' por '_'
title=$(echo "$title" | sed 's/ /_/g')
author=$(echo "$author" | sed 's/ /_/g')
folder=$(echo "$folder" | sed 's/ /_/g')

# echo "Se va a crear $dir/$folder$separator$title-$author.dat"
# touch $dir/$folder$separator$title-$author.dat

# echo $song > $dir/$folder$separator$title-$author.dat

file_path="$dir/$folder$separator$title$union$author.dat"

echo "Se va a crear $file_path"
touch "$file_path"

# Usar printf para escribir el contenido del texto, preservando los saltos de línea
printf "%s" "$song" > "$file_path"
