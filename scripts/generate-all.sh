#!/bin/bash

process_string() {
    local input="$1"
    local part1
    local part2

    # Comprobar si el carácter '-' está presente en la cadena
    if [[ "$input" == *-* ]]; then
        # Separar la cadena en dos partes por el carácter '-'
        part1=$(echo "$input" | cut -d'-' -f1)
        part2=$(echo "$input" | cut -d'-' -f2)

        # Reemplazar '_' por ' ' en ambas partes
        part1=$(echo "$part1" | tr '_' ' ')
        part2=$(echo "$part2" | tr '_' ' ')

        # Eliminar la extensión '.dat' en la segunda parte
        part2=$(echo "$part2" | sed 's/\.dat$//')
    else
        # Si no hay '-', toda la cadena es la parte 1 y la parte 2 está vacía
        part1=$(echo "$input" | tr '_' ' ')
        part2=""

        # Eliminar la extensión '.dat' en la primera parte
        part1=$(echo "$part1" | sed 's/\.dat$//')
    fi

    # Devolver los resultados separados por un delimitador
    echo "$part1|$part2"
}


dir_data=./cpp/songs
dir_html=./songs
script=./scripts/generate.sh
index_file=./songs/data.txt

n=1

# Vacío el archivo de índice
echo > $index_file

for file in $(ls $dir_data); 
do
    echo "------------------------------------------"
    $script $dir_data/$file
    result=$(process_string $file)
    title=$(echo "$result" | cut -d'|' -f1)
    author=$(echo "$result" | cut -d'|' -f2)
    filename=$(echo "$file" | cut -d'.' -f1)

    echo "Nombre de archivo: $filename"
    echo "Título: $title"
    echo "Autor:  $author"

    echo "<a href=\"$dir_html/$filename.html\">$n. <span id=\"song-title\">$title</span> <span id=\"author\">$author</span></a><br>" >> $index_file
    n=$((n+1))

done

printf "\n\n"
echo Se han generado $n archivos