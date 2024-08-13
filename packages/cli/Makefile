ROADMAP_TEMPLATE := `cat ../../template/ROADMAP.md | base64`

build:
	echo \
	'{}' \
	| \
	jq \
	--arg ROADMAP_TEMPLATE ${ROADMAP_TEMPLATE} \
	'.base64 = $$ROADMAP_TEMPLATE | .base64 | @base64d | @json | "export const roadmapTemplate = " + . + ";"' \
	-r > src/roadmap_template.ts