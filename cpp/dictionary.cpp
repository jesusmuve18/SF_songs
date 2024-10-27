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

        reserved = { "Intro:", "Final:", "**", "***", "****", "2ª", "2ª:", "1ª", "1ª:", "2º:", 
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

    string notePart(string& word) {

        string note;
        bool eq1=false;
        int len;
        string res="";

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
                // res.at(0)=toupper(res.at(0)); //empieza por mayúscula
            }
        }
        

        if(!res.empty() && res.at(res.length()-1)=='#'){
            res.at(res.length()-1)='\\';
            word.insert((res.length()-1), "\\");
            res+="#";
        }

        return res;
    }

    string variationPart(string& word) { // Todo lo que no es nota
        string w=word; //Creo una copia
        string res=w.substr(notePart(w).length(), w.length());

        if(!res.empty() && res.at(res.length()-1)=='#'){
            res.at(res.length()-1)='\\';
            word.insert((res.length()-1), "\\");
            res+="#";
        }

        return res;
    }

    bool chordLine(const string & line){

        bool chord_line = false;  // Por defecto si la línea está vacía devuelve false

        if (line.length()!=0){

            vector<string> words = split(line); // vector de palabras de la línea

            if(words.size()==0){ // Si no tiene palabras
                return false;
            }

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

    void unirLineas(const string& linea1, string linea2, string & res, string t="\t", string endline="\\\\\n") {
        // string res; // Resultado
        vector<int> inicio, final;
        string tab="";
        bool hay_palabra=false; // Para saber si una posición está ocupada o no
        string comando="\\chord";

        if(!linea1.empty()) { // Si había antes una línea de acordes
            for(int i=0; i<linea1.length(); i++){
                if(linea1.at(i)!=' '){ // Se encuentra una posición "ocupada"
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
                final.push_back(linea1.length()); // Si el final de línea es final de palabra
            }

            // Muestro el resultado obtenido
            // for(int i=0; i<inicio.size() && i<final.size(); i++){
            //     cout<<"Inicio: "<<inicio.at(i)<<": "<<linea1.at(inicio.at(i))<<" , Final: "<<final.at(i)<<": "<<linea1.at(final.at(i)-1)<<endl;
            // }                        

            // Lo incorporo a la línea que no es de acordes
            int desplazamiento=0;
            vector<string> words = split(linea1); // vector de palabras de la línea de acordes
            int j=0;

            // Si la línea de acordes es mayor que la línea de abajo
            if(!final.empty() && final.at(final.size()-1)>=linea2.size()){ // Si hace falta rellenar con espacios
                int dif=final.at(final.size()-1)-linea2.size();
                for(int i=0; i<dif; i++){
                    linea2+=" ";
                }
            }

            string antes,despues;
            string parentesis1, parentesis2;

            for(int i=0; i<inicio.size(); i++){
                
                parentesis1="";
                parentesis2="";

                // Tratamiento de paréntesis
                if(words.at(j).length()>1){
                    if(words.at(j).at(0)=='('){
                        parentesis1='(';
                        words.at(j).erase(words.at(j).begin());
                    }
                    if(words.at(j).at(words.at(j).length()-1)==')'){
                        parentesis2=')';
                        words.at(j).erase(--words.at(j).end());
                    }
                }

                antes=comando+"{"+parentesis1+notePart(words.at(j))+"}{"+variationPart(words.at(j))+parentesis2+"}"+"{";
                j++;

                // Evitar separar caracteres con tilde
                if((inicio.at(i)+desplazamiento-1)>0 && (inicio.at(i)+desplazamiento-1)<linea2.length() && (static_cast<int>(linea2.at(inicio.at(i)+desplazamiento-1))==static_cast<char>(0xC3) )){
                    desplazamiento++;
                    linea2+=" ";  //Al tener una tilde se cuentan mal los espacios por lo que habrá que añadir uno
                }

                // Evitar fallo con el signo '¡'
                if((inicio.at(i)+desplazamiento-1)>=0 && (inicio.at(i)+desplazamiento-1)<linea2.length() && (static_cast<int>(linea2.at(inicio.at(i)+desplazamiento-1))==-62 )){
                    desplazamiento++;
                    linea2+=" ";
                }

                linea2.insert(inicio.at(i)+desplazamiento,antes);


                desplazamiento+=antes.length();

                despues="}";

                // Evitar separar caracteres con tilde
                if((final.at(i)+desplazamiento-1)>0 && (final.at(i)+desplazamiento-1)<linea2.length() && static_cast<int>(linea2.at(final.at(i)+desplazamiento-1))==static_cast<char>(0xC3)){
                    desplazamiento++;
                    linea2+=" ";
                }

                // Evitar fallo con el signo '¡'
                if((final.at(i)+desplazamiento-1)>=0 && (final.at(i)+desplazamiento-1)<linea2.length() && (static_cast<int>(linea2.at(final.at(i)+desplazamiento-1))==-62 )){
                    desplazamiento++;
                    linea2+=" ";
                }

                // cout<<line<<","<<line.length()<<","<<final.at(i)+desplazamiento<<endl;
                linea2.insert(final.at(i)+desplazamiento, despues);
                desplazamiento+=despues.length();
            }
            

            res+=t+tab+linea2+endline;
        } else {
            if(linea2=="<strong>") {
                if(res.length()>2){
                    res.pop_back();
                    // res.pop_back();
                    res+="\\jump"+endline;
                }
                res+=t+"\\begin{chorus}%\n";
                tab="\t";
            } else if(linea2=="</strong>"){
                if(res.length()>3){
                    res.pop_back();
                    res.pop_back();
                    res.pop_back();
                    // res+="\\jump"+endline;
                    res+=endline;
                }
                res+=t+"\\end{chorus}%\n"+t+"\\jump"+endline;
                tab="";
            } else if(split(linea2).size()==0){
                if(res.length()>2){
                    res.pop_back();
                    // res.pop_back();
                    res+="\n"+t+"\\jump"+endline;
                }
            }else {
                res+=tab+linea2+endline;
            }
        }
    }

    string toLatex(const string& filename, const string& title, const string& subtitle) {
        ifstream is;
        ofstream os;

        string res;

        is.open(filename);

        if(is){
            
            string line;
            string chordline;

            string comando="\\chord";
            // res="\\begin{cancion}["+title+"]["+subtitle+"]%\n";

            bool empty_line=false;

            while(getline(is, line)){
                // cout<<"line: ["<<line<<"]";

                if(chordLine(line)){ // Si es una línea de acordes
                    // cout<<" es de acordes"<<endl;

                    if(empty_line){
                        res+="\\jump\n";
                        empty_line=false;
                    }

                    
                    
                    if(chordline.empty()){ 
                        chordline=line; // La guardo en una cadena
                    } else { // Ya había una línea de acordes

                        vector<string> chordlines={chordline,line};

                        while(getline(is,line) && chordLine(line)){
                            chordlines.push_back(line);
                        }

                        for(int i=0; i<chordlines.size()-1; i++){
                            res+="{\\transparent{0}{";
                            unirLineas(chordlines.at(i), line, res,"", "");

                            // // Le quito el último salto de línea
                            // if(!res.empty() && res.at(res.length()-1)=='\n'){
                            //     for(int i=0; i<6; i++)  // Le quito "\\\\\n"
                            //         res.pop_back();
                            // }
                            
                            res+="}}\\vspace*{-0.4cm}\\\\\n";
                        }

                        unirLineas(chordlines.at(chordlines.size()-1), line, res);
                        
                        chordline.clear();
                    }
                } else { 
                    // cout<<" NO es de acordes"<<endl;
                    // cout<<"Uniendo ["<<chordline<<"]["<<line<<"]:"<<unirLineas(chordline,line, res)<<endl;
                    
                    if(chordline.empty()) {
                        if(split(line).size()==0){
                            if(empty_line) {
                                unirLineas(chordline,line, res);
                            } else {
                                empty_line=true;
                            }
                            
                        } else {
                            empty_line=false;
                            unirLineas(chordline,line, res);
                        }
                    } else {
                        unirLineas(chordline,line, res);
                        chordline.clear();
                    }
                        
                }

            }

            if(!chordline.empty()){
                unirLineas(chordline,"", res);
            }

            // Le quito el último salto de línea
            if(!res.empty() && res.at(res.length()-1)=='\\')
                for(int i=0; i<4; i++)
                    res.pop_back();
                    
            res+="\\end{cancion}%\n";
        } else {
            cerr << "Error abriendo el archivo de entrada: " << filename << endl;
            exit(-2);
        }

        return "\\begin{cancion}["+title+"]["+subtitle+"]%\n"+res;
    }
    
};