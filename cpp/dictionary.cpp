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

        variations = { "M", "m", "7", "6", "5", "4", "9", "11", "13", "2", 
                       "aug", "dim", "sus", "add", " ", "/", "+", "-", "maj"};

        sort(variations.begin(), variations.end(), compareStringSize); // ordeno las variaciones por longitud

        reserved = { "Intro:", "Final:", "**", "***", "****", "2ª", "2ª:", "1ª:", "2º:", 
                     "1º:", "vez:", "-"};
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
            bool parenthesis1, parenthesis2;

            for(auto w=words.begin(); w!=words.end() && chord_line; w++){
                word = *w;
                parenthesis1 = (word.at(0) == '(' );
                parenthesis2 = (word.at(word.length()-1)==')');

                if(parenthesis1){
                    word.erase(0,1);
                }

                if(parenthesis2){
                    word.erase(word.length()-1);
                }

                if(find(reserved.begin(), reserved.end(), word)==reserved.end()){
                    // Si la palabra no es reservada

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

                                        if(parenthesis1){
                                            word_aux = "(" + word_aux;
                                        }

                                        if(parenthesis2){
                                            word_aux = word_aux + ")";
                                        }

                                        *w = word_aux;
                                    }

                                }

                                if(!eq2){ // Si la palabra no coincide con ningún acorde (su forma)
                                    chord_line = false;
                                }

                            } else { // No tiene variación
                                word_aux = before + word + after;
                                
                                if(parenthesis1){
                                    word_aux = "(" + word_aux;
                                }

                                if(parenthesis2){
                                    word_aux = word_aux + ")";
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

                    word_aux = "<span id=\"reserved\">" + word + "</span>";

                    if(parenthesis1){
                        word_aux = "(" + word_aux;
                    }

                    if(parenthesis2){
                        word_aux = word_aux + ")";
                    }

                    

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

    string notePart(const string& word) {

        string note;
        bool eq1=false;
        int len;
        string res;

        for(auto n = notes.begin(); n!=notes.end() && !eq1; n++){
            note = *n;
            len = note.length();
            eq1=(len<=word.length());


            for(int i=0; i<len && eq1; i++){
                if(i<word.length() && word.at(i)!=note.at(i)){
                    eq1 = false;
                }
            }

            if(eq1){
                res=note;
                res.at(0)=toupper(res.at(0)); //empieza por mayúscula
            }
        }

        if(res.at(res.length()-1)=='#'){
            res.at(res.length()-1)='\\';
            res+="#";
        }

        return res;
    }

    string variationPart(const string&word) { // Todo lo que no es nota
        return word.substr(notePart(word).length(), word.length());
    }

    bool chordLine(const string & line){

        bool chord_line = false;  // Por defecto si la línea está vacía devuelve false

        if (line.length()!=0){

            vector<string> words = split(line); // vector de palabras de la línea
            vector<string> gaps = blankSpaces(line); // vector de espacios en blanco
            string note;
            string variation;
            string word;
            bool eq1, eq2;
            int len;

            chord_line = true;
            bool parenthesis1, parenthesis2;

            for(auto w=words.begin(); w!=words.end() && chord_line; w++){
                word = *w;
                parenthesis1 = (word.at(0) == '(' );
                parenthesis2 = (word.at(word.length()-1)==')');

                if(parenthesis1){
                    word.erase(0,1);
                }

                if(parenthesis2){
                    word.erase(word.length()-1);
                }

                if(find(reserved.begin(), reserved.end(), word)==reserved.end()){
                    // Si la palabra es reservada

                    eq1 = false;

                    for(auto n = notes.begin(); n!=notes.end() && !eq1; n++){
                        note = *n;
                        eq1 = true;
                        len = note.length();

                        for(int i=0; i<len && eq1; i++){ // Compruebo si empieza por la nota con la que se está comparando
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

                                    for(int i = len; i<len + variation.length() && eq2; i++){ // Compruebo si sigue por alguna variación
                                        if(i<word.length() && word.at(i)!=variation.at(i-len)){
                                            eq2 = false;
                                        }
                                    }
                                }

                                if(!eq2){ // Si la palabra no coincide con ningún acorde (su forma)
                                    chord_line = false;
                                }

                            }               
                        }
                    }

                    if(!eq1){ // Si la palabra no coincide con ningún acorde (su forma)
                        chord_line = false;
                    }
                }
            }
        }
        return chord_line;
    }

    string toLatex(string filename) {

        vector<string> caracteres_especiales={"á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú", "ñ", "Ñ"};

        ifstream is;
        ofstream os;

        string res;

        is.open(filename);


        if(is){
            
            string line;
            string chordline;
            bool hay_palabra;
            vector<int> inicio, final;

            string comando="\\chord";

            while(getline(is, line)){
                if(chordLine(line)){ // Si es una línea de acordes
                    chordline=line; // La guardo en una cadena
                } else {

                    hay_palabra=false;

                    if(!chordline.empty()) { // Si había antes una línea de acordes
                        for(int i=0; i<chordline.length(); i++){
                            if(chordline.at(i)!=' '){ // Se encuentra una posición "ocupada"
                                if(!hay_palabra){ // Si no había antes una palabra
                                    hay_palabra=true;
                                    inicio.push_back(i); // guardo la posición de inicio
                                }
                            } else {
                                if(hay_palabra){
                                    hay_palabra=false;
                                    final.push_back(i); // guardo la posición de final
                                }
                            }
                        } if(inicio.size()>final.size()){
                            final.push_back(chordline.length()); // Si el final de línea es final de palabra
                        }

                        // Muestro el resultado obtenido
                        // for(int i=0; i<inicio.size() && i<final.size(); i++){
                        //     cout<<"Inicio: "<<inicio.at(i)<<": "<<chordline.at(inicio.at(i))<<" , Final: "<<final.at(i)<<": "<<chordline.at(final.at(i)-1)<<endl;
                        // }

                        

                        // Lo incorporo a la línea que no es de acordes
                        int desplazamiento=0;
                        vector<string> words = split(chordline); // vector de palabras de la línea de acordes
                        int j=0;

                        if(final.at(final.size()-1)>line.size()){ // Si hace falta rellenar con espacios
                            int dif=final.at(final.size()-1)-line.size();
                            for(int i=0; i<dif; i++){
                                line+=' ';
                            }
                        }

                        string antes,despues;

                        for(int i=0; i<inicio.size(); i++){

                            antes=comando+"{"+notePart(words.at(j))+"}{"+variationPart(words.at(j))+"}"+"{";
                            j++;

                            line.insert(inicio.at(i)+desplazamiento,antes);
                            desplazamiento+=antes.length();

                            despues="}";

                            if(static_cast<int>(line.at(final.at(i)+desplazamiento-1))==static_cast<char>(0xC3)){
                                desplazamiento++;
                            }


                            line.insert(final.at(i)+desplazamiento, despues);
                            desplazamiento+=despues.length();
                        }

                        // cout<<"Linea obtenida: "<<line<<endl;
                        res+=line+"\n";
                        chordline.clear();
                        inicio.clear();
                        final.clear();
                    } else {
                        if(line=="<strong>") {
                            line="\\begin{chorus}";
                        } else if(line=="</strong>"){
                            line="\\end{chorus}";
                        }
                        res+=line+"\n";
                    }
                }
            }
        } else {
            cerr << "Error abriendo el archivo de entrada: " << filename << endl;
            exit(-2);
        }

        return res;
    }
    
};