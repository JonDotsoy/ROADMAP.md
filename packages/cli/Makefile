ROADMAP_TEMPLATE := `cat ../../template/ROADMAP.md | base64`

all: build

build-roadmap_template:
	echo \
	'{}' \
	| \
	jq \
	--arg ROADMAP_TEMPLATE ${ROADMAP_TEMPLATE} \
	'$$ROADMAP_TEMPLATE | @base64d | @json | "export const roadmapTemplate = " + . + ";"' \
	-r > src/roadmap_template.ts

install:
	bun install

build: build-roadmap_template
	bun build --compile src/cli.ts --outfile dist/roadmap

preparepkg:
	cat package.json | jq -r '{ version: .version } | @json | "export const pkg = " + .' > pkg.ts
	bunx prettier -w pkg.ts