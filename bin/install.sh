#!/bin/bash

FILES=(
    css
    el
    fonts
    images
    js/script.min.js
    index.html
)

case $OSTYPE in
    darwin*) CP=/usr/local/bin/gcp ;;
    *) CP=/usr/bin/cp ;;
esac

mkdir -p dist

for f in ${FILES[@]}; do
    [[ $f =~ "/" ]] && mkdir -p dist/${f%%/*}
    test -e dist/$f || $CP -rp --preserve=links src/$f dist/$f
done
