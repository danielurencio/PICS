data() {
 curl "http://www.coneval.org.mx/Informes/Pobreza/Pobreza_municipal/pobreza%20extrema%20y%20alimentacion%20por%20municipio.zip" > pobreza.zip
 unzip pobreza.zip; rm pobreza.zip;
 xlsx2csv *.xlsx > pobreza.csv; rm *.xlsx
}

clean() {
#  total=$(cat pobreza.csv | wc -l);
  last=$(cat pobreza.csv | grep -n 32058 | cut -d ':' -f 1);
  first=$(cat pobreza.csv | grep -n 1001,Ag | cut -d ':' -f 1);
  head -n +${last} pobreza.csv > pobreza1.csv;
  tail -n +${first} pobreza1.csv > pobreza2.csv;
  cat pobreza2.csv | cut -d ',' -f 2- > pobreza3.csv
#  rm *[1-2].csv
  echo "cveEnt,entidad federativa,cveMun,municipio,población,pobreza extrema (%),pobreza extrema (personas),carencia por acceso a la alimentación (%),carencia por acceso a la alimentación (personas),población pobre extrema y que también es carente por acceso a la alimentación (%), población pobre extrema y que también es carente por acceso a la alimentación (personas)" > H;
  cat H pobreza3.csv > pobreza4.csv;
  cat pobreza4.csv | cut -d ',' -f 1-11 > pobreza5.csv
  mv pobreza5.csv pobrezaExtrema;
  rm *.csv H;
  mv pobrezaExtrema pobreza.csv
}

store() {
  mongoimport -d PICS -c pobrezaExtrema --type=csv --headerline pobreza.csv;
}

export() {
  mongo pobreza.js;

  mongoexport -d PICS -c pobrezaExtrema -o pobrezaSUN.csv --type=csv -f "_id,ciudad,pobreza extrema (%),carencia por acceso a la alimentación (%),pobreza extrema y con carencia por acceso a la alimentación (%)"
}
