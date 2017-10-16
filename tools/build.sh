echo "[@polskycenter/bnv-web] build starting" \
&& mkdir -p public/ \
&& rm -rf public/css \
&& rm -rf public/js \
&& cp -R lib/assets/* public \
&& mkdir -p public/css \
&& mkdir -p public/js \
&& NODE_ENV="production" browserify lib/app/index.js -t [envify] | uglifyjs -c > public/js/index.js \
&& sass --update lib/scss:public/css --sourcemap=none --style=compressed --force  \
&& echo "[@bnv/web] build complete"
