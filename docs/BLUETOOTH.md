# Bluetooth listening in Zonked

## What people heard

A rustling "swoosh swoosh" over Bluetooth headphones.

## Likely causes

1. Lossy codecs. Bluetooth music uses SBC or AAC. They squeeze sound to fit a thin radio link. Steady hiss (rain, white noise) and two tones that are almost the same pitch are hard to squeeze, so they smear and seem to pulse.
2. Call mode. When any app uses the headset microphone, many headsets drop to a phone-call link. That link is mono and low quality. Music then sounds thin and swooshy.
3. Radio drops. A weak link (far away, a crowded room, a busy 2.4 GHz band) loses small pieces of sound.
4. Engine underruns. Less likely. The computer was too busy to fill the sound buffer in time.

## What Bluetooth mode does

Choose "Bluetooth headphones" in onboarding (step 3) or in Settings. The choice is stored on this device under `zonked.device.v1`. Old saved values `headphones` and `unsure` become `wired`.

Only the Web Audio graph changes. It sits after the DSP worklet and before the final clip guard:

- A gentle high shelf, about -6 dB above 6 kHz.
- A low-pass near 9 kHz.
- The noise layer is 3 dB lower.
- Switching crossfades two paths over 250 ms, so there is no click.

Beat frequencies, carriers, the gain cap (0.85), the ramps and the hard limit (0.95) do not change. `crates/dsp-core` is untouched.

Picks follow the device:

- Bluetooth prefers sounds tagged `btFriendly` (less than 4 percent of their energy above 6 kHz) and templates with pads, soft notes or chimes. It lowers templates with white or violet noise or crackle.
- Speakers keep the existing speaker rules (no reliance on binaural beats).
- Wired keeps the usual picks.
- Intensity never goes above what the sensitivity setting allows.

The hiss score of each recorded loop comes from `web/scripts/hiss-score.mjs`. Run it once when a loop changes, then copy the numbers into `web/src/audio/samples/catalog.ts`. Made-in-code sounds are tagged by their filter settings.

## The call-mode tip

Shown in the player Options sheet when Bluetooth is set:

If it sounds swooshy, set your computer's sound input to its own microphone so the headphones stay in music mode.

## Sound health

Advanced shows "Sound health: smooth" or "N hiccups in the last 5 minutes". It counts:

- Skipped render quanta, seen by a frame counter watchdog in the worklet.
- Late frames, seen as a jump of more than 40 ms in the output delay.
- The browser's own underrun count, where the browser offers one.
- Failed decodes and loop seams that would click.

Counts stay in memory on this device. Nothing is sent anywhere.

`node web/scripts/glitch-check.mjs` plays 3 sounds at Wired and Bluetooth for 30 seconds each in headless Chromium. It prints hiccups, peak, RMS and the level above 6 kHz, and fails if Bluetooth mode lowers the level above 6 kHz by less than 4 dB on rain and fountain.

## Not tested

- Real Bluetooth devices. All checks ran on the computer's own output path in headless Chromium, which has no codec.
- A real iPhone and Safari.
- Whether the swoosh is gone for the owner. The filters follow the likely cause. Nobody has listened with the owner's headphones.
- Call mode itself. The tip is advice. Zonked cannot see or change the system sound input.
