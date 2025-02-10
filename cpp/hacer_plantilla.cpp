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
    <link rel=\"stylesheet\" href=\"" + main_dir + "styles_new/general.css\">\n\
    <link rel=\"stylesheet\" href=\"" + main_dir + "styles_new/cabecera.css\">\n\
    <link rel=\"stylesheet\" href=\"" + main_dir + "styles_new/cancion.css\">\n\
    <link rel=\"stylesheet\" href=\"" + main_dir + "styles_new/ajuste_velocidad_tactil.css\">\n\
\n\
    <script type=\"module\" src=\"" + main_dir + "javascript/cabecera2_canciones.js\"></script>\n\
    <script type=\"module\" src=\"" + main_dir + "javascript/modules/cancion.mjs\"></script>\n\
    <script type=\"module\" src=\"" + main_dir + "javascript/modules/scroll.mjs\"></script>\n\
    <script type=\"module\" src=\"" + main_dir + "javascript/modules/tools.mjs\"></script>\n\
    <script type=\"module\" src=\"" + main_dir + "javascript/modules/ajuste_velocidad_tactil.mjs\"></script>\n\
\n\
    <link rel=\"icon\" href=\"" + main_dir + "images/logo_sf.png\">\n\
</head>\n\
<body>\n\
    <div id=\"pagina\">\n\
        <div id=\"cabecera\">\n\
            <header>\n\
                <img id=\"logo\" src=\"" + main_dir + "images/logo_sf.png\" alt=\"Logo Sf\">\n\
                <div id=\"grupo-sf\">Grupo San Francisco</div>\n\
                <button id=\"icono-buscar\" class=\"hidden\"><img src=\"" + main_dir + "images/search.svg\"></button>\n\
                <button id=\"icono-tools\"><img src=\"" + main_dir + "images/tools.svg\"></button>\n\
                <button id=\"icono-menu\"><img src=\"" + main_dir + "images/menu.svg\"></button>\n\
            </header>\n\
\n\
            <nav>\n\
                <ul>\n\
                    <li><a href=\"" + main_dir + "index.html\">Inicio</a><img src=\"" + main_dir + "images/right-arrow.svg\"></li>\n\
                    <li><a href=\"" + main_dir + "indice.html\">Indice</a><img src=\"" + main_dir + "images/right-arrow.svg\"></li>\n\
                    <li><a href=\"" + main_dir + "acordes.html\">Acordes</a><img src=\"" + main_dir + "images/right-arrow.svg\"></li>\n\
                    <li><a href=\"" + main_dir + "about.html\">Acerca de</a><img src=\"" + main_dir + "images/right-arrow.svg\"></li>\n\
                </ul>\n\
            </nav>\n\
\n\
            <div id=\"contenedor-buscador\">\n\
                <div id=\"marco-buscador\">\n\
                    <input type=\"text\" name=\"buscador\" id=\"buscador\" placeholder=\"Buscar...\">\n\
                </div>\n\
            </div>\n\
        </div>\n\
\n\
        <div id=\"contenedor-tools\">\n\
            <h2>Herramientas</h2>\n\
            <div id=\"herramientas\">\n\
                <div id=\"ajuste-cejilla\">\n\
                    <b>Cejilla: </b>\n\
                    <button id=\"dim-capo\">-</button>\n\
                    <input id=\"input-ajuste-cejilla\" type=\"number\">\n\
                    <button id=\"inc-capo\">+</button>\n\
                </div>\n\
                <div id=\"ajuste-tono\">\n\
                    <b>Tono: </b>\n\
                    <button id=\"dim-tone\">-</button>\n\
                    <input id=\"input-ajuste-tono\" type=\"number\">\n\
                    <button id=\"inc-tone\">+</button>\n\
                </div>\n\
                <div id=\"ajuste-velocidad\">\n\
                    <b>Velocidad: </b>\n\
                    <button id=\"dim-velocidad\">-</button>\n\
                    <input id=\"input-ajuste-velocidad\" type=\"number\">\n\
                    <button id=\"inc-velocidad\">+</button>\n\
                </div>\n\
            </div>\n\
            <div id=\"contenedor-reestablecer\">\n\
                <button id=\"reestablecer\">Reestablecer</button>\n\
            </div>\n\
        </div>\n\
\n\
        <div id=\"contenedor-ajuste-velocidad-tactil\" class=\"hidden\">\n\
            <div id=\"velocidad\">Velocidad\n\
                <div id=\"valor\"></div>\n\
            </div>\n\
        </div>\n\
\n\
        <div id=\"cuerpo\">\n\
            <div id=\"notation\">europe sharp</div>\n\
            <div id=\"title\">" + title +"</div>\n\
            <div id=\"artist\">" + subtitle + "</div>\n\
            <div id=\"info\">\n\
                <div id=\"tone\">\n\
                    <b>Tono: </b> <span id=\"original-tone\">" + tone + "</span><br>\n\
                    <b>Cejilla: </b><span id=\"capo\">" + to_string(capo) + "</span><br>\n\
                    <b>Transpuesta:</b> <span id=\"traspose\">" + to_string(traspose) + "</span>\n\
                </div>\n\
            </div>\n\
            <div id=\"song-body\" class=\"texto-principal\">" + song + "</div>\n\
             </div>\n\
        </div>\n\
\n\
\n\
        <div id=\"controls\">\n\
            <div id=\"pauseButton-frame\"><img id=\"pauseButton\" src=\"../images/play_2.svg\" alt=\"play\"></div>\n\
             <div id=\"speed-bar\">\n\
                <input type=\"range\" class=\"scroll-speed-bar\" id=\"scroll-speed-bar\" min=\"1\" max=\"100\" value=\"" + to_string(default_speed) + "\" steps=\"1\" oninput=\"ajustarVelocidad()\">\n\
                <span class=\"scroll-speed-value\" id=\"scroll-speed-value\">" + to_string(default_speed) + "</span></p>\n\
            </div>\n\
        </div>\n\
    </div>\n\
</body>\n\
</html>";

    cout << plantilla << endl;
}