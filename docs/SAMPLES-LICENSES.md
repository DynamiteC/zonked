# Nature sample licences

Every loop shipped under `web/public/samples/` is listed here. Only CC0 or public domain material is used.
`node scripts/check-samples.mjs` fails when a shipped file is missing from this table, has a licence outside
the allow list, or has a different SHA-256.

Allow list: `CC0 1.0`, `Public domain (PD-author, dedicated by the author)`.
Public domain here means the recording author dedicated it to the public domain, as stated on the Commons file page.

## Shipped files

| File | Title | Author | Source page | Licence | Licence page | Downloaded (UTC) | Segment used | Bytes | SHA-256 of shipped file |
|---|---|---|---|---|---|---|---|---|---|
| rain.mp3.json | Rain | ezwa (PDSounds record 682) | https://commons.wikimedia.org/wiki/File:Rain_(1).ogg | Public domain (PD-author, dedicated by the author) | https://commons.wikimedia.org/wiki/Template:PD-author | 2026-11-27 | 0:00-0:35 of source (source SHA-256 31efcbe952a3989a...) | 210716 | ada559df5ca8712ea5bc267bc95339420b8ed5db2b29ff83e8ef1876aa182038 |
| stream.mp3.json | Stream, river water up close | jackthemurray (Freesound 433589) | https://commons.wikimedia.org/wiki/File:433589_jackthemurray_stream-river-water-up-close.wav | CC0 1.0 | https://creativecommons.org/publicdomain/zero/1.0/ | 2026-11-27 | 0:10-0:45 of source (source SHA-256 be201d2fd0d110fc...) | 210716 | 43b64bead6a4155110b4b5392dfe8eab775c71eadea1f57c626a18dbdef7d468 |
| ocean.mp3.json | Ocean Waves on a Tropical Beach | Jarrod stanley | https://commons.wikimedia.org/wiki/File:Ocean_Waves_on_a_Tropical_Beach.ogg | CC0 1.0 | https://creativecommons.org/publicdomain/zero/1.0/ | 2026-11-27 | 0:20-0:55 of source (source SHA-256 bae2fc0a0c1d36f4...) | 210716 | d31ae216e2b73c0a19973d03c5c26f12055c35a9f88a49c7d81659a2a9b669d6 |
| rapids.mp3.json | Florida Rapids | Jarrod stanley | https://commons.wikimedia.org/wiki/File:Florida_Rapids.ogg | CC0 1.0 | https://creativecommons.org/publicdomain/zero/1.0/ | 2026-11-27 | 0:20-0:55 of source (source SHA-256 dd4be4f359fe377c...) | 210716 | bc8f28a90ba4b8063dcea36a3678920da0e31e4e33e03baea2e46aaaebef27de |
| forest.mp3.json | Forest ambience | nille (PDSounds record 707) | https://commons.wikimedia.org/wiki/File:20090610_0_ambience.ogg | Public domain (PD-author, dedicated by the author) | https://commons.wikimedia.org/wiki/Template:PD-author | 2026-11-27 | 0:05-0:40 of source (source SHA-256 43848c3eda5f4282...) | 210716 | 9570e37c217ef5580de7bfbf238ea4f549f31bc73b6d85f8b04ae5b8629990d9 |
| birds.mp3.json | Birds singing in garden | ezwa (PDSounds record 128) | https://commons.wikimedia.org/wiki/File:Birds_singing_in_garden.ogg | Public domain (PD-author, dedicated by the author) | https://commons.wikimedia.org/wiki/Template:PD-author | 2026-11-27 | 0:00-0:35 of source (source SHA-256 c3a9cbbecb313810...) | 210716 | 7cd810d7c0b9ed33f232003f8a80a4d672b8d650d74e3cff2765126bc040d199 |
| breeze.mp3.json | Gentle breeze and birds singing | ezwa (PDSounds record 129) | https://commons.wikimedia.org/wiki/File:Gentle_breeze_and_birds_singing.ogg | Public domain (PD-author, dedicated by the author) | https://commons.wikimedia.org/wiki/Template:PD-author | 2026-11-27 | 0:00-0:28 of source (source SHA-256 399c31051dfe42f5...) | 168632 | 797acb5125d1abdad3813f657cf215d27cd1c3d22257780a83267e513df11b4d |

## How the loops were made

1. Download the source file from its source page. No login was needed. yt-dlp was not used.
2. Cut the segment shown above, plus a 4 to 5 s tail, convert to mono 32 kHz.
3. Loop point: equal-power crossfade of the tail into the head, so the end flows into the start.
4. Gain: normalised to about -23 LUFS, then lowered if needed so the peak stays under -6.5 dBFS.
   The stream and breeze loops are peaky and end quieter (about -33 LUFS) to hold that peak limit.
5. Encode MP3, 56 kbps, mono (libmp3lame). MP3 decodes in Chrome, Firefox and Safari.
6. The file carries a .json extension so the Kiro Crew gateway can serve it. The app fetches it as an
   arrayBuffer, the same way as `dsp_core.wasm.json`. The browser PWA uses the same files.

## Not used

- Epidemic Sound: considered and rejected. It is a paid subscription library. Its licence does not allow
  bundling or redistributing tracks inside a public repository or app.
- Wikimedia Commons files under CC BY-SA, CC BY or CC BY-NC (several rain, forest and stream recordings):
  the share-alike and attribution terms do not fit this repository.
- A flute or village-flute loop: the only public domain flute files found are 13 s phrases, shorter than the
  20 s loop minimum, and a played phrase does not loop well. No clean loop was found, so none is shipped.
- A wind-only loop: the only CC0 wind file is a harsh howl at 16 kHz, not soft wind. The breeze loop
  (gentle breeze with birds) covers soft wind.
- A waterfall loop: none found under an allowed licence. River rapids is shipped instead.
- yt-dlp was not needed: every shipped file came from Wikimedia Commons.
