#!/bin/bash

case $OSTYPE in
    darwin*) SED=gsed ;;
    *) SED=sed ;;
esac

if [[ $1 == 'add' ]]; then
    $SED -i -e '$a\' dist/{cz,de,en,es,gr}/index.html
elif [[ $1 == 'remove' ]]; then
    truncate -s -1 dist/{cz,de,en,es,gr}/index.html
fi
