denue/32.csv:denue/32.zip
	bash -c "source ./denue.sh; \
	for var in \$$(compgen -v); do export \$$var; done; \
	denueOrdenarCSV"

denue/32.zip:
	bash -c "source ./denue.sh; \
	for var in \$$(compgen -v); do export \$$var; done; \
	denueDescarga csv"
