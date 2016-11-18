data() {
  curl http://www.conapo.gob.mx/work/models/CONAPO/Resource/862/4/images/Base_IMU%202010_CONAPO_VF.xlsx > marg.xlsx
}

clean() {
  xlsx2csv -s 2 marg.xlsx > marg.csv;
}

import() {
  mongoimport -d PICS -c marg --type=csv --headerline marg.csv;
}

export() {
 mongoexport -d PICS -c gradoDemarg --type=csv -f 'ciudad,Grado de marginación urbana 2010' -o grado.csv;
}
