# Translation review

Every Swahili (sw) and Gĩkũyũ (ki) string below is a draft written without a native speaker. Each one is marked NEEDS_REVIEW.
Please correct the text directly in `public/assets/i18n/sw.js` and `public/assets/i18n/ki.js`, then run `node tools/translation-review.mjs` to refresh this list.

Points to check first:

- The scripture lines (`scripture`) are drafts, not quotations from a published Swahili or Gĩkũyũ Bible. Replace them with the wording your church uses.
- The theme words (`theme_from`, `theme_to`, `theme_line`) appear very large on the page.
- Where a Gĩkũyũ word was uncertain, English was kept on purpose ("Live", "Menu", "Copy address", "Not to scale", "Coordinates", "Parking", "Accommodation", "Bishop", "Reverend").
- `clock_*` builds the local way of telling time, for example 10:00 is "saa nne asubuhi".
- Speaker titles are in `titles`.

| Key | English | Kiswahili | Status | Gĩkũyũ | Status |
|---|---|---|---|---|---|
| `skip` | Skip to what is happening now | Ruka hadi kinachoendelea sasa | NEEDS_REVIEW | Thiĩ harĩa harathiĩ rĩu | NEEDS_REVIEW |
| `nav_now` | Now | Sasa | NEEDS_REVIEW | Rĩu | NEEDS_REVIEW |
| `nav_programme` | Programme | Ratiba | NEEDS_REVIEW | Mũtaratara | NEEDS_REVIEW |
| `nav_speakers` | Speakers | Wahubiri | NEEDS_REVIEW | Ahunjia | NEEDS_REVIEW |
| `nav_theme` | Theme | Kauli mbiu | NEEDS_REVIEW | Mũtwe | NEEDS_REVIEW |
| `nav_venue` | Venue | Mahali | NEEDS_REVIEW | Handũ | NEEDS_REVIEW |
| `nav_inquiries` | Inquiries | Maswali | NEEDS_REVIEW | Ciũria | NEEDS_REVIEW |
| `menu_open` | Open menu | Fungua menyu | NEEDS_REVIEW | Hingũra Menu | NEEDS_REVIEW |
| `menu_close` | Close menu | Funga menyu | NEEDS_REVIEW | Hinga Menu | NEEDS_REVIEW |
| `language` | Language | Lugha | NEEDS_REVIEW | Rũthiomi | NEEDS_REVIEW |
| `subtitle` | Annual Conference | Kongamano la Kila Mwaka | NEEDS_REVIEW | Kĩũngano kĩa O Mwaka | NEEDS_REVIEW |
| `dates_range` | {d1} to {d2} {month} {year} | {d1} hadi {d2} {month} {year} | NEEDS_REVIEW | {d1} nginya {d2} {month} {year} | NEEDS_REVIEW |
| `place_short` | Kerugoya | Kerugoya | NEEDS_REVIEW | Kerugoya | NEEDS_REVIEW |
| `pre_title` | Starts in | Inaanza baada ya | NEEDS_REVIEW | Kĩambĩrĩria thutha wa | NEEDS_REVIEW |
| `pre_line` | The first session opens on {day} {date} at {time}. | Kipindi cha kwanza kitaanza {day} {date} {time}. | NEEDS_REVIEW | Kĩũngano kĩa mbere nĩ kĩambĩrĩria {day} {date} {time}. | NEEDS_REVIEW |
| `wait_title` | {day} live | {day} ni leo | NEEDS_REVIEW | {day} Live | NEEDS_REVIEW |
| `wait_line` | The morning session starts at {time}. | Kipindi cha asubuhi kitaanza {time}. | NEEDS_REVIEW | Kĩũngano kĩa rũciinĩ nĩ kĩambĩrĩria {time}. | NEEDS_REVIEW |
| `ongoing_title` | Ongoing | Inaendelea | NEEDS_REVIEW | Kĩrathiĩ | NEEDS_REVIEW |
| `ongoing_line` | {session}, until {time}. | {session}, hadi {time}. | NEEDS_REVIEW | {session}, nginya {time}. | NEEDS_REVIEW |
| `break_title` | Recharging | Mapumziko | NEEDS_REVIEW | Kũhurũka | NEEDS_REVIEW |
| `break_line` | Break. {session} starts at {time}. | Mapumziko. {session} kitaanza {time}. | NEEDS_REVIEW | Kũhurũka. {session} nĩ kĩambĩrĩria {time}. | NEEDS_REVIEW |
| `done_title` | See you tomorrow | Tuonane kesho | NEEDS_REVIEW | Tũgũkuona rũciũ | NEEDS_REVIEW |
| `done_line` | {session} on {day} starts at {time}. | {session}, {day}, kitaanza {time}. | NEEDS_REVIEW | {session}, {day}, nĩ kĩambĩrĩria {time}. | NEEDS_REVIEW |
| `ended_title` | Thank you | Asante | NEEDS_REVIEW | Nĩ ngatho | NEEDS_REVIEW |
| `ended_line` | Thank you for coming to The Recharge. God bless you as you go. | Asante kwa kuhudhuria The Recharge. Mungu akubariki unapoondoka. | NEEDS_REVIEW | Nĩ ngatho nĩ gũũka The Recharge. Ngai akũrathime ũgĩthiĩ. | NEEDS_REVIEW |
| `left` | left | zimebaki | NEEDS_REVIEW | ciatigara | NEEDS_REVIEW |
| `until_start` | to go | zimebaki | NEEDS_REVIEW | ciatigara | NEEDS_REVIEW |
| `welcomes` | Welcomes you to | Linakukaribisha kwenye | NEEDS_REVIEW | Rĩragũthagĩrĩra harĩ | NEEDS_REVIEW |
| `role_guest` | Guest | Mgeni | NEEDS_REVIEW | Mũgeni | NEEDS_REVIEW |
| `day_done` | Completed | Imekamilika | NEEDS_REVIEW | Nĩ kĩarĩkia | NEEDS_REVIEW |
| `day_done_line` | Thank God for this day | Tunamshukuru Mungu kwa siku hii | NEEDS_REVIEW | Nĩ tũracookeria Ngai ngatho nĩ ũndũ wa mũthenya ũyũ | NEEDS_REVIEW |
| `thanks_for_coming` | Thanks you for coming to | Linakushukuru kwa kuhudhuria | NEEDS_REVIEW | Nĩ ĩragũcookeria ngatho nĩ gũũka | NEEDS_REVIEW |
| `closing_bless` | God bless you | Mungu akubariki | NEEDS_REVIEW | Ngai akũrathime | NEEDS_REVIEW |
| `today` | Today | Leo | NEEDS_REVIEW | Ũmũthĩ | NEEDS_REVIEW |
| `every_day` | Every day | Kila siku | NEEDS_REVIEW | O mũthenya | NEEDS_REVIEW |
| `mini_until` | until {time} | hadi {time} | NEEDS_REVIEW | nginya {time} | NEEDS_REVIEW |
| `unit_days` | Days | Siku | NEEDS_REVIEW | Mathiku | NEEDS_REVIEW |
| `unit_hours` | Hours | Saa | NEEDS_REVIEW | Mathaa | NEEDS_REVIEW |
| `unit_minutes` | Min | Dak | NEEDS_REVIEW | Ndag | NEEDS_REVIEW |
| `unit_seconds` | Sec | Sek | NEEDS_REVIEW | Thek | NEEDS_REVIEW |
| `session_morning` | Morning session | Kipindi cha asubuhi | NEEDS_REVIEW | Kĩũngano kĩa rũciinĩ | NEEDS_REVIEW |
| `session_evening` | Evening session | Kipindi cha alasiri | NEEDS_REVIEW | Kĩũngano kĩa hwaĩ-inĩ | NEEDS_REVIEW |
| `ticker_pre` | The Recharge | The Recharge | NEEDS_REVIEW | The Recharge | NEEDS_REVIEW |
| `ticker_live` | Live | Leo | NEEDS_REVIEW | Live | NEEDS_REVIEW |
| `ticker_left` | left | zimebaki | NEEDS_REVIEW | ciatigara | NEEDS_REVIEW |
| `announce_pre` | The conference starts on {day} at {time}. | Kongamano litaanza {day} {time}. | NEEDS_REVIEW | Kĩũngano nĩ kĩambĩrĩria {day} {time}. | NEEDS_REVIEW |
| `announce_wait` | Today is {day}. The morning session starts at {time}. | Leo ni {day}. Kipindi cha asubuhi kitaanza {time}. | NEEDS_REVIEW | Ũmũthĩ nĩ {day}. Kĩũngano kĩa rũciinĩ nĩ kĩambĩrĩria {time}. | NEEDS_REVIEW |
| `announce_ongoing` | {session} is on now, until {time}. | {session} kinaendelea sasa, hadi {time}. | NEEDS_REVIEW | {session} nĩ kĩrathiĩ rĩu, nginya {time}. | NEEDS_REVIEW |
| `announce_break` | Break. {session} starts at {time}. | Mapumziko. {session} kitaanza {time}. | NEEDS_REVIEW | Kũhurũka. {session} nĩ kĩambĩrĩria {time}. | NEEDS_REVIEW |
| `announce_done` | Sessions are over for today. Next: {day} at {time}. | Vipindi vya leo vimekwisha. Kinachofuata: {day} {time}. | NEEDS_REVIEW | Ciũngano cia ũmũthĩ nĩ ciathira. Kĩrũmĩrĩri: {day} {time}. | NEEDS_REVIEW |
| `announce_ended` | The conference has ended. Thank you for coming. | Kongamano limekwisha. Asante kwa kuhudhuria. | NEEDS_REVIEW | Kĩũngano nĩ kĩathira. Nĩ ngatho nĩ gũũka. | NEEDS_REVIEW |
| `watch_live` | Watch live | Tazama moja kwa moja | NEEDS_REVIEW | Rora Live | NEEDS_REVIEW |
| `youtube_quiet` | Church channel on YouTube | Chaneli ya kanisa YouTube | NEEDS_REVIEW | Kanisa YouTube | NEEDS_REVIEW |
| `tz_note` | Times are Nairobi time (UTC+3). Your phone shows {local} there now. | Saa zote ni za Nairobi (UTC+3). Simu yako inaonyesha {local} sasa. | NEEDS_REVIEW | Mathaa mothe nĩ ma Nairobi (UTC+3). Thimũ yaku ĩronania {local} rĩu. | NEEDS_REVIEW |
| `test_clock` | Test clock, not the real time. Tap for the real time | Saa ya majaribio, si saa halisi. Gusa kwa saa halisi | NEEDS_REVIEW | Thaa ya kũgeria, ti thaa ya ma. Hihinya nĩguo ũrore thaa ya ma | NEEDS_REVIEW |
| `host_line` | Host: {host} | Mwenyeji: {host} | NEEDS_REVIEW | Mũnyiitani: {host} | NEEDS_REVIEW |
| `programme_title` | Programme | Ratiba | NEEDS_REVIEW | Mũtaratara | NEEDS_REVIEW |
| `add_calendar` | Add to calendar | Weka kwenye kalenda | NEEDS_REVIEW | Ongerera kalenda | NEEDS_REVIEW |
| `add_calendar_all` | Add all five days to your calendar | Weka siku zote tano kwenye kalenda | NEEDS_REVIEW | Ongerera mathiku mothe matano kalenda | NEEDS_REVIEW |
| `status_now` | Now | Sasa | NEEDS_REVIEW | Rĩu | NEEDS_REVIEW |
| `status_next` | Next | Kifuatacho | NEEDS_REVIEW | Kĩrũmĩrĩri | NEEDS_REVIEW |
| `time_range` | {a} to {b} | {a} hadi {b} | NEEDS_REVIEW | {a} nginya {b} | NEEDS_REVIEW |
| `label_topic` | Topic | Mada | NEEDS_REVIEW | Ũhoro | NEEDS_REVIEW |
| `label_speaker` | Speaker | Mhubiri | NEEDS_REVIEW | Mũhunjia | NEEDS_REVIEW |
| `speakers_title` | Speakers | Wahubiri | NEEDS_REVIEW | Ahunjia | NEEDS_REVIEW |
| `role_host` | Host | Mwenyeji | NEEDS_REVIEW | Mũnyiitani | NEEDS_REVIEW |
| `card_alt` | Profile card of {title} {name} | Kadi ya {title} {name} | NEEDS_REVIEW | Kadi ya {title} {name} | NEEDS_REVIEW |
| `card_alt_host` | Profile card of {title} {name}, host | Kadi ya {title} {name}, mwenyeji | NEEDS_REVIEW | Kadi ya {title} {name}, mũnyiitani | NEEDS_REVIEW |
| `view_card` | View the card of {title} {name} | Tazama kadi ya {title} {name} | NEEDS_REVIEW | Rora kadi ya {title} {name} | NEEDS_REVIEW |
| `close` | Close | Funga | NEEDS_REVIEW | Hinga | NEEDS_REVIEW |
| `theme_from` | Slaves | Watumwa | NEEDS_REVIEW | Ngombo | NEEDS_REVIEW |
| `theme_to` | Sons | Wana | NEEDS_REVIEW | Ariũ | NEEDS_REVIEW |
| `theme_line` | Promoting Slaves to Sons | Kuwainua Watumwa kuwa Wana | NEEDS_REVIEW | Kũhaica Ngombo Gũtuĩka Ariũ | NEEDS_REVIEW |
| `scripture` | Wherefore thou art no more a servant, but a son; and if a son, then an heir of God through Christ. | Kwa hiyo wewe si mtumwa tena, bali u mwana; na kama u mwana, basi u mrithi kwa Mungu. | NEEDS_REVIEW | Nĩ ũndũ ũcio ndũrĩ ngombo rĩngĩ, no ũrĩ mũrũ; na angĩkorwo ũrĩ mũrũ, ũrĩ mũgai wa igai rĩa Ngai. | NEEDS_REVIEW |
| `scripture_ref` | Galatians 4:7 | Wagalatia 4:7 | NEEDS_REVIEW | Agalatia 4:7 | NEEDS_REVIEW |
| `scripture_version` | King James Version | Rasimu, inasubiri kuhakikiwa | NEEDS_REVIEW | Ũhoro ũyũ ũrabatara gũthuthurio | NEEDS_REVIEW |
| `venue_title` | Venue | Mahali | NEEDS_REVIEW | Handũ | NEEDS_REVIEW |
| `venue_maps_name` | On Google Maps: {place} | Kwenye Google Maps: {place} | NEEDS_REVIEW | Google Maps: {place} | NEEDS_REVIEW |
| `open_maps` | Open in Google Maps | Fungua Google Maps | NEEDS_REVIEW | Hingũra Google Maps | NEEDS_REVIEW |
| `copy_address` | Copy address | Nakili anwani | NEEDS_REVIEW | Copy address | NEEDS_REVIEW |
| `copied` | Address copied | Anwani imenakiliwa | NEEDS_REVIEW | Address copied | NEEDS_REVIEW |
| `not_to_scale` | Not to scale | Si kwa kipimo | NEEDS_REVIEW | Not to scale | NEEDS_REVIEW |
| `map_church` | Church | Kanisa | NEEDS_REVIEW | Kanitha | NEEDS_REVIEW |
| `coordinates` | Coordinates | Kuratibu | NEEDS_REVIEW | Coordinates | NEEDS_REVIEW |
| `parking` | Parking | Maegesho | NEEDS_REVIEW | Parking | NEEDS_REVIEW |
| `accommodation` | Accommodation | Malazi | NEEDS_REVIEW | Accommodation | NEEDS_REVIEW |
| `inquiries_title` | Inquiries | Maswali | NEEDS_REVIEW | Ciũria | NEEDS_REVIEW |
| `inquiries_lead` | Questions about the conference? Call or send a WhatsApp message. | Una swali kuhusu kongamano? Piga simu au tuma ujumbe wa WhatsApp. | NEEDS_REVIEW | Wĩ na kĩũria? Hũra thimũ kana ũtũme ndũmĩrĩri ya WhatsApp. | NEEDS_REVIEW |
| `call` | Call | Piga simu | NEEDS_REVIEW | Hũra thimũ | NEEDS_REVIEW |
| `whatsapp` | WhatsApp | WhatsApp | NEEDS_REVIEW | WhatsApp | NEEDS_REVIEW |
| `whatsapp_message` | Hello. I have a question about The Recharge conference. | Habari. Nina swali kuhusu kongamano la The Recharge. | NEEDS_REVIEW | Nĩ wega. Ndĩ na kĩũria kĩgiĩ kĩũngano kĩa The Recharge. | NEEDS_REVIEW |
| `follow` | Follow the church | Fuatilia kanisa | NEEDS_REVIEW | Rũmĩrĩra kanitha | NEEDS_REVIEW |
| `share` | Share | Shiriki | NEEDS_REVIEW | Tũmĩra arata | NEEDS_REVIEW |
| `share_text` | The Recharge, Annual Conference. {dates}, Kerugoya. Theme: Promoting Slaves to Sons. Come with your family and friends. | The Recharge, Kongamano la Kila Mwaka. {dates}, Kerugoya. Kauli mbiu: Kuwainua Watumwa kuwa Wana. Karibu pamoja na familia na marafiki. | NEEDS_REVIEW | The Recharge, Kĩũngano kĩa O Mwaka. {dates}, Kerugoya. Mũtwe: Kũhaica Ngombo Gũtuĩka Ariũ. Ũka na famĩlĩ na arata aku. | NEEDS_REVIEW |
| `notfound_title` | Page not found | Ukurasa haupatikani | NEEDS_REVIEW | Rũrenda rũtiraneneka | NEEDS_REVIEW |
| `notfound_line` | This page does not exist. The conference page is one tap away. | Ukurasa huu haupo. Ukurasa wa kongamano uko hapa chini. | NEEDS_REVIEW | Rũrenda rũrũ rũtirĩ kuo. Rũrenda rwa kĩũngano rũrĩ haha. | NEEDS_REVIEW |
| `notfound_back` | Go to The Recharge | Nenda The Recharge | NEEDS_REVIEW | Thiĩ The Recharge | NEEDS_REVIEW |
| `titles.Bishop` | Bishop | Askofu | NEEDS_REVIEW | Bishop | NEEDS_REVIEW |
| `titles.Pastor` | Pastor | Mchungaji | NEEDS_REVIEW | Mũrĩithi | NEEDS_REVIEW |
| `titles.Reverend` | Reverend | Mchungaji | NEEDS_REVIEW | Reverend | NEEDS_REVIEW |
| `titles.Apostle` | Apostle | Mtume | NEEDS_REVIEW | Mũtũmwo | NEEDS_REVIEW |
| `weekdays[0]` | Sunday | Jumapili | NEEDS_REVIEW | Kiumia | NEEDS_REVIEW |
| `weekdays[1]` | Monday | Jumatatu | NEEDS_REVIEW | Njumatatũ | NEEDS_REVIEW |
| `weekdays[2]` | Tuesday | Jumanne | NEEDS_REVIEW | Njumaine | NEEDS_REVIEW |
| `weekdays[3]` | Wednesday | Jumatano | NEEDS_REVIEW | Njumatana | NEEDS_REVIEW |
| `weekdays[4]` | Thursday | Alhamisi | NEEDS_REVIEW | Aramithi | NEEDS_REVIEW |
| `weekdays[5]` | Friday | Ijumaa | NEEDS_REVIEW | Njumaa | NEEDS_REVIEW |
| `weekdays[6]` | Saturday | Jumamosi | NEEDS_REVIEW | Njumamothi | NEEDS_REVIEW |
| `weekdays_short[0]` | Sun | Jpl | NEEDS_REVIEW | Kiu | NEEDS_REVIEW |
| `weekdays_short[1]` | Mon | Jtt | NEEDS_REVIEW | Njt | NEEDS_REVIEW |
| `weekdays_short[2]` | Tue | Jnn | NEEDS_REVIEW | Nji | NEEDS_REVIEW |
| `weekdays_short[3]` | Wed | Jtn | NEEDS_REVIEW | Njn | NEEDS_REVIEW |
| `weekdays_short[4]` | Thu | Alh | NEEDS_REVIEW | Ara | NEEDS_REVIEW |
| `weekdays_short[5]` | Fri | Iju | NEEDS_REVIEW | Nju | NEEDS_REVIEW |
| `weekdays_short[6]` | Sat | Jmo | NEEDS_REVIEW | Njm | NEEDS_REVIEW |
| `months[0]` | January | Januari | NEEDS_REVIEW | Njenuarĩ | NEEDS_REVIEW |
| `months[1]` | February | Februari | NEEDS_REVIEW | Mwere wa kerĩ | NEEDS_REVIEW |
| `months[2]` | March | Machi | NEEDS_REVIEW | Mwere wa gatatũ | NEEDS_REVIEW |
| `months[3]` | April | Aprili | NEEDS_REVIEW | Mwere wa kana | NEEDS_REVIEW |
| `months[4]` | May | Mei | NEEDS_REVIEW | Mwere wa gatano | NEEDS_REVIEW |
| `months[5]` | June | Juni | NEEDS_REVIEW | Mwere wa gatandatũ | NEEDS_REVIEW |
| `months[6]` | July | Julai | NEEDS_REVIEW | Mwere wa mũgwanja | NEEDS_REVIEW |
| `months[7]` | August | Agosti | NEEDS_REVIEW | Mwere wa kanana | NEEDS_REVIEW |
| `months[8]` | September | Septemba | NEEDS_REVIEW | Mwere wa kenda | NEEDS_REVIEW |
| `months[9]` | October | Oktoba | NEEDS_REVIEW | Mwere wa ikũmi | NEEDS_REVIEW |
| `months[10]` | November | Novemba | NEEDS_REVIEW | Mwere wa ikũmi na ũmwe | NEEDS_REVIEW |
| `months[11]` | December | Desemba | NEEDS_REVIEW | Ndithemba | NEEDS_REVIEW |
| `clock_format` |  | saa {h} {p} | NEEDS_REVIEW | thaa {h} {p} | NEEDS_REVIEW |
| `clock_hours[0]` |  | moja | NEEDS_REVIEW | ĩmwe | NEEDS_REVIEW |
| `clock_hours[1]` |  | mbili | NEEDS_REVIEW | igĩrĩ | NEEDS_REVIEW |
| `clock_hours[2]` |  | tatu | NEEDS_REVIEW | ithatũ | NEEDS_REVIEW |
| `clock_hours[3]` |  | nne | NEEDS_REVIEW | inya | NEEDS_REVIEW |
| `clock_hours[4]` |  | tano | NEEDS_REVIEW | ithano | NEEDS_REVIEW |
| `clock_hours[5]` |  | sita | NEEDS_REVIEW | ithathatũ | NEEDS_REVIEW |
| `clock_hours[6]` |  | saba | NEEDS_REVIEW | mũgwanja | NEEDS_REVIEW |
| `clock_hours[7]` |  | nane | NEEDS_REVIEW | inyanya | NEEDS_REVIEW |
| `clock_hours[8]` |  | tisa | NEEDS_REVIEW | kenda | NEEDS_REVIEW |
| `clock_hours[9]` |  | kumi | NEEDS_REVIEW | ikũmi | NEEDS_REVIEW |
| `clock_hours[10]` |  | kumi na moja | NEEDS_REVIEW | ikũmi na ĩmwe | NEEDS_REVIEW |
| `clock_hours[11]` |  | kumi na mbili | NEEDS_REVIEW | ikũmi na igĩrĩ | NEEDS_REVIEW |
| `clock_periods[0]` |  | 0 usiku | NEEDS_REVIEW | 0 ũtukũ | NEEDS_REVIEW |
| `clock_periods[1]` |  | 5 asubuhi | NEEDS_REVIEW | 5 rũciinĩ | NEEDS_REVIEW |
| `clock_periods[2]` |  | 12 mchana | NEEDS_REVIEW | 12 mũthenya | NEEDS_REVIEW |
| `clock_periods[3]` |  | 15 alasiri | NEEDS_REVIEW | 17 hwaĩ-inĩ | NEEDS_REVIEW |
| `clock_periods[4]` |  | 17 jioni | NEEDS_REVIEW | 19 ũtukũ | NEEDS_REVIEW |
| `clock_periods[5]` |  | 19 usiku | NEEDS_REVIEW |  | NEEDS_REVIEW |
