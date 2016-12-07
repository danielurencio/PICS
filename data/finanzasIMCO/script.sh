data() {
 curl http://apiv3.dev.imco.org.mx/vendor/imco/indices-api/documentos/Documentos%20de%20resultados/IIPM%202015%20Base-de-datos.xlsx > imco2015.xlsx;
}

clean() {
 xlsx2csv -s 7 imco2015.xlsx > data.csv
 sed -i '1,3d' data.csv;
 cut -d ',' -f 2,102 data.csv > a.csv;
 head -n +443 a.csv > data.csv;

 echo "_id,puntaje" > head;
 cat head data.csv > data1.csv;
 rm a.csv data.csv head; mv data1.csv data.csv;
}

import() {
 mongoimport -d PICS -c finanzasIMCO --headerline --type=csv data.csv;
}
