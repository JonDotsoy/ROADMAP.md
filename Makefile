PRETTIER = bunx PRETTIER
BUN = bun

.PHONY: all
all: build

.PHONY: lint
lint:
	${PRETTIER} -c .

.PHONY: fmt
fmt:
	${PRETTIER} -w .

.PHONY: clean
clean: clean@lib clean@cli
	rm -rf node_modules

.PHONY: build
build: build@lib

node_modules:
	${BUN} install

.PHONY: clean@%
clean@%:
	make -C packages/$* clean

.PHONY: build@%
build@%: node_modules
	make -C packages/$* build

.PHONY: %@lib
%@lib: node_modules
	make -C packages/lib $*
