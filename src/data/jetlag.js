import airportData from 'airport-data/airports.json'

export const CHRONOTYPE_PRESETS = {
  EARLY: {
    id: 'EARLY',
    label: 'Early Sleeper',
    bedtime: '21:00',
    wakeTime: '05:00',
    icon: '🌤️',
    description: 'Natural rhythm with earlier wind-downs',
  },
  ON_TIME: {
    id: 'ON_TIME',
    label: 'On Time',
    bedtime: '23:00',
    wakeTime: '07:00',
    icon: '☀️',
    description: 'Balanced rhythm for most travelers',
  },
  NIGHT_OWL: {
    id: 'NIGHT_OWL',
    label: 'Night Owl',
    bedtime: '01:00',
    wakeTime: '09:00',
    icon: '🌙',
    description: 'Later start, slower adaptation window',
  },
};

const CURATED_CITY_LOOKUP = {
  HYD: { city: 'Hyderabad', country: 'India', utcOffset: 5.5 },
  JFK: { city: 'New York', state: 'NY', country: 'USA', utcOffset: -4 },
  LAX: { city: 'Los Angeles', state: 'CA', country: 'USA', utcOffset: -7 },
  BHM: { city: 'Birmingham', state: 'AL', country: 'USA', utcOffset: -5 },
  ANC: { city: 'Anchorage', state: 'AK', country: 'USA', utcOffset: -9 },
  PHX: { city: 'Phoenix', state: 'AZ', country: 'USA', utcOffset: -7 },
  LIT: { city: 'Little Rock', state: 'AR', country: 'USA', utcOffset: -6 },
  DEN: { city: 'Denver', state: 'CO', country: 'USA', utcOffset: -7 },
  BDL: { city: 'Hartford', state: 'CT', country: 'USA', utcOffset: -5 },
  ILG: { city: 'Wilmington', state: 'DE', country: 'USA', utcOffset: -5 },
  MIA: { city: 'Miami', state: 'FL', country: 'USA', utcOffset: -5 },
  ATL: { city: 'Atlanta', state: 'GA', country: 'USA', utcOffset: -5 },
  HNL: { city: 'Honolulu', state: 'HI', country: 'USA', utcOffset: -10 },
  BOI: { city: 'Boise', state: 'ID', country: 'USA', utcOffset: -7 },
  ORD: { city: 'Chicago', state: 'IL', country: 'USA', utcOffset: -6 },
  IND: { city: 'Indianapolis', state: 'IN', country: 'USA', utcOffset: -5 },
  DSM: { city: 'Des Moines', state: 'IA', country: 'USA', utcOffset: -6 },
  ICT: { city: 'Wichita', state: 'KS', country: 'USA', utcOffset: -6 },
  SDF: { city: 'Louisville', state: 'KY', country: 'USA', utcOffset: -5 },
  MSY: { city: 'New Orleans', state: 'LA', country: 'USA', utcOffset: -6 },
  PWM: { city: 'Portland', state: 'ME', country: 'USA', utcOffset: -5 },
  BWI: { city: 'Baltimore', state: 'MD', country: 'USA', utcOffset: -5 },
  BOS: { city: 'Boston', state: 'MA', country: 'USA', utcOffset: -5 },
  DTW: { city: 'Detroit', state: 'MI', country: 'USA', utcOffset: -5 },
  MSP: { city: 'Minneapolis', state: 'MN', country: 'USA', utcOffset: -6 },
  JAN: { city: 'Jackson', state: 'MS', country: 'USA', utcOffset: -6 },
  STL: { city: 'St. Louis', state: 'MO', country: 'USA', utcOffset: -6 },
  BZN: { city: 'Bozeman', state: 'MT', country: 'USA', utcOffset: -7 },
  OMA: { city: 'Omaha', state: 'NE', country: 'USA', utcOffset: -6 },
  LAS: { city: 'Las Vegas', state: 'NV', country: 'USA', utcOffset: -8 },
  MHT: { city: 'Manchester', state: 'NH', country: 'USA', utcOffset: -5 },
  EWR: { city: 'Newark', state: 'NJ', country: 'USA', utcOffset: -5 },
  ABQ: { city: 'Albuquerque', state: 'NM', country: 'USA', utcOffset: -7 },
  CLT: { city: 'Charlotte', state: 'NC', country: 'USA', utcOffset: -5 },
  FAR: { city: 'Fargo', state: 'ND', country: 'USA', utcOffset: -6 },
  CMH: { city: 'Columbus', state: 'OH', country: 'USA', utcOffset: -5 },
  OKC: { city: 'Oklahoma City', state: 'OK', country: 'USA', utcOffset: -6 },
  PDX: { city: 'Portland', state: 'OR', country: 'USA', utcOffset: -8 },
  PHL: { city: 'Philadelphia', state: 'PA', country: 'USA', utcOffset: -5 },
  PVD: { city: 'Providence', state: 'RI', country: 'USA', utcOffset: -5 },
  CHS: { city: 'Charleston', state: 'SC', country: 'USA', utcOffset: -5 },
  FSD: { city: 'Sioux Falls', state: 'SD', country: 'USA', utcOffset: -6 },
  BNA: { city: 'Nashville', state: 'TN', country: 'USA', utcOffset: -6 },
  DFW: { city: 'Dallas', state: 'TX', country: 'USA', utcOffset: -6 },
  SLC: { city: 'Salt Lake City', state: 'UT', country: 'USA', utcOffset: -7 },
  BTV: { city: 'Burlington', state: 'VT', country: 'USA', utcOffset: -5 },
  RIC: { city: 'Richmond', state: 'VA', country: 'USA', utcOffset: -5 },
  SEA: { city: 'Seattle', state: 'WA', country: 'USA', utcOffset: -8 },
  CRW: { city: 'Charleston', state: 'WV', country: 'USA', utcOffset: -5 },
  MKE: { city: 'Milwaukee', state: 'WI', country: 'USA', utcOffset: -6 },
  CYS: { city: 'Cheyenne', state: 'WY', country: 'USA', utcOffset: -7 },
  YYZ: { city: 'Toronto', country: 'Canada', utcOffset: -5 },
  MEX: { city: 'Mexico City', country: 'Mexico', utcOffset: -6 },
  GRU: { city: 'Sao Paulo', country: 'Brazil', utcOffset: -3 },
  EZE: { city: 'Buenos Aires', country: 'Argentina', utcOffset: -3 },
  SCL: { city: 'Santiago', country: 'Chile', utcOffset: -4 },
  BOG: { city: 'Bogota', country: 'Colombia', utcOffset: -5 },
  LIM: { city: 'Lima', country: 'Peru', utcOffset: -5 },
  PTY: { city: 'Panama City', country: 'Panama', utcOffset: -5 },
  HAV: { city: 'Havana', country: 'Cuba', utcOffset: -5 },
  SDQ: { city: 'Santo Domingo', country: 'Dominican Republic', utcOffset: -4 },
  JNB: { city: 'Johannesburg', country: 'South Africa', utcOffset: 2 },
  CAI: { city: 'Cairo', country: 'Egypt', utcOffset: 2 },
  NBO: { city: 'Nairobi', country: 'Kenya', utcOffset: 3 },
  LOS: { city: 'Lagos', country: 'Nigeria', utcOffset: 1 },
  CMN: { city: 'Casablanca', country: 'Morocco', utcOffset: 1 },
  ACC: { city: 'Accra', country: 'Ghana', utcOffset: 0 },
  ADD: { city: 'Addis Ababa', country: 'Ethiopia', utcOffset: 3 },
  TUN: { city: 'Tunis', country: 'Tunisia', utcOffset: 1 },
  TLV: { city: 'Tel Aviv', country: 'Israel', utcOffset: 2 },
  RUH: { city: 'Riyadh', country: 'Saudi Arabia', utcOffset: 3 },
  DOH: { city: 'Doha', country: 'Qatar', utcOffset: 3 },
  IST: { city: 'Istanbul', country: 'Turkey', utcOffset: 3 },
  SVO: { city: 'Moscow', country: 'Russia', utcOffset: 3 },
  KBP: { city: 'Kyiv', country: 'Ukraine', utcOffset: 2 },
  WAW: { city: 'Warsaw', country: 'Poland', utcOffset: 1 },
  BER: { city: 'Berlin', country: 'Germany', utcOffset: 1 },
  CDG: { city: 'Paris', country: 'France', utcOffset: 1 },
  MAD: { city: 'Madrid', country: 'Spain', utcOffset: 1 },
  FCO: { city: 'Rome', country: 'Italy', utcOffset: 1 },
  ZRH: { city: 'Zurich', country: 'Switzerland', utcOffset: 1 },
  VIE: { city: 'Vienna', country: 'Austria', utcOffset: 1 },
  BRU: { city: 'Brussels', country: 'Belgium', utcOffset: 1 },
  DUB: { city: 'Dublin', country: 'Ireland', utcOffset: 0 },
  LIS: { city: 'Lisbon', country: 'Portugal', utcOffset: 0 },
  OSL: { city: 'Oslo', country: 'Norway', utcOffset: 1 },
  ARN: { city: 'Stockholm', country: 'Sweden', utcOffset: 1 },
  HEL: { city: 'Helsinki', country: 'Finland', utcOffset: 2 },
  ATH: { city: 'Athens', country: 'Greece', utcOffset: 2 },
  DEL: { city: 'New Delhi', country: 'India', utcOffset: 5.5 },
  PEK: { city: 'Beijing', country: 'China', utcOffset: 8 },
  HKG: { city: 'Hong Kong', country: 'Hong Kong', utcOffset: 8 },
  TPE: { city: 'Taipei', country: 'Taiwan', utcOffset: 8 },
  ICN: { city: 'Seoul', country: 'South Korea', utcOffset: 9 },
  KUL: { city: 'Kuala Lumpur', country: 'Malaysia', utcOffset: 8 },
  BKK: { city: 'Bangkok', country: 'Thailand', utcOffset: 7 },
  CGK: { city: 'Jakarta', country: 'Indonesia', utcOffset: 7 },
  MNL: { city: 'Manila', country: 'Philippines', utcOffset: 8 },
  SGN: { city: 'Ho Chi Minh City', country: 'Vietnam', utcOffset: 7 },
  KTM: { city: 'Kathmandu', country: 'Nepal', utcOffset: 5.75 },
  CMB: { city: 'Colombo', country: 'Sri Lanka', utcOffset: 5.5 },
  DAC: { city: 'Dhaka', country: 'Bangladesh', utcOffset: 6 },
  KHI: { city: 'Karachi', country: 'Pakistan', utcOffset: 5 },
  KBL: { city: 'Kabul', country: 'Afghanistan', utcOffset: 4.5 },
  AKL: { city: 'Auckland', country: 'New Zealand', utcOffset: 12 },
  PER: { city: 'Perth', country: 'Australia', utcOffset: 8 },
  MEL: { city: 'Melbourne', country: 'Australia', utcOffset: 10 },
  NAN: { city: 'Nadi', country: 'Fiji', utcOffset: 12 },
  DXB: { city: 'Dubai', country: 'UAE', utcOffset: 4 },
  SIN: { city: 'Singapore', country: 'Singapore', utcOffset: 8 },
  LHR: { city: 'London', country: 'UK', utcOffset: 1 },
  HND: { city: 'Tokyo', country: 'Japan', utcOffset: 9 },
  SFO: { city: 'San Francisco', country: 'USA', utcOffset: -7 },
  AMS: { city: 'Amsterdam', country: 'Netherlands', utcOffset: 2 },
  SYD: { city: 'Sydney', country: 'Australia', utcOffset: 10 },
};

const DATASET_CITY_LOOKUP = airportData.reduce((lookup, airport) => {
  const utcOffset = Number(airport.timezone)
  if (airport.type !== 'airport' || !airport.iata || !airport.city || !airport.country || Number.isNaN(utcOffset)) return lookup
  lookup[airport.iata] = {
    city: airport.city,
    country: airport.country,
    utcOffset,
  }
  return lookup
}, {})

export const CITY_LOOKUP = { ...DATASET_CITY_LOOKUP, ...CURATED_CITY_LOOKUP }

export function padTime(value) {
  return String(value).padStart(2, '0')
}

export function toMinutes(timeString) {
  if (!timeString) return 0
  const [hours, minutes] = timeString.split(':').map(Number)
  return hours * 60 + minutes
}

export function toTimeString(totalMinutes) {
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
  const hours = Math.floor(normalized / 60)
  const minutes = normalized % 60
  return `${padTime(hours)}:${padTime(minutes)}`
}

export function formatTime12(timeString) {
  const totalMinutes = toMinutes(timeString)
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours % 12 || 12
  return `${hour12}:${padTime(minutes)} ${suffix}`
}

export function formatCompactTime(timeString) {
  const totalMinutes = toMinutes(timeString)
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  const suffix = hours >= 12 ? 'pm' : 'am'
  const hour12 = hours % 12 || 12
  return `${hour12}${minutes ? `:${padTime(minutes)}` : ''}${suffix}`
}

export function parseTime12(value) {
  const match = String(value).trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2] || 0)
  if (hour < 1 || hour > 12 || minute > 59) return null
  const suffix = match[3].toUpperCase()
  const hour24 = (hour % 12) + (suffix === 'PM' ? 12 : 0)
  return toTimeString(hour24 * 60 + minute)
}

export function minutesToLabel(minutes) {
  const hours = Math.floor(Math.abs(minutes) / 60)
  const remainingMinutes = Math.abs(minutes) % 60
  const sign = minutes < 0 ? '-' : '+'

  if (hours === 0) return `${sign}${remainingMinutes}m`
  if (remainingMinutes === 0) return `${sign}${hours}h`
  return `${sign}${hours}h ${remainingMinutes}m`
}

export function getNetOffsetHours(originCode, destinationCode) {
  const origin = CITY_LOOKUP[originCode] || { utcOffset: 0 }
  const destination = CITY_LOOKUP[destinationCode] || { utcOffset: 0 }

  const delta = destination.utcOffset - origin.utcOffset
  const normalized = ((delta + 12) % 24) - 12
  return Number(normalized.toFixed(1))
}

function getFlightDurationMinutes(originCode, destinationCode, takeoffTime, landingTime) {
  const origin = CITY_LOOKUP[originCode] || { utcOffset: 0 }
  const destination = CITY_LOOKUP[destinationCode] || { utcOffset: 0 }
  const departureUtc = toMinutes(takeoffTime) - origin.utcOffset * 60
  let arrivalUtc = toMinutes(landingTime) - destination.utcOffset * 60

  while (arrivalUtc <= departureUtc) arrivalUtc += 24 * 60
  return arrivalUtc - departureUtc
}

function getChronotypePhaseOffset(chronotype) {
  if (chronotype === 'EARLY') return -2 * 60
  if (chronotype === 'NIGHT_OWL') return 2 * 60
  return 0
}

function getFlightProtocol({ takeoffTime, durationMinutes, destinationCity, chronotype }) {
  const takeoffMinutes = toMinutes(takeoffTime)
  const sleepDuration = Math.min(8 * 60, Math.max(90, durationMinutes - 4 * 60))
  const sleepEnd = Math.max(90, durationMinutes - 2 * 60)
  const sleepStart = Math.max(45, sleepEnd - sleepDuration + getChronotypePhaseOffset(chronotype))
  const firstMeal = Math.min(durationMinutes - 45, Math.max(45, durationMinutes * 0.2))

  return [
    `Departure: ${formatTime12(takeoffTime)} origin time.`,
    `Sleep on board: ${formatTime12(toTimeString(Math.round(takeoffMinutes + sleepStart)))} - ${formatTime12(toTimeString(Math.round(takeoffMinutes + sleepEnd)))}.`,
    `Meal and hydrate around ${formatTime12(toTimeString(Math.round(takeoffMinutes + firstMeal)))}.`,
    `On arrival in ${destinationCity}, seek outdoor light after waking.`,
    `Avoid caffeine during the final 8 hours before sleep.`,
  ]
}

export function computeJetLagPlan({
  originCity,
  destinationCity,
  travelDate,
  chronotype = 'ON_TIME',
  baselineBedtime,
  baselineWakeTime,
  flightDetails = {},
}) {
  const preset = CHRONOTYPE_PRESETS[chronotype] || CHRONOTYPE_PRESETS.ON_TIME
  const baseBedtime = baselineBedtime || preset.bedtime
  const baseWakeTime = baselineWakeTime || preset.wakeTime
  const netOffsetHours = getNetOffsetHours(originCity, destinationCity)
  const direction = netOffsetHours > 0 ? 'EASTWARD' : 'WESTWARD'
  const takeoffTime = flightDetails.takeoffTime
  const landingTime = flightDetails.landingTime
  const flightDurationMinutes = getFlightDurationMinutes(originCity, destinationCity, takeoffTime, landingTime)

  const sleepDurationMinutes =
    (toMinutes(baseWakeTime) - toMinutes(baseBedtime) + 24 * 60) % (24 * 60)

  const sigma = direction === 'EASTWARD' ? -1 : 1.25
  const commuteMinutes = flightDetails.considerCommuteTime ? 4 * 60 : 0
  const chronotypePhaseOffset = getChronotypePhaseOffset(chronotype)
  const schedule = [-1, 1].map((dayNumber) => {
    // Use one gradual adjustment before departure and continue it after landing.
    const offsetDay = dayNumber < 0 ? 1 : dayNumber
    const bedtimeShiftMinutes = Math.round(offsetDay * sigma * 60)
    const preflightWakeTime = toTimeString(toMinutes(takeoffTime) - Math.max(90, commuteMinutes))
    const preflightBedtime = toTimeString(toMinutes(preflightWakeTime) - sleepDurationMinutes + chronotypePhaseOffset)
    const targetBedtime = dayNumber < 0
      ? preflightBedtime
      : toTimeString(toMinutes(baseBedtime) + bedtimeShiftMinutes)
    const targetWakeTime = dayNumber < 0
      ? preflightWakeTime
      : toTimeString(toMinutes(targetBedtime) + sleepDurationMinutes)
    const referenceBedtime = dayNumber < 0
      ? baseBedtime
      : toTimeString(toMinutes(baseBedtime) + netOffsetHours * 60)
    const referenceWakeTime = dayNumber < 0
      ? baseWakeTime
      : toTimeString(toMinutes(baseWakeTime) + netOffsetHours * 60)
    const caffeineCutoff = toTimeString(toMinutes(targetBedtime) - 8 * 60)

    const seekLightWindow = `${targetWakeTime} - ${toTimeString(toMinutes(targetWakeTime) + 4 * 60)}`
    const avoidLightWindow = `${toTimeString(toMinutes(targetBedtime) - 4 * 60)} - ${targetBedtime}`

    return {
      phase: dayNumber < 0 ? 'PRE_FLIGHT' : 'POST_LANDING',
      dayNumber,
      targetBedtime,
      targetWakeTime,
      userBedtime: referenceBedtime,
      userWakeTime: referenceWakeTime,
      referenceLabel: dayNumber < 0
        ? `${(CITY_LOOKUP[originCity] || { city: originCity }).city} local`
        : 'Origin clock',
      targetTimeZone: dayNumber < 0
        ? (CITY_LOOKUP[originCity] || { city: originCity }).city
        : (CITY_LOOKUP[destinationCity] || { city: destinationCity }).city,
      caffeineCutoff,
      seekLightWindow,
      avoidLightWindow,
      badge: dayNumber < 0 ? 'PREP' : 'ADAPT',
    }
  })

  const phaseWindow = {
    start: 0,
    end: 0,
  }

  return {
    inputs: {
      originCity,
      destinationCity,
      travelDate,
      chronotype,
      baselineBedtime: baseBedtime,
      baselineWakeTime: baseWakeTime,
      flightDetails: {
        hasFlightTimes: true,
        takeoffTime,
        landingTime,
        considerCommuteTime: Boolean(flightDetails.considerCommuteTime),
      },
    },
    computed: {
      netOffsetHours,
      direction,
      flightDurationMinutes,
      flightDurationLabel: `${Math.floor(flightDurationMinutes / 60)}h ${flightDurationMinutes % 60}m`,
      adaptationDaysRequired: Math.ceil(Math.abs(netOffsetHours) / 1.25),
      schedule,
      flightProtocol: getFlightProtocol({
        takeoffTime,
        durationMinutes: flightDurationMinutes,
        destinationCity: (CITY_LOOKUP[destinationCity] || { city: destinationCity }).city,
        chronotype,
      }),
      summary: {
        title:
          direction === 'EASTWARD'
            ? 'Fast eastward shift: phase-advance protocol'
            : 'Westward reset: phase-delay protocol',
        description:
          direction === 'EASTWARD'
            ? 'Advance sleep earlier, avoid bright light before bed, and seek outdoor light after waking.'
            : 'Delay sleep later, avoid bright light before bed, and seek outdoor light after waking.',
      },
      phaseWindow,
    },
  }
}

export function getFlightsForReturn({ originCity, destinationCity, baselineBedtime, baselineWakeTime, chronotype }) {
  return {
    originCity: destinationCity,
    destinationCity: originCity,
    baselineBedtime,
    baselineWakeTime,
    chronotype,
    returnMode: true,
  }
}
