# The Recharge, conference website (poster edition)

This copy follows the printed poster: paper background, orange-to-red title, navy and red theme badge, purple ribbon with the church logo, torn paper edges. The plain edition is in the `recharge-site` folder next to this one. Both share the same config, clock and content.

A small static site for The Recharge, Annual Conference of Jesus Healing Centre Churches Kenya (2 to 6 December 2026, Kerugoya). It always shows what is happening now, using the time and the schedule only. The folder to upload is `public/`. The `source/` folder keeps your original logo, cards and videos untouched.

Fonts: Montserrat Black carries the poster's heavy headlines, Arizonia gives the red script for Guest and Host, Anton keeps the giant names and numbers compact, and Alegreya Sans keeps reading text calm. All four have real ĩ and ũ.
Original font note: Anton is a tall, heavy poster face that lets one word fill a phone screen, and Alegreya Sans is a calm humanist sans with real ĩ and ũ that stays easy to read in long Swahili and Gĩkũyũ lines.

## Edit the details

Open `public/config.js` in any text editor (Notepad is fine). Everything you may change is there: session times, venue text, map link, coordinates, phone number, YouTube and TikTok links, live-stream link, notice banner, charge start date, speaker names, titles and photo paths. Keep the quotes and commas. Times must keep `+03:00`.

- **Live button:** paste the link into `livestreamUrl`. It appears only during sessions.
- **Last-minute notice:** type it into `notice` (one text per language). Empty hides it.
- **Topic or speaker for a session:** fill `topic` or `speaker` on that session. Empty stays hidden.

## Replace a photo or card

1. Put the new image (PNG or JPG) in `source/speaker-cards/`, named like the old one.
2. Easiest: run `python tools/build_assets.py` (and `python tools/poster_assets.py` for the poster fonts, paper and torn edge) (needs `pip install pillow fonttools brotli`). It makes the small WebP and AVIF files.
3. Without Python: copy your image into `public/assets/speakers/`, then in `config.js` set `still` to its path, `stillSmall` to `""` and `avif` to `false`.
4. Videos: put the MP4 in `public/assets/video/` and set `video` in `config.js`. A WebM can go in `videoWebm`.
5. After replacing any image, change `VERSION` in `public/sw.js` (for example to `"v2"`) so installed phones fetch the new file.

## Test any moment

Add these to the address: `?now=2026-12-04T14:10:00+03:00` freezes the clock at that moment, and `&speed=60` makes it run 60 times faster.

| Try this `?now=` | You should see |
|---|---|
| `2026-11-25T08:00:00+03:00` | Starts in, days to go, ring filling |
| `2026-12-02T08:00:00+03:00` | Wednesday live, 2 hours to go |
| `2026-12-02T10:40:00+03:00` | Ongoing, hourglass 40 minutes in |
| `2026-12-04T14:10:00+03:00` | Recharging, 50 minutes to 15:00 |
| `2026-12-03T21:00:00+03:00` | See you tomorrow |
| `2026-12-06T18:00:00+03:00` | Thank you, closing screen |
| `2026-12-02T09:59:55+03:00&speed=1` | Switches to Ongoing by itself after 5 seconds |

Checks (need Node.js): `node tools/check-site.mjs` (files, strings, links), `node tools/test-states.mjs` (boundary tests), `node tools/contrast.mjs` (colour contrast), `node tools/translation-review.mjs` (refreshes `TRANSLATION_REVIEW.md`). To try the site on your computer: `node tools/serve.mjs`, then open http://localhost:8787.

## Put it online with Cloudflare Pages (free)

**Drag and drop**
1. Sign in at dash.cloudflare.com, open Workers & Pages, then Create, then Pages, then Upload assets.
2. Name the project (for example `the-recharge`) and drop either the `public` folder or the ready-made `the-recharge-upload.zip`. Deploy.
3. Your address will look like `https://the-recharge.pages.dev`. In `public/index.html`, replace every `https://REPLACE-WITH-YOUR-SITE.pages.dev` with it (this makes WhatsApp previews show the picture), then upload again.
4. To update later: open the project, Create new deployment, drop `public` again.

**With Git (GitHub)**
1. Put this folder in a GitHub repository.
2. In Cloudflare: Workers & Pages, Create, Pages, Connect to Git, choose the repository.
3. Framework preset: None. Build command: leave empty. Build output directory: `recharge-site/public` (or `public` if the repository is only this folder).
4. Every push to the main branch publishes the site.

Translations into Kiswahili and Gĩkũyũ are drafts. Please have them checked using `TRANSLATION_REVIEW.md`.
