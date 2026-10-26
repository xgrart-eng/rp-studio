# RP Studio (mobile PWA)
Cloud-API roleplay chat with image and video generation, for adults (18+). No server: everything is stored on your phone (localStorage + IndexedDB). API keys go only to the provider you set.

## Files
- `index.html`, `app.js`, `style.css`, `manifest.json`, `sw.js`, icons: the installable PWA (host on any static https host).
- `rp-studio-single.html`: the same app in one file. Opens anywhere, but it can't be installed as a PWA.

## Keys
1. **OpenRouter** (chat): https://openrouter.ai/keys. Pay as you go. The default model is `x-ai/grok-4.7`, the newest Grok on OpenRouter as of Oct 2026, at about $2 per million input tokens. Older `x-ai/grok-4.x` ids also work. Any OpenAI-compatible provider works: change the Base URL.
2. **fal.ai** (images + video): https://fal.ai/dashboard/keys. Flux dev is about $0.025 per image. Wan image-to-video (`fal-ai/wan-i2v`) is about $0.20–0.40 per clip and takes 1–3 minutes.
- Read each provider's terms and pick providers and models whose terms allow the content you plan to make. Some fal models have a safety checker you can set in "Extra image params", for example `{"enable_safety_checker":false}`, but only where the provider allows that.
- Replicate is in the settings, but its API blocks browser (CORS) calls. It only works through your own proxy. The "custom" image provider POSTs `{prompt}` to any endpoint you give it.

## Image provider presets (Settings → Images)
- **fal.ai**: `fal-ai/flux-lora` costs $0.035 per megapixel, so about $0.035 at 832×1216. `fal-ai/lora` runs SD/SDXL checkpoints and LoRAs from Hugging Face or a URL. The fal key is also used for video.
- **Runware**: use any Civitai model by its AIR id (`civitai:MODEL@VERSION`). Images cost from about $0.003. NSFW checking is optional (`checkNSFW`).
- **Novita AI**: SD/SDXL checkpoints and LoRAs. NSFW detection is optional (`enable_nsfw_detection`, $0.0015 extra per image).
- "Turn provider safety checker off" sends the provider's own flag. It only has an effect where that provider allows it. Every provider bans minors, non-consensual imagery and real people without consent. Character appearance prompts must describe adults.

## Use
Settings → paste your keys → Save. Characters → tap one to start a chat. Each message has buttons for 🖼 scene image, ✎ edit, 🗑 delete, ↻ regenerate (creates swipes ‹ ›), and ⋯ continue. Generated images have a 🎬 Animate button that makes a video.
Import SillyTavern V1/V2/V3 cards as .json or .png. Back up or restore everything under Settings → Data.

## Hosting
Netlify Drop: open https://app.netlify.com/drop and drag the folder in (free account). GitHub Pages and Cloudflare Pages also work. On your Pixel, open the https URL in Chrome → ⋮ → Add to Home screen / Install app.
