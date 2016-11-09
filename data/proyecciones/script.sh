data() {
  curl "http://www.conapo.gob.mx/work/models/CONAPO/Proyecciones/Datos/descargas/Proyecciones_municipios_y_localidades.zip" > proyecciones.zip
}

clean() {
  unzip proyecciones.zip;
}

municipios() {
 echo "cveMun,Municipio,Sexo,Grupo de Edad, 2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,2030" > header

 for e in ./Proyecciones_municipios_y_localidades/Municipios/*; do
  file=${e%.*};
  ent=$(echo $(basename ${e%.*}) | cut -d '_' -f 1).csv;
##  xlsx2csv $e > $file.csv;
  libreoffice --headless --convert-to csv --infilter=44,34,76,1 ${e} --outdir Proyecciones_municipios_y_localidades/Municipios;

  iconv -f ISO-8859-15 -t UTF-8 -o ${file}1.csv $file.csv; rm $file.csv; mv ${file}1.csv $file.csv

  tail -n +21 $file.csv > a.csv;
  cat header a.csv > Proyecciones_municipios_y_localidades/Municipios/$ent;
  rm a.csv;
  rm $e; rm $file.csv;
  echo Created $ent;
# done

# rm header;

 for n in 1 2 3; do
 cat Proyecciones_municipios_y_localidades/Municipios/$ent | cut -d ',' -f $n  > $n

  while read i; do
   if [[ $i != "" ]]; then
    var=$i;
    echo $var,;
   fi;

   if [[ $i == "" ]]; then
    echo $var,;
   fi; 

  done < $n >> ${n}_ok;
 done

 cut Proyecciones_municipios_y_localidades/Municipios/$ent -d ',' -f 4- > resto
 paste 1_ok 2_ok 3_ok resto > Proyecciones_municipios_y_localidades/Municipios/${ent}_ok.csv
 rm Proyecciones_municipios_y_localidades/Municipios/${ent}
 rm [1-3]*; rm resto;

done 
 rm header;

}
