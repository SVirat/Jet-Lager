import { useEffect, useMemo, useState } from 'react'
import { createWorker } from 'tesseract.js'
import './App.css'
import {
  CHRONOTYPE_PRESETS,
  CITY_LOOKUP,
  computeJetLagPlan,
  formatCompactTime,
  formatTime12,
  getFlightsForReturn,
  parseTime12,
  toMinutes,
  toTimeString,
} from './data/jetlag'

const cityOptions = Object.entries(CITY_LOOKUP)

function cityOptionLabel(city) {
  if (city.state) return `${city.city}, ${city.state}`
  return city.country ? `${city.city}, ${city.country}` : city.city
}

const initialForm = {
  originCity: '',
  destinationCity: '',
  chronotype: '',
  baselineBedtime: '',
  baselineWakeTime: '',
  flightDetails: {
    hasFlightTimes: true,
    takeoffTime: '',
    landingTime: '',
    considerCommuteTime: false,
  },
}

function ChronotypeSelector({ value, onChange }) {
  return (
    <div className="chronotype-group" role="radiogroup" aria-label="Chronotype preset">
      {Object.values(CHRONOTYPE_PRESETS).map((preset) => (
        <button
          key={preset.id}
          type="button"
          className={`chip ${value === preset.id ? 'active' : ''}`}
          onClick={() => onChange(preset.id)}
          aria-pressed={value === preset.id}
        >
          <span className="chip-icon" aria-hidden="true">{preset.icon}</span>
          <span className="chip-copy">
            <strong>{preset.label}</strong>
            <small>{formatCompactTime(preset.bedtime)} - {formatCompactTime(preset.wakeTime)}</small>
          </span>
        </button>
      ))}
    </div>
  )
}

function TimeInput({ label, value, onChange }) {
  const [draft, setDraft] = useState(value ? formatTime12(value) : '')

  useEffect(() => setDraft(value ? formatTime12(value) : ''), [value])

  const commit = () => {
    const parsed = parseTime12(draft)
    if (parsed) {
      onChange(parsed)
      setDraft(formatTime12(parsed))
    } else {
      setDraft(value ? formatTime12(value) : '')
    }
  }

  return (
    <label className="time-input-wrap">
      <span className="slider-label-row">
        <span>{label}</span>
      </span>
      <input
        type="text"
        inputMode="text"
        placeholder="11:00 PM"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => event.key === 'Enter' && commit()}
        aria-label={label}
      />
    </label>
  )
}

function FlightTimeInput({ label, value, onChange }) {
  const snapToQuarterHour = (timeValue) => {
    if (!timeValue) return
    const [hours, minutes] = timeValue.split(':').map(Number)
    onChange(toTimeString((hours * 60) + (Math.round(minutes / 15) * 15)))
  }

  return (
    <label className="flight-time-field">
      <span>{label} <small className="local-time-note">(local time)</small></span>
      <input
        type="time"
        step="900"
        required
        value={value}
        onChange={(event) => snapToQuarterHour(event.target.value)}
        aria-label={label}
      />
    </label>
  )
}

function formatDuration(minutes) {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

function getClockSegments(start, duration) {
  const end = start + duration
  if (end <= 100) return [{ left: start, width: duration }]
  return [
    { left: start, width: 100 - start },
    { left: 0, width: end - 100 },
  ]
}

function ClockBar({ className, segments, label, active, onToggle, overlays = [] }) {
  return (
    <button
      type="button"
      className={`clock-track ${className} ${active ? 'active' : ''}`}
      onClick={onToggle}
      aria-label={label}
      aria-expanded={active}
    >
      {segments.map((segment, segmentIndex) => (
        <span key={`main-${segmentIndex}`} className="clock-band primary-band" style={{ left: `${segment.left}%`, width: `${segment.width}%` }} />
      ))}
      {overlays.map((overlay) => overlay.segments.map((segment, segmentIndex) => (
        <span key={`${overlay.className}-${segmentIndex}`} className={`clock-band ${overlay.className}`} style={{ left: `${segment.left}%`, width: `${segment.width}%` }} />
      )))}
      <span className="clock-tooltip" role="status">{label}</span>
    </button>
  )
}

function TravelTimeline({ plan }) {
  const originCode = plan.inputs.originCity
  const destinationCode = plan.inputs.destinationCity
  const origin = CITY_LOOKUP[originCode] || { city: originCode }
  const destination = CITY_LOOKUP[destinationCode] || { city: destinationCode }
  const duration = plan.computed.flightDurationMinutes
  const takeoff = toMinutes(plan.inputs.flightDetails.takeoffTime)
  const sleepDuration = Math.min(8 * 60, Math.max(90, duration - 4 * 60))
  const sleepEnd = Math.max(90, duration - 2 * 60)
  const chronotypeOffset = plan.inputs.chronotype === 'EARLY' ? -2 * 60 : plan.inputs.chronotype === 'NIGHT_OWL' ? 2 * 60 : 0
  const sleepStart = Math.max(45, sleepEnd - sleepDuration + chronotypeOffset)
  const markers = [
    { at: 0, label: 'Depart', tone: 'depart' },
    { at: Math.round(sleepStart), label: 'Sleep now', tone: 'sleep' },
    { at: Math.round(sleepStart + sleepDuration), label: 'Wake now', tone: 'light' },
    { at: duration, label: 'Land', tone: 'land' },
  ]

  return (
    <div className="timeline-panel">
      <div className="timeline-header">
        <div>
          <h3>Flight timeline</h3>
          <p className="section-note">Action windows are anchored to your actual flight duration.</p>
        </div>
        <span>{formatDuration(duration)} in transit</span>
      </div>
      <div className="flight-track" aria-label="Flight action timeline">
        <div className="flight-track-line" />
        <div
          className="flight-action-window"
          style={{ left: `${(sleepStart / duration) * 100}%`, width: `${(sleepDuration / duration) * 100}%` }}
          aria-label="Recommended onboard sleep window"
        />
        {markers.map((marker) => (
          <div key={marker.label} className={`flight-marker ${marker.tone}`} style={{ left: `${(marker.at / duration) * 100}%` }}>
            {(marker.tone === 'sleep' || marker.tone === 'light') && <span className="marker-dot" />}
            <strong>{marker.label}</strong>
            <small className="marker-time">{formatTime12(toTimeString(takeoff + marker.at))}</small>
          </div>
        ))}
        <div className="flight-track-labels">
          <span>{origin.city} / {formatTime12(plan.inputs.flightDetails.takeoffTime)}</span>
          <span>{destination.city} / {formatTime12(plan.inputs.flightDetails.landingTime)}</span>
        </div>
      </div>
    </div>
  )
}

function DaylightChart({ plan }) {
  const origin = CITY_LOOKUP[plan.inputs.originCity] || { city: plan.inputs.originCity, utcOffset: 0 }
  const destination = CITY_LOOKUP[plan.inputs.destinationCity] || { city: plan.inputs.destinationCity, utcOffset: 0 }
  const makePath = (offset) => Array.from({ length: 49 }, (_, index) => {
    const hour = index / 2
    const daylight = Math.max(0.08, (Math.sin(((hour - 6 + offset) / 24) * Math.PI * 2) + 1) / 2)
    return `${index === 0 ? 'M' : 'L'} ${(hour / 24) * 100} ${92 - daylight * 70}`
  }).join(' ')

  return (
    <div className="daylight-panel">
      <div className="section-heading">
        <div>
          <h3>Daylight across both clocks</h3>
          <p className="section-note">The wave shows relative daylight over one local day; the shaded lower area is night.</p>
        </div>
        <div className="chart-legend">
          <span><i className="legend-dot origin-dot" />{origin.city}</span>
          <span><i className="legend-dot destination-dot" />{destination.city}</span>
        </div>
      </div>
      <div className="daylight-chart-wrap">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`Daylight comparison for ${origin.city} and ${destination.city}`}>
          <path className="night-fill" d="M 0 92 L 0 22 L 100 22 L 100 92 Z" />
          <path className="daylight-path origin-path" d={makePath(origin.utcOffset)} />
          <path className="daylight-path destination-path" d={makePath(destination.utcOffset)} />
          <line x1="0" y1="92" x2="100" y2="92" className="chart-axis" />
        </svg>
        <div className="chart-labels"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span></div>
      </div>
    </div>
  )
}

function DailyCard({ item, index, showCommuteOption, commuteChecked, onCommuteChange }) {
  const [activeBar, setActiveBar] = useState(null)
  const [activeLights, setActiveLights] = useState({ seek: false, avoid: false })
  const normalStart = (toMinutes(item.userBedtime) / 1440) * 100
  const normalDuration = ((toMinutes(item.userWakeTime) - toMinutes(item.userBedtime) + 1440) % 1440 / 1440) * 100
  const targetStart = (toMinutes(item.targetBedtime) / 1440) * 100
  const targetDuration = ((toMinutes(item.targetWakeTime) - toMinutes(item.targetBedtime) + 1440) % 1440 / 1440) * 100
  const normalSegments = getClockSegments(normalStart, normalDuration)
  const targetSegments = getClockSegments(targetStart, targetDuration)
  const seekSegments = getClockSegments(
    (toMinutes(item.seekLightWindow.split(' - ')[0]) / 1440) * 100,
    ((toMinutes(item.seekLightWindow.split(' - ')[1]) - toMinutes(item.seekLightWindow.split(' - ')[0]) + 1440) % 1440 / 1440) * 100,
  )
  const avoidSegments = getClockSegments(
    (toMinutes(item.avoidLightWindow.split(' - ')[0]) / 1440) * 100,
    ((toMinutes(item.avoidLightWindow.split(' - ')[1]) - toMinutes(item.avoidLightWindow.split(' - ')[0]) + 1440) % 1440 / 1440) * 100,
  )
  const showSeek = activeLights.seek
  const showAvoid = activeLights.avoid
  const hasWrap = normalSegments.length > 1 || targetSegments.length > 1 || (showSeek && seekSegments.length > 1) || (showAvoid && avoidSegments.length > 1)
  const normalLabel = `Normal sleep: ${formatTime12(item.userBedtime)} to ${formatTime12(item.userWakeTime)}`
  const suggestedLabel = `Suggested sleep: ${formatTime12(item.targetBedtime)} to ${formatTime12(item.targetWakeTime)}`
  const toggleLight = (light) => setActiveLights((current) => ({ ...current, [light]: !current[light] }))
  const firstLightOverlays = [
    ...(showSeek ? [{ className: 'seek-band', segments: [seekSegments[0]] }] : []),
    ...(showAvoid ? [{ className: 'avoid-band', segments: [avoidSegments[0]] }] : []),
  ]
  const wrappedLightOverlays = [
    ...(showSeek && seekSegments[1] ? [{ className: 'seek-band', segments: [seekSegments[1]] }] : []),
    ...(showAvoid && avoidSegments[1] ? [{ className: 'avoid-band', segments: [avoidSegments[1]] }] : []),
  ]

  return (
    <article className="schedule-card" key={`${item.phase}-${item.dayNumber}`}>
      {showCommuteOption && (
        <label className="commute-toggle">
          <input type="checkbox" checked={commuteChecked} onChange={(event) => onCommuteChange(event.target.checked)} />
          <span>Consider 4 hours of commute/immigration for international flights</span>
        </label>
      )}
      <div className="card-grid">
        <div>
          <label>Bedtime</label>
          <strong>{formatTime12(item.targetBedtime)}</strong>
        </div>
        <div>
          <label>Wake time</label>
          <strong>{formatTime12(item.targetWakeTime)}</strong>
        </div>
        <div>
          <label>Caffeine cutoff</label>
          <strong>{formatTime12(item.caffeineCutoff)}</strong>
        </div>
      </div>
      <div className={`sleep-clock-compare ${hasWrap ? 'has-wrap' : ''} ${showSeek || showAvoid ? 'has-light' : ''}`} aria-label={`24 hour sleep comparison for day ${item.dayNumber}`}>
        <div className="clock-scale">
          <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span>
        </div>
        <div className="clock-bars">
          <div className="clock-bar-row">
            <span className="clock-bar-label">Normal</span>
            <ClockBar
              className="normal-track"
              segments={[normalSegments[0]]}
              label={normalLabel}
              active={activeBar === 'normal'}
              onToggle={() => setActiveBar(activeBar === 'normal' ? null : 'normal')}
            />
            {normalSegments[1] && <div className="clock-wrap-row"><span>After midnight</span><ClockBar className="normal-track" segments={[normalSegments[1]]} label={normalLabel} active={activeBar === 'normal-wrap'} onToggle={() => setActiveBar(activeBar === 'normal-wrap' ? null : 'normal-wrap')} /></div>}
          </div>
          <div className="clock-bar-row">
            <span className="clock-bar-label">Suggested</span>
            <ClockBar
              className="target-track"
              segments={[targetSegments[0]]}
              label={suggestedLabel}
              active={activeBar === 'suggested'}
              onToggle={() => setActiveBar(activeBar === 'suggested' ? null : 'suggested')}
              overlays={firstLightOverlays}
            />
            {targetSegments[1] && <div className="clock-wrap-row"><span>After midnight</span><ClockBar className="target-track" segments={[targetSegments[1]]} label={suggestedLabel} active={activeBar === 'suggested-wrap'} onToggle={() => setActiveBar(activeBar === 'suggested-wrap' ? null : 'suggested-wrap')} overlays={wrappedLightOverlays} /></div>}
          </div>
        </div>
      </div>
      <div className="insights-row day-light-guidance">
        <button type="button" className={`insight yellow ${showSeek ? 'active' : ''}`} aria-pressed={showSeek} onClick={() => toggleLight('seek')}>
          <span className="dot" />
          Seek light {item.seekLightWindow.split(' - ').map(formatTime12).join(' - ')}
        </button>
        <button type="button" className={`insight red ${showAvoid ? 'active' : ''}`} aria-pressed={showAvoid} onClick={() => toggleLight('avoid')}>
          <span className="dot" />
          Avoid light {item.avoidLightWindow.split(' - ').map(formatTime12).join(' - ')}
        </button>
      </div>
    </article>
  )
}

function ScheduleGroup({ title, description, items, showCommuteOption, commuteChecked, onCommuteChange }) {
  return (
    <section className="schedule-group">
      <div className="schedule-group-heading">
        <div>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
      </div>
      <div className={`schedule-grid ${items.length === 1 ? 'single-window' : ''}`}>
        {items.map((item, index) => (
          <DailyCard
            key={`${item.phase}-${item.dayNumber}-${index}`}
            item={item}
            index={index}
            showCommuteOption={showCommuteOption}
            commuteChecked={commuteChecked}
            onCommuteChange={onCommuteChange}
          />
        ))}
      </div>
    </section>
  )
}

function App() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [scanStatus, setScanStatus] = useState('')
  const originName = CITY_LOOKUP[form.originCity]?.city || form.originCity
  const destinationName = CITY_LOOKUP[form.destinationCity]?.city || form.destinationCity
  const isInternational = CITY_LOOKUP[form.originCity]?.country !== CITY_LOOKUP[form.destinationCity]?.country

  const plan = useMemo(() => computeJetLagPlan(form), [form])

  const handleFieldChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleChronotypeChange = (value) => {
    const preset = CHRONOTYPE_PRESETS[value]
    setForm((current) => ({
      ...current,
      chronotype: value,
      baselineBedtime: preset.bedtime,
      baselineWakeTime: preset.wakeTime,
    }))
  }

  const handleCommuteChange = (value) => {
    setForm((current) => ({
      ...current,
      flightDetails: { ...current.flightDetails, considerCommuteTime: value },
    }))
  }

  const handleFlightImport = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setScanStatus(`Scanning ${file.name}...`)
    const applyScannedTimes = (content) => {
      const scannedTimes = content.match(/(?:[01]?\d|2[0-3])[:.]\d{2}/g) || []
      if (scannedTimes.length >= 2) {
        const normalizeScannedTime = (value) => value.replace('.', ':').padStart(5, '0')
        setForm((current) => ({
          ...current,
          flightDetails: {
            ...current.flightDetails,
            takeoffTime: normalizeScannedTime(scannedTimes[0]),
            landingTime: normalizeScannedTime(scannedTimes[1]),
          },
        }))
        setScanStatus(`Scanned ${file.name}: departure and landing times filled in. Please confirm them.`)
      } else {
        setScanStatus(`Could not read times from ${file.name}; please confirm the required fields manually.`)
      }
    }

    if (file.type.startsWith('image/')) {
      createWorker('eng')
        .then(async (worker) => {
          const { data } = await worker.recognize(file)
          await worker.terminate()
          applyScannedTimes(data.text)
        })
        .catch(() => {
          setScanStatus('Could not scan this image; please confirm the required fields manually.')
        })
      return
    }

    file.text().then(applyScannedTimes).catch(() => {
      setScanStatus('Could not scan this file; please confirm the required fields manually.')
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const planReturnFlight = () => {
    const next = getFlightsForReturn({
      originCity: form.originCity,
      destinationCity: form.destinationCity,
      baselineBedtime: form.baselineBedtime,
      baselineWakeTime: form.baselineWakeTime,
      chronotype: form.chronotype,
    })

    setForm((current) => ({
      ...current,
      originCity: next.originCity,
      destinationCity: next.destinationCity,
      baselineBedtime: next.baselineBedtime,
      baselineWakeTime: next.baselineWakeTime,
      chronotype: next.chronotype,
    }))
    setSubmitted(true)
  }

  return (
    <div className="page-shell">
      <main className="app-layout">
        <section className="panel form-panel">
          <div className="hero-copy">
            <div className="hero-title-row">
              <img className="hero-logo" src="/logo.png" alt="" />
              <h1>Fix your jet lag</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="route-fields">
              <label className="field-group compact-field" htmlFor="originCity">
                <span>From</span>
                  <select
                  id="originCity"
                    required
                  value={form.originCity}
                  onChange={(event) => handleFieldChange('originCity', event.target.value)}
                  aria-label="Origin city"
                >
                  <option value="">Select a city</option>
                  {cityOptions.map(([code, city]) => <option key={code} value={code}>{cityOptionLabel(city)}</option>)}
                </select>
              </label>

              <button type="button" className="swap-button" aria-label="Swap origin and destination" onClick={() => setForm((current) => ({ ...current, originCity: current.destinationCity, destinationCity: current.originCity }))}>
                ⇄
              </button>

              <label className="field-group compact-field" htmlFor="destinationCity">
                <span>To</span>
                  <select
                  id="destinationCity"
                    required
                  value={form.destinationCity}
                  onChange={(event) => handleFieldChange('destinationCity', event.target.value)}
                  aria-label="Destination city"
                >
                  <option value="">Select a city</option>
                  {cityOptions.map(([code, city]) => <option key={code} value={code}>{cityOptionLabel(city)}</option>)}
                </select>
              </label>
            </div>

            <div className="field-group full-column flight-details-section">
              <div className="flight-details-grid">
                <FlightTimeInput
                  label={`Departure from ${originName}`}
                  value={form.flightDetails.takeoffTime}
                  onChange={(value) => setForm((current) => ({
                    ...current,
                    flightDetails: { ...current.flightDetails, takeoffTime: value },
                  }))}
                />
                <FlightTimeInput
                  label={`Landing in ${destinationName}`}
                  value={form.flightDetails.landingTime}
                  onChange={(value) => setForm((current) => ({
                    ...current,
                    flightDetails: { ...current.flightDetails, landingTime: value },
                  }))}
                />
              </div>
              <div className="scan-divider">
                <span>Or</span>
                <label className="file-button">
                  Scan ticket
                  <input type="file" accept="image/*,.pdf" onChange={handleFlightImport} />
                </label>
              </div>
              {scanStatus && <p className="scan-status" role="status">{scanStatus}</p>}
            </div>

            <div className="field-group full-column sleep-preference-section">
              <label className="field-label">When do you normally sleep?</label>
              <ChronotypeSelector
                value={form.chronotype}
                onChange={handleChronotypeChange}
              />
            </div>

            <details className="advanced-options">
              <summary>Advanced options</summary>
              <div className="advanced-content">
                <div className="normal-hours-grid">
                  <TimeInput label="Normal bedtime" value={form.baselineBedtime} onChange={(value) => handleFieldChange('baselineBedtime', value)} />
                  <TimeInput label="Normal wake time" value={form.baselineWakeTime} onChange={(value) => handleFieldChange('baselineWakeTime', value)} />
                </div>
              </div>
            </details>

            <button type="submit" className="primary-button">Get My Plan</button>
          </form>
        </section>

        {submitted && (
          <section className="panel results-panel" aria-live="polite">
            <div className="results-header">
              <div>
                <h2>{originName} → {destinationName}</h2>
              </div>
              <button type="button" className="secondary-button" onClick={planReturnFlight}>
                Plan Return Flight
              </button>
            </div>

            <div className="summary-grid">
              <article className="metric-card highlight">
                <span>Net shift</span>
                <strong>{Math.abs(plan.computed.netOffsetHours)}h</strong>
                <small>{plan.computed.direction} travel</small>
              </article>
              <article className="metric-card">
                <span>Flight time</span>
                <strong>{plan.computed.flightDurationLabel}</strong>
                <small>{formatTime12(form.flightDetails.takeoffTime)} → {formatTime12(form.flightDetails.landingTime)}</small>
              </article>
              <article className="metric-card">
                <span>Adaptation</span>
                <strong>{plan.computed.adaptationDaysRequired} days</strong>
                <small>Recovery period</small>
              </article>
            </div>

            <TravelTimeline plan={plan} />

            {plan.computed.flightProtocol.length > 0 && (
              <div className="flight-protocol">
                <div className="protocol-header">
                  <h3>In-flight action protocol</h3>
                  <span>{formatTime12(form.flightDetails.takeoffTime)} → {formatTime12(form.flightDetails.landingTime)}</span>
                </div>
                <ul>
                  {plan.computed.flightProtocol.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <ScheduleGroup
              title="Before flight"
              description="Your sleep window before departure."
              items={plan.computed.schedule.filter((item) => item.dayNumber < 0)}
              showCommuteOption={isInternational}
              commuteChecked={Boolean(form.flightDetails.considerCommuteTime)}
              onCommuteChange={handleCommuteChange}
            />
            <ScheduleGroup
              title="After flight"
              description="Your first destination-time sleep window after landing."
              items={plan.computed.schedule.filter((item) => item.dayNumber >= 0)}
            />
            <details className="daylight-details">
              <summary>Daylight across both clocks</summary>
              <DaylightChart plan={plan} />
            </details>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
