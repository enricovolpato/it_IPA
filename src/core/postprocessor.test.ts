import { describe, expect, it } from 'vitest'
import { applyRaddoppianmentoFonosintattico } from './postprocessor'

describe('applyRaddoppianmentoFonosintattico', () => {
  it('geminates after oxytone words', () => {
    expect(applyRaddoppianmentoFonosintattico('La città nuova', 'la tʃitˈtaː ˈnwɔːva'))
      .toBe('la tʃitˈtaː ˈnnwɔːva')
    expect(applyRaddoppianmentoFonosintattico('Andrò subito', 'anˈdrɔ suˈbito'))
      .toBe('anˈdrɔ ssuˈbito')
  })

  it('geminates after cogeminant monosyllables', () => {
    expect(applyRaddoppianmentoFonosintattico('Andiamo a casa', 'anˈdjaːmo a ˈkaːsa'))
      .toBe('anˈdjaːmo a ˈkkaːsa')
    expect(applyRaddoppianmentoFonosintattico('E bello', 'ɛ ˈbɛllo'))
      .toBe('ɛ ˈbbɛllo')
    expect(applyRaddoppianmentoFonosintattico('Da Roma', 'da ˈroːma'))
      .toBe('da ˈrroːma')
    expect(applyRaddoppianmentoFonosintattico('Più forte', 'pju ˈfɔrte'))
      .toBe('pju ˈffɔrte')
  })

  it('geminates after specific trigger words', () => {
    expect(applyRaddoppianmentoFonosintattico('Come va', 'ˈkoːme ˈva'))
      .toBe('ˈkoːme ˈvva')
    expect(applyRaddoppianmentoFonosintattico('Dove sei', 'ˈdoːve ˈsɛi̯'))
      .toBe('ˈdoːve ˈssɛi̯')
    expect(applyRaddoppianmentoFonosintattico('Qualche volta', 'ˈkwalke ˈvɔlta'))
      .toBe('ˈkwalke ˈvvɔlta')
    expect(applyRaddoppianmentoFonosintattico('Sopra la tavola', 'ˈsoːpra la ˈtaːvola'))
      .toBe('ˈsoːpra lla ˈtaːvola')
  })

  it('geminates pregeminant words when preceded by vowel', () => {
    expect(applyRaddoppianmentoFonosintattico('Mio dio', 'ˈmiːo ˈdiːo'))
      .toBe('ˈmiːo ˈddiːo')
    expect(applyRaddoppianmentoFonosintattico('Ave Maria', 'ˈaːve maˈriːa'))
      .toBe('ˈaːve mmaˈriːa')
    expect(applyRaddoppianmentoFonosintattico('Spirito Santo', 'ˈspiːrito ˈsanto'))
      .toBe('ˈspiːrito ˈssanto')
  })

  it('does not geminate after non-cogeminant monosyllables', () => {
    expect(applyRaddoppianmentoFonosintattico('Il cane', 'il ˈkane'))
      .toBe('il ˈkane')
    expect(applyRaddoppianmentoFonosintattico('Mai parla', 'ˈmai ˈparla'))
      .toBe('ˈmai ˈparla')
    expect(applyRaddoppianmentoFonosintattico('Poi cambia', 'ˈpoi ˈkambia'))
      .toBe('ˈpoi ˈkambia')
  })

  it('handles poetic de and ne as cogeminant', () => {
    expect(applyRaddoppianmentoFonosintattico('De Roma', 'de ˈroːma'))
      .toBe('de ˈrroːma')
  })
})
