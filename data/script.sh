# Esta función descarga y transforma la cartografía de límites estatales.
function entidades {
  curl -o entidades.zip http://mapserver.inegi.org.mx/MGN/mge2014v6_2.zip
  unzip entidades.zip
  ogr2ogr -t_srs EPSG:4326 -f GeoJSON ENTIDADES.json mge2015v6_2.shp
  topojson -o entidades.json ENTIDADES.json -p
  rm ENTIDADES.json mge2015v6_2.* entidades.zip
}

# Cartografía de cada entidad federativa
function cadaEntidad {
  mkdir entidades; cd entidades;
  links=(
  Aguascalientes/702825209025_s.zip
  Baja_California/702825209032_s.zip
  Baja_California_Sur/702825209049_s.zip
  Campeche/702825209056_s.zip
  Chiapas/702825209063_s.zip
  Chihuahua/702825209070_s.zip
  Distrito_Federal/702825209100_s.zip
  Coahuila_de_Zaragoza/702825209087_s.zip
  Colima/702825209094_s.zip
  Durango/702825209117_s.zip
  Guanajuato/702825209124_s.zip
  Guerrero/702825209131_s.zip
  Hidalgo/702825209148_s.zip
  Jalisco/702825209155_s.zip
  Michoacan_de_Ocampo/702825209179_s.zip
  Morelos/702825209186_s.zip
  Mexico/702825209162_s.zip
  Nayarit/702825209193_s.zip
  Nuevo_Leon/702825209209_s.zip
  Oaxaca/702825209216_s.zip
  Puebla/702825209223_s.zip
  Queretaro/702825209230_s.zip
  Quintana_Roo/702825209247_s.zip
  San_Luis_Potosi/702825209254_s.zip
  Sinaloa/702825209261_s.zip
  Sonora/702825209278_s.zip
  Tabasco/702825209285_s.zip
  Tamaulipas/702825209292_s.zip
  Tlaxcala/702825209308_s.zip
  Veracruz_de_Ignacio_de_la_Llave/702825209315_s.zip
  Yucatan/702825209322_s.zip
  Zacatecas/702825209339_s.zip)

  for i in ${links[@]}; do
    entidad=$(echo $i | cut -d'/' -f1);
  #  echo $entidad;
    curl -o $entidad.zip http://internet.contenidos.inegi.org.mx/contenidos/productos//prod_serv/contenidos/espanol/bvinegi/productos/geografia/Cinter_2015/$i
  done
}

# Con esto se ordenan cada tipo de cartografía en una carpeta diferente.
function ordenar {
  cd entidades; #mkdir municipios;

  for i in *; do
   if [ -f $i ]; then
      filename=${i%.*};
      mkdir $filename;
      unzip $i -d $filename;
      cd $filename/conjunto_de_datos;

      # Esto crea una carpeta para tipo de cartografía.
	for f in *; do
	  var="${f%.*}";
	  length=${#var}
	  dir=${var:2:$length};

        # Sin no existe la carpeta, entonces se crea.
	  if [ ! -d "${dir}" ]; then
	    mkdir ${dir}
	  fi
	# Esto mueve los archivos a cada carpeta. Los '??' es para el # de entidad
	  if [[ ??${dir}.* ]]; then
	    mv ??${dir}.* ${dir}
	  fi
	done

    #ogr2ogr -t_srs EPSG:4326 -f GeoJSON ${filename}_MUN.json *mun.shp
    #topojson -o ${filename}_mun.json ${filename}_MUN.json -p
    #mv ${filename}_mun.json ../../
      cd ../..;
      #mv *.json municipios;
   fi
  done

#  cd municipios; mkdir exports; cd ../../;
#  node script.js; 
}

function transformar {
  cd entidades;

  categories=(
   mun
   l
   m
   #e
  )

  for c in ${categories[@]}; do
    mkdir $c
    for d in */; do
      ogr2ogr -t_srs EPSG:4326 -f GeoJSON \
${c}/${d::-1}_${c}.json ${d}conjunto_de_datos/${c}/*.shp;
    done
  done

  echo "Finito.."
}


## DENUE ##################|
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
   curl -o ${num}.zip http://www3.inegi.org.mx/sistemas/descarga/descargaarchivo.aspx?file=DENUE%2fEntidad_federativa%2f${num}_${links[$i]}%2fdenue_${num}_shp.zip
 done

}
