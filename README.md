# JetLager

JetLager is a React + Vite flight-aware jet-lag planning tool. It combines a traveler's normal sleep pattern, origin and destination airport time zones, local departure and landing times, and chronotype preferences to create a compact pre-flight, in-flight, and post-flight plan.

The application runs entirely in the browser. There is no API server, database, account system, or persisted user profile.

## Features

- Blank-first workflow: no route or plan is generated until the user submits the form.
- Worldwide airport selection using IATA airport codes internally and city/country labels in the UI.
- Curated airport overrides for important routes plus the OpenFlights airport dataset for broad worldwide coverage.
- Local departure and landing times with quarter-hour increments (`00`, `15`, `30`, `45`).
- Ticket scanning:
  - Image uploads are read with Tesseract OCR.
  - PDF uploads are read through their text layer when available.
  - The first two detected times populate departure and landing for user confirmation.
- Optional sleep-pattern choices:
  - Early Sleeper: `9pm - 5am`
  - On Time: `11pm - 7am`
  - Night Owl: `1am - 9am`
- Advanced editable bedtime and wake-time fields in AM/PM format.
- International-flight option to reserve four hours for commute and immigration before departure.
- In-flight timeline showing departure, onboard sleep, wake, and landing.
- Two schedule sections:
  - Before flight, in origin-local time.
  - After flight, with suggested times in destination-local time and the origin body-clock reference translated to destination time.
- Interactive sleep comparison bars with tap/click tooltips.
- Optional Seek light and Avoid light overlays on the Suggested timeline.
- Collapsed daylight comparison chart for origin and destination.
- Responsive desktop and mobile layouts.

## Quick Start

Requirements:

- Node.js 18 or newer recommended.
- npm.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173/`.

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Validation Commands

The repository does not currently define an npm `test` script. Run the focused Vitest file directly:

```bash
npx vitest run src/App.test.js
```

Run linting with:

```bash
npm run lint
```

Run the production build as the fastest JSX and bundling check:

```bash
npm run build
```

## User Flow

1. Select an origin and destination airport.
2. Enter local departure and landing times.
3. Optionally choose a normal sleep pattern.
4. Optionally expand Advanced options and type a normal bedtime and wake time.
5. For international routes, optionally enable the four-hour commute/immigration buffer in Before flight.
6. Click Get My Plan.
7. Review the flight timeline, protocol, Before flight schedule, and After flight schedule.
8. Toggle Seek light or Avoid light to reveal those windows on the Suggested timeline.

The form is intentionally blank on initial load. Required route and flight inputs prevent an incomplete plan from being submitted.

## Project Structure

```text
.
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── logo.png
└── src/
    ├── App.jsx
    ├── App.css
    ├── App.test.js
    ├── index.css
    ├── main.jsx
    └── data/
        └── jetlag.js
```

### `src/App.jsx`

Owns the form and presentation layer:

- Form state and blank initial state.
- Airport selects and swap action.
- Flight-time inputs and ticket scanning.
- Chronotype selection and Advanced options.
- Results cards, flight timeline, sleep timelines, light toggles, and daylight chart.

The component calls `computeJetLagPlan(form)` with `useMemo`. Presentation components are kept in this file because the app is currently a small single-screen experience.

### `src/data/jetlag.js`

Owns the calculation and location data layer:

- `CHRONOTYPE_PRESETS` contains the three sleep-pattern presets.
- `CITY_LOOKUP` merges the curated route lookup with `airport-data/airports.json`.
- Time conversion helpers use internal `HH:mm` values and display AM/PM labels.
- `getNetOffsetHours` computes the normalized destination-minus-origin UTC offset.
- `computeJetLagPlan` produces flight duration, direction, schedule windows, light windows, and in-flight protocol text.
- `getFlightsForReturn` swaps the route for the return-flight action.

### `src/App.test.js`

Contains focused Vitest coverage for:

- Time-zone offset direction.
- HYD to JFK flight duration and schedule construction.
- Four-hour international commute adjustment.
- Seek-light and avoid-light placement.
- Chronotype effects on pre-flight and onboard sleep timing.

## Calculation Model

### Flight duration

Departure and landing are entered as local airport times. The calculation converts each to UTC using the airport's fixed `utcOffset`:

```text
departureUtc = departureLocal - originOffset
arrivalUtc   = arrivalLocal - destinationOffset
```

If arrival is not later than departure, one day is added to arrival. The difference is the elapsed flight duration.

### Time-zone shift

```text
rawDelta = destinationUtcOffset - originUtcOffset
netShift = normalized rawDelta in the range [-12, 12)
```

Positive shifts are treated as eastward travel; negative shifts are treated as westward travel.

### Sleep duration

Normal sleep duration is calculated from the user's bedtime and wake time, including overnight wrap:

```text
sleepDuration = (wakeMinutes - bedMinutes + 1440) mod 1440
```

### Before-flight schedule

The pre-flight wake time is the departure time minus either:

- 90 minutes for the normal case, or
- 4 hours when the international commute/immigration checkbox is enabled.

The pre-flight bedtime is calculated backward from that wake time using normal sleep duration and chronotype phase offset.

Chronotype phase offsets currently shift the plan by:

- Early Sleeper: 2 hours earlier.
- On Time: no additional shift.
- Night Owl: 2 hours later.

### After-flight schedule

The current UI intentionally shows one representative post-landing window. Its target bedtime begins from the normal bedtime and applies the direction-aware phase shift. The origin sleep window is translated into destination-local clock time for comparison.

### Light guidance

The current rule is intentionally simple and direction-independent:

- Seek outdoor light for four hours after the suggested wake time.
- Avoid bright light for four hours before the suggested bedtime.

These windows can be toggled independently and appear as overlays on the Suggested timeline.

### In-flight protocol

The onboard sleep window is calculated from elapsed flight duration and shifted by chronotype. It ends approximately two hours before landing to leave time for waking, hydration, and arrival preparation.

## Time and Time-zone Assumptions

- User-entered departure and landing values are local to their respective airports.
- Airport offsets come from the bundled airport dataset or curated fixed overrides.
- The current model uses fixed UTC offsets, not date-specific daylight-saving transitions.
- The flight-duration fallback assumes landing occurs on the same or following calendar day and adds 24 hours when needed.
- The app does not validate whether the selected flight schedule is commercially realistic.

For production-grade scheduling, replace fixed offsets with date-aware IANA time-zone calculations and include a travel date in the input model.

## Airport Data

`airport-data` provides the OpenFlights Airports Database as JSON. At module load, airport records with an IATA code, city, country, airport type, and numeric timezone offset are converted into the lookup used by the selects.

Curated records are merged after the dataset so important airports retain the app's preferred city, state, country, and offset values.

Because the complete airport JSON is bundled into the client, production builds are large. A future optimization could generate a reduced application-specific airport index or load airport data asynchronously.

## Ticket Scanning

`Tesseract.js` is used for image OCR in the browser. The scanner:

1. Reads the selected image.
2. Extracts text with the English OCR worker.
3. Finds values matching a simple `HH:MM` or `HH.MM` pattern.
4. Uses the first two matches as departure and landing candidates.
5. Leaves final confirmation to the user.

PDF handling currently reads the file as text. Scanned/image-only PDFs may not produce usable text and should fall back to manual entry.

## Design Notes

- The page is intentionally a working planning tool rather than a marketing landing page.
- Results are hidden until the form is submitted.
- The primary schedule UI uses two cards to keep the workflow scannable: Before flight and After flight.
- Overnight windows are split into an explicit After midnight row.
- Tooltips work on hover/focus and can be toggled by tapping the bar on touch devices.
- The daylight chart is collapsed by default to keep the main plan compact.

## Safety and Scope

JetLag Sync is an informational planning aid, not medical advice. Circadian responses vary by person, medication, age, health condition, and trip context. Travelers should use judgment and consult a qualified clinician for health-specific guidance.