#!/bin/bash

FILES=(
    CNAME
    fonts
    images
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

for f in ${FILES[@]}; do
    test -e dist/$f || $CP -rp --preserve=links src/$f dist/$f
done

$SED -i -e 's#\.\./\(css\|fonts\|images\|js\)#/\1#g' dist/css/style.min.css dist/js/script.min.js dist/{cz,de,en,es,gr}/index.html
$SED -i -e 's#\.\./\.\./src/\(css\|js\)#/\1#g' dist/css/style.min.css.map dist/js/script.min.js.map

rm dist/{cz,de,en,es,gr}/future.html
