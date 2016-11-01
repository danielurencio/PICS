files() {
  curl http://www.inegi.org.mx/est/contenidos/Proyectos/ce/ce2014/doc/tabulados.html > a
  cat a | grep 'a class="list-group-item"' > b; rm a
  cut -d "=" -f 3 b > c; rm b
  cut -d ">" -f 1 c > links; rm c

 while read i;
  do var=$(echo $i | cut -f2 -d '/');
curl -o mip/$var http://www.inegi.org.mx/est/contenidos/Proyectos/ce/ce2014/doc/tabulados/${var}
  done < links; rm links
}

csv() {
  for i in mip/mu*ce14_01.*; do
#    file=$(basename ${i%.*});
    var=${i%.*};
#    echo $var
    xlsx2csv ${var}.xlsx > ${var}.csv
  done;
}

parse() {
  touch h;

echo 'Entidad federativa,Municipio,Sector,Subsector,Rama,Subrama,Clase,Denominación,Unidades económicas,Total,Subtotal,Personal ocupado remunerado,Propietarios-familiares y otros trabajadores no remunerados,No dependiente de la razón social,Remuneraciones,Gastos por consumo de bienes y servicios,Ingresos por suministro de bienes y servicios,Producción bruta total,Consumo Intermedio,Valor agregado censal bruto,Formación bruta de capital fijo,Variación total de existencias,Activos fijos,Depreciación de activos fijos' > h;

  for i in mip/*.csv; do
    var=${i%.*};
    tail -n +25 ${var}.csv > ${var}_p.csv; rm ${var}.csv;
    upto=$(cat ${var}_p.csv | grep -n 'Nota. Los Cens' | cut -d ':' -f 1);
    dif=$(tail -n +${upto} ${var}_p.csv | wc -l);
#    dif=`expr $final - $upto`;
    head -n -${dif} ${var}_p.csv > ${var}_f.csv; rm ${var}_p.csv;
    cat h ${var}_f.csv > ${var}.csv; rm ${var}_f.csv
  done

  rm h;
}

store() {
 for i in mip/*.csv; do
  mongoimport -d PICS -c ce14 --type=csv --headerline --file ${i};
 done
}


