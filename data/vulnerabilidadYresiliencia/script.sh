data() {
 curl -o file.zip 'http://www.anr.gob.mx/descargas/Indicadores/Indice%20de%20resiliencia.zip';
}

unpack() {
 unzip file.zip;
 libreoffice --headless --convert-to csv Indice_de_resiliencia.dbf;
 iconv -f ISO-8859-15 -t UTF-8 Indice_de_resiliencia.csv > data.csv;
 rm I*;
 cat data.csv | cut -d',' -f'2,12,13' | sed '1d' > data1.csv; rm data.csv
 echo 'cveMun,grado de vulnerabilidad social,resiliencia' > head;
 cat head data1.csv > data.csv; rm data1.csv head;
}

import() {
 mongoimport -d PICS -c vulYres --type=csv --headerline data.csv;
}
