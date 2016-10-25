edos() {
 f=$1
 file=${f%.*}
 xlsx2csv ${file}.xlsx > ${file}.csv
 sed -i '1,6d' ${file}.csv
# head -n -11 ${file}.csv > ${file}_a.csv
# rm ${file}.csv; mv ${file}_a.csv ${file}.csv;
}

curl http://www.inegi.org.mx/est/contenidos/Proyectos/ce/ce2014/doc/tabulados.html | grep 'a class="list-group-item"'
