data() {
 curl "http://www.inegi.org.mx/sistemas/consulta_resultados/zip/iter2010/iter_nalcsv10.zip" > data.zip
}

clean() {
 unzip data.zip
}

import() {
 mongoimport -d PICS -c censo2010 --type=csv --headerline censo2010/conjunto_de_datos/iter_00_cpv2010.csv
}

# db.censo2010.find({'nom_loc':'Total del Municipio'},{entidad:1,mun:1,pobtot:1,_id:0,'nom_loc':1}).limit().pretty().count()
