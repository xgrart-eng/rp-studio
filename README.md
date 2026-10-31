# RP Studio (mobile PWA)
Cloud-API roleplay chat with image and video generation, for adults only (every character is 21+; there is an age gate). There is no server: everything is stored on your phone (localStorage + IndexedDB). Each API key is sent only to its own provider.

## Files
- `index.html`, `app.js`, `premade.js`, `style.css`, `manifest.json`, `sw.js`, icons: the installable PWA.
- `rp-studio-single.html`: the same app in one file. It opens anywhere but can't be installed.
- `tests/`: Puppeteer tests (see below).

## Defaults and keys (Settings)
- **Chat: xAI.** Base URL `https://api.x.ai/v1`, model `grok-4`. Get a key at https://console.x.ai. Any OpenAI-compatible provider works if you change the Base URL (OpenRouter is in the provider list).
- **Images: Runware only** (https://my.runware.ai). Settings → Images has one **★ My models** list: your saved models first, then ☆ suggestions (the curated presets). Tap a model to use it, tap ☆ to keep it, or use **Find models** to search Runware/Civitai. Paste a model AIR id (e.g. `civitai:4384@128713`) and tap **Check this model** to verify it.
- **Video:** Runware by default (LTX-2.3). fal.ai is still available as a video fallback; its key is in the Video section.
- Pick models whose terms allow what you make. Minors, real people and non-consensual content are prohibited. The negative prompt always blocks child/loli/young.

## Images
- **Image prompt** setting: **Review in editor** (default) or **Quick** (no editor).
- In the editor, the **Scene** box is filled from the chat. Scene chips and Face chips add to it and rebuild the prompt on the phone, with no extra AI call. **Build prompt from this** asks the AI again; it also runs on its own about 1 second after you stop typing in Scene. **Fill scene from chat** writes the scene from the chat. The Model row opens your models (tap to switch; manage, rename and remove them in Settings > Manage models). The final prompt is read-only. Tap **✎ edit prompt** to write it yourself.
- Nothing is generated until you tap **Generate**.

## Backups
Settings → Data → Export all. API keys are left out of the export unless you tick "Include API keys". When you import a backup without keys, the keys already on the phone are kept.

## Tests
Serve the app folder on `localhost:8787` (for example `python3 -m http.server 8787`). Install `puppeteer-core` and Google Chrome, then run `bash tests/run-all.sh`. It builds the single file, checks syntax, and runs every test against both `index.html` and `rp-studio-single.html`. `tests/golden` (t29) compares image prompts byte for byte against saved fixtures.

## Deploy
GitHub Pages: copy the app files into the Pages repo, bump `CACHE` in `sw.js` (e.g. `rpstudio-v31`), commit and push. Then check that `https://<user>.github.io/<repo>/sw.js` shows the new version. On the Pixel, open the URL in Chrome → ⋮ → Install app. Reopen the app once to pick up the update.
- v38: optional **Sample dialogue** (`mes_example`, alias `example_dialogue`/`sample_dialogue` on import) under More details; sent as a delimited `<sample_dialogue>` style-reference block only when non-empty.
- v39: Hazel v2 (pm-hazel) with Sample dialogue. Tap ↻ Update on Hazel, then start a new chat.
- v40: Runware content check (checkContent) is now off by default, with a Settings toggle "Runware content check (off by default)". Existing phones are switched off once (ccMig40). The app's own adult-age guard (prompt age stripping plus the negative guard) still always runs. Per-character stable seed, with New look and a seed override. Optional face reference through IP-Adapter (runware:55@3) on SDXL-family models. Not yet verified against a live key.
- v41: The "Browse Runware models" button searches public checkpoints sorted by popularity, 50 per page, with an architecture filter (Any, Illustrious, Pony, NoobAI, SDXL). An NSFW level is shown when Runware returns one. Starring a model (★) saves its default size, scheduler, steps and CFG, plus its trigger words added to the image prefix after the age filter. The Hassaku preset id (140272@1617798) is v2.1fix, not v2.2; the label now says so.
