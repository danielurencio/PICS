data() {
  curl "http://www.conapo.gob.mx/work/models/CONAPO/Marginacion/Datos_Abiertos/SUN/Mapa_del_Sistema_Urbano_Nacional_2010.rar" > sun.rar;
  mkdir sunShape;
  unrar e sun.rar;
  iconv -t UTF-8 SUN.dbf;
  ogr2ogr -t_srs EPSG:4326 sun.shp SUN.shp;
  rm SUN.*
  mv sun.* sunShape;
  rm *.rar;
}

solar() {
 curl "https://dgel.energia.gob.mx/documentos/TIFF/Solar/Directa.zip" > direct.zip
 unzip direct.zip
 cp Directa/"Irradiacion Social Directa Anual.tif" solar.tif;
 rm Directa -r;
 rm *.zip;
}


eolica(){
curl https://dgel.energia.gob.mx/documentos/TIFF/Eolico_CFE/Potencia/120m_Altura.zip > 120m.zip
 unzip 120m.zip;
 cp "120m Altura/Densidad de potencia 120m_ Anual.tif" 120mAnual.tif
 rm "120m Altura" -r;
 rm *.zip;
 mv 120mAnual.tif eolica.tif
}

geotermia() {
  curl https://dgel.energia.gob.mx/documentos/TIFF/Geotermica/Geotermico_Tiff.zip > geo.zip
 unzip "*.zip";
 mv Geotermico_Tiff/geotermia.tif ./;
 rm -r Geotermico_Tiff;
 rm *.zip;
}

residuos() {
# for i in Residuos_Urbanos ForestalesYAgricolas ResiduosIndustriales ResiudosPecuarios Biocombustibles Tala_Sustentable; do
  curl https://dgel.energia.gob.mx/documentos/TIFF/Biomasa/Residuos_Urbanos.zip > Residuos_Urbanos.zip;
 #done;
  unzip *.zip
  unzip Residuos_Urbanos/ResiduosUrbanos_Municipal_Tiff.zip
  mv ResiduosUrbanos_Municipal_Tiff/Residuos\ Urbanos_Municipio.tif ./residuos.tif;
  rm */ -r;
  rm *.zip;
}

##############################################3
tifs() {
 solar; eolica; geotermia; residuos;
 data;

 rasterPoint; dbfTocsv;
}
############################################333

rasterPoint() {
  for i in *.tif; do
   value=${i%.*};
   for band in 1 2 3; do
     echo $band;
     python rasterPoint.py $i sunShape/sun.shp $band $value
   done
  done
}

dbfTocsv() {
 libreoffice --headless --convert-to csv sunShape/sun.dbf;
 mv sunShape/sun.csv ./
 sed -i 1d sun.csv;
 cut -d ',' -f 16,38- sun.csv > tifs.csv
 rm sun.csv;
 echo "cveSUN,eolica1,eolica2,eolica3,geotermia1,geotermia2,geotermia3,residuos1,residuos2,residuos3,solar1,solar2,solar3" > head
 cat head tifs.csv > potencial.csv;
 rm head tifs.csv;
 mongoimport -d test -c potencial --headerline --type=csv potencial.csv;
 mongo filterSUN.js;
 mongo rgb.js;
}

oceanic() {
 curl "https://dgel.energia.gob.mx/documentos/TIFF/Oleaje/Potencia.zip" > oceanic.zip;
 unzip oceanic.zip;
 mv Potencia/potmed_anual.tif oceanic.tif;
 rm -r Potencia;
 rm oceanic.zip;
}

costas() {
 mongoexport -d test -c costas --type=csv -f "_id" -o costas.csv;
# sed -i 1d costas.csv;
 var=$(sed ':a;N;$!ba;s/\n/ OR CVE_SUN = /g' costas.csv);
 count=$( echo $var | wc -c );
 var=$( echo ${var:7:$count} );
 ogr2ogr -f "ESRI Shapefile" -where "$var" costas.shp sunShape/sun.shp;
 rm costas.csv;
 mkdir costas; mv costas.* costas;
}
