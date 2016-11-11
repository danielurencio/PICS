# http://smn1.conagua.gob.mx/climatologia/catalogos/cat_ags.html
# https://es.wikipedia.org/wiki/Anexo:Abreviaturas_en_M%C3%A9xico

entidades=(ags bc bcs camp chis chih coah col df dgo gto gro hgo jal mex mich mor nay nl oax pue qro qroo slp sin son tab tamps tlax ver yuc zac);

getLinks() {
 for i in ${!entidades[@]}; do
  curl http://smn1.conagua.gob.mx/climatologia/catalogos/cat_${entidades[$i]}.html | grep "MED-EXT MES" | cut -d '.' -f 3 > ${entidades[$i]}_ent
#    echo ${entidades[$i]}
 done;
}

getData() {
 mkdir files;

 for i in ${!entidades[@]}; do

   while read j; do
     file=$(echo $j | cut -d '/' -f 4);
     curl http://smn1.conagua.gob.mx/climatologia${j}.TXT -o files/${file}.txt;
   done < ${entidades[$i]}_ent;

 done

 echo FINITO!
}

clean() {
# Nobre de estación y clave municipal
cveMun=$(sed '4!d' $1);
nombre=$(sed '5!d' $1 | cut -d ',' -f 1);

# Declarar las variables para los archivos que se van a crear.
 a=${1%.*}_1.txt;
 b=${1%.*}_2.txt;
 c=${1%.*}_3.txt;
 d=${1%.*}_4.txt;

# Transformar la codificación del texto para reconocer acentos (´).
 iconv -f ISO-8859-1 -t UTF-8 $1 > $a;

# Crear 'arrays' para identificar los niveles en dónde cortar y guardar el # de línea.
 levels=(MÁXIMA MÍNIMA PRECIPITACIÓN EVAPORACIÓN)
 array=();

 for i in ${levels[@]}; do
  array+=( $(cat $a | grep -n $i | cut -d ':' -f 1) );
  #echo ${array[@]};
 done

# Reducir el archivo a la información necesaria mínima.
 tail -n +${array[0]} $a > $b; rm $a;

# Re-identificar los niveles donde cortar y guardar el # de línea.
 unset array levels;
 levels=(MÁXIMA MÍNIMA PRECIPITACIÓN EVAPORACIÓN);
 array=();

 for i in ${levels[@]}; do
  array+=( $(cat $b | grep -n $i | cut -d ':' -f 1) );
  #echo ${array[@]};
 done

# Hacer un nuevo archivo sin la evaporación
  head -n +$( expr ${array[3]} - 2) $b > $c; rm $b;

# PRECIPITACIÓN, TEMPERATURA MÍNIMA & TEMPERATURA MÁXIMA
  tail -n +${array[2]} $c > ${levels[2]}.txt;
  head -n +$( expr ${array[2]} - 2 ) $c > $d; rm $c;
  tail -n +${array[1]} $d > ${levels[1]}.txt;
  head -n +$( expr ${array[1]} - 2 ) $d > ${levels[0]}.txt; rm $d;


# Combinar archivos en uno y convertir éste en formato CSV.
  for i in 0 1 2; do
    tail -n +5 ${levels[$i]}.txt > ${levels[$i],,}.txt; rm ${levels[$i]}.txt;
    sed -i 's/  */,/g' ${levels[$i],,}.txt;
#    sed -i "s/$/,\\${levels[$i],,},\\${nombre},\\${cveMun:3:${#cveMun}}/g" ${levels[$i],,}.txt;
    sed -i "s/$/,\\${levels[$i],,},\\${nombre},\\${cveMun}/g" ${levels[$i],,}.txt;

    sed -i 's/máxima/temperatura máxima/g' ${levels[$i],,}.txt;
    sed -i 's/mínima/temperatura mínima/g' ${levels[$i],,}.txt;
  done;

  cat ${levels[0],,}.txt ${levels[1],,}.txt ${levels[2],,}.txt > ${1%.*}

  echo "mes,año inicial,año final,número de años,valor máximo,fecha del máximo,se ha repetido el máximo, valor mínimo,fecha del mínimo,se ha repetido el mínimo,valor medio,desviación estándar,medición,nombre de estación,cveMun" > header

  cat header ${1%.*} > ${1%.*}.csv;
  rm header p* m* ${1%.*};

  echo Converted!
}


parseAll() {
 for i in files/*; do
   echo $i
   clean $i;
 done
}

importAll() {
 for i in files/*.csv; do
   mongoimport -d PICS -c normales --type=csv --headerline ${i};
 done
}

newDB() {
  mongo normales.js
  mongo clima.js
  mongoexport -d PICS -c clima --type=csv -f '_id,temperatura máxima,temperatura mínima,precipitación,ciudad' -o clima.csv
}
