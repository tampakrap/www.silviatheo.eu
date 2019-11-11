#!/bin/bash

FILES=(
    css
    el
    fonts
    images
    js/script.min.js
    index.html
)

mkdir -p dist

for f in ${FILES[@]}; do
    [[ $f =~ "/" ]] && mkdir -p dist/${f%%/*}
    gcp -rp --preserve=links src/$f dist/$f
done
