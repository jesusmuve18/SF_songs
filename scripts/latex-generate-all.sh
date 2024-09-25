
#!/bin/bash

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
dir_out=./latex/songs           # Directorio destino
script=./cpp/to_latex           # Programa
general=0-general               # Carpeta por defecto

# Contadores
total_files=0
n=1
    
#####################################################################3
# Recorro el directorio

archivos=($(find "$dir_data" -maxdepth 1 -type f -exec basename {} \;))

for file in "${archivos[@]}"; 
do
    if ! test -d $file; then # Solo recorro los archivos
        # echo "------------------------------------------"
        echo $file  

        # Eliminar la extensión '.dat' de $file
        file=$(echo "$file" | sed 's/\.dat$//')
        touch $dir_out/$sub_dir/$file.tex
        $script $dir_data/$file.dat > $dir_out/0-General/$file.tex
    fi
done

################################################################################
# Obtengo y recorro las subcarpetas

subcarpetas=($(obtener_subcarpetas $dir_data))

for sub_dir in "${subcarpetas[@]}"; 
do
    archivos=($(find "$dir_data/$sub_dir" -maxdepth 1 -type f -exec basename {} \;))

    if ! test -d $dir_out/$sub_dir; then
        echo "Creando el directorio"
        mkdir $dir_out/$sub_dir
    fi

    for file in "${archivos[@]}"; 
    do
        if ! test -d $file; then # Solo recorro los archivos
            # echo "------------------------------------------"
            
            echo $file

            # Eliminar la extensión '.dat' de $file
            file=$(echo "$file" | sed 's/\.dat$//')
            touch $dir_out/$sub_dir/$file.tex
            $script $dir_data/$sub_dir/$file.dat > $dir_out/$sub_dir/$file.tex
        fi
    done
done

    
