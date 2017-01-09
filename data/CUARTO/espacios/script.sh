datos() {
  while read i; do
    file=$(echo $i | cut -d'/' -f13);
    curl $i > ${file}.zip
  done < resultados.txt
}
