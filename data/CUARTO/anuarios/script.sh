
getData() {
  files=(
  702825082017xls.zip
  702825082024xls.zip
  702825082031xls.zip
  702825082048xls.zip
  702825082055xls.zip
  702825082062xls.zip
  702825082079xls.zip
  702825082086xls.zip
  702825082369xls.zip
  702825082376xls.zip
  702825083533xls.zip
  702825083632xls.zip
  702825083649xls.zip
  702825083656xls.zip
  702825083663xls.zip
  702825083670xls.zip
  702825083687xls.zip
  702825083694xls.zip
  702825083748xls.zip
  702825083755xls.zip
  702825083762xls.zip
  702825084295xls.zip
  702825084301xls.zip
  702825084318xls.zip
  702825084325xls.zip
  702825084332xls.zip
  702825084349xls.zip
  702825084356xls.zip
  702825084363xls.zip
  702825084370xls.zip
  702825084431xls.zip
  702825085407xls.zip
  )

  for j in ${files[@]}; do
   curl http://internet.contenidos.inegi.org.mx/contenidos/productos//prod_serv/contenidos/espanol/bvinegi/productos/nueva_estruc/anuarios_2016/$j > $j
  done
}

ordenar() {
  for i in *.zip; do
    unzip $i
    count=0

    for j in *.xls; do
      if [[ $count < 1 ]]; then
          dir=$(echo $j | cut -d " " -f 1)
          dir=${dir::-1}
          mkdir ${dir}
          mv *.pdf *.xls *.PDF $dir
      fi
      count=`expr $count + 1`
    done

  done
}


electricidad() {
#  mkdir electricidad;

  for i in */; do
    name=$(ls $i | grep Electricidad);
    ent=$(ls $i | grep Electricidad | cut -d " " -f 1);
    echo $name
    xls2csv -x "$i$name" -c "${name%.*}.csv" -n 1 -f -q
    iconv -f ISO-8859-15 -t UTF-8 "${name%.*}.csv" > "${ent}Index.csv"
    rm "${name%.*}.csv"

   for j in "Usuarios de energía" "Volumen" "Valor de las ventas"; do
    var=$(echo $j | cut -d " " -f 1);
    sheet=`expr $(cat "${ent}Index.csv" | grep "${j}" | cut -d "," -f 1 | cut -d "." -f 2) + 1`
    echo $sheet $j
    xls2csv -x "$i${name}" -n 4 -c "${name%.*}$var.csv" -q
    iconv -f ISO-8859-15 -t UTF-8 "${name%.*}$var.csv" > ${ent}${var}_raw.csv
    rm "${name%.*}$var.csv"

   done

####
    for i in Usuarios Volumen Valor; do
      limpiar $i
    done
####

    echo " "
  done

  rm *Index.csv;

#  for i in Usuarios Volumen Valor; do
#    limpiar $i
#  done
}

limpiar() {
 echo "Municipio,Total,Doméstico,Alumbrado Público,Bombeo de aguas potables y negras,Agrícola,Industrial y de servicios,Variable,ent" > header;

 for i in *${1}_raw.csv; do
   inicio=$(cat $i | grep '^Estado\|^Delegación' -n | cut -d":" -f 1);
   inicio=`expr $inicio + 1`
   num=$(cat $i | grep ^a -n | cut -d":" -f1);
   line=$(head -`expr $num - 1` $i | tail -1)

   if [[ ${line:0:4} == "Nota" ]]; then
    final=`expr $num - 2`
   else
    final=`expr $num - 1`
   fi

   file=$(echo $i | cut -d"_" -f1)
   echo $file,$inicio,$final

   head -n $final $i | tail -n +$inicio > ${file}_sin.csv
   sed -i 's/,,,,,/,/g' ${file}_sin.csv
   sed -i 's/\([0-9]\),\([0-9]\)/\1\2/g' ${file}_sin.csv
   sed -i 's/,,,,/,/g' ${file}_sin.csv
   sed -i 's/,,/,/g' ${file}_sin.csv
   sed -i 's/,,/,/g' ${file}_sin.csv
   sed -i 's/"//g' ${file}_sin.csv
#   sed -i "s/,$/,${1}/g" ${file}_sin.csv
#   sed -i "s/$/,${ent::-1}/g" ${file}_sin.csv

   sed -i 's/,g[/],/,/g' ${file}_sin.csv
   sed -i 's/,f[/],/,/g' ${file}_sin.csv
   sed -i 's/\([0-9]\) \([0-9]\)/\1\2/g' ${file}_sin.csv

   sed -i "s/,$/,${1}/g" ${file}_sin.csv
   sed -i "s/$/,${ent::-1}/g" ${file}_sin.csv

   cat header ${file}_sin.csv > ${file}.csv
   rm ${i} ${file}_sin.csv;
 done

 rm header;
}

arreglarParticulares() {
 for i in CDMX.*.csv; do
  sed -i '2,5d' $i;
 done 

 dobleLinea Hgo "Santiago Tulantepec" "de Lugo Guerrero"
 dobleLinea Oax "Heroica Ciudad de Juchitán" "de Zaragoza"
 dobleLinea Oax "Heroica Villa Tezoatlán de Segura" "de Oaxaca"

for i in Oax.*.csv; do
  num=$(cat $i | grep "y Luna, Cuna de la Independencia " -n | cut -d':' -f1);
  sed -i "${num}d" $i;
  sed -i "s/Heroica Villa Tezoatlán de Segura de Oaxaca/Heroica Villa Tezoatlán de Segura y Luna; Cuna de la Independencia de Oaxaca/g" $i
done

# for i in Hgo.*.csv; do
#  num=$(cat $i | grep 'Santiago Tulantepec' -n | cut -d':' -f1);
#  sed "${num}d" -i $i
#  sed -i "s/de Lugo Guerrero/Santiago Tulantepec de Lugo Guerrero/g" $i;
# done
}

dobleLinea() {
 for i in ${1}.*.csv; do
  num=$(cat $i | grep "${2}" -n | cut -d':' -f1);
  sed "${num}d" -i ${i}
  sed -i "s/${3}/${2} ${3}/g" $i;
 done

}

importar() {
 for i in *.csv; do
  mongoimport -d PICS -c electricidad --type=csv --headerline $i
 done
}
