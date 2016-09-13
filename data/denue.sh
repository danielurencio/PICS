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
  Mexico
  Michoacan_de_Ocampo
  Morelos
  Nayarit
  Nuevo_Leon
  Oaxaca
  Puebla
  Queretaro
  Quintana_Roo
  San_Luis_Potosi
  Sinaloa
  Sonora
  Tabasco
  Tamaulipas
  Tlaxcala
  Veracruz_de_Ignacio_de_la_Llave
  Yucatan
  Zacatecas)

 mkdir denue

 for i in ${!links[@]}; do
   num=`expr $i + 1`;
   if [ ${#num} == 1 ]; then num=0$num; fi
#  echo $num ${links[$i]}
   curl -o denue/${num}.zip http://www3.inegi.org.mx/sistemas/descarga/descargaarchivo.aspx?file=DENUE%2fEntidad_federativa%2f${num}_${links[$i]}%2fdenue_${num}_shp.zip
 done
}

denueOrdenar() {
  cd denue;
  for i in *; do
   dir=${i%.*}
   mkdir $dir
   unzip $i -d $dir
   cd $dir

   for j in *; do
    if [ ! -d $j ]; then
     ogr2ogr -t_srs EPSG:4326 -f GeoJSON ../${dir}.json DENUE_INEGI_${dir}_.shp
    else
     ogr2ogr -t_srs EPSG:4326 -f GeoJSON ../${dir}.json ${j}/DENUE_INEGI_${dir}_.shp
    fi
   done

   cd ../
  done

  mkdir json; mv *.json json
}
