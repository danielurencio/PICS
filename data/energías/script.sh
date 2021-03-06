process() {
 libreoffice --headless --convert-to csv $1;
 iconv -f ISO-8859-15 -t UTF-8 ${1%.*}.csv | sed '2d' > data.csv;
 rm ${1%.*}.csv;

 sed -i 's/Estado de México/México/g' data.csv;
 sed -i 's/Naucalpan/Naucalpan de Juárez/g' data.csv;
 sed -i 's/Juchitán de Zaragoza/Heroica Ciudad de Juchitán de Zaragoza/g' data.csv;
 sed -i 's/Atotonilco El Alto/Atotonilco el Alto/g' data.csv;
 sed -i 's/San Juan De Los Lagos/San Juan de los Lagos/g' data.csv;
 sed -i 's/Lagos De Moreno/Lagos de Moreno/g' data.csv; 
 sed -i 's/Estado de México/México/g' data.csv;
 sed -i 's/San Miguel El Alto/San Miguel el Alto/g' data.csv;
 sed -i 's/Tepatitlan De Morelos/Tepatitlán de Morelos/g' data.csv;
 sed -i 's/Union De San Antonio/Unión de San Antonio/g'
 sed -i 's/Bola±os/Bolaños/g' data.csv;
 sed -i 's/Acatlán De Juaréz/Acatlán de Juárez/g' data.csv
 sed -i 's/Teuchitlàn/Teuchitlán/g' data.csv;
 sed -i 's/Ojuelos/donaldTrumpMiRey/g' data.csv;
 sed -i 's/donaldTrumpMiRey/Ojuelos de Jalisco/g' data.csv;
 sed -i 's/San Julian/San Julián/g' data.csv;
 sed -i 's/Tlajomulco de Zuñiga/Tlajomulco de Zúñiga/g' data.csv;
 sed -i 's/Unión De Tula/Unión de Tula/g' data.csv;
 sed -i 's/Unión De San Antonio/Unión de San Antonio/g' data.csv;
 sed -i 's/Ojuelos de Jalisco de Jalisco/Ojuelos de Jalisco/g' data.csv;
 sed -i 's/Tacotan/Tacotán/g' data.csv
 sed -i 's/Apaseo El Alto/Apaseo el Alto/g' data.csv;
 sed -i 's/Apaseo El Grande/Apaseo el Grande/g' data.csv;
 sed -i 's/San Luis De La Paz/San Luis de la Paz/g' data.csv;
 sed -i 's/San Miguel Allende/San Miguel de Allende/g' data.csv;
 sed -i 's/San Luis De La Paz/San Luis de la Paz/g' data.csv;
 sed -i 's/Dolores Hidalgo/Dolores Hidalgo Cuna de la Independencia Nacional/g' data.csv;
 sed -i 's/Pabellón De Arteaga/Pabellón de Arteaga/g' data.csv;
 sed -i 's/Rincón De Romos/Rincón de Romos/g' data.csv;
 sed -i 's/San Francisco De Los Romo/San Francisco de los Romo/g' data.csv;
 sed -i 's/Veracruz/Veracruz de Ignacio de la Llave/g' data.csv;
 sed -i 's/Temapache/Álamo Temapache/g' data.csv;
 sed -i 's/Ozuluama De Mascareñas/Ozuluama de Mascareñas/g' data.csv;
 sed -i 's/Úrsulo Galván/Ursulo Galván/g' data.csv;
 sed -i 's/Ixtapan De La Sal/Ixtapan de la Sal/g' data.csv;
 sed -i 's/Coahuila/Coahuila de Zaragoza/g' data.csv;
 sed -i 's/Fco. I. Madero/Francisco I. Madero/g' data.csv;
 sed -i 's/Fco.. I. Madero/Francisco I. Madero/g' data.csv;
 sed -i 's/Ciudad Juárez/Juárez/g' data.csv;
 sed -i 's/Cd. Juárez/Juárez/g' data.csv;

 sed -i 's/Temósachicc/Temósachic/g' data.csv;
 #sed -i 's/Temósachi/Temósachic/g' data.csv;

 sed -i 's/Guadalupe Y Calvo/Guadalupe y Calvo/g' data.csv;
 sed -i 's/San Francisco De Borja/San Francisco de Borja/g' data.csv;
 sed -i 's/Parral/Hidalgo del Parral/g' data.csv;
 sed -i 's/Santa Barbara/Santa Bárbara/g' data.csv;
 sed -i 's/Ayutla De Los Libres/Ayutla de los Libres/g' data.csv;
 sed -i 's/Chilpancingo/Chilpancingo de los Bravo/g' data.csv;
 sed -i 's/Tula De Allende/Tula de Allende/g' data.csv;
sed -i 's/Santiago Tulantepec De Lugo Guerrero/Santiago Tulantepec de Lugo Guerrero/g' data.csv
 sed -i 's/Nopala De Villagrán/Nopala de Villagrán/g' data.csv;
 sed -i 's/Tezontepec De Aldama/Tezontepec de Aldama/g' data.csv;
 sed -i 's/Agua Blanca de iturbide/Agua Blanca de Iturbide/g' data.csv;
 sed -i 's/Tepeji del Río/Tepeji del Río de Ocampo/g' data.csv;
 sed -i 's/Michoacán/Michoacán de Ocampo/g' data.csv;
 sed -i 's/Huanlqueo/Huaniqueo/g' data.csv;
 sed -i 's/Puruandiro/Puruándiro/g' data.csv;
 sed -i 's/Zacualpan De Amilpas/Zacualpan de Amilpas/g' data.csv;
 sed -i 's/Puente De Ixtla/Puente de Ixtla/g' data.csv;
 sed -i 's/Amatlán de Ca±as/Amatlán de Cañas/g' data.csv;
 sed -i 's/Ixtlan del Río/Ixtlán del Río/g' data.csv;
 sed -i 's/General Bravo/Gral. Bravo/g' data.csv;
 sed -i 's/Ciénega De Flores/Ciénega de Flores/g' data.csv;
 sed -i 's/Gal. Zuazua/Gral. Zuazua/g' data.csv;
 sed -i 's/Tuxtepec/San Juan Bautista Tuxtepec/g' data.csv;
 sed -i 's/Ixtaltepec/Asunción Ixtaltepec/g' data.csv;
 sed -i 's/Santo  Domingo Ingenio/Santo Domingo Ingenio/g' data.csv;
 sed -i 's/Matías Romero Avenda±o/Matías Romero Avendaño/g' data.csv;
 sed -i 's/Usila/San Felipe Usila/g' data.csv;
 sed -i 's/Ixtaltepec/Asunción Ixtaltepec/g' data.csv;
 sed -i 's/lxtepec/Ixtepec/g' data.csv;
 sed -i 's/Cuyamecalco/Cuyamecalco Villa de Zaragoza/g' data.csv;
 sed -i 's/Izucar De Matamoros/Izúcar de Matamoros/g' data.csv;
 sed -i 's/Tlapanala/Tlapanalá/g' data.csv;
 sed -i 's/Huehuetlán El Grande/Huehuetlán el Grande/g' data.csv; 
 sed -i 's/Tecali De Herrera/Tecali de Herrera/g' data.csv;
 sed -i 's/Los Reyes De Juárez/Los Reyes de Juárez/g' data.csv;
 sed -i 's/Chalchicomula De Sesma/Chalchicomula de Sesma/g' data.csv;
 sed -i 's/San Salvador El Seco/San Salvador el Seco/g' data.csv;
 sed -i 's/Palmar del Bravo/Palmar de Bravo/g' data.csv;
 sed -i 's/San Juan Del Río/San Juan del Río/g' data.csv;
 sed -i 's/Amealco De Bonfil/Amealco de Bonfil/g' data.csv;
 sed -i 's/Villa De Reyes/Villa de Reyes/g' data.csv;
 sed -i 's/Santa María Del Río/Santa María del Río/g' data.csv;
 sed -i 's/Villa de Ariaga/Villa de Arriaga/g' data.csv;
 sed -i 's/Los Mochis/Ahome/g' data.csv;
 sed -i 's/Mochis/Ahome/g' data.csv;
 sed -i 's/Mazatlan/Mazatlán/g' data.csv;
 sed -i 's/Nacozari De García/Nacozari de García/g' data.csv;
 sed -i 's/Ónavas/Onavas/g' data.csv;
 sed -i 's/Ciudad Obregón/Cajeme/g' data.csv;
 sed -i 's/Navajoa/Navojoa/g' data.csv;
 sed -i 's/San Luis Rio Colorado/San Luis Río Colorado/g' data.csv;
 sed -i 's/Llera De Canales/Llera/g' data.csv;
 sed -i 's/Llera de Canales/Llera/g' data.csv;
 sed -i 's/Mante/El Mante/g' data.csv;
 sed -i 's/Ixtacuixtla De Mariano Matamoros/Ixtacuixtla de Mariano Matamoros/g' data.csv;
 sed -i 's/Cacalchen/Cacalchén/g' data.csv;
 sed -i 's/Hunucma/Hunucmá/g' data.csv;
 sed -i 's/Tekanto/Tekantó/g' data.csv;
 sed -i 's/Tepakan/Tepakán/g' data.csv;
 sed -i 's/Tixpehual/Tixpéhual/g' data.csv;
 sed -i 's/Dzan/Dzán/g' data.csv;
 sed -i 's/Uman/Umán/g' data.csv;
 sed -i 's/Merida/Mérida/g' data.csv;
 sed -i 's/Teãºl De Gonzã¡Lez Ortega/Teúl de González Ortega/g' data.csv;
 sed -i 's/Moyahua De Estrada/Moyahua de Estrada/g' data.csv;
 sed -i 's/Tlaltenango De Sánchez Román/Tlaltenango de Sánchez Román/g' data.csv;
 sed -i 's/Villa De Cos/Villa de Cos/g' data.csv;
 sed -i 's/Calera de Víctor Rosales/Calera/g' data.csv;
 sed -i 's/Playas De Rosarito/Playas de Rosarito/g' data.csv; 
 sed -i 's/Hopelchen/Hopelchén/g' data.csv;
 sed -i 's/Champoton/Champotón/g' data.csv; 
 sed -i 's/Parras de la Fuente/Parras/g' data.csv; 
 sed -i 's/San Juan Sabinas/San Juan de Sabinas/g' data.csv;
 sed -i 's/Tecoman/Tecomán/g' data.csv;
 sed -i 's/Villa De Álvarez/Villa de Álvarez/g' data.csv;
 sed -i 's/Copainalã¡/Copainalá/g' data.csv;
 sed -i 's/Francisco Léon/Francisco León/g' data.csv;
 sed -i 's/Ascención/Ascensión/g' data.csv;
 sed -i 's/Gómez Palacios/Gómez Palacio/g' data.csv;
 sed -i 's/La Soledad/Irapuato/g' data.csv;
 sed -i 's/Palos Altos/Arcelia/g' data.csv;
 sed -i 's/Temósachi/Temósachic/g' data.csv;
 sed -i 's/Chilpancingo de los Bravo de los Bravo/Chilpancingo de los Bravo/g' data.csv;
 sed -i 's/José Azueta/Zihuatanejo de Azueta/g' data.csv;
 sed -i 's/Atotonilco El Grande/Atotonilco el Grande/g' data.csv;
 sed -i 's/Tacotán/Unión de Tula/g' data.csv;
 sed -i 's/Tultitlan/Tultitlán/g' data.csv; 
 sed -i 's/Calpulalpan/Jilotepec/g' data.csv;
 sed -i 's/Zacualpan de Amilpas/Zacualpan/g' data.csv;
 sed -i 's/Ixtlan Del Río/Ixtlán del Río/g' data.csv;
 sed -i 's/Asunción Asunción Ixtaltepec/Asunción Ixtaltepec/g' data.csv;
 sed -i 's/San Felipe San Felipe Usila/San Felipe Usila/g' data.csv;
# sed -i 's/Felipe Carrillo Puerto/Querétaro/g' data.csv;
 sed -i 's/Villa de Pozos/San Luis Potosí/g' data.csv;
 sed -i 's/Bocas/San Luis Potosí/g' data.csv;
 sed -i 's/Costa Rica/Culiacán/g' data.csv;
 sed -i 's/Guamúchil/Salvador Alvarado/g' data.csv;
 sed -i 's/Topolobampo/Ahome/g' data.csv; 
 sed -i 's/Macultepec/Centro/g' data.csv; 
 sed -i 's/Villa de Casas/Casas/g' data.csv;
 sed -i 's/Tatíla/Tatatila/g' data.csv;
 sed -i 's/Tuzamapan Coatepec/Coatepec/g' data.csv;
 sed -i 's/Industrial San Luis/San Luis Potosí/g' data.csv;
 sed -i 's/Cd. San Luis Potosí/San Luis Potosí/g' data.csv;
}

import() {
 mongoimport -d PICS -c energias --type=csv --headerline data.csv;
}
