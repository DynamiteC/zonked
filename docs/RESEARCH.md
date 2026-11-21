# Research notes

Zonked is a free sound sanctuary. It is not a medical device. It does not diagnose, treat or cure anything.
Everything below says "may support". Evidence is small to medium at best and often mixed.

The ids S1 to S16 are used in `web/src/catalog/bands.ts`. Shipped code holds ids only, never URLs.
Author lists and journals below were checked against the Europe PMC index (rest API) on 2026-11-21.

## Honest summary

- Binaural beats: a 2019 meta-analysis found a medium average effect (g 0.45) on memory, attention, anxiety and pain. Study quality varies a lot and many individual trials are null.
- Entrainment (the brain "following" the beat) is disputed. A 2023 systematic review found inconsistent EEG results.
- Steady pink noise has small sleep studies. Pink noise timed to sleep brain waves needs EEG equipment and is a different thing from steady noise.
- Calm music and sound can lower reported anxiety in some trials. Taste matters.
- Violet noise and lo-fi music: little or no direct research. They are offered as preference, not as therapy.

## Band guide (as shown in the app)

| Band | Beat range | May support | Evidence label | Sources |
|---|---|---|---|---|
| Delta | 0.5-4 Hz | rest and sleep | limited | S8, S12 |
| Theta | 4-8 Hz | meditation, drowsy calm | preliminary | S2, S12 |
| Alpha | 8-13 Hz | stress relief, relaxed focus | mixed | S1, S6, S11 |
| Beta | 13-30 Hz | alert focus | mixed | S1, S4, S7 |
| Gamma | 30-40 Hz | alert attention (experimental) | limited | S2, S12 |

Labels are the author's reading of abstracts, not a claim by the studies. Strong evidence is not claimed for any band.

## Sources (verified)

| Id | Citation | URL |
|---|---|---|
| S1 | Garcia-Argibay M, Santed MA, Reales JM. Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis. Psychol Res 2019;83:357-372. | https://pubmed.ncbi.nlm.nih.gov/30073406/ |
| S2 | Chaieb L, Wilpert EC, Reber TP, Fell J. Auditory beat stimulation and its effects on cognition and mood states. Front Psychiatry 2015;6:70. | https://pmc.ncbi.nlm.nih.gov/articles/PMC4428073/ |
| S3 | Wahbeh H, Calabrese C, Zwickey H, Zajdel D. Binaural beat technology in humans: a pilot study to assess neuropsychologic, physiologic, and electroencephalographic effects. J Altern Complement Med 2007;13:199-206. | https://pubmed.ncbi.nlm.nih.gov/17388762 |
| S4 | Lane JD, Kasian SJ, Owens JE, Marsh GR. Binaural auditory beats affect vigilance performance and mood. Physiol Behav 1998;63:249-252. | https://pubmed.ncbi.nlm.nih.gov/9423966 |
| S5 | Le Scouarnec RP, Poirier RM, Owens JE, Gauthier J, Taylor AG, Foresman PA. Use of binaural beat tapes for treatment of anxiety: a pilot study of tape preference and outcomes. Altern Ther Health Med 2001;7:58-63. | https://pubmed.ncbi.nlm.nih.gov/11191043/ |
| S6 | Padmanabhan R, Hildreth AJ, Laws D. A prospective, randomised, controlled study examining binaural beat audio and pre-operative anxiety in patients undergoing general anaesthesia for day case surgery. Anaesthesia 2005;60:874-877. | https://pubmed.ncbi.nlm.nih.gov/16115248/ |
| S7 | Goodin P, Ciorciari J, Baker K, Carey AM, Harper M, Kaufman J. A high-density EEG investigation into steady state binaural beat stimulation. PLoS One 2012;7:e34789. (No vigilance or cortical power change versus a white-noise control.) | https://pubmed.ncbi.nlm.nih.gov/22496862/ |
| S8 | Zhou J, Liu D, Li X, Ma J, Zhang J, Fang J. Pink noise: effect on complexity synchronization of brain activity and sleep consolidation. J Theor Biol 2012;306:68-72. | https://pubmed.ncbi.nlm.nih.gov/22726808 |
| S9 | Papalambros NA, Santostasi G, Malkani RG, Braun R, Weintraub S, Paller KA, Zee PC. Acoustic enhancement of sleep slow oscillations and concomitant memory improvement in older adults. Front Hum Neurosci 2017;11:109. (Closed-loop EEG, not steady noise.) | https://pubmed.ncbi.nlm.nih.gov/28337134/ |
| S10 | Papalambros NA et al. Acoustic enhancement of sleep slow oscillations in mild cognitive impairment. Ann Clin Transl Neurol 2019;6:1191-1201. Also Schade MM et al. Nat Sci Sleep 2020;12:411-429 (non-phase-locked pink noise, mixed) and Vickrey B, Lerner I. Front Hum Neurosci 2023;17:1302836 (overnight pink noise may hurt insight). | https://pubmed.ncbi.nlm.nih.gov/31353857/ ; https://pmc.ncbi.nlm.nih.gov/articles/PMC7364346 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC10722168/ |
| S11 | Mallik A, Russo FA. The effects of music and auditory beat stimulation on anxiety: a randomized clinical trial. PLoS One 2022;17:e0259312. | https://pmc.ncbi.nlm.nih.gov/articles/PMC8906590/ |
| S12 | Ingendoh RM, Posny ES, Heine A. Binaural beats to entrain the brain? A systematic review. PLoS One 2023;18:e0286023. | https://pmc.ncbi.nlm.nih.gov/articles/PMC10198548/ |
| S13 | Chaieb L, Wilpert EC, Hoppe C, Axmacher N, Fell J. The impact of monaural beat stimulation on anxiety and cognition. Front Hum Neurosci 2017;11:251. | https://pmc.ncbi.nlm.nih.gov/articles/PMC5430051/ |
| S14 | Hou H, Wang J, Yue X. The impact of sound intervention on sleep quality and stress levels in college students: a randomized controlled trial. Front Psychol 2026;17:1859138. | https://pmc.ncbi.nlm.nih.gov/articles/PMC13318881/ |
| S15 | Elnazer HY. Music and binaural beat interventions for young adults: a systematic review of effects on anxiety, sleep, and cognition. Acta Neuropsychiatr 2026;38:e15. | https://pmc.ncbi.nlm.nih.gov/articles/PMC13130302/ |
| S16 | Weiland TJ et al. Original sound compositions reduce anxiety in emergency department patients: a randomised controlled trial. Med J Aust 2011;195:694-698. | https://pubmed.ncbi.nlm.nih.gov/22171868/ |

Dropped: the first Wahbeh 2007 record (PubMed 17309374), which was not checked against the index. No Cochrane review is cited: none was found and checked, so none is claimed. Kennel and Taylor are not cited for the same reason.
The earlier plan named "Vernon 2012" for S7. The index shows the first author is Goodin. The plan name was wrong and is corrected here.

## Safety wording used in the app

"Not a medical device. May not work for everyone. Binaural beats need stereo headphones. Stop if you feel uncomfortable. If you have epilepsy, a hearing condition or a diagnosis, ask a clinician first."
