#!/bin/bash

FILES=(
    CNAME
    css/style.min.css
    css/style.min.css.map
    el
    fonts
    images
    index.html
    js/script.min.js
    robots.txt
    sitemap.xml
)

case $OSTYPE in
    darwin*)
        CP=gcp
        SED=gsed
        ;;
    *)
        CP=cp
        SED=sed
        ;;
esac

mkdir -p dist

for f in ${FILES[@]}; do
    [[ $f =~ "/" ]] && mkdir -p dist/${f%%/*}
    test -e dist/$f || $CP -rp --preserve=links src/$f dist/$f
done

$SED -i -e 's#\.\./\(css\|fonts\|images\|js\)#/\1#g' dist/css/style.min.css dist/js/script.min.js dist/{cz,de,en,es,gr}/index.html
