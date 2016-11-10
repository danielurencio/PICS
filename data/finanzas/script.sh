data() {
  
#  curl "http://sc.inegi.org.mx/cobdem/descargaformatosservlet?tipo=1&archivo=SIMBAD_34168_20161105114729082.xlsx" > finanzas.xlsx;
  #libreoffice --headless --convert-to csv --infilter=44,34,76,1 finanzas.xlsx;
  #rm finanzas.xlsx;
  #iconv -f ISO-8859-15 -t UTF-8 -o finanzas1.csv finanzas.csv;
  #rm finanzas.csv; mv finanzas1.csv finanzas.csv;
}

clean() {
  libreoffice --headless --convert-to csv --infilter=44,34,76,1 finanzas.xlsx;
  #rm finanzas.xlsx;
  iconv -f ISO-8859-15 -t UTF-8 -o finanzas1.csv finanzas.csv;
  rm finanzas.csv; mv finanzas1.csv finanzas.csv;


 last=$(cat finanzas.csv | grep -n '99,No' | cut -d ':' -f 1);
 first=$(cat finanzas.csv | grep -n Clave | cut -d ':' -f 1);

 head -n +${last} finanzas.csv > 1.csv;
 tail -n +${first} 1.csv > 2.csv;
 rm finanzas.csv 1.csv; mv 2.csv finanzas.csv;
 sed -i 's/Clave/_id/g' finanzas.csv;
}
