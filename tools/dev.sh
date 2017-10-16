echo "[@polskycenter/bnv-web] development starting..." \
&& mkdir -p public/ \
&& cp -R lib/assets/* public \
&& mkdir -p public/css \
&& mkdir -p public/js \
&& nodemon index.js --ignore public/ --ignore node_modules/ \
& watchify lib/app/index.js -o public/js/index.js -v -d \
& sass --watch lib/scss:public/css
