#include <iostream>
#include <string>
#include <fstream>
#include "dictionary.cpp"
using namespace std;

void Generar (string filename, string & title, string & subtitle) {
    title = "";
    subtitle = "";

    string tmp = "";
    char l;
    int index = 0;
    bool route = false;

    // Eliminamos la ruta
    for(int i=0; i<filename.length(); i++) { // Guardo la posición del último '/'
        if(filename.at(i) == '/'){
            index = i;
            route = true;
        }
    }

    for(int i=index+route; i<filename.length(); i++){ // Borro la ruta
        tmp += filename.at(i);
    }

    filename = tmp;
    tmp = "";
    bool saved = false;

    // No tenemos en cuenta la extensión
    for(int i=0; i<filename.length() && l!='.'; i++){
        l = filename.at(i);

        if(l == '_'){
            tmp+=' ';
        } else {
            if(l != '-'){
                if(l != '.')
                    tmp += l;
            } else {
                title = tmp;
                saved = true;
                tmp = "";
            }
        }
    }
	if(saved){
		subtitle = tmp;
	} else {
		title = tmp;
	}
   
}

string Tono(string song){

    Dictionary d;

    for(int i=0; i<song.length(); i++){
        if(song.at(i)=='\n'){
            song.at(i) = ' ';
        }
    }

    vector<string> words=d.split(song);
    string w;
    bool eq;
    string tmp;
    string note = "";
    string variation ="";

    bool found = false;

    for(auto it = words.begin(); it!=words.end() && !found; it++) {
        w = *it;
        eq = (w.length() >= d.before.length());

        for(int i=0; i<d.before.length() && eq; i++){
            eq = (w.at(i)==d.before.at(i));
        }

        if(eq){ // Se ha encontrado una coincidencia de la palabra before
            tmp = "";

            for(int i=d.before.length(); i<w.length(); i++){  // Guardo el resto temporalmente
                tmp += w.at(i);
            }

            //Comprobaré si esa misma palabra coincide con after
            eq = (w.length() >= d.after.length());

            for(int i=0; i<d.after.length() && eq; i++){
                eq = (w.at(w.length()-1-i)==d.after.at(d.after.length()-1-i));
            }

            if(eq){ // Se ha encontrado la segunda coincidencia y por tanto el tono
                w = tmp;
                tmp = "";

                for(int i=0; i<w.length() - d.after.length(); i++){
                    tmp += w.at(i);
                }

                note = tmp;
                found = true;

            } else { // Buscaré en la palabra siguiente
                auto it2 = it;
                it2++;

                

                w=*it2; // cojo la siguiente palabra

                eq = (w.length() >= d.after.length());

                for(int i=0; i<d.after.length() && eq; i++){
                eq = (w.at(w.length()-1-i)==d.after.at(d.after.length()-1-i));
            }

                if(eq){ // Se ha encontrado la segunda coincidencia y por tanto el tono

                    note = tmp;
                    tmp = "";

                    for(int i=0; i<w.length() - d.after.length(); i++){
                        tmp += w.at(i);
                    }

                    variation = tmp;
                    found = true;
                }
            }           
        }
    }

    return note + " " + variation;
}

int main(int argc, char** argv){
    string main_dir = "../";
    string title = "this is the title";
    string subtitle = "this is the subtitle";
    int default_speed = 60;
    string tone = "";
    int capo = 0;
    int traspose = 0;
    
    if(argc!=2) {
        cerr << "Error. Número de parámetros incorrecto" <<endl;
        exit(-1);
    }

    string filename = argv[1];
    ifstream is(filename);

    string song;
    string line;

    // Cargo la canción
    if(is) {
        while(getline(is, line)){
            song += line + "\n";
        }
    } else {
        cerr << "Error, no existe el ardchivo "<< argv[1] << endl;
        exit(-2);
    }

    // Cargo el título y el subtítulo
    Generar(filename, title, subtitle);

    // Cargo el tono
    tone = Tono(song);


    string plantilla = "<!DOCTYPE html>\n \
<html lang=\"en\">\n\
<head>\n\
    <meta charset=\"UTF-8\">\n\
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\
    <title>" + title + "</title>\n\
    <link rel=\"stylesheet\" href=\"" + main_dir + "/styles/style.css\">\n\
    <script src=\"" + main_dir + "scripts.js\"></script>\n\
    <link rel=\"icon\" href=\"" + main_dir + "images/Logo Tau sin fondo.png\">\n\
</head>\n\
<body>\n\
    <div id=\"pagina\">\n\
        <div id=\"cabecera\">\n\
            <header>\n\
                <img id=\"logo\" src=\"" + main_dir + "images/Logo Tau sin fondo.png\" alt=\"Logo Sf\">\n\
                <div id=\"grupo-sf\">Grupo San Francisco Granada</div>\n\
                <input type=\"text\" id=\"search-bar\" placeholder=\"Pulsa aquí para buscar\">\n\
            </header>\n\
\n\
            <nav>\n\
                <ul>\n\
                    <a href=\"" + main_dir + "index.html\"><li>Inicio</li></a>\n\
                    <a href=\"" + main_dir + "indice.html\"><li>Indice</li></a>\n\
                    <a href=\"" + main_dir + "acordes.html\"><li>Acordes</li></a>\n\
                    <!-- <a href=\"#\"><li>Opción 3</li></a> -->\n\
                    <a href=\"" + main_dir + "about.html\"><li>Acerca de</li></a>\n\
                </ul>\n\
            </nav>\n\
        </div>\n\
        <div id=\"contenido\">\n\
\n\
            <aside>\n\
                Cejilla: <span id=\"plus-min\" onclick=\"incCapo()\">+</span> <span id=\"plus-min\" onclick=\"incCapo(-1)\">-</span><br>\n\
                Tono: <span id=\"plus-min\" onclick=\"incTone()\">+</span> <span id=\"plus-min\" onclick=\"incTone(-1)\">-</span>\n\
            </aside>\n\
\n\
            <div id=\"song\">\n\
                <div id=\"notation\">europe sharp</div>\n\
                <div id=\"info\">\n\
                    <div id=\"title\">" + title + "</div>\n\
                    <div id=\"artist\">" + subtitle + "</div>\n\
                     <div id=\"tone\">\n\
                        Tono: <span id=\"original-tone\">" + tone + "</span><br>\n\
                        Cejilla: traste <span id=\"capo\">" + to_string(capo) + "</span><br>\n\
                        Transpuesta: <span id=\"traspose\">" + to_string(traspose) + "</span> semitonos\n\
                    </div>\n\
                </div>\n\
                <div id=\"song-body\" class=\"texto-principal\">" + song +"</div>\n\
                </div>\n\
            </div>\n\
        <div id=\"controls\">\n\
            <img id=\"pauseButton\" src=\"../images/play.svg\" alt=\"play\">\n\
             <div id=\"speed-bar\">\n\
                <input type=\"range\" class=\"scroll-speed-bar\" id=\"scroll-speed-bar\" min=\"1\" max=\"100\" value=\"" + to_string(default_speed) + "\" steps=\"1\" oninput=\"ajustarVelocidad()\">\n\
                <span class=\"scroll-speed-value\" id=\"scroll-speed-value\">" + to_string(default_speed) + "</span></p>\n\
            </div>\n\
        </div>\n\
        <div id=\"pie\">\n\
            <div id=\"pie-content\">\n\
                 &copy; JesusMuve\n\
            </div>\n\
        </div>\n\
    </div>\n\
</body>\n\
</html>";

    cout << plantilla << endl;
}