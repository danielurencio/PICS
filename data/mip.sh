edos() {
 f=$1
 file=${f%.*}
 xlsx2csv ${file}.xlsx > ${file}.csv
 sed -i '1,6d' ${file}.csv
# head -n -11 ${file}.csv > ${file}_a.csv
# rm ${file}.csv; mv ${file}_a.csv ${file}.csv;
}

files() {
  curl http://www.inegi.org.mx/est/contenidos/Proyectos/ce/ce2014/doc/tabulados.html > a
  cat a | grep 'a class="list-group-item"' > b; rm a
  cut -d "=" -f 3 b > c; rm b
  cut -d ">" -f 1 c > links; rm c

  while read i;
    do var=$(echo $i | cut -f2 -d '/');
    curl -o mip/$var http://www.inegi.org.mx/est/contenidos/Proyectos/ce/ce2014/doc/tabulados/${var}
  done < links
}
