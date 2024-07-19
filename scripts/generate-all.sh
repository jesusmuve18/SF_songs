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

obtener_subcarpetas() {
    local directorio="$1"
    subcarpetas=()
    for dir in "$directorio"/*/; do
        [ -d "$dir" ] && subcarpetas+=("$(basename "$dir")")
    done
    echo "${subcarpetas[@]}"
}


dir_data=./cpp/songs
dir_html=./songs
script=./scripts/generate.sh
index_file=./songs/data.txt

total_files=0
n=1

# Vacío el archivo de índice
echo > $index_file

# Obtengo las subcarpetas
subcarpetas=($(obtener_subcarpetas $dir_data))

echo "<div id=\"enlaces\">" >> $index_file
# Añado los enlaces al índice
for sub_dir in "${subcarpetas[@]}";
do
    # Le quito el número y cambio '_' por ' '
    sub_dir_name=$(echo "$( echo $sub_dir | tr '_' ' ')" | cut -d '-' -f 2-)

    echo "  <a href=\"#$sub_dir_name\">$sub_dir_name</a>" >> $index_file
done

echo "</div>" >> $index_file

for file in $(ls $dir_data); 
do
    if [[ ! -d "$dir_data/$file" ]]; then # Solo recorro los archivos
        echo "------------------------------------------"
        $script $dir_data/$file
        result=$(process_string $file)
        title=$(echo "$result" | cut -d'|' -f1)
        author=$(echo "$result" | cut -d'|' -f2)
        filename=$(echo "$file" | cut -d'.' -f1)

        echo "Nombre de archivo: $filename"
        echo "Título: $title"
        echo "Autor:  $author"

        # La añado al índice
        echo "<a href=\"$dir_html/$filename.html\">$n. <span id=\"song-title\">$title</span> <span id=\"author\">$author</span></a><br>" >> $index_file
        
        # Aumento el contador
        n=$((n+1))
        total_files=$(($total_files+1))
    fi

done


# Recorro las subcarpetas
for sub_dir in "${subcarpetas[@]}"; 
do
    echo "........................................."

    echo "Añadiendo canciones de $sub_dir..."

    # Le quito el número y cambio '_' por ' '
    sub_dir_name=$(echo "$( echo $sub_dir | tr '_' ' ')" | cut -d '-' -f 2-)

    # La añado al índice
    echo "<h2 id=\"$sub_dir_name\">$sub_dir_name</h2>" >> $index_file

    n=1

    for file in $(ls $dir_data/$sub_dir); 
    do
        if ! test -d $file; then # Solo recorro los archivos
            echo "------------------------------------------"
            $script $dir_data/$sub_dir/$file
            result=$(process_string $file)
            title=$(echo "$result" | cut -d'|' -f1)
            author=$(echo "$result" | cut -d'|' -f2)
            filename=$(echo "$file" | cut -d'.' -f1)

            echo "Nombre de archivo: $filename"
            echo "Título: $title"
            echo "Autor:  $author"

            # La añado al índice
            echo "<a href=\"$dir_html/$sub_dir/$filename.html\">$n. <span id=\"song-title\">$title</span> <span id=\"author\">$author</span></a><br>" >> $index_file
            
            # Aumento el contador
            n=$((n+1))
            total_files=$(($total_files+1))
        fi

    done

done

printf "\n\n"
echo Se han generado $total_files archivos

# 269 + 17 + 13 + 150 = 449
percent=$(echo "scale=3; (($total_files-($n-1))*100)/ 449" | bc)
echo "$percent% completado del cantoral"