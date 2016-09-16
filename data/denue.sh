function denueDescarga {
 links=( 
  Aguascalientes
  Baja_California
  Baja_California_Sur
  Campeche
  Coahuila_de_Zaragoza
  Colima 
  Chiapas
  Chihuahua
  Distrito_Federal
  Durango
  Guanajuato
  Guerrero
  Hidalgo
  Jalisco
  México
  Michoacán_de_Ocampo
  Morelos
  Nayarit
  Nuevo_León
  Oaxaca
  Puebla
  Querétaro
  Quintana_Roo
  San_Luis_Potosí
  Sinaloa
  Sonora
  Tabasco
  Tamaulipas
  Tlaxcala
  Veracruz_de_Ignacio_de_la_Llave
  Yucatán
  Zacatecas)

 mkdir denue

 for i in ${!links[@]}; do
   num=`expr $i + 1`;
   if [ ${#num} == 1 ]; then num=0$num; fi
#  echo $num ${links[$i]}
   curl -o denue/${num}.zip http://www3.inegi.org.mx/sistemas/descarga/descargaarchivo.aspx?file=DENUE%2fEntidad_federativa%2f${num}_${links[$i]}%2fdenue_${num}_${1}.zip
 done
}

denueOrdenarSHP() {
  cd denue;
  for i in *; do
   dir=${i%.*}
   mkdir $dir
   unzip $i -d $dir
   cd $dir

   for j in *; do
    if [[ ! -d $j && ! -f ../${dir}.json ]]; then
     ogr2ogr -t_srs EPSG:4326 -f GeoJSON ../${dir}.json DENUE_INEGI_${dir}_.shp
    fi
    if [ -d $j ]; then
     ogr2ogr -t_srs EPSG:4326 -f GeoJSON ../${dir}.json ${j}/DENUE_INEGI_${dir}_.shp
    fi
   done

   cd ../
  done

  mkdir json; mv *.json json
  cd json;

  for i in *; do
    iconv -f ISO-8859-1 -t utf-8 ${i%.*}.json > ${i%.*}_utf8.json;
  done

  mkdir no; mv ??.json no;

  cd ../
}

denueOrdenarCSV() {
  cd denue;
  unzip "*.zip"

  for i in */; do
    mv ${i}* ./;
    rm -r ${i};
  done

  for i in *.csv; do
    num=$(echo ${i} | cut -d "_" -f 3);
    iconv -f ISO-8859-1 -t utf-8 ${i} > ${num}.csv
  done

  rm D*.csv
  cd ../
}

importCSVtoMongo()  {
  cd denue;

  for i in *.csv; do
    mongoimport --file ${i} -d PICS -c denue --headerline --type=csv
  done

  cd ../
}
