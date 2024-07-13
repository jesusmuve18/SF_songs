# SF_songs

Repositorio de la página https://jesusmuve18.github.io/SF_songs/

## Descripción

Este repositorio se ha hecho con el objetivo de escribir y almacenar canciones de una forma sencilla y rápida, de forma que se puedan ver en cualquier dispositivo para poder tocarlas en el piano o la guitarra (principalmente). 

## Utilidades

### Lectura y generación automática de canciones

Se ha desarrollado un <a href="./scripts/generate.sh">script</a> que lee una canción escrita en texto plano y reconoce automáticamente los acordes y la letra para su correcta visualización, creando un documento html asociado con la canción. Para ello, la canción deberá estar ubicada en el directorio **cpp/songs/** y el formato del nombre del archivo debe ser: **título_de_la_canción-autor.dat** para que se pueda reconocer automáticamente el título y el autor (o subtítulo). La ejecución debe ser de la forma:
```bash
$ ./scripts/generate.sh ./cpp/songs/nombre_de_la_canción-autor.dat
```

Por ejemplo, si tenemos el archivo **título_de_la_canción-autor.dat** que contiene el siguiente texto:
```
C          Sol
Esto es la letra,
Ab               D#
la letra de una canción.
```
y ejecutamos la línea anterior se generará el archivo **songs/título_de_la_canción-autor.html** cuya visualización será:

<center>
    <img src="./images/readme/ejemplo-generador.png" alt="ejemplo-generador" width="60%" style="margin: 20px">
</center>

Además, existe otro <a href="./scripts/generate-all.sh">script</a> que genera todas las canciones del directorio **cpp/songs/** y además las añade al índice de la <a href="./index.html">página principal</a>.
Su ejecución será: 

```bash
$ ./scripts/generate-all.sh
```

### Generación automática de diagramas de acordes

Se ha desarrollado otro <a href="./latex/svg_maker.sh">script</a> que convierte el diagrama de acordes generado en **latex/diagram_maker.tex** gracias al paquete **jmvsong** (proyecto cuyo repositorio pronto se subirá a github donde aparecerá su uso) a un formato de archivo **svg**. Para ello, será necesario tener instalada la herramienta **pdf2svg** disponible en cualquier sistema operativo.

Su uso debe ser:
```bash
$ cd latex
$ ./svg_maker.sh nombre_acorde
```

De esta forma se generará un archivo en el directorio **images/svg_chords** con el nombre **nombre_acorde.svg** que estará listo para su visualización en la web. El nombre deberá estar en notación americana con bemoles para que se encuentre correctamente cuando aparezca en la canción.

Por ejemplo, si el archivo **latex/diagram_maker.tex** contiene dentro del cuerpo:
```tex
\begin{document} 
   
\thispagestyle{empty}

\vddiagram[%
nombre=La\#,
variacion=m7,
trasteinicial=1,
iniciocejilla=5,
cejilla=1,
fprimera=1,
fsegunda=2,
ftercera=1,
fcuarta=3,
fquinta=1,
fsexta=,]%
{1}{2}{1}{3}{1}{x}

\end{document}
```

y se ejecuta en la terminal el comando 
```bash
$ cd latex
$ ./svg_maker.sh Bbm7
```

Se generará el archivo **images/svg_chords/Bbm7.svg** que contendrá el siguiente **svg** (sin el fondo blanco):

<center>
<div style="background-color: white; display: inline-block; margin: 20px;">
        <img src="./images/svg_chords/Bbm7.svg" alt="ejemplo-generador">
</div>
</center>

Cuando en una canción se encuentre el acorde de **La#m7** (o cualquier notación que haga referencia al mismo acorde) se buscará automáticamente el archivo de imagen que acabamos de generar.

### Cambio de cejilla y de tono

En las páginas de canciones generadas aparece un cuadro que permite cambiar de cejilla y de tono. Automáticamente se calcularán los acordes resultantes de dichas modificaciones. Su uso está más desarrollado en <a href="./about.html">acerca de</a>. 

### Scroll

En la esquina inferior izquierda hay un icono que permite reanudar o pausar el scroll automático (de momento con velocidad única).

### Visualización de acordes

Al pasar el ratón por encima de un acorde de una canción aparecerá en el centro de la página la representación del diagrama de dicho acorde (si existe en la base de datos).