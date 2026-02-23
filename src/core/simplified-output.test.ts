import { describe, expect, it } from 'vitest'
import { buildSimplifiedOutput, buildSimplifiedOutputHtml } from './simplified-output'
import { phonemize } from './espeak'

describe('buildSimplifiedOutput', () => {
  it('keeps apostrophes inside words for alignment', () => {
    const original = "dall'incontro tra competenze"
    const ipa = 'dallinkˈontro tra kkompetˈɛnt͡se'

    expect(buildSimplifiedOutput(original, ipa)).toBe("dall'incontro tra kkompetɛnze")
  })

  it('preserves double z instead of IPA affricates', () => {
    const original = 'carrozzina'
    const ipa = 'karrot͡sːˈina'

    expect(buildSimplifiedOutput(original, ipa)).toBe('carrozzina')
  })

  it('replaces open and closed e/o vowels based on IPA', () => {
    const original = 'persone scelte'
    const ipa = 'pɛrˈsoːne ˈʃɛlte'

    expect(buildSimplifiedOutput(original, ipa)).toBe('pɛrsone scɛlte')
  })

  it('keeps original text on word count mismatch when no IPA words align', () => {
    const original = 'ciao'
    const ipa = 'ˈt͡ʃao extra'

    expect(buildSimplifiedOutput(original, ipa)).toBe('ciao')
  })

  it('still applies replacements when IPA has extra words', () => {
    const original = 'persone ACTIVE'
    const ipa = 'pɛrˈsoːne akˈtive extra'

    expect(buildSimplifiedOutput(original, ipa)).toBe('pɛrsone ACTIVe')
  })

  it('keeps numeric tokens to preserve alignment', () => {
    const original = 'Ha 4 scomparti regolabili'
    const ipa = 'a ˈkwattro skomˈparti reɡoˈlabiːli'

    expect(buildSimplifiedOutput(original, ipa)).toBe('Ha 4 scomparti regolabili')
  })

  it('does not geminate when IPA consonant mismatches word start', () => {
    const original = 'piccole'
    const ipa = 'ˈttikːole'

    expect(buildSimplifiedOutput(original, ipa)).toBe('piccole')
  })

  it('preserves line breaks and applies IPA replacements per line', () => {
    const original = 'persone\nscelte'
    const ipa = 'pɛrˈsoːne\nˈʃɛlte'

    expect(buildSimplifiedOutput(original, ipa)).toBe('pɛrsone\nscɛlte')
  })

  it('renders IPA spans in HTML output', () => {
    const original = 'persone'
    const ipa = 'pɛrˈsoːne'
    const html = buildSimplifiedOutputHtml(original, ipa)

    expect(html).toContain('p')
    expect(html).toContain('<span class="ipa-emphasis">ɛ</span>')
  })

  it('integrates with phonemize for apostrophes and double z', async () => {
    const original = "Ogni carrozzina nasce dall'incontro."
    const ipa = await phonemize(original)
    const simplified = buildSimplifiedOutput(original, ipa)

    expect(simplified).toContain('carrozzina')
    expect(simplified).toContain("dall'incontro")
    expect(simplified).not.toContain('t͡s')
    expect(simplified).not.toContain('d͡z')
    expect(simplified).not.toContain('͡')
  }, 20000)

  it('preserves word alignment on longer phrases', async () => {
    const original = "Progettiamo soluzioni su misura, partendo dalle persone."
    const ipa = await phonemize(original)
    const simplified = buildSimplifiedOutput(original, ipa)
    const wordCount = (value: string) => [...value.matchAll(/\p{L}+(?:[’']\p{L}+)*/gu)].length

    expect(wordCount(simplified)).toBe(wordCount(original))
  }, 20000)
  it('marks closed e as italic so it is always recognizable', () => {
    const original = 'bene'
    const ipa = 'ˈbɛːne'
    const html = buildSimplifiedOutputHtml(original, ipa)

    // Both e's should be italic — ɛ (open) and e (closed) are always highlighted
    const spans = html.match(/<span class="ipa-emphasis">[eɛ]<\/span>/g) ?? []
    expect(spans.length).toBe(2)
  })

  it('marks standard s as italic so it is always recognizable', () => {
    const original = 'sasso'
    const ipa = 'ˈsasso'
    const html = buildSimplifiedOutputHtml(original, ipa)

    expect(html).toContain('<span class="ipa-emphasis">s</span>')
  })

  it('marks voiced s→z replacement as italic', () => {
    const original = 'rosa'
    const ipa = 'ˈrɔːza'
    const html = buildSimplifiedOutputHtml(original, ipa)

    expect(html).toContain('<span class="ipa-emphasis">z</span>')
  })

  it('handles empty input gracefully', () => {
    expect(buildSimplifiedOutput('', '')).toBe('')
    expect(buildSimplifiedOutputHtml('', '')).toBe('')
  })

  it('handles punctuation-only input', () => {
    expect(buildSimplifiedOutput('!!!', '')).toBe('!!!')
  })

  it('handles geminated affricates in simplified output', () => {
    // t͡ʃt͡ʃ should be compatible with word starting with 'c'
    const original = 'cena'
    const ipa = 'ˈt͡ʃt͡ʃeːna'

    const result = buildSimplifiedOutput(original, ipa)
    expect(result).toContain('t͡ʃt͡ʃ')
  })

  it('handles multi-line input with mismatched line counts gracefully', () => {
    const original = 'prima\nseconda'
    const ipa = 'ˈpriːma sɛˈkonda'

    // line counts don't match, falls back to single-line processing
    const result = buildSimplifiedOutput(original, ipa)
    expect(result).toBeTruthy()
  })

  it('escapes HTML special characters in output', () => {
    const original = '<script>alert("xss")</script>'
    const ipa = 'ˈskript'
    const html = buildSimplifiedOutputHtml(original, ipa)

    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;')
    expect(html).toContain('&gt;')
  })})
