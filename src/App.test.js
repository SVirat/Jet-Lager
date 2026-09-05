import { describe, it, expect } from 'vitest'
import { computeJetLagPlan, getNetOffsetHours } from './data/jetlag'

describe('jet lag calculations', () => {
  it('computes westward offset correctly', () => {
    expect(getNetOffsetHours('HYD', 'JFK')).toBe(-9.5)
  })

  it('builds before and after flight windows from local flight times', () => {
    const plan = computeJetLagPlan({
      originCity: 'HYD',
      destinationCity: 'JFK',
      travelDate: '2026-10-15',
      chronotype: 'ON_TIME',
      baselineBedtime: '22:30',
      baselineWakeTime: '06:30',
      flightDetails: {
        takeoffTime: '02:15',
        landingTime: '09:30',
      },
    })

    expect(plan.computed.direction).toBe('WESTWARD')
    expect(plan.computed.schedule).toHaveLength(2)
    expect(plan.computed.flightDurationMinutes).toBe(1005)
    expect(plan.computed.schedule[0].targetBedtime).toBe('16:45')
    expect(plan.computed.schedule[0].targetWakeTime).toBe('00:45')
    expect(plan.computed.schedule[1].userBedtime).toBe('13:00')
    expect(plan.computed.schedule[1].userWakeTime).toBe('21:00')
    expect(plan.computed.schedule.at(-1).dayNumber).toBe(1)
    expect(plan.computed.schedule[0].targetBedtime).toMatch(/\d{2}:\d{2}/)
    expect(plan.computed.flightProtocol.length).toBeGreaterThan(0)
  })
  
  it('moves pre-flight sleep earlier when airport time is included', () => {
    const plan = computeJetLagPlan({
      originCity: 'HYD',
      destinationCity: 'JFK',
      baselineBedtime: '23:00',
      baselineWakeTime: '07:00',
      flightDetails: {
        takeoffTime: '02:15',
        landingTime: '09:30',
        considerCommuteTime: true,
      },
    })

    expect(plan.computed.schedule[0].targetBedtime).toBe('14:15')
    expect(plan.computed.schedule[0].targetWakeTime).toBe('22:15')
  })

  it('places seek light after waking and avoid light before sleep', () => {
    const plan = computeJetLagPlan({
      originCity: 'HYD',
      destinationCity: 'JFK',
      baselineBedtime: '23:00',
      baselineWakeTime: '07:00',
      flightDetails: { takeoffTime: '02:15', landingTime: '09:30' },
    })

    const afterFlight = plan.computed.schedule[1]
    expect(afterFlight.seekLightWindow).toBe('08:15 - 12:15')
    expect(afterFlight.avoidLightWindow).toBe('20:15 - 00:15')
  })

  it('uses chronotype to shift pre-flight and onboard sleep timing', () => {
    const baseFlight = {
      originCity: 'HYD',
      destinationCity: 'JFK',
      baselineBedtime: '23:00',
      baselineWakeTime: '07:00',
      flightDetails: { takeoffTime: '02:15', landingTime: '09:30' },
    }
    const earlyPlan = computeJetLagPlan({ ...baseFlight, chronotype: 'EARLY' })
    const nightPlan = computeJetLagPlan({ ...baseFlight, chronotype: 'NIGHT_OWL' })

    expect(earlyPlan.computed.schedule[0].targetBedtime).toBe('14:45')
    expect(nightPlan.computed.schedule[0].targetBedtime).toBe('18:45')
    expect(earlyPlan.computed.flightProtocol[1]).toContain('7:00 AM')
    expect(nightPlan.computed.flightProtocol[1]).toContain('11:00 AM')
  })
})
