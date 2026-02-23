import { describe, expect, it } from 'vitest'
import { applyRaddoppiamentoFonosintattico } from './postprocessor'

describe('applyRaddoppiamentoFonosintattico', () => {
  it('geminates after oxytone words', () => {
    expect(applyRaddoppiamentoFonosintattico('La città nuova', 'la tʃitˈtaː ˈnwɔːva'))
      .toBe('la tʃitˈtaː ˈnnwɔːva')
    expect(applyRaddoppiamentoFonosintattico('Andrò subito', 'anˈdrɔ suˈbito'))
      .toBe('anˈdrɔ ssuˈbito')
  })

  it('geminates after cogeminant monosyllables', () => {
    expect(applyRaddoppiamentoFonosintattico('Andiamo a casa', 'anˈdjaːmo a ˈkaːsa'))
      .toBe('anˈdjaːmo a ˈkkaːsa')
    expect(applyRaddoppiamentoFonosintattico('E bello', 'ɛ ˈbɛllo'))
      .toBe('ɛ ˈbbɛllo')
    expect(applyRaddoppiamentoFonosintattico('Da Roma', 'da ˈroːma'))
      .toBe('da ˈrroːma')
    expect(applyRaddoppiamentoFonosintattico('Più forte', 'pju ˈfɔrte'))
      .toBe('pju ˈffɔrte')
  })

  it('geminates after specific trigger words', () => {
    expect(applyRaddoppiamentoFonosintattico('Come va', 'ˈkoːme ˈva'))
      .toBe('ˈkoːme ˈvva')
    expect(applyRaddoppiamentoFonosintattico('Dove sei', 'ˈdoːve ˈsɛi̯'))
      .toBe('ˈdoːve ˈssɛi̯')
    expect(applyRaddoppiamentoFonosintattico('Qualche volta', 'ˈkwalke ˈvɔlta'))
      .toBe('ˈkwalke ˈvvɔlta')
    expect(applyRaddoppiamentoFonosintattico('Sopra la tavola', 'ˈsoːpra la ˈtaːvola'))
      .toBe('ˈsoːpra lla ˈtaːvola')
  })

  it('geminates pregeminant words when preceded by vowel', () => {
    expect(applyRaddoppiamentoFonosintattico('Mio dio', 'ˈmiːo ˈdiːo'))
      .toBe('ˈmiːo ˈddiːo')
    expect(applyRaddoppiamentoFonosintattico('Ave Maria', 'ˈaːve maˈriːa'))
      .toBe('ˈaːve mmaˈriːa')
    expect(applyRaddoppiamentoFonosintattico('Spirito Santo', 'ˈspiːrito ˈsanto'))
      .toBe('ˈspiːrito ˈssanto')
  })

  it('does not geminate after non-cogeminant monosyllables', () => {
    expect(applyRaddoppiamentoFonosintattico('Il cane', 'il ˈkane'))
      .toBe('il ˈkane')
    expect(applyRaddoppiamentoFonosintattico('Mai parla', 'ˈmai ˈparla'))
      .toBe('ˈmai ˈparla')
    expect(applyRaddoppiamentoFonosintattico('Poi cambia', 'ˈpoi ˈkambia'))
      .toBe('ˈpoi ˈkambia')
  })

  it('handles poetic de and ne as cogeminant', () => {
    expect(applyRaddoppiamentoFonosintattico('De Roma', 'de ˈroːma'))
      .toBe('de ˈrroːma')
  })

  it('geminates affricates correctly after cogeminant words', () => {
    // t͡ʃ (c dolce) — "che cena" → geminate the affricate, not just 't'
    expect(applyRaddoppiamentoFonosintattico('che cena', 'ke ˈt͡ʃeːna'))
      .toBe('ke ˈt͡ʃt͡ʃeːna')

    // d͡ʒ (g dolce) — "a giocare"
    expect(applyRaddoppiamentoFonosintattico('a giocare', 'a d͡ʒoˈkaːre'))
      .toBe('a d͡ʒd͡ʒoˈkaːre')

    // t͡s (z sorda) — "è zia"
    expect(applyRaddoppiamentoFonosintattico('è zia', 'ɛ ˈt͡siːa'))
      .toBe('ɛ ˈt͡st͡siːa')

    // d͡z (z sonora) — "a zero"
    expect(applyRaddoppiamentoFonosintattico('a zero', 'a ˈd͡zɛːro'))
      .toBe('a ˈd͡zd͡zɛːro')
  })

  it('does not geminate when next word starts with a vowel', () => {
    expect(applyRaddoppiamentoFonosintattico('a Enzo', 'a ˈɛnt͡so'))
      .toBe('a ˈɛnt͡so')
  })

  it('handles single-word input without crashing', () => {
    expect(applyRaddoppiamentoFonosintattico('casa', 'ˈkaːsa'))
      .toBe('ˈkaːsa')
  })

  it('returns original IPA on word count mismatch', () => {
    expect(applyRaddoppiamentoFonosintattico('una frase lunga', 'ˈuːna ˈfraːse'))
      .toBe('ˈuːna ˈfraːse')
  })

  it('does not geminate "ne" (clitic) despite being in prepositions list', () => {
    expect(applyRaddoppiamentoFonosintattico('ne parla', 'ne ˈparla'))
      .toBe('ne ˈparla')
  })
})
