#!/usr/bin/env python3

import jinja2
import json
import os
import yaml

with open('strings.yaml', 'r') as f:
    strings = yaml.load(f, Loader=yaml.BaseLoader)

with open('package.json', 'r') as f:
    package = json.load(f)
    config = package['silviatheo']

langs = config['langs']
special_langs = config['special_langs']

tmpl_path = jinja2.FileSystemLoader('./src')
jinja_env = jinja2.Environment(loader=tmpl_path)

if not os.path.exists('dist/'):
    os.mkdir('dist/')

for page in ['index', 'future']:
    tmpl = jinja_env.get_template(f'{page}.html.jinja')
    for lang in langs:
        if not os.path.exists(f'dist/{lang}'):
            os.mkdir(f'dist/{lang}')

        lang_page_html = f'dist/{lang}/{page}.html'
        iso_lang = lang

        if lang in ['cz', 'gr']:
            if lang == 'cz':
                iso_lang = 'cs'
            elif lang == 'gr':
                iso_lang = 'el'
            if not os.path.islink(f'dist/{iso_lang}'):
                os.symlink(lang, f'dist/{iso_lang}')

        lang_strings = {}
        for k, v in strings.items():
            try:
                lang_strings[k] = v[lang]
            except TypeError:
                pass

        other_langs = langs.copy()
        other_langs.remove(lang)
        lang_strings.update({'other_langs': other_langs, 'special_langs': special_langs, 'lang': lang, 'iso_lang': iso_lang})
        output = tmpl.render(lang_strings)
        with open(lang_page_html, 'w') as f:
            f.write(output)

if not os.path.islink('dist/index.html'):
    os.symlink('en/index.html', 'dist/index.html')
