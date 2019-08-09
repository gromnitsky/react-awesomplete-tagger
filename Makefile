dist := dist
out := _out

demo := _out/demo
cache := $(out)/.cache

all: $(dist)/react-awesomplete-tagger.min.js

$(dist)/react-awesomplete-tagger.js: umd.name=AwesompleteTagger

$(cache)/%.js: %.jsx; $(jsx-to-js)

$(dist)/%.js: $(cache)/%.js
	$(mkdir)
	rollup $< --format umd --name $(umd.name) -o $@ -m -c

$(dist)/%.min.js: $(dist)/%.js
	terser $< -o $@ -cm --source-map content=$<.map,url=$(notdir $@).map



demo.deps.src := $(shell adieu -pe '$$("link,script").map( (_, e) => $$(e).attr("href") || $$(e).attr("src")).get().join`\n`' demo.html)
demo.deps.dest := $(addprefix $(demo)/, $(demo.deps.src))

$(demo)/%: %; $(copy)
$(demo)/%.js: %.jsx; $(jsx-to-js)

all: $(demo)/demo.html $(demo)/demo.json $(demo)/demo.jsx $(demo.deps.dest)



mkdir = @mkdir -p $(dir $@)
define copy =
$(mkdir)
cp $< $@
@[ ! -r $<.map ] || cp $<.map $@.map
endef
define jsx-to-js
$(mkdir)
node_modules/.bin/babel -s inline $< -o $@
endef

.DELETE_ON_ERROR:
