#!/bin/bash

FILES=(
    css/style.min.css
    css/style.min.css.map
    el
    fonts
    images
    js/script.min.js
    index.html
)

case $OSTYPE in
    darwin*) CP=gcp ;;
    *) CP=cp ;;
esac

mkdir -p dist

for f in ${FILES[@]}; do
    [[ $f =~ "/" ]] && mkdir -p dist/${f%%/*}
    test -e dist/$f || $CP -rp --preserve=links src/$f dist/$f
done

$CP CNAME dist/
