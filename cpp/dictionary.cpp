#include <iostream>
#include <fstream>
#include <sstream>

#include <vector>
#include <algorithm>
#include <string>

using namespace std;


bool compareStringSize(const std::string& a, const std::string& b) {
    return a.size() > b.size(); // Ordenar por tamaño, de mayor a menor
}

class Dictionary {
public:
    vector<string> notes;
    vector<string> variations;
    vector<string> reserved;

    const string before = "<b>";
    const string after = "</b>";

    // Constructor sin parámetros
    Dictionary() {  
        notes = { "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
                  "Db", "Eb", "Gb", "Ab", "Bb",
                  "Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si",
                  "Reb", "Mib", "Solb", "Lab", "Sib",
                  "do", "do#", "re", "re#", "mi", "fa", "fa#", "sol", "sol#", "la", "la#", "si",
                  "reb", "mib", "solb", "lab", "sib"};

        sort(notes.begin(), notes.end(), compareStringSize); // ordeno las notas por longitud

        variations = { "M", "m", "7", "6", "5", "4", "9", "11", "13", 
                       "aug", "dim", "sus", "add", " ", "/", "+", "-", "maj"};

        sort(variations.begin(), variations.end(), compareStringSize); // ordeno las variaciones por longitud

        reserved = { "Intro:", "**", "2ª", "1ª", "2º", "1º" "vez:"};
    }

    // Dada una línea de texto la separa en palabras (por espacios)

    vector<string> split(const string & line) {
        vector<string> words;
        istringstream is(line);
        string word;  // auxiliar

        while(getline(is, word, ' ')){
            if(word!="")
                words.push_back(word);
        }

        return words;
    }

    // Dada una línea de texto guarda los espacios en blanco

    vector<string> blankSpaces(const string & line) {
        vector<string> words;
        char blank=' ';
        string aux="";

        if(line.at(0)!=blank){ // Añado caracter inicial
            words.push_back(aux);
        }

        for(int i=0; i<line.length(); i++) {
            if(line.at(i)==blank) {
                aux += blank;

            } else if(aux!=""){
                words.push_back(aux);
                aux = "";
            }
        }

        return words;
    }


    // Dada una línea procesa todos los acordes para su correcta visualización en html
    string ProcessLine(string line, string before = "<b>", string after = "</b>") {
        string result="";

        if (line.length()!=0){

            vector<string> words = split(line); // vector de palabras de la línea
            vector<string> gaps = blankSpaces(line); // vector de espacios en blanco
            string note;
            string variation;
            string word;
            string word_aux;
            bool eq1, eq2;
            int len;

            // string before = "<b>";
            // string after = "</b>";

            bool chord_line = true;
            bool parenthesis;

            for(auto w=words.begin(); w!=words.end() && chord_line; w++){
                word = *w;
                parenthesis = (word.at(0) == '(' && word.at(word.length()-1)==')');

                if(parenthesis){
                    word.erase(0,1);
                    word.erase(word.length()-1);
                }

                

                if(find(reserved.begin(), reserved.end(), word)==reserved.end()){
                    // Si la palabra es reservada

                    eq1 = false;

                    for(auto n = notes.begin(); n!=notes.end() && !eq1; n++){
                        note = *n;
                        eq1 = true;
                        len = note.length();

                        for(int i=0; i<len && eq1; i++){
                            if(i<word.length() && word.at(i)!=note.at(i)){
                                eq1 = false;
                            }
                        }

                        if(eq1){

                            eq2 = false;

                            if(word.length() > len){ // La palabra es más larga
                                for(auto var = variations.begin(); var!=variations.end() && !eq2; var++) {
                                    variation = *var;
                                    // eq2 = true;
                                    eq2 = (word.length() >= len + variation.length());

                                    for(int i = len; i<len + variation.length() && eq2; i++){
                                        if(i<word.length() && word.at(i)!=variation.at(i-len)){
                                            eq2 = false;
                                        }
                                    }

                                    if(eq2){ // Se ha encontrado coincidencia con la variación

                                        // Miro a ver si en la variación tiene el bajo cambiado
                                        // en ese caso tendré que hacer que se reconozca como una nota:

                                        bool found = false;

                                        for(int i = len; i<word.length() && !found; i++){
                                            if(word.at(i)=='/'){
                                                found = true;

                                                string bass;

                                                // Copio todo lo que hay detrás del caracter '/'
                                                for(int j=i+1; j<word.length(); j++){
                                                    bass += word.at(j);
                                                }
                                                
                                                // Compruebo que efectivamente es una nota
                                                bass = ProcessLine(bass, "</b><b>", "");

                                                // Devuelvo el cambio
                                                int j;
                                                for(j=i+1; j<word.length(); j++){
                                                    word.at(j) = bass.at(j-i-1);
                                                }

                                                for(int k=j-i-1; k<bass.length(); k++){
                                                    word.push_back(bass.at(k));
                                                }
                                            }
                                        }
                                        
                                        
                                        word_aux = word;
                                        word_aux.insert(len, " ");
                                        word_aux = before + word_aux + after;

                                        if(parenthesis){
                                            word_aux = "(" + word_aux + ")";
                                        }

                                        *w = word_aux;
                                    }

                                }

                                if(!eq2){ // Si la palabra no coincide con ningún acorde (su forma)
                                    chord_line = false;
                                }

                            } else { // No tiene variación
                                word_aux = before + word + after;

                                if(parenthesis){
                                    word_aux = "(" + word_aux + ")";
                                }
                                *w = word_aux;
                            }                 
                        }
                    }

                    if(!eq1){ // Si la palabra no coincide con ningún acorde (su forma)
                        chord_line = false;
                    }
                } else {
                    // La palabra "word" es reservada

                    word_aux = word;

                    if(parenthesis){
                        word_aux = "(" + word_aux + ")";
                    }

                    word_aux = "<span id=\"reserved\">" + word_aux + "</span>";

                    *w = word_aux;
                }
            }

            if(!chord_line){ // Si la línea tiene alguna palabra que no sea un acorde
                result = line;
            } else {
                for(int i=0; i<gaps.size() && i<words.size(); i++) { // Reconstruyo la cadena
                    result += gaps.at(i) + words.at(i);
                }
            }
        }

        

        return result;
    }

    // Dado un archivo de entrada, procesa y devuelve su contenido línea a línea
    string Proccess(string filename) {
        ifstream is;
        ofstream os;

        string res;

        is.open(filename);

        if(is){
            
            string line;

            while(getline(is, line)){
                res+=ProcessLine(line) + "\n";
            }
        } else {
            cerr << "Error abriendo el archivo de entrada: " << filename << endl;
            exit(-2);
        }

        return res;
    }
};