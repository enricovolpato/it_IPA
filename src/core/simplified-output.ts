const WORD_REGEX = /[\p{L}\p{N}]+(?:[’'][\p{L}\p{N}]+)*/gu

type Segment = {
  text: string
  italic: boolean
}

export const buildSimplifiedOutput = (originalText: string, ipaText: string): string => {
  return buildSimplifiedOutputSegments(originalText, ipaText).map(segment => segment.text).join('')
}

export const buildSimplifiedOutputHtml = (originalText: string, ipaText: string): string => {
  return buildSimplifiedOutputSegments(originalText, ipaText)
    .map(segment => renderSegment(segment))
    .join('')
}

const buildSimplifiedOutputSegments = (originalText: string, ipaText: string): Segment[] => {
  if (originalText.includes('\n') || ipaText.includes('\n')) {
    const originalLines = splitLines(originalText)
    const ipaLines = splitLines(ipaText)

    if (originalLines.length === ipaLines.length) {
      const lineSegments: Segment[] = []
      originalLines.forEach((line, index) => {
        lineSegments.push(...buildSimplifiedOutputSegmentsSingleLine(line, ipaLines[index] ?? ''))
        if (index < originalLines.length - 1) {
          lineSegments.push({ text: '\n', italic: false })
        }
      })
      return lineSegments
    }
  }

  return buildSimplifiedOutputSegmentsSingleLine(originalText, ipaText)
}

const buildSimplifiedOutputSegmentsSingleLine = (originalText: string, ipaText: string): Segment[] => {
  const ipaWords = ipaText.split(/\s+/).filter(Boolean)
  const wordMatches = [...originalText.matchAll(WORD_REGEX)]

  if (wordMatches.length === 0 || ipaWords.length === 0) {
    return [{ text: originalText, italic: false }]
  }

  if (wordMatches.length !== ipaWords.length) {
    console.warn('Word count mismatch between original and IPA text. Simplification skipped.')
  }

  const result: Segment[] = []
  let lastIndex = 0
  let wordIndex = 0

  for (const match of wordMatches) {
    const matchIndex = match.index ?? 0
    const word = match[0]
    const ipaWord = ipaWords[wordIndex] ?? ''

    result.push({ text: originalText.slice(lastIndex, matchIndex), italic: false })

    if (ipaWord) {
      const simplifiedSegments = simplifyWord(word, ipaWord)
      result.push(...simplifiedSegments)
    } else {
      result.push({ text: word, italic: false })
    }

    lastIndex = matchIndex + word.length
    wordIndex += 1
  }

  result.push({ text: originalText.slice(lastIndex), italic: false })
  return result
}

const splitLines = (text: string): string[] => text.split(/\r?\n/)

const isNumericToken = (word: string): boolean => /^\p{N}+$/u.test(word)

const simplifyWord = (word: string, ipaWord: string): Segment[] => {
  if (isNumericToken(word)) {
    return [{ text: word, italic: false }]
  }
  const baseSegments = replaceLettersWithIpa(word, ipaWord)
  return applyGeminationFromIpa(baseSegments, word, ipaWord)
}

const replaceLettersWithIpa = (word: string, ipaWord: string): Segment[] => {
  const eTokens = [...ipaWord.matchAll(/[eɛ]/g)].map(match => match[0])
  const oTokens = [...ipaWord.matchAll(/[oɔ]/g)].map(match => match[0])
  const szTokens = extractSZTokens(ipaWord)
  let eIndex = 0
  let oIndex = 0
  let szIndex = 0

  return [...word].map((char) => {
    const lower = char.toLowerCase()
    if (lower === 'e') {
      const replacement = eTokens[eIndex]
      eIndex += 1
      return { text: replacement ?? char, italic: Boolean(replacement) }
    }

    if (lower === 'o') {
      const replacement = oTokens[oIndex]
      oIndex += 1
      return { text: replacement ?? char, italic: Boolean(replacement) }
    }

    if (lower === 's' || lower === 'z') {
      const replacement = szTokens[szIndex]
      szIndex += 1
      if (!replacement) {
        return { text: char, italic: false }
      }
      return { text: applyCase(replacement, char), italic: true }
    }

    return { text: char, italic: false }
  })
}

const applyGeminationFromIpa = (segments: Segment[], word: string, ipaWord: string): Segment[] => {
  const geminated = getGeminatedConsonant(ipaWord)
  if (!geminated) {
    return segments
  }

  if (!isGeminationCompatible(word, geminated)) {
    return segments
  }

  const gemSegment = { text: `${geminated}${geminated}`, italic: true }
  const startsWithVowel = /^[aeiouàèéìòóù]/i.test(word)
  if (startsWithVowel) {
    return [gemSegment, ...segments]
  }

  return [gemSegment, ...segments.slice(1)]
}

const isGeminationCompatible = (word: string, geminated: string): boolean => {
  const lower = word.toLowerCase()

  if (/^[aeiouàèéìòóù]/i.test(word)) {
    return true
  }

  switch (geminated) {
    case 'p':
      return lower.startsWith('p')
    case 'b':
      return lower.startsWith('b')
    case 't':
      return lower.startsWith('t')
    case 'd':
      return lower.startsWith('d')
    case 'k':
      return lower.startsWith('c') || lower.startsWith('k') || lower.startsWith('q')
    case 'ɡ':
      return lower.startsWith('g')
    case 'f':
      return lower.startsWith('f')
    case 'v':
      return lower.startsWith('v')
    case 's':
      return lower.startsWith('s')
    case 'z':
      return lower.startsWith('z')
    case 'ʃ':
      return lower.startsWith('sc') || lower.startsWith('sci')
    case 'ʒ':
      return lower.startsWith('g')
    case 'm':
      return lower.startsWith('m')
    case 'n':
      return lower.startsWith('n')
    case 'ɲ':
      return lower.startsWith('gn')
    case 'l':
      return lower.startsWith('l')
    case 'ʎ':
      return lower.startsWith('gl')
    case 'r':
      return lower.startsWith('r')
    case 't͡ʃ':
      return lower.startsWith('c') || lower.startsWith('ci') || lower.startsWith('ce')
    case 'd͡ʒ':
      return lower.startsWith('g') || lower.startsWith('gi') || lower.startsWith('ge')
    case 't͡s':
    case 'd͡z':
      return lower.startsWith('z')
    default:
      return true
  }
}

const getGeminatedConsonant = (ipaWord: string): string | null => {
  const cleaned = ipaWord.replace(/^[ˈˌ]+/, '')
  const affricates = ['t͡ʃ', 'd͡ʒ', 't͡s', 'd͡z']

  for (const affricate of affricates) {
    if (cleaned.startsWith(affricate + affricate)) {
      return affricate
    }
    if (cleaned.startsWith(affricate) && cleaned.slice(affricate.length, affricate.length + 1) === 'ː') {
      return affricate
    }
  }

  const consonant = cleaned[0]
  if (consonant && cleaned[1] === 'ː') {
    return consonant
  }
  if (!consonant || cleaned[1] !== consonant) {
    return null
  }

  if (!/[pbktdɡfvszʃʒmnɲŋlʎr]/.test(consonant)) {
    return null
  }

  return consonant
}

const extractSZTokens = (ipaWord: string): string[] => {
  const tokens: string[] = []
  const affricates = ['t͡s', 'd͡z']
  let index = 0

  while (index < ipaWord.length) {
    let matched = false

    for (const affricate of affricates) {
      if (ipaWord.startsWith(affricate, index)) {
        const nextIndex = index + affricate.length
        const isLong = ipaWord[nextIndex] === 'ː'
        tokens.push('z')
        if (isLong) {
          tokens.push('z')
          index = nextIndex + 1
        } else {
          index = nextIndex
        }
        matched = true
        break
      }
    }

    if (matched) {
      continue
    }

    const char = ipaWord[index]
    if (char === 's' || char === 'z') {
      const isLong = ipaWord[index + 1] === 'ː'
      tokens.push(char)
      if (isLong) {
        tokens.push(char)
        index += 2
      } else {
        index += 1
      }
      continue
    }

    index += 1
  }

  return tokens
}

const applyCase = (token: string, template: string): string => {
  const isUpper = template.toUpperCase() === template && template.toLowerCase() !== template
  return isUpper ? token.toUpperCase() : token
}

const renderSegment = (segment: Segment): string => {
  const escaped = escapeHtml(segment.text)
  if (!segment.italic) {
    return escaped
  }
  return `<span class="ipa-emphasis">${escaped}</span>`
}

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
