denue/json:
	bash -c "source ./script.sh; \
	for var in \$$(compgen -v); do export \$$var; done; \
	denueOrdenar"

denue:
	bash -c "source ./script.sh; \
	for var in \$$(compgen -v); do export \$$var; done; \
	denueDescarga"
