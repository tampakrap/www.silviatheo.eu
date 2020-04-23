#!/usr/bin/env python3

from datetime import datetime, timedelta
from random import randrange
import icalendar
import json
import pytz
import urllib.parse
import yaml


def gen_id():
    time_now = datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
    random_number = randrange(100000000, 999999999)
    return f'{time_now}-{random_number}@silviatheo.eu'


with open('strings.yaml', 'r') as f:
    strings = yaml.load(f, Loader=yaml.BaseLoader)

with open('package.json', 'r') as f:
    package = json.load(f)
    config = package['silviatheo']

LANGS = config['langs']
TZ_ES = pytz.timezone('Europe/Madrid')
WEBSITE = 'https://www.silviatheo.eu/'
PREPARTY_URL = WEBSITE + '#pre-party'
PREPARTY_ADDR = 'Saporem, Calle de Ventura de la Vega, 5, 28014 Madrid, Spain'
PREPARTY_MAP = 'https://www.google.com/maps/place/Saporem/@40.4158492,-3.7010353,17z/data=!3m1!4b1!4m5!3m4!1s0xd42288175bcdb51:0x9bcb201a9344e5b!8m2!3d40.4158492!4d-3.6988466'
TRANSPORTATION_URL = WEBSITE + '#transportation'
TRANSPORTATION_ADDR = 'El Brillante, Plaza del Emperador Carlos V, 8, 28012 Madrid, Spain'
TRANSPORTATION_MAP = 'https://www.google.com/maps/place/El+Brillante/@40.4084654,-3.6937362,19z/data=!3m1!4b1!4m5!3m4!1s0xd422628ae900001:0x9f47c22eb73ab37a!8m2!3d40.4084654!4d-3.693189'
WEDDING_URL = WEBSITE
WEDDING_ADDR = 'La Quinta de Illescas - Finca para bodas, A-42 KM.30, 45200 Illescas, Toledo, Spain'
WEDDING_MAP = 'https://www.google.com/maps/place/La+Quinta+de+Illescas/@40.164897,-3.8161193,18.58z/data=!4m5!3m4!1s0xd41f4029c1e3685:0xe528694c1b18788e!8m2!3d40.1649416!4d-3.8158414'

tz_d = icalendar.TimezoneDaylight()
tz_d.add('tzname', 'CEST')
tz_d.add('tzoffsetfrom', timedelta(hours=1))
tz_d.add('tzoffsetto', timedelta(hours=2))
tz_d.add('dtstart', datetime(1970,3,29,2,0,0))
tz_d.add('rrule', {'freq': 'yearly', 'bymonth': 3, 'byday': '-1su'})

tz_s = icalendar.TimezoneStandard()
tz_s.add('tzname', 'CET')
tz_s.add('tzoffsetfrom', timedelta(hours=2))
tz_s.add('tzoffsetto', timedelta(hours=1))
tz_s.add('dtstart', datetime(1970, 10, 25, 3, 0, 0))
tz_s.add('rrule', {'freq': 'yearly', 'bymonth': 10, 'byday': '-1su'})

tz = icalendar.Timezone()
tz.add('tzid', TZ_ES.zone)
tz.add('tzurl', f'http://tzurl.org/zoneinfo-outlook/{TZ_ES.zone}')
tz.add('x-lic-location', TZ_ES.zone)
tz.add_component(tz_d)
tz.add_component(tz_s)

for lang in LANGS:
    preparty = icalendar.Event()
    preparty.add('summary', strings['calendar_preparty'][lang])
    preparty.add('dtstart', datetime(2021,7,9,20,0,0,tzinfo=TZ_ES))
    preparty.add('dtend', datetime(2021,7,10,2,0,0,tzinfo=TZ_ES))
    preparty.add('url', urllib.parse.quote(PREPARTY_URL, safe=''))
    preparty.add('location', PREPARTY_ADDR)
    preparty.add('description', f'{PREPARTY_URL}\n\n{PREPARTY_ADDR}\n\n{PREPARTY_MAP}')
    preparty.add('uid', gen_id())

    transportation = icalendar.Event()
    transportation.add('summary', strings['calendar_transportation'][lang])
    transportation.add('dtstart', datetime(2021,7,10,17,30,0,tzinfo=TZ_ES))
    transportation.add('dtend', datetime(2021,7,10,18,15,0,tzinfo=TZ_ES))
    transportation.add('url', urllib.parse.quote(TRANSPORTATION_URL, safe=''))
    transportation.add('location', TRANSPORTATION_ADDR)
    transportation.add('description', f'{TRANSPORTATION_URL}\n\n{TRANSPORTATION_ADDR}\n\n{TRANSPORTATION_MAP}')
    transportation.add('uid', gen_id())

    wedding = icalendar.Event()
    wedding.add('summary', strings['calendar_wedding'][lang])
    wedding.add('dtstart', datetime(2021,7,10,19,0,0,tzinfo=TZ_ES))
    wedding.add('dtend', datetime(2021,7,11,5,0,0,tzinfo=TZ_ES))
    wedding.add('url', urllib.parse.quote(WEDDING_URL, safe=''))
    wedding.add('location', WEDDING_ADDR)
    wedding.add('description', f'{WEDDING_URL}\n\n{WEDDING_ADDR}\n\n{WEDDING_MAP}')
    wedding.add('uid', gen_id())

    cal = icalendar.Calendar()
    cal.add('version', '2.0')
    cal.add('prodid', '-//iCal Generator//silviatheo.eu//')
    cal.add('calscale', 'GREGORIAN')

    cal.add_component(tz)
    cal.add_component(preparty)
    cal.add_component(transportation)
    cal.add_component(wedding)

    f = open(f'src/calendar/silviatheo_wedding_{lang}.ics', 'wb')
    f.write(cal.to_ical())
    f.close()
