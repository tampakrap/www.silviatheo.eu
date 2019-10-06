#!/usr/bin/env python3

import shutil
import re
import yaml

LANGUAGES = ['en', 'gr', 'es', 'cz', 'de']
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
weregettingmarried = strings['yaml_weregettingmarried']
del strings['yaml_weregettingmarried']

for lang in LANGUAGES:
    lang_index_html = '{}.html'.format(lang)
    print('Creating {}'.format(lang_index_html))
    shutil.copyfile('index.tmpl', lang_index_html)

    flags_html = '{: <24s}<a href="javascript:void(0);"><img src="images/flags/{}.png"/></a>\n{: <24s}<ul class="sub-menu">\n'.format('', lang, '')
    FLAGS = LANGUAGES.copy()
    FLAGS.remove(lang)
    for flag in FLAGS:
        flags_html += '{: <28s}<li><a href="{}.html"><img src="images/flags/{}.png"></a></li>\n'.format('', flag, flag)
    with open(lang_index_html, 'r') as f:
        lines = f.readlines()
    with open(lang_index_html, 'w') as f:
        for line in lines:
            f.write(re.sub(r'set_flags', flags_html[:-1], line))

    weregettingmarried_html = ''
    time = 1.00
    for letter in weregettingmarried[lang]:
        time += 0.05
        if letter == ' ':
            weregettingmarried_html += '{: <24s}<span>&nbsp;</span>\n'.format('')
        else:
            weregettingmarried_html += '{: <24s}<span class=" wow fadeInUp" data-wow-delay="{:.2f}s">{}</span>\n'.format('', time, letter)
    with open(lang_index_html, 'r') as f:
        lines = f.readlines()
    with open(lang_index_html, 'w') as f:
        for line in lines:
            f.write(re.sub(r'yaml_weregettingmarried', weregettingmarried_html, line))

    for tmpl_var in tmpl_vars:
        orig_tmpl_var = tmpl_var
        translated = strings[tmpl_var][lang]
        orig_translated = translated
        print('Replacing "{}" with "{}"'.format(tmpl_var, translated))
        with open(lang_index_html, 'r') as f:
            lines = f.readlines()
        with open(lang_index_html, 'w') as f:
            for line in lines:
                if '{}_cap'.format(tmpl_var) in line:
                    tmpl_var = '{}_cap'.format(tmpl_var)
                    if lang == 'gr':
                        for acc_letter, plain_letter in GR_ACCENTS.items():
                            translated = re.sub(r'{}'.format(acc_letter), plain_letter, translated)
                f.write(re.sub(r'{}'.format(tmpl_var), translated, line))
                tmpl_var = orig_tmpl_var
                translated = orig_translated

    print("DONE {}".format(lang_index_html))

#shutil.copyfile('en.html', 'index.html')
