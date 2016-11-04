data() {
curl "http://datos.cfe.gob.mx/Datos/Usuariosyconsumodeelectricidadpormunicipio.csv" > data.csv;
}

store() {
  mongoimport -d PICS -c consumoE --type=csv --headerline data.csv
}

export() {
  mongo consumoE.js

  mongoexport -d PICS -c consumoE -o consumoE.csv --type=csv -f "_id,ciudad,consumo promedio (enero a agosto de 2016)"
}
