SUN/8.csv: entidades/mun
	bash -c "source ./script.sh; \
	for var in \$$(compgen -v); do export \$$var; done; \
	SUN; cotejar;"

entidades/mun: entidades/Zacatecas/conjunto_de_datos/sip
	bash -c "source ./script.sh; \
	for var in \$$(compgen -v); do export \$$var; done; \
	transformar"

entidades/Zacatecas/conjunto_de_datos/sip: entidades/Zacatecas.zip
	bash -c "source ./script.sh; \
	for var in \$$(compgen -v); do export \$$var; done; \
	ordenar"

entidades/Zacatecas.zip: entidades.json
	bash -c "source ./script.sh; \
	for var in \$$(compgen -v); do export \$$var; done; \
	cadaEntidad"

entidades.json:
	bash -c "source ./script.sh; \
	for var in \$$(compgen -v); do export \$$var; done; \
	entidades"
