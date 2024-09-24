#include <iostream>
#include <fstream>
#include "dictionary.cpp"
using namespace std;

int main(int argc, char** argv) {
    if(argc!=2) {
        cerr << "Error. La ejecución debe ser: script <file-name.txt>" << endl;
        exit(-1);
    }

    Dictionary d;
    cout << d.toLatex(argv[1]);
}