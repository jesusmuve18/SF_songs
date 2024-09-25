#include <iostream>
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

int main(int argc, char** argv) {
    if(argc!=2) {
        cerr << "Error. La ejecución debe ser: script <file-name.txt>" << endl;
        exit(-1);
    }

    string title;
    string subtitle;

    // Cargo el título y el subtítulo
    Generar(argv[1], title, subtitle);

    Dictionary d;
    cout << d.toLatex(argv[1], title, subtitle);
}