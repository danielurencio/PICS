data() {
  curl "http://www.conapo.gob.mx/work/models/CONAPO/Marginacion/Datos_Abiertos/SUN/Mapa_del_Sistema_Urbano_Nacional_2010.rar" > sun.rar;
  mkdir sunShape;
  unrar e sun.rar;
  ogr2ogr -t_srs EPSG:4326 sun.shp SUN.shp;
  rm SUN.*
  mv sun.* sunShape;
  rm *.rar;
}

solar() {
 curl "https://dgel.energia.gob.mx/documentos/TIFF/Solar/Directa.zip" > direct.zip
 unzip direct.zip
 cp Directa/"Irradiacion Social Directa Anual.tif" irradiacion.tif;
 rm Directa -r;
 rm *.zip;
}


eolica(){
curl https://dgel.energia.gob.mx/documentos/TIFF/Eolico_CFE/Potencia/120m_Altura.zip > 120m.zip
 unzip 120m.zip;
 cp "120m Altura/Densidad de potencia 120m_ Anual.tif" 120mAnual.tif
 rm "120m Altura" -r;
 rm *.zip;
 mv 120manual.tif eolica.tif
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

tifs() {
 solar; eolica; geotermia; residuos;
}

#rasterPoint() {
#  for i in *.tif; do
#   echo $i 
#  done
#}

addSUN() {
 libreoffice --headless --convert-to csv sunShape/sun.dbf;
 sed -i "1 s/,[A-Z],[0-9]\|,[A-Z],[0-9][0-9]\|,[A-Z],[0-9],[0-9]\|,[A-Z],[0-9][0-9],[0-9]\|,[A-Z],[0-9][0-9],[0-9][0-9]//g" sun.csv;
 mongoimport -d test -c sun --type=csv --headerline sun.csv;
 mongo sunShape.js;
 mongoexport -d test -c sun --type=csv -o sun1.csv -f "CVE_ENT,CVE_MUN,CVE_LOC,NOM_LOC,CVE_EMLOC,CVE_AGEB,POINT_X,POINT_Y,Tipo_loc,Tipo,GM2010,GD_HLI,ubicacion,CVE_MPIO,Pob_2010,CVE_SUN,NOM_ENT,CVE_LOC_1,CIUDAD,TIPO_CD,P1990,P1995,P2000,P2005,P2010,TC_90_95,TC_95_00,TC_00_05,TC_05_10,TC_90_00,TC_00_10,CAT_C_0010,fs,PR_POBOC,conve,conven_,POT_DES,cc";
 mongo --eval "db.sun.drop()";
 libreoffice --headless --convert-to dbf sun1.csv;
 rm sun1.csv;
 rm sunShape/sun.dbf;
 mv sun1.dbf sun.dbf;
 mv sun.dbf sunShape/;
}
