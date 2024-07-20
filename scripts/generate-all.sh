#!/bin/bash

################################################################################
# Funciones que se usarán después

process_string() {
    # Dada una cadena pasada como argumento:
    # Elimina la extensión .dat
    # Cambia los caracteres '_' por ' '
    # La separa en 2 partes según indique el caracter '-'
    # Se devuelven ambas partes procesadas, separadas por el caracter '|'
    #
    # Para recuperar ambas partes será necesario:
    #   result=$(process_string $file)
    #   parte_1=$(echo "$result" | cut -d'|' -f1)
    #   parte_2=$(echo "$result" | cut -d'|' -f2)

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
    # Dado un directorio pasado como parámetro devuelve un array con todas
    # las subcarpetas que contiene
    local directorio="$1"
    subcarpetas=()
    for dir in "$directorio"/*/; do
        [ -d "$dir" ] && subcarpetas+=("$(basename "$dir")")
    done
    echo "${subcarpetas[@]}"
}

################################################################################
# Parámetros

dir_data=./cpp/songs            # Directorio origen
dir_html=./songs                # Directorio destino
script=./scripts/generate.sh    # Script que procesa cada archivo
index_file=./songs/0-data.txt   # Ubicación del archivo de índice

# Contadores
total_files=0
n=1

# Vacío el archivo de índice
echo > $index_file

################################################################################
# Obtengo el array de archivos ordenado como si '_' fuera ' '

archivos=($(find "$dir_data" -maxdepth 1 -type f -exec basename {} \;))

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
# Obtengo las subcarpetas

subcarpetas=($(obtener_subcarpetas $dir_data))

echo "<div id=\"enlaces\">" >> $index_file
# Añado los enlaces al índice
for sub_dir in "${subcarpetas[@]}";
do
    # Le quito el número y cambio '_' por ' '
    sub_dir_name=$(echo "$(echo $sub_dir | tr '_' ' ')" | cut -d '-' -f 2-)

    echo "  <a href=\"#$sub_dir_name\">$sub_dir_name</a>" >> $index_file
done

echo "</div>" >> $index_file

################################################################################
# Genero y añado al índice los archivos procesados previamente
echo "<ol>" >> $index_file

for file in "${archivos[@]}"; 
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
        echo "<li><a href=\"$dir_html/$filename.html\"><span id=\"song-title\">$title</span> <span id=\"author\">$author</span></a></li><br>" >> $index_file
        
        # Aumento el contador
        n=$((n+1))
        total_files=$(($total_files+1))
    fi

done

echo "</ol>" >> $index_file
################################################################################
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

    ################################################################################
    # Obtengo el array de archivos de la subcarpeta ordenado como si '_' fuera ' '
    
    archivos=($(find "$dir_data/$sub_dir" -maxdepth 1 -type f -exec basename {} \;))

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

    ################################################################################
    # Genero y añado al índice los archivos procesados previamente

    echo "<ol>" >> $index_file

    for file in "${archivos[@]}"; 
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
            echo "<li><a href=\"$dir_html/$filename.html\"><span id=\"song-title\">$title</span> <span id=\"author\">$author</span></a></li><br>" >> $index_file
            
            # Aumento el contador
            n=$((n+1))
            total_files=$(($total_files+1))
        fi

    done

    echo "</ol>" >> $index_file

done

################################################################################
# Salida de información
printf "\n\n"
echo "Se han generado $total_files archivos ($(($n-1)) en \"otros\")"

# 269 + 17 + 13 + 150 = 449
total_files=$(($total_files - $n +1)) # le quito la sección de "otros" (ya que no es del cantoral)

percent=$(echo "scale=3; ($total_files*100)/ 449" | bc)
echo "$percent% completado del cantoral"




