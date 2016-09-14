denue/json:denue
	bash -c "source ./script.sh; \
	for var in \$$(compgen -v); do export \$$var; done; \
	denueOrdenarCSV"

denue:
	bash -c "source ./script.sh; \
	for var in \$$(compgen -v); do export \$$var; done; \
	denueDescarga csv"
