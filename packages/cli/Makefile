ROADMAP_TEMPLATE := `cat ../../template/ROADMAP.md | base64`

.PHONY: all
all: build

src/roadmap_template.ts:
	echo \
	'{}' \
	| \
	jq \
	--arg ROADMAP_TEMPLATE ${ROADMAP_TEMPLATE} \
	'$$ROADMAP_TEMPLATE | @base64d | @json | "export const roadmapTemplate = " + . + ";"' \
	-r > src/roadmap_template.ts

src/common/dictionary.ts:
	cat src/common/dictionary.yaml | yq '. | @json | "export const dictionary: Record<string, Record<string, string[]>> = " + .' > src/common/dictionary.ts
	bunx prettier -w src/common/dictionary.ts

.PHONY: install
install:
	bun install

.PHONY: build
build: dist/roadmap

dist/roadmap: src/roadmap_template.ts
	bun build --compile src/cli.ts --outfile dist/roadmap

pkg.ts:
	cat package.json | jq -r '{ version: .version } | @json | "export const pkg = " + .' > pkg.ts
	bunx prettier -w pkg.ts

.PHONY: clean
clean:
	rm -rf dist
