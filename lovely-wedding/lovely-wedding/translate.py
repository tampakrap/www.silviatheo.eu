#!/usr/bin/env python3

from shutil import copyfile
import re
import yaml

LANGUAGES = ['en', 'gr'] #, 'es', 'cz', 'de']
GR_ACCENTS = {
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

with open('strings.yaml', 'r') as f:
    strings = yaml.load(f)

tmpl_vars = strings.keys()

for lang in LANGUAGES:
    lang_index_html = '{}.html'.format(lang)
    print('Creating {}'.format(lang_index_html))
    copyfile('index.tmpl', lang_index_html)
    for tmpl_var in tmpl_vars:
        orig_tmpl_var = tmpl_var
        translated = strings[tmpl_var][lang]
        orig_translated = translated
        print('Replacing "{}" with "{}"'.format(tmpl_var, translated))
        with open(lang_index_html, "r") as sources:
            lines = sources.readlines()
        with open(lang_index_html, "w") as sources:
            for line in lines:
                if '{}_cap'.format(tmpl_var) in line:
                    tmpl_var = '{}_cap'.format(tmpl_var)
                    if lang == 'gr':
                        for acc_letter, plain_letter in GR_ACCENTS.items():
                            translated = re.sub(r'{}'.format(acc_letter), plain_letter, translated)
                sources.write(re.sub(r'{}'.format(tmpl_var), translated, line))
                tmpl_var = orig_tmpl_var
                translated = orig_translated
    print("DONE {}".format(lang_index_html))
