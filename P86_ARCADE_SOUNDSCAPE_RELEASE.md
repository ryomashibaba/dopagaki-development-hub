# P86 — ARCADE SOUNDSCAPE, opt-in experimental audio

Date: 2026-10-17 JST. Scope: browser audio, no game physics modification.

## Visible change
- The 3D trial has an explicit **音楽・効果音：OFF/ON** control (default OFF, respecting autoplay/browser policies).
- Clicking ON starts a fully original Web Audio procedural piece at **134 BPM**, with a roughly 2.2-second atmospheric introduction, six-note minor-key motif (E G B A F# D), pulsing low-end and speed-reactive high-register notes.
- Native B48 Runner events trigger short synthesized NEAR MISS, natural jump (only from GAP_TAKEOFF), true landing (GAP_LANDING), course clear and failure cues.
- The sound is original and does not use Suno material, copyrighted media files, background network requests, downloaded MP3 or external assets.
- P86 is a first-pass synthesizer, **not** the later user-approved Suno v6 BGM or a mastered AAA audio mix.

## User consent, pause and performance
- A user click is required before constructing or resuming the AudioContext.
- Browser refusal / missing Web Audio leaves the entire real physics/gameplay operating normally, with UI reporting audio unavailable.
- Muting suspends audio. Pause/hidden-tab fades channel to zero and stops additional melody scheduling; restart resets musical sequence. Genuine ending effects get a short tail without restarting the soundtrack.
- Audio runs on the browser audio timeline with a short ≤170ms look-ahead and an absolute maximum of 3 scheduling steps per render; it does not start extra physics ticks or invoke the Runner.
- All synthesis uses stock oscillators/envelopes in Web Audio; no outside SDKs, no audio worklets, no geometry changes, and no new input mappings.

## Safety
- B45 fixture constants, B48 physics/CCD, B51-C moving obstacles, all 4 SHA-frozen P62 authored stages, P76 physical return, P77 83-second native full acceptance, P78–P85 gameplay and renderer stay unchanged.
- Physics chat's separate PR #1 remains Draft/HOLD and must not be imported until properly approved.
- Sound does not alter scoring, survival clock, NEAR MISS detection, steering, speed, camera lock, frame quality or replay.
- Original mix loudness and subjective player feedback remain unverified; users can mute at any time.

## Validation
- Node tests cover original six-note motif, two-second introduction, no sound before click, pause/suspend/visibility, bounded event scheduling, unsupported Web Audio, and strict B48 native Runner invariance.
- Chromium tests check user-gesture enable/mute, pause, restart, old P62 stage compatibility and unsupported AudioContext fallback without runtime errors.
- Release only with PR QA + Chromium and the main QA/browser/publish/verify-public pipeline matching exact commit and P86 version.
