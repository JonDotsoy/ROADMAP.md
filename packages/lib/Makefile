TSC = bunx tsc
NPM = npm

.PHONY: all
all: build

.PHONY: clean
clean:
	rm -rf libs

.PHONY: build
build: libs/esm

libs/esm:
	${TSC} --project tsconfig.esm.json --outDir libs/esm

.PHONY: pack
pack:
	${NPM} pack

.PHONY: publish
publish:
	${NPM} publish
