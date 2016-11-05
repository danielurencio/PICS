data() {
  curl -o delitos.xlsx "http://sc.inegi.org.mx/cobdem/descargaformatosservlet?tipo=1&archivo=SIMBAD_01099_20161104015628730.xlsx"
  libreoffice --headless --convert-to csv --infilter=44,34,76,1 delitos.xlsx;
  rm delitos.xlsx;
  iconv -f ISO-8859-15 -t UTF-8 -o delitos1.csv delitos.csv;
  rm delitos.csv; mv delitos1.csv delitos.csv;
}

clean() {
 last=$(cat delitos.csv | grep -n '32996,No especificado' | cut -d ':' -f 1);
 first=$(cat delitos.csv | grep -n Clave | cut -d ':' -f 1);

 head -n +${last} delitos.csv > 1.csv;
 tail -n +${first} 1.csv > 2.csv;
 rm delitos.csv 1.csv; mv 2.csv delitos.csv;
 sed -i 's/Clave/_id/g' delitos.csv;
}

store() {
 mongoimport -d PICS -c delitos --type=csv --headerline delitos.csv;
 mongo delitos.js
}

export() {
 mongoexport -d PICS -c delitos --type=csv -f "_id,Total delitos,ciudad,Daño en las cosas (%),Delitos sexuales (%),Homicidio (%),Lesiones (%),Robo (%),Otros delitos (%)" -o delitosF.csv;
}
