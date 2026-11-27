# Zonked growth research

Status: research note for planning. Not tested with real people.
Date of research: 2026-11-28.
Scope: how binaural beats grew and what the evidence says, what growth.design teaches that fits a free private app, and the next five things Zonked should have.
Source tags like [S3] point to the Sources table at the end. Every URL lives only there.

How to read the evidence labels:

| Label | Meaning here |
|---|---|
| Strong | Several good trials agree, effect holds up under review |
| Mixed | Reviews exist, but trials disagree or results depend on method |
| Weak | Few or small studies, or only indirect evidence |

No use of binaural beats earns "strong" in the sources read. Zonked copy must keep saying "may help" and never "treats".

---

## A. Binaural beats: growth, use and honest evidence

### A1. How the field and market grew

| Fact | Source |
|---|---|
| A 2022 survey of Global Drug Survey 2021 respondents found that people mostly use binaural beats to relax or fall asleep (about 72 percent). About 35 percent used them to change mood. About 12 percent hoped for an effect like other drugs. | [S1], [S2] |
| In the same survey, 5.3 percent reported using beats to reach altered states. The highest rates were in the United States, Mexico, Brazil, Poland, Romania and the United Kingdom. Median age was 27. | [S1] |
| A market firm values the "sleep sound music apps" market at 1.50 billion US dollars in 2025 and forecasts 3.33 billion by 2033 (10.5 percent yearly growth). | [S3] |
| The same firm values "binaural beats headphones" at 1.30 billion in 2025 and forecasts 2.50 billion by 2033 (8.5 percent yearly growth). | [S4] |
| Free and paid beat apps are common on app stores. One long-running Android example sells itself for memory, focus, meditation, sleep and relaxation. | [S5] |

Caveats:

- The market numbers come from vendor reports. They cover adjacent markets (sleep sound apps, headphones), not beats alone. Treat them as a sense of direction, not a measure.
- The survey sample is people who answer a drug survey. It does not represent all listeners.
- Reading: demand is mostly about rest and sleep, not about drugs or focus. That fits Zonked's calm front door.

### A2. Common uses and what the evidence says

| Use | Label | What the sources say |
|---|---|---|
| Relax, calm, anxiety | Mixed | A 2019 meta-analysis of 22 studies on memory, attention, anxiety and pain found a medium average effect (g = 0.45) [S6]. A 2024 review of anxiety and depression reports better results than control conditions, with limits in study quality [S7]. A young-adult review calls the findings beneficial but limited by different designs and small samples [S8]. |
| Focus, attention, memory | Mixed | A 2023 meta-analysis found a medium effect (g = 0.40) for memory and attention, and its own systematic part found conflicting results for theta and beta beats [S9]. |
| Sleep | Weak to mixed | A young-adult review reports possible benefit for sleep with small samples [S8]. A 2024 trial reports that 0.25 Hz beats shortened the time to slow-wave sleep during daytime naps [S10]. A narrative review calls beats promising but needing validation, and notes most of the sleep benefit it found came from slow soft music [S11]. |
| Pain | Weak to mixed | A systematic review says effects seem to depend on the cause of the pain or the medical procedure, and points to alpha or delta-to-alpha beats for acute pain [S12]. Reviews of anxiety and pain around surgery and dental care exist [S13], [S14]. A review of sensory entrainment more broadly says results can depend on matching the stimulus frequency [S15]. |
| The idea that the brain "follows" the beat (entrainment) | Mixed | A 2023 systematic review of 14 EEG studies found 5 in line with entrainment, 8 contradicting it and 1 mixed. The studies were too different to compare [S16]. |
| Altered states, "digital drug" effects | Weak | Only survey evidence was found [S1]. Zonked should not target this use. |

Plain limits to repeat in the product and docs:

- Many studies are small. Many have no strong control sound. Placebo and expectation are likely part of any effect. This is an inference from the reviewed limits [S8], [S16], not a number from a source.
- No source read supports a cure or treatment claim. Reviews call them an extra, low-cost option at most [S7], [S12].
- Pure beats and beats hidden under music or noise are both studied. Results do not clearly favor one [S7].
- Effects in clinical-care studies (surgery, dental) do not transfer to a person at a desk. Do not borrow those results.

### A3. Safety notes

| Topic | Note | Source |
|---|---|---|
| Seizure risk | The flash rules for web pages are about light, not sound. The W3C rule says nothing on a page should flash more than three times in any one second, unless below stated thresholds [S17]. Zonked already holds to 3 flashes per second for any full-screen change. | [S17] |
| Seizure and epilepsy with audio | This research did not find a source showing binaural beats cause seizures. One medical-center guide still advises people with seizure disorders to speak to a doctor first [S18]. Zonked copy should say the same in plain words. | [S18] |
| Who should check with a doctor first | The same guide lists three groups: seizure disorders, serious psychiatric diagnoses such as psychosis or bipolar disorder, and sound sensitivity such as tinnitus or hyperacusis [S18]. This is one non-peer-reviewed guide, so treat it as a cautious default. | [S18] |
| Volume | A sleep-music review suggests comfortable volume and 30 to 45 minutes before bed [S11]. Zonked already caps output and fades in slowly. | [S11] |
| Headphones | Two-tone beats need one tone per ear. Speakers cannot make a true binaural beat. Zonked already says this at onboarding. | [S16] (definition: one tone per ear) and repo copy |
| Medical claims | Not a medical device. Never say treat, cure or heal. | repo rules |

Gaps in this research: there is no source here on tinnitus risk from long sessions, and none on children. Keep the 20 to 1500 Hz and 0.5 to 40 Hz limits and the gain cap as they are.

### A4. More honest ways Zonked can be useful

Each idea names the job, a sound or tool Zonked already has, and the evidence label for the benefit. Where the benefit is mostly "calm time" and not beats, the table says so.

| Use | Job to be done | Zonked tool today | Honest evidence |
|---|---|---|---|
| Coding break | Step away after a hard stretch | Crew screen, "Recover" feeling, micro-break family | Mixed for beats. Taking a break is the real help. |
| Focus sprint | One block of work with an end | Timer chips, focus family, Studio Pomodoro | Mixed [S9]. Time-boxing is the likely driver. |
| Wind-down | Switch off after work | After-Work Reset journey | Mixed to weak [S8] |
| Commute | Calm sound on a train or bus | Offline PWA, MediaSession, noise and lo-fi layers | Weak for beats. Speakers or Bluetooth need non-beat sound. Zonked already picks gentle pulses and noise for speakers. |
| Study | Steady attention for a set time | Study goal, Study Sprint Week | Mixed [S9] |
| Breathing | Two to five minutes of paced breath | Breathing ring, "meditation-breath-pacer" family | Better studied than beats. Meta-analyses of breathwork and slow-paced breathing exist [S19], [S20]. One review found that fast-only paces and sessions under 5 minutes were less effective [S21]. I read only snippets, so effect sizes are unchecked. |
| Sleep timer | Fall asleep, then silence | Sleep fade chip (20 min) | Weak [S8], [S11] |
| Shared calm | Two people or a family listen in the same room | None | No evidence. See ideas below. |

Shared calm, kept local and private: a "quiet room" mode that plays pulses and noise on speakers (no beats), with a bigger Stop button and a lower volume cap. No sharing link, no account. This needs no network. It is an idea only. Cost and need are untested.

---

## B. growth.design principles mapped to Zonked

### B1. What was read

| Piece | Used for |
|---|---|
| Principles index [S22] | Confirms the site lists 106 biases and principles in four decision steps. The page body I could read was short, so detailed definitions below come from the case studies. |
| Case study index [S23] | Found the pieces most relevant to onboarding, retention, ethics and calm apps. |
| Headspace onboarding [S24] | Jobs to be done, framing, reciprocity, endowment, asking for little before giving value. |
| Duolingo retention [S25] | Hick's law, happy path, Zeigarnik, streak risk, exit points, notification restraint. |
| Zeigarnik effect [S26] | Zeigarnik, endowed progress, time hostage. |
| Blinkist onboarding [S27] | Respect over data, progressive disclosure, personalization expectations, the "psych" idea. |
| Brave ethical design [S28] | Reciprocity, commitment before value, labor illusion, familiarity. |
| Five onboarding mistakes [S29] | Early notification asks, vague copy, fake scarcity. |
| Hopper permission asks [S30] | User-driven prompts, cognitive load, recommend one action. |
| Spotify Wrapped [S31] | Variable reward, storytelling, framing, delighters. |
| Labor perception bias [S32] | Showing work so users trust a result. |

Not read in detail: peak-end rule, goal gradient, default effect and commitment as stand-alone pieces. They appear below by their usual names. The mapping is my reading, not a growth.design claim.

### B2. Principle to screen map

| Principle | What it says (paraphrase) | Zonked screen or behaviour | Status |
|---|---|---|---|
| Hick's law [S25] | More and busier choices slow decisions. Highlight one option. | Today shows one Daily Session card, then For you (5), Journeys (6), Browse. Keep the card the loudest thing. Starter step shows 3 cards with the first pre-picked. | Partly done. Today below the card is busy. |
| Default effect (general) | People accept the pre-selected option. | First starter pre-selected. Goal pre-set to "Just curious". Keep defaults safe: gentle, low volume, 15 min. | Done. Keep. |
| Endowed progress [S26] | Real early progress lifts completion. Fake progress backfires. | Onboarding "Step n of 5" and week dots. Only count real steps. Do not show a fake head start. | Done for steps. Never fake. |
| Goal gradient (general) | Effort rises as the finish nears. | The step counter in onboarding. A short one-night path in journeys. | Partly done. |
| Zeigarnik [S26], [S25] | Unfinished things nag. Progress bars help completion. | "Day 3 of 7" on journey cards. Use sparingly. Never nag. | Done. Needs an exit point (see C2). |
| Peak-end rule (general) | People judge an experience by its peak and its end. | The end of a session. Fade out, then one calm line. A quiet "Done for now" card. | Missing. See C2. |
| Variable reward [S31] | Surprise rewards please people but can hook them. | A "Surprise me" pick in the library, using real catalog sounds only. No loot, no timers. Keep it light. | Not built. Low priority. |
| Reciprocity [S24], [S28], [S29] | Give value before asking for anything. | Zonked asks for nothing: no account, no notifications, no data. The only ask is the safety notice. | Done. Keep. |
| Commitment before value [S28] | Big asks before value feel pushy. | Do not ask for a streak goal, reminder, or Studio switch before the first sound. | Done. |
| Jobs to be done and framing [S24], [S27] | Ask the user's job. Frame it with positive words. | Goal choices use positive words ("Calm down", "Sleep"). Avoid "Manage anxiety". | Done. |
| Progressive disclosure [S27], [S30] | Hide advanced controls until needed. | Studio is behind a switch. Mix sheet and timers sit in the player. | Done. |
| Personalization expectations [S27] | Asking a question promises the app will use the answer. | The three answers must change the starters. They do, through the recommender. | Done. Test it. |
| Labor illusion [S32], [S28] | Showing work builds trust in a result. | Starter step "Preview" and the fade-in are honest work. Do not add a fake "analyzing" screen. | Done. Avoid fakes. |
| Peak of delight, storytelling [S31] | Warm stories and animation are remembered. | Mascot and breathing ring. Keep them calm and reduced-motion safe. | Done. |
| Exit points [S25] | Let people leave with a sense of completion. | A "Done for now" end card after a session or a journey day. | Missing. See C2. |
| Respecting attention [S25] | Filtering your own nudges builds trust. | No push notifications at all. Reminders stay in-app. | Done. Keep. |
| Respect over data [S27] | Do not ask for tracking before trust. | Local-only storage. "Nothing leaves your computer." | Done. Keep. |

### B3. Rejected patterns (dark patterns and ones that do not fit)

| Pattern | Why Zonked rejects it | Source |
|---|---|---|
| Streak loss, "do not lose your streak" | Growth.design cites a former Duolingo growth lead who said losing a streak is a big reason people quit. Zonked uses days-this-week and rest days that count. | [S25] |
| Guilt copy and shaming | Shaming is rarely a good idea. No "you missed" text. | [S25] |
| Fake urgency, countdown offers, scarcity | Growth.design lists faked scarcity as a dark pattern. Zonked is free, so there is nothing to sell. | [S29] |
| Time hostage, return every few minutes | Training people to return many times a day is an ethics problem. | [S26] |
| Notification pleas, early permission asks | Asking before trust fails. Zonked sends none. | [S29], [S30] |
| Paywalls, ads, accounts, tracking | Out of scope by the project rules. | [S27], repo rules |
| Fake progress or fake "working" screens | Growth.design says fake waits need ethical rules. Zonked avoids them. | [S32], [S26] |
| Social leaderboards, share-to-win | Spotify Wrapped rides social value. Zonked has no network and no sharing. | [S31] |

---

## C. Next five things, ranked

Method: each item is ranked by effect on first-sound speed, fit with the evidence, and size. File paths are under `web/src/ui/calm/` unless stated.

### What already exists (do not repeat)

Read from the code and `docs/UX-SPEC.md`:

- Onboarding of 5 steps with Skip, safety notice, starter step with Preview (`Onboarding.tsx`, `StarterStep.tsx`, `SafetyNotice.tsx`).
- Today with a Daily Session card, "Not this one", week dots, For you row, 6 journeys, library link, crew chip (`Today.tsx`).
- Player with timer chips (15, 30, 60, Until I stop, Sleep fade) (`TimerChips.tsx`, `PlayerScreen.tsx`).
- Favorites, mixes, Recent, milestones, backup, MediaSession, wake lock, shortcuts in `web/src/app/`.
- In-app reminder text only, never a system notification (`web/src/app/milestones.ts`).
- Studio has a focus and break (Pomodoro) timer (`web/src/ui/TimerPanel.tsx`). Calm does not.

### The five, ranked

#### 1. Two-tap start

| Field | Value |
|---|---|
| What | Merge the safety notice into the starter screen, so "Skip, just play" shows one safe default plus the notice and one button. Add a big "Play again" on Today that replays the last session. |
| User problem | The fastest path today is 3 taps and the usual path is 5. People who only want sound wait through questions. |
| Evidence | Hick's law and recommend one action [S25], [S30]. Time to value matters in onboarding [S28]. Asking for little before value [S24]. |
| Ease effect | First sound: 5 taps down to 2 on the skip path. 1 tap for returning users stays. Reading load: the notice is 5 short lines, shown once. |
| Size | S |
| Risk | Hearing safety: the notice must stay required and visible, and the 2 second fade stays. Privacy: none. |
| Files | `Onboarding.tsx`, `SafetyNotice.tsx`, `StarterStep.tsx`, `copy.ts`, `useCalmSession.ts` (gate), `calm.test.tsx` |

#### 2. Done-for-now end card

| Field | Value |
|---|---|
| What | When a session or timer ends, show one calm card: "Done for now." One line of what played and for how long. Buttons: Play again, Close. For a journey day, show the day as done and "See you when you like." |
| User problem | Sessions end without a finish line. Open loops (journey rows, week dots) can feel like a never-ending list. |
| Evidence | Exit points [S25]. Peak-end rule (general). Zeigarnik can be overused [S26]. |
| Ease effect | No extra taps before sound. Adds one read of about 10 words at the end. |
| Size | S |
| Risk | Hearing safety: none. Privacy: none. Copy must avoid guilt and avoid "come back tomorrow" pressure. |
| Files | `PlayerScreen.tsx`, `CalmApp.tsx`, `CalmChrome.tsx`, `copy.ts`, `useCalmSession.ts`, `calm.css` |

#### 3. Local "how did it feel" check

| Field | Value |
|---|---|
| What | After a session, one optional row: Calmer, Same, Not for me. Store it on this device. Use it to nudge For you and the Daily card toward what helped, and away from what did not. Include it in backup and in "Forget my answers". |
| User problem | Evidence for beats is mixed. People differ. Today the app cannot learn what works for one person. |
| Evidence | Personalization is only good when it delivers on the expectation it sets [S27]. The honest evidence label is "mixed", so the user's own signal is the best guide [S8], [S16]. |
| Ease effect | Zero taps before sound. One optional tap after. Gains over time: fewer "Not this one" taps. |
| Size | M |
| Risk | Privacy: local only, schema checked, size capped, no network. Do not show a score. Hearing safety: ranking must never raise intensity above the sensitivity setting. |
| Files | `useCalmData.ts`, `data/` (new field and storage), `Today.tsx`, `web/src/catalog` recommender input, `web/src/app/backup.ts`, `calm.test.tsx` |

#### 4. Focus sprint with break in Calm

| Field | Value |
|---|---|
| What | A "Focus sprint" chip: 25 minutes of sound, a soft chime, then a 5 minute break with calmer sound, then a clear end. It reuses the existing focus-and-break timer. Calm shows it as one chip in the timer row plus one Today card. |
| User problem | Coders and students want time-boxed work, but the timer lives only in Studio. |
| Evidence | Beats for attention are mixed [S9]. Time-boxing and breaks are the likely benefit, not the beat. Say so in the "Why this works" text. |
| Ease effect | One tap from the player or Today. No new settings screen. |
| Size | M |
| Risk | Hearing safety: the break must lower, not raise, the sound. Chimes stay under the gain cap. Flashes: no visual pulse on the switch. Privacy: none. |
| Files | `TimerChips.tsx`, `PlayerScreen.tsx`, `Today.tsx`, `copy.ts`, `web/src/app/timers.ts` (reuse `pomodoro`), `web/src/ui/TimerPanel.tsx` (reference) |

#### 5. Two-minute breathing session

| Field | Value |
|---|---|
| What | A "Breathe" card in Library and Today: a 2 to 5 minute paced breath with the existing ring, soft noise and no beat. A text line replaces the ring under reduced motion. |
| User problem | Many people want a quick reset that is not a long sound session. Breathing has better research support than beats. |
| Evidence | Meta-analyses of breathwork and slow-paced breathing exist [S19], [S20]. One review found sessions under 5 minutes and fast-only paces less effective [S21]. So default to 5 minutes, and do not claim more than "many people find it calming". |
| Ease effect | One tap from Today. Reading load: one line of copy. |
| Size | S to M |
| Risk | Hearing safety: low volume, no beat. Flashes: the ring scales slowly, far below 3 per second, and is static under reduced motion. Privacy: none. |
| Files | `Library.tsx`, `Today.tsx`, `PlayerScreen.tsx`, `web/src/ui/calm/mascot/`, `copy.ts`, template `meditation-breath-pacer` family in `web/src/catalog` |

### Ranking reasons

| Rank | Why here |
|---|---|
| 1 | Biggest cut in taps for the least work. Fixes the first-minute problem. |
| 2 | Small, gentle, and fixes the open-loop feeling that Zeigarnik can cause. |
| 3 | Fits the honest evidence best: the user's own signal beats a claim. Costs more, so it is third. |
| 4 | Serves coders and students directly. Reuses code. |
| 5 | Best evidence base of the five but needs new copy and a no-beat template check. |

### Not chosen, with a reason

| Idea | Why not now |
|---|---|
| Surprise me pick | Variable reward is easy to push too far. Low need. |
| Shared quiet room | Untested, no evidence, extra safety rules. |
| Push reminders | Breaks the no-notification rule and the trust the app builds. |
| Streak chain | Rejected as a dark pattern. |

---

## C6. Ease-of-use audit of the current Calm flow

Read: `Onboarding.tsx`, `StarterStep.tsx`, `Today.tsx`, `CalmApp.tsx`, `TimerChips.tsx`, `copy.ts`, `docs/UX-SPEC.md`. I did not run the app, so timing and layout claims are from code only.

### Tap count from first open to first sound

| Path | Taps | Steps |
|---|---|---|
| Skip path | 3 | Skip, "I understand, start", Start |
| Full default path | 5 | Next (goal), Next (when), Next (listening), "I understand, start", Start |
| Full path with choices | 5 to 8 | Same, plus one tap per changed answer |
| Full path with preview | adds 1 | Preview plays 10 seconds, then stops. Start begins the sound again. |
| Returning user | 1 | Start on the Today card |
| Spec target | 2 on the skip path | The spec says Skip goes to the notice and then a default session. The code goes to the notice and then the starter screen, so it takes one more tap. |

### Friction found

| # | Friction | Where |
|---|---|---|
| 1 | Skip path stops at the starter screen. One extra tap against the spec. | `Onboarding.tsx` (Skip goes to step 4, then step 5) |
| 2 | The safety notice counts as "Step 4 of 5", so it feels like a question. It is a stop sign in the middle. | `Onboarding.tsx` |
| 3 | The listening note is about 30 words. It is the longest text before the first sound. | `copy.ts` (`listenNote`) |
| 4 | Preview then Start restarts the sound, so there is a gap and a repeat fade-in. | `StarterStep.tsx` |
| 5 | Today has four blocks under the main card (goal, For you with 5, Journeys with 6, Browse). The main card is not the only strong element. | `Today.tsx` |
| 6 | "Skip, just play" is a low-weight link under the Next button. It is easy to miss, as a small Skip was missed in the Blinkist example. | `Onboarding.tsx`, [S27] |
| 7 | The goal screen shows six choices at once with "Just curious" pre-picked. A reader may not see that a choice is already set. | `Onboarding.tsx`, `ChoiceGrid.tsx` |
| 8 | No end-of-session card. The sound stops and the user is left on the player. This is not verified in `PlayerScreen.tsx`, which I did not read. | `PlayerScreen.tsx` |
| 9 | Sleep fade is a fixed 20 minutes in a chip row. A person going to bed must open the player first. | `TimerChips.tsx` |

### The five smallest fixes

| # | Fix | Effect | Size |
|---|---|---|---|
| 1 | Make Skip go to the notice and then straight into the first starter, with no starter screen. | Skip path from 3 taps to 2. | S |
| 2 | Show the safety notice as its own screen with no step number, and show steps as "1 of 3" for the three questions. | Less confusion about what the notice is. | S |
| 3 | Shorten `listenNote` to one sentence, such as "Headphones work best for two-tone beats. Speakers suit gentle pulses and noise." | About half the reading. | S |
| 4 | Do not stop the preview sound when Start is tapped. Hand the running sound to the session. | No gap, no second fade-in. | S |
| 5 | Make "Skip, just play" a full secondary button, and mark the pre-picked goal with a visible check and the word "Selected". | Easier to find. Clear defaults. | S |

All five keep the safety notice and the fade-in unchanged.

---

## Open questions and limits

- No real user has been tested. All tap counts and friction come from reading code.
- Effect sizes were taken from abstracts and snippets. The full text of the meta-analyses was not read. Do not quote numbers in the app.
- The breathing sources were read as titles and snippets only.
- Peak-end, goal gradient and default effect were not read in a growth.design piece. They are labeled "general".
- One safety guide [S18] is not peer reviewed. Confirm with a clinician before making a health statement.

## Sources

| ID | Name | URL |
|---|---|---|
| S1 | Barratt et al., Who uses digital drugs? Survey of binaural beat consumers (Drug and Alcohol Review, 2022), USC repository | https://research.usc.edu.au/esploro/outputs/journalArticle/Who-uses-digital-drugs-An-international/99622140802621 |
| S2 | ScienceDaily, Audio files are being used as digital drugs, survey suggests | https://www.sciencedaily.com/releases/2022/03/220330130520.htm |
| S3 | Verified Market Research, Sleep Sound Music Apps Market | https://www.verifiedmarketresearch.com/product/sleep-sound-music-apps-market/ |
| S4 | Verified Market Research, Binaural Beats Headphones Market | https://www.verifiedmarketresearch.com/product/binaural-beats-headphones-market/ |
| S5 | Google Play, Binaural Beats Therapy listing (study music brainwave app) | https://play.google.com/store/apps/details?hl=fr&id=studymusic.brainwave.binauralbeats |
| S6 | Garcia-Argibay et al., Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis (Psychological Research, 2019) | https://link.springer.com/10.1007/s00426-018-1066-8 |
| S7 | The Efficiency of Binaural Beats on Anxiety and Depression: A Systematic Review (Applied Sciences, 2024) | https://www.mdpi.com/2076-3417/14/13/5675 |
| S8 | Music and binaural beat interventions for young adults: a systematic review of effects on anxiety, sleep, and cognition (PubMed) | https://pubmed.ncbi.nlm.nih.gov/41656644/ |
| S9 | Basu and Banerjee, Potential of binaural beats intervention for improving memory and attention (Psychological Research, 2023) | https://pubmed.ncbi.nlm.nih.gov/35842538/ |
| S10 | Binaural beats at 0.25 Hz shorten the latency to slow-wave sleep during daytime naps (Scientific Reports, 2024) | https://pmc.ncbi.nlm.nih.gov/articles/PMC11525714/ |
| S11 | Elements of music that work to improve sleep, a narrative review (Frontiers in Sleep) | https://frontiersin.org/journals/sleep/articles/10.3389/frsle.2025.1707162/full |
| S12 | Does brain entrainment using binaural auditory beats affect pain perception in acute and chronic pain? A systematic review (BMC CAM, 2024) | https://link.springer.com/article/10.1186/s12906-024-04339-y |
| S13 | Binaural beats for perioperative anxiety and pain: systematic review and meta-analysis (PubMed) | https://pubmed.ncbi.nlm.nih.gov/41176178/ |
| S14 | Effectiveness of binaural beats in reducing dental pain and anxiety: systematic review and meta-analysis (PMC) | https://pmc.ncbi.nlm.nih.gov/articles/PMC12451561/ |
| S15 | The efficacy of sensory neural entrainment on acute and chronic pain: systematic review and meta-analysis (PubMed) | https://pubmed.ncbi.nlm.nih.gov/37057253/ |
| S16 | Ingendoh et al., Binaural beats to entrain the brain? A systematic review (PLoS ONE, 2023) | https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286023 |
| S17 | W3C, Understanding Success Criterion 2.3.1: Three Flashes or Below Threshold | https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold |
| S18 | Sterling Medical Center, Brainwave Audio Safety Guide 2026 | https://www.sterlingmedicalcenter.org/brain-health/brainwave-audio-safety-guide-2026-who-should-and-shouldnt-use-it/ |
| S19 | Effect of breathwork on stress and mental health: a meta-analysis of randomised-controlled trials (PubMed) | https://pubmed.ncbi.nlm.nih.gov/36624160/ |
| S20 | The effect of slow-paced breathing on cardiovascular and emotion functions: meta-analysis and systematic review (Mindfulness) | https://link.springer.com/article/10.1007/s12671-023-02294-2 |
| S21 | Breathing practices for stress and anxiety reduction: implementation guidelines from a systematic review (Brain Sciences, 2023) | https://www.mdpi.com/2076-3425/13/12/1612 |
| S22 | growth.design, 106 cognitive biases and principles | https://growth.design/psychology |
| S23 | growth.design, case studies index | https://growth.design/case-studies |
| S24 | growth.design, How to properly apply jobs-to-be-done to user onboarding (Headspace) | https://growth.design/case-studies/headspace-user-onboarding |
| S25 | growth.design, Duolingo's user retention: 8 tactics | https://growth.design/case-studies/duolingo-user-retention |
| S26 | growth.design, Zeigarnik effect | https://growth.design/case-studies/zeigarnik-effect |
| S27 | growth.design, One simple psychology framework to improve your onboarding (Blinkist) | https://growth.design/case-studies/blinkist-user-onboarding |
| S28 | growth.design, Chrome vs Brave: ethical design | https://growth.design/case-studies/brave-browser-onboarding |
| S29 | growth.design, 5 deadly onboarding mistakes | https://growth.design/case-studies/5-product-onboarding-mistakes-to-avoid |
| S30 | growth.design, How Hopper nails permission requests UX | https://growth.design/case-studies/hopper-permission-requests-ux |
| S31 | growth.design, Spotify Wrapped: 6 psychology principles | https://growth.design/case-studies/spotify-wrapped-psychology |
| S32 | growth.design, Labor perception bias | https://growth.design/case-studies/labor-perception-bias |

Content was rephrased for compliance with licensing restrictions.
