ROADMAP_TEMPLATE := `cat ../../template/ROADMAP.md | base64`

build:
	echo \
	'{}' \
	| \
	jq \
	--arg ROADMAP_TEMPLATE ${ROADMAP_TEMPLATE} \
	'$$ROADMAP_TEMPLATE | @base64d | @json | "export const roadmapTemplate = " + . + ";"' \
	-r > src/roadmap_template.ts

preparepkg:
	cat package.json | jq -r '{ version: .version } | @json | "export const pkg = " + .' > pkg.ts
	bunx prettier -w pkg.ts