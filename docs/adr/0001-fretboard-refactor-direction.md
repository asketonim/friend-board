# ADR 0001: Fretboard refactor direction

Status: Accepted
Date: 2026-09-30

## Context

The app currently combines live microphone pitch detection, stable note selection, scale overlay controls, and fretboard rendering in a small Next.js client UI.

Relevant code at the time of this decision:

- `src/app/page.tsx` owns page-level state and wires recording, stable detected notes, scale controls, and `Fretboard` props.
- `src/components/Fretboard.tsx` renders the fretboard grid and currently computes note highlight, scale membership, label visibility, and CSS class precedence inline.
- `src/music/notes.ts` contains note, MIDI, frequency, tuning, and fretboard-position primitives.
- `src/music/scales.ts` contains scale type definitions and scale overlay construction.
- `src/music/useStableDetectedNotes.ts` stabilizes noisy frequency samples into detected notes.
- `src/recording/useRecorder.ts` owns microphone/session lifecycle and per-animation-frame pitch sampling.
- `src/recording/pitchDetection.ts` contains the current simple pitch detection algorithm.

The latest scale overlay work made the app more useful, but it also increased component responsibility. The goal of the next refactor is not to redesign the product. The goal is to make current behavior easier to read, preserve, and extend.

## Decision

### 1. Keep `Home` as the state owner for now

Selected option: `1A` — keep `src/app/page.tsx` as the owner of app state and extract presentational panels.

`Home` should continue to own:

- recording start/stop state from `useRecording`
- stable detected notes from `useStableDetectedNotes`
- note-label visibility
- scale visibility
- selected scale root
- selected scale type
- derived `scaleOverlay`

Rationale:

- Current state is local to one screen.
- There is no demonstrated need for global state, context, or a reducer yet.
- Extracting presentational components gives most of the readability gain with less abstraction.

Refactor implication:

- Prefer components like `RecordingControls`, `DisplayOptions`, and `ScaleControls` that receive state and callbacks as props.
- Do not introduce global state, app context, Zustand, Redux, or a page reducer unless later behavior makes state transitions genuinely complex.

### 2. Keep detection status removed for now

Selected option: `2C` — intentionally remove live detection status from the UI for now.

The UI should not restore the previous detected-note/status block during this refactor.

Rationale:

- Product direction currently favors a cleaner fretboard-first surface.
- Live detection feedback can be revisited later with a deliberate design instead of restoring old text by inertia.

Refactor implication:

- `Home` does not need to consume `activeNote`, `isSignalActive`, or `hasDetectedNote` unless another visible feature needs them.
- `useStableDetectedNotes` may keep returning these fields because they are useful domain state, but consumers should not be forced to display them.
- Do not add a `DetectionStatus` component in this refactor.

### 3. Introduce named fretboard visual state now; split component later if needed

Selected option: `3B + C in the future` — introduce named cell visual state now, and consider component splitting later.

`Fretboard` should stop relying on a wide boolean argument list to determine note classes. Instead, it should compute a named state per fretboard position.

Target concept:

```ts
type FretboardCellVisualState =
  | "hidden"
  | "normal"
  | "dimmedByDetectedNote"
  | "scaleMuted"
  | "scaleMember"
  | "scaleRoot"
  | "detectedExact"
  | "detectedOutOfScale"
```

Exact names may change during implementation, but the invariant should remain: visual precedence is explicit and named.

Current precedence to preserve unless deliberately changed:

1. hidden note labels when no state requires visibility
2. played note that is outside the active scale
3. exact detected note
4. scale root
5. scale member
6. non-scale note muted by active scale
7. note dimmed because another detected note is active
8. normal visible note

Rationale:

- `getNoteClassName` currently accepts many booleans and encodes precedence implicitly.
- Named visual states make the logic readable and testable.
- This creates a better seam for later UX changes, including future `FretboardNote` or `FretboardCell` extraction.

Refactor implication:

- First extract pure visual-state computation.
- Then map visual state to CSS classes.
- Only split subcomponents after the state model is clear; avoid splitting JSX without reducing decision complexity.

### 4. Keep sharp-only scale roots

Selected option: `4A` — keep sharp-only roots for now.

Scale root selection continues to use `SHARP_NOTE_NAMES` from `src/music/notes.ts`.

Rationale:

- The app already uses sharp pitch-class names as its canonical note spelling.
- Flat/enharmonic spelling is a real music-product decision, not a cleanup task.
- Adding flats now would expand UI, model, and test scope without being required for the current refactor.

Refactor implication:

- Do not add flat roots or enharmonic spelling in this refactor.
- It is acceptable to introduce small pitch-class helpers if they reduce duplicated modulo/index logic.
- Any future flats work should be its own ADR or explicit product decision.

### 5. Keep current pitch detection algorithm, isolate its contract

Selected option: `5C` — isolate the detector contract and improve the algorithm later.

The current `detectPitch(samples, sampleRate)` algorithm should not be changed as part of the UI/code-structure refactor.

Rationale:

- Pitch-detection accuracy is a separate DSP problem.
- Mixing detector changes with UI refactoring would make regressions harder to attribute.
- The current detector already has a simple contract and basic tests.

Refactor implication:

- Keep `src/recording/pitchDetection.ts` as the algorithm boundary.
- Preserve the return contract: detected frequency in hertz or `null`.
- If `useRecorder` is refactored, it should still depend on that contract, not on algorithm internals.
- Future pitch work can replace the implementation behind the same function or introduce a clearly named detector abstraction.

### 6. Store ADRs under `docs/adr`

Selected option: `6A` — use `docs/adr/0001-fretboard-refactor-direction.md`.

Rationale:

- ADRs are long-lived decision records, not user-facing product docs.
- Numbered files preserve chronology.
- This path is easy for future agents and contributors to discover.

## Non-goals for the next refactor

- Do not add global state management.
- Do not restore live detected-note/status UI.
- Do not add flat/enharmonic scale names.
- Do not change pitch detection behavior.
- Do not redesign visual styling beyond preserving existing behavior through clearer code.
- Do not add tests just to assert implementation wiring.

## Expected next refactor sequence

1. Keep `Home` state ownership unchanged.
2. Extract presentational controls from `src/app/page.tsx`:
   - recording controls
   - note-label display option
   - scale controls
3. Introduce named fretboard cell visual state in or near `src/components/Fretboard.tsx`.
4. Preserve current visual behavior while making precedence explicit.
5. Add focused tests only if the extracted visual-state function becomes pure and valuable to lock down.
6. Run `npm test` and `npm run lint`.
7. Smoke-test the actual page in the browser.

## Reference invariants

- `Home` owns state; extracted components are controlled/presentational.
- `Fretboard` receives detected notes, label visibility, and optional scale overlay.
- Scale overlay remains optional; no scale means ordinary note-label/detection behavior.
- Live detection should still visually highlight notes on the fretboard.
- Active scale should still make scale members visible and mute non-scale notes.
- A detected note outside the active scale should remain visually distinct.
- Sharp note names remain the canonical display and scale-root spelling.
