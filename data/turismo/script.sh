entidades=(AGS BC BCS CAM CHIS CHIH COAH COL CDMX DGO GTO GRO HGO JAL MEX MICH MOR NAY NL OAX PUE QRO QROO SLP SIN SON TAB TAMS TLAX VER YUC ZAC);

data() {
 for i in ${entidades[@]}; do
   curl http://www.datatur.sectur.gob.mx/ITxEF_Docs/${i}_ANUARIO_XLS15.zip -o ${i}.zip
#   echo $i;
 done;
}


unpack() {
 for i in ${entidades[@]}; do
  mkdir ${i};
  unzip ${i}.zip -d ${i};
 done;
}


clean() {
 for i in */; do
  newName=$(basename ${i}*.xls | cut -d '.' -f 1);
  mv ${i}*.xls ${i}${newName}.xls;

########## SOLUCIÓN A PROBLEMA CON CHIHUAHUA #####################
  if [[ $newName == Chih ]]; then
    libreoffice --headless --convert-to ods ${i}${newName}.xls --outdir ${i};
    libreoffice --headless --convert-to xlsx ${i}${newName}.ods --outdir ${i};
    rm ${i}*.xls ${i}*.ods;

    echo $i
    xlsx2csv ${i}${newName}.xlsx -s 1 > ${i}index.csv;
#################################################################
  else
    libreoffice --headless --convert-to xlsx ${i}${newName}.xls --outdir ${i};
    rm ${i}${newName}.xls;
  
    echo $i
    xlsx2csv ${i}${newName}.xlsx -s 1 > ${i}index.csv;
  fi
 done;
}


sheetNumber() {
 for i in */; do
  echo $i
  cuar=$(cat ${i}index.csv | grep -n "2,,Cuartos y unidades" | cut -d',' -f1 | cut -d'.' -f2);
  est=$(cat ${i}index.csv | grep -n "1,,Establecimientos de h" | cut -d',' -f1 | cut -d'.' -f2);
  lle=$(cat ${i}index.csv | grep -n '6,,Llegada\|8,,Llegada' | cut -d',' -f1 | cut -d'.' -f2);
  prin=$(cat ${i}index.csv | grep -n "Principales i" | cut -d',' -f1 | cut -d'.' -f2);

  xlsx2csv ${i}*.xlsx -s $(expr $cuar + 1) > ${i}cuartos.csv
  xlsx2csv ${i}*.xlsx -s $(expr $est + 1) > ${i}establecimientos.csv
  xlsx2csv ${i}*.xlsx -s $(expr $lle + 1)> ${i}llegadas.csv
  xlsx2csv ${i}*.xlsx -s $(expr $prin + 1) > ${i}ocupación.csv
 done
}

establecimientos() {
 for i in */; do

  if [[ $i == JAL/ ]]; then
   num=$(cat ${i}establecimientos.csv | grep -n 'y municipio",' | cut -d ':' -f 1);
  elif [[ $i == CDMX/ ]]; then
   num=$(cat ${i}establecimientos.csv | grep -n 'Delegación' | cut -d ':' -f 1);
  else
   num=$(cat ${i}establecimientos.csv | grep -n "Municipio" | cut -d ':' -f 1);
  fi

  if [[ $i == VER/ || $i == PUE/ || $i == HGO/ ]]; then
    tail -n +$(expr 5 + ${num}) ${i}establecimientos.csv > ${i}establecimientos1.csv;
  else
    tail -n +$(expr 4 + ${num}) ${i}establecimientos.csv > ${i}establecimientos1.csv;
  fi


  if [[ ${i} == OAX/ ]]; then
    fuente=$(cat ${i}establecimientos1.csv | grep -n Fuente | cut -d ':' -f1);
    head -n +$(expr $fuente - 7) ${i}establecimientos1.csv > ${i}establecimientos2.csv
  elif [[ ${i} == VER/ ]]; then
    fuente=$(cat ${i}establecimientos1.csv | grep -n Fuente | cut -d ':' -f1);
    head -n +$(expr $fuente - 6) ${i}establecimientos1.csv > ${i}establecimientos2.csv
  elif [[ ${i} == YUC/ || ${i} == QROO/ || ${i} == NAY/ || ${i} == MEX/ || ${i} == DGO/ || ${i} == CAM/ || ${i} == AGS/ ]]; then
    fuente=$(cat ${i}establecimientos1.csv | grep -n Fuente | cut -d ':' -f1);
    head -n +$(expr $fuente - 5) ${i}establecimientos1.csv > ${i}establecimientos2.csv
  elif [[ ${i} == TAB/ || ${i} == PUE/ || ${i} == BCS/ ]]; then
    fuente=$(cat ${i}establecimientos1.csv | grep -n Fuente | cut -d ':' -f1);
    head -n +$(expr $fuente - 3) ${i}establecimientos1.csv > ${i}establecimientos2.csv
  else
    fuente=$(cat ${i}establecimientos1.csv | grep -n Fuente | cut -d ':' -f1);
    head -n +$(expr $fuente - 4) ${i}establecimientos1.csv > ${i}establecimientos2.csv
  fi

 done

 ## GTO - Corregir líneas discontinuas
 unoGTO=$(sed -n '13p' GTO/establecimientos2.csv);
 dosGTO=$(sed -n '14p' GTO/establecimientos2.csv);
 tresGTO=$(echo $unoGTO $dosGTO);
 sed -i "s/\\$unoGTO/\\$tresGTO/g" GTO/establecimientos2.csv;
 sed '14d' GTO/establecimientos2.csv > GTO/e2.csv;
 rm GTO/establecimientos2.csv; mv GTO/e2.csv GTO/establecimientos2.csv;
 
 ## HGO - Corregir líneas discontinuas
 unoHGO=$(sed -n '39p' HGO/establecimientos2.csv);
 dosHGO=$(sed -n '40p' HGO/establecimientos2.csv);
 tresHGO=$(echo $unoHGO $dosHGO);
 sed -i "s/\\$unoHGO/\\$tresHGO/g" HGO/establecimientos2.csv;
 sed '40d' HGO/establecimientos2.csv > HGO/e2.csv;
 rm HGO/establecimientos2.csv; mv HGO/e2.csv HGO/establecimientos2.csv;

 ## JAL - Corregir líneas discontinuas
 unoJAL=$(sed -n '8p' JAL/establecimientos2.csv);
 dosJAL=$(sed -n '9p' JAL/establecimientos2.csv);
 tresJAL=$(echo $unoJAL $dosJAL);
 sed -i "s/\\$unoJAL/\\$tresJAL/g" JAL/establecimientos2.csv;
 sed '9d' JAL/establecimientos2.csv > JAL/e2.csv;
 rm JAL/establecimientos2.csv; mv JAL/e2.csv JAL/establecimientos2.csv;

 ## VER - Corregir líneas discontinuas
 unoVER=$(sed -n '7p' VER/establecimientos2.csv);
 dosVER=$(sed -n '8p' VER/establecimientos2.csv);
 tresVER=$(echo $unoVER $dosVER);
 sed -i "s/\\$unoVER/\\$tresVER/g" VER/establecimientos2.csv;
 sed '8d' VER/establecimientos2.csv > VER/e2.csv;
 rm VER/establecimientos2.csv; mv VER/e2.csv VER/establecimientos2.csv;
 unset unoVER dosVer tresVer;

 unoVER=$(sed -n '55p' VER/establecimientos2.csv);
 dosVER=$(sed -n '56p' VER/establecimientos2.csv);
 tresVER=$(echo $unoVER $dosVER);
 sed -i "s/\\$unoVER/\\$tresVER/g" VER/establecimientos2.csv;
 sed '56d' VER/establecimientos2.csv > VER/e2.csv;
 rm VER/establecimientos2.csv; mv VER/e2.csv VER/establecimientos2.csv;


 for i in */; do

  if [[ $i == AGS/ ]]; then
   sed -i 's/ ,,,,/,/g' ${i}establecimientos2.csv;
  else
   sed -i 's/,,,,/,/g' ${i}establecimientos2.csv;
  fi

  cat ${i}establecimientos2.csv | cut -d',' -f1-2 > ${i}establecimientos3.csv
  sed -i "s/$/,\\${i::-1}/g" ${i}establecimientos3.csv;
  cat ${i}establecimientos3.csv >> E.csv

  rm ${i}establecimientos[1-3].csv;
  
 done;

 echo '_id,establecimientos,ent' > head;
 cat head E.csv > ESTABLECIMIENTOS.csv;
 rm E.csv head;

 sed -i 's/"//g' ESTABLECIMIENTOS.csv
}


cuartos() {

 for i in */; do

  if [[ $i == JAL/ ]]; then
   num=$(cat ${i}cuartos.csv | grep -n 'y municipio",' | cut -d ':' -f 1);
  elif [[ $i == CDMX/ ]]; then
   num=$(cat ${i}cuartos.csv | grep -n 'Delegación' | cut -d ':' -f 1);
  else
   num=$(cat ${i}cuartos.csv | grep -n "Municipio" | cut -d ':' -f 1);
  fi

  if [[ $i == VER/ || $i == PUE/ || $i == HGO/ ]]; then
    tail -n +$(expr 5 + ${num}) ${i}cuartos.csv > ${i}cuartos1.csv;
  else
    tail -n +$(expr 4 + ${num}) ${i}cuartos.csv > ${i}cuartos1.csv;
  fi



 if [[ ${i} == OAX/ ]]; then
   fuente=$(cat ${i}cuartos1.csv | grep -n Fuente | cut -d ':' -f1);
   head -n +$(expr $fuente - 7) ${i}cuartos1.csv > ${i}cuartos2.csv;
 elif [[ ${i} == VER/ ]]; then
   fuente=$(cat ${i}cuartos1.csv | grep -n Fuente | cut -d ':' -f1);
   head -n +$(expr $fuente - 6) ${i}cuartos1.csv > ${i}cuartos2.csv;
 elif [[ ${i} == AGS/ || ${i} == DGO/ || ${i} == NAY/ || ${i} == MEX/ || ${i} == YUC/ || ${i} == QROO/ ]]; then
   fuente=$(cat ${i}cuartos1.csv | grep -n Fuente | cut -d ':' -f1);
   head -n +$(expr $fuente - 5) ${i}cuartos1.csv > ${i}cuartos2.csv;
 elif [[ ${i} == BCS/ || ${i} == TAB/ || ${i} == PUE/ ]]; then
   fuente=$(cat ${i}cuartos1.csv | grep -n Fuente | cut -d ':' -f1);
   head -n +$(expr $fuente - 3) ${i}cuartos1.csv > ${i}cuartos2.csv;
 else
   fuente=$(cat ${i}cuartos1.csv | grep -n Fuente | cut -d ':' -f1);
   head -n +$(expr $fuente - 4) ${i}cuartos1.csv > ${i}cuartos2.csv;
 fi
   
 done

#####

 ## GTO - Corregir líneas discontinuas
 unoGTO=$(sed -n '13p' GTO/cuartos2.csv);
 dosGTO=$(sed -n '14p' GTO/cuartos2.csv);
 tresGTO=$(echo $unoGTO $dosGTO);
 sed -i "s/\\$unoGTO/\\$tresGTO/g" GTO/cuartos2.csv;
 sed '14d' GTO/cuartos2.csv > GTO/e2.csv;
 rm GTO/cuartos2.csv; mv GTO/e2.csv GTO/cuartos2.csv;
 
 ## HGO - Corregir líneas discontinuas
 unoHGO=$(sed -n '39p' HGO/cuartos2.csv);
 dosHGO=$(sed -n '40p' HGO/cuartos2.csv);
 tresHGO=$(echo $unoHGO $dosHGO);
 sed -i "s/\\$unoHGO/\\$tresHGO/g" HGO/cuartos2.csv;
 sed '40d' HGO/cuartos2.csv > HGO/e2.csv;
 rm HGO/cuartos2.csv; mv HGO/e2.csv HGO/cuartos2.csv;

 ## JAL - Corregir líneas discontinuas
 unoJAL=$(sed -n '8p' JAL/cuartos2.csv);
 dosJAL=$(sed -n '9p' JAL/cuartos2.csv);
 tresJAL=$(echo $unoJAL $dosJAL);
 sed -i "s/\\$unoJAL/\\$tresJAL/g" JAL/cuartos2.csv;
 sed '9d' JAL/cuartos2.csv > JAL/e2.csv;
 rm JAL/cuartos2.csv; mv JAL/e2.csv JAL/cuartos2.csv;

 ## VER - Corregir líneas discontinuas
 unoVER=$(sed -n '7p' VER/cuartos2.csv);
 dosVER=$(sed -n '8p' VER/cuartos2.csv);
 tresVER=$(echo $unoVER $dosVER);
 sed -i "s/\\$unoVER/\\$tresVER/g" VER/cuartos2.csv;
 sed '8d' VER/cuartos2.csv > VER/e2.csv;
 rm VER/cuartos2.csv; mv VER/e2.csv VER/cuartos2.csv;
 unset unoVER dosVer tresVer;

 unoVER=$(sed -n '56p' VER/cuartos2.csv);
 dosVER=$(sed -n '57p' VER/cuartos2.csv);
 tresVER=$(echo $unoVER $dosVER);
 sed -i "s/\\$unoVER/\\$tresVER/g" VER/cuartos2.csv;
 sed '57d' VER/cuartos2.csv > VER/e2.csv;
 rm VER/cuartos2.csv; mv VER/e2.csv VER/cuartos2.csv;

######
 for i in */; do

  if [[ $i == AGS/ ]]; then
   sed -i 's/ ,,,,/,/g' ${i}cuartos2.csv;
  else
   sed -i 's/,,,,/,/g' ${i}cuartos2.csv;
  fi

  cat ${i}cuartos2.csv | cut -d',' -f1-2 > ${i}cuartos3.csv
  sed -i "s/$/,\\${i::-1}/g" ${i}cuartos3.csv;
  cat ${i}cuartos3.csv >> C.csv 

  rm ${i}cuartos[1-3].csv;

 done;

 echo '_id,cuartos,ent' > head;
 cat head C.csv > CUARTOS.csv;
 rm C.csv head;

 sed -i 's/"//g' CUARTOS.csv

}

clearCuartos() {
 for i in */; do
  rm ${i}cuartos[1-4].csv
 done;
} 
