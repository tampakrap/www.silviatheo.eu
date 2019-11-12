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

[[ $OSTYPE =~ "darwin" ]] && alias cp=gcp

mkdir -p dist

for f in ${FILES[@]}; do
    [[ $f =~ "/" ]] && mkdir -p dist/${f%%/*}
    test -e dist/$f || cp -rp --preserve=links src/$f dist/$f
done