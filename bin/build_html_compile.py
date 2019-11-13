#!/usr/bin/env python3

import os
import shutil
import re
import yaml

LANGUAGES = ['en', 'gr', 'es', 'cz', 'de']
ACCENTS = {
    'gr': {
        'Ά': 'Α',
        'ά': 'α',
        'Έ': 'Ε',
        'έ': 'ε',
        'Ή': 'Η',
        'ή': 'η',
        'Ί': 'Ι',
        'ί': 'ι',
        'ϊ': 'ι',
        'ΐ': 'ι',
        'Ό': 'ο',
        'ό': 'ο',
        'Ύ': 'υ',
        'ύ': 'υ',
        'ϋ': 'υ',
        'ΰ': 'υ',
        'Ώ': 'ω',
        'ώ': 'ω',
    }
}

FONT_CZ = 'Promocyja'

with open('strings.yaml', 'r') as f:
    strings = yaml.load(f)

tmpl_vars = strings.keys()
weregettingmarried = strings['yaml_weregettingmarried']
del strings['yaml_weregettingmarried']

for page in ['index', 'future']:
    for lang in LANGUAGES:
        if not os.path.exists(f'src/{lang}'):
            os.mkdir(f'src/{lang}')
        lang_page_html = f'src/{lang}/{page}.html'
        #print(f'Creating {lang_page_html}')
        shutil.copyfile(f'src/{page}.tmpl', lang_page_html)
        tmp_lang = lang
        if lang == 'gr':
            tmp_lang = 'el'
            if not os.path.islink(f'src/{tmp_lang}'):
                os.symlink(lang, f'src/{tmp_lang}')
        with open(lang_page_html, 'r') as f:
            lines = f.readlines()
        with open(lang_page_html, 'w') as f:
            for line in lines:
                f.write(re.sub(r'set_lang', tmp_lang, line))

        flags_html = f'{"": <16s}<a href="javascript:void(0);"><img width=16 height=11 src="../images/flags/{lang}.png"/></a>\n{"": <16s}<ul class="sub-menu">\n'
        FLAGS = LANGUAGES.copy()
        FLAGS.remove(lang)
        for flag in FLAGS:
            flags_html += f'{"": <18s}<li><a href="/{flag}/"><img width=16 height=11 src="../images/flags/{flag}.png"></a></li>\n'
        with open(lang_page_html, 'r') as f:
            lines = f.readlines()
        with open(lang_page_html, 'w') as f:
            for line in lines:
                f.write(re.sub(r'set_flags', flags_html[:-1], line))

        weregettingmarried_html = ''
        time = 1.00
        for letter in weregettingmarried[lang]:
            time += 0.05
            if letter == ' ':
                weregettingmarried_html += f'{"": <12s}<span>&nbsp;</span>\n'
            else:
                weregettingmarried_html += f'{"": <12s}<span class=" wow fadeInUp" data-wow-delay="{time:.2f}s">{letter}</span>\n'
        weregettingmarried_html = weregettingmarried_html[:-1]
        with open(lang_page_html, 'r') as f:
            lines = f.readlines()
        with open(lang_page_html, 'w') as f:
            for line in lines:
                f.write(re.sub(r'yaml_weregettingmarried', weregettingmarried_html, line))

        for tmpl_var in tmpl_vars:
            orig_tmpl_var = tmpl_var
            translated = strings[tmpl_var][lang]
            orig_translated = translated
            #print(f'Replacing "{tmpl_var}" with "{translated}"')
            with open(lang_page_html, 'r') as f:
                lines = f.readlines()
            with open(lang_page_html, 'w') as f:
                for line in lines:
                    if f'{tmpl_var}_cap' in line:
                        tmpl_var = f'{tmpl_var}_cap'
                        if lang in ['gr', 'es']:
                            for acc_letter, plain_letter in ACCENTS['gr'].items():
                                translated = re.sub(fr'{acc_letter}', plain_letter, translated)
                    elif f'{tmpl_var}_cz' in line:
                        tmpl_var = f'{tmpl_var}_cz'
                        if lang == 'cz':
                            translated = f'<span style=\'font-family: "{FONT_CZ}"; font-size: 30px;\'>{translated}</span>'
                    f.write(re.sub(fr'{tmpl_var}', translated, line))
                    tmpl_var = orig_tmpl_var
                    translated = orig_translated

        #print(f'DONE {lang_page_html}')

if not os.path.islink('src/index.html'):
    os.symlink('en/index.html', 'src/index.html')
