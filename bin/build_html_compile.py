#!/usr/bin/env python3

import jinja2
import os
import re
import yaml

with open('strings.yaml', 'r') as f:
    strings = yaml.load(f)

langs = strings['langs']
special_langs = strings['special_langs']

tmpl_path = jinja2.FileSystemLoader('./src')
jinja_env = jinja2.Environment(loader=tmpl_path)

for page in ['index', 'future']:
    tmpl = jinja_env.get_template(f'{page}.html.jinja')
    for lang in langs:
        if not os.path.exists(f'src/{lang}'):
            os.mkdir(f'src/{lang}')

        lang_page_html = f'src/{lang}/{page}.html'
        iso_lang = lang

        if lang == 'gr':
            iso_lang = 'el'
            if not os.path.islink(f'src/{iso_lang}'):
                os.symlink(lang, f'src/{iso_lang}')

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

if not os.path.islink('src/index.html'):
    os.symlink('en/index.html', 'src/index.html')
