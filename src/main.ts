import './style.css'
import { phonemize } from './core/espeak'

const app = document.querySelector<HTMLDivElement>('#app')

if (app) {
  app.innerHTML = `
    <div class="app-shell">
      <section class="panel">
        <div class="panel-head">
          <label class="panel-label" for="input-text">Testo di input</label>
          <div class="panel-actions inline-actions">
            <button id="clear-btn" class="ghost" type="button">Cancella tutto</button>
          </div>
        </div>
        <textarea id="input-text" placeholder="Scrivi o incolla un testo in italiano..."></textarea>
      </section>

      <section class="panel output-panel">
        <div class="panel-head">
          <label class="panel-label" for="output-text">Output IPA</label>
          <div class="panel-actions inline-actions">
            <button id="simplified-toggle" class="ghost toggle" type="button" aria-pressed="false">OUTPUT SEMPLIFICATO</button>
            <button id="copy-btn" class="ghost" type="button">Copia IPA</button>
          </div>
        </div>
        <pre id="output-text" aria-live="polite"></pre>
      </section>

      <section class="panel symbol-guide" aria-labelledby="ipa-guide-title">
        <div>
          <p class="panel-label">Guida rapida</p>
          <h2 id="ipa-guide-title">Simboli IPA usati nell'app</h2>
          <p class="panel-subtitle">Esempi rapidi per leggere l'output senza dubbi.</p>
        </div>
        <div class="symbol-grid">
          <div class="symbol-card">
            <div class="symbol">a</div>
            <div>
              <div class="symbol-name">a aperta</div>
              <div class="symbol-example">casa → /ˈka.sa/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">e</div>
            <div>
              <div class="symbol-name">e chiusa</div>
              <div class="symbol-example">perché → /perˈke/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ɛ</div>
            <div>
              <div class="symbol-name">e aperta</div>
              <div class="symbol-example">pèsca → /ˈpɛs.ka/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">i</div>
            <div>
              <div class="symbol-name">i</div>
              <div class="symbol-example">vino → /ˈvi.no/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">o</div>
            <div>
              <div class="symbol-name">o chiusa</div>
              <div class="symbol-example">dopo → /ˈdo.po/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ɔ</div>
            <div>
              <div class="symbol-name">o aperta</div>
              <div class="symbol-example">porta → /ˈpɔr.ta/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">u</div>
            <div>
              <div class="symbol-name">u</div>
              <div class="symbol-example">luna → /ˈlu.na/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">j</div>
            <div>
              <div class="symbol-name">semivocale j</div>
              <div class="symbol-example">ieri → /ˈjɛ.ri/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">w</div>
            <div>
              <div class="symbol-name">semivocale w</div>
              <div class="symbol-example">uomo → /ˈwɔ.mo/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ʃ</div>
            <div>
              <div class="symbol-name">suono sc</div>
              <div class="symbol-example">scena → /ˈʃe.na/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">s</div>
            <div>
              <div class="symbol-name">s sorda</div>
              <div class="symbol-example">sasso → /ˈsas.so/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">z</div>
            <div>
              <div class="symbol-name">s sonora</div>
              <div class="symbol-example">rosa → /ˈrɔza/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ɲ</div>
            <div>
              <div class="symbol-name">suono gn</div>
              <div class="symbol-example">gnocchi → /ˈɲɔk.ki/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ʎ</div>
            <div>
              <div class="symbol-name">suono gl</div>
              <div class="symbol-example">figlio → /ˈfiʎ.ʎo/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">t͡ʃ</div>
            <div>
              <div class="symbol-name">suono c/ci</div>
              <div class="symbol-example">cena → /ˈt͡ʃe.na/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">d͡ʒ</div>
            <div>
              <div class="symbol-name">suono g/gi</div>
              <div class="symbol-example">giro → /ˈd͡ʒi.ro/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">t͡s</div>
            <div>
              <div class="symbol-name">z sorda</div>
              <div class="symbol-example">zio → /ˈt͡sio/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">d͡z</div>
            <div>
              <div class="symbol-name">z sonora</div>
              <div class="symbol-example">zero → /ˈd͡ze.ro/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ˈ</div>
            <div>
              <div class="symbol-name">accento principale</div>
              <div class="symbol-example">città → /t͡ʃitˈtaː/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ː</div>
            <div>
              <div class="symbol-name">segno di lunghezza</div>
              <div class="symbol-example">città → /t͡ʃitˈtaː/</div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <footer class="app-footer">
      <div class="footer-brand">
        <img src="./pronuncia-icon.svg" alt="/t͡ʃoˈɛ/" />
        <div>
          <div class="footer-title">Dizionario IPA</div>
          <div class="footer-subtitle">Trascrizione IPA in tempo reale con eSpeak-ng.</div>
        </div>
      </div>
      <div class="footer-actions">
        <div class="status" id="status">Pronto</div>
        <button id="theme-toggle" class="ghost icon-button" type="button" aria-label="Tema scuro">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 14.5c-1.7 3.8-5.9 5.7-9.7 4.1-3.8-1.6-5.7-6-4.1-9.7C8.4 6 10.6 4.6 13 4.4c-1.8 2.7-1.1 6.5 2 8.5 2.1 1.4 4.8 1.6 6 1.6z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </footer>
  `
}

const input = document.querySelector<HTMLTextAreaElement>('#input-text')
const output = document.querySelector<HTMLPreElement>('#output-text')
const status = document.querySelector<HTMLDivElement>('#status')
const copyBtn = document.querySelector<HTMLButtonElement>('#copy-btn')
const clearBtn = document.querySelector<HTMLButtonElement>('#clear-btn')
const themeToggle = document.querySelector<HTMLButtonElement>('#theme-toggle')
const simplifiedToggle = document.querySelector<HTMLButtonElement>('#simplified-toggle')
let isSimplifiedOutput = false

const setStatus = (message: string) => {
  if (status) {
    status.textContent = message
  }
}

const updateOutput = async () => {
  if (!input || !output) {
    return
  }

  const value = input.value.trim()
  if (!value) {
    output.textContent = ''
    setStatus('Pronto')
    return
  }

  setStatus('Conversione...')
  const ipa = await phonemize(value)
  output.textContent = isSimplifiedOutput ? buildSimplifiedOutput(value, ipa) : ipa
  setStatus('Pronto')
}

input?.addEventListener('input', () => {
  void updateOutput()
})

clearBtn?.addEventListener('click', () => {
  if (input && output) {
    input.value = ''
    output.textContent = ''
    setStatus('Pronto')
  }
})

simplifiedToggle?.addEventListener('click', () => {
  isSimplifiedOutput = !isSimplifiedOutput
  simplifiedToggle.setAttribute('aria-pressed', String(isSimplifiedOutput))
  void updateOutput()
})

copyBtn?.addEventListener('click', async () => {
  if (!output) {
    return
  }

  const text = output.textContent ?? ''
  if (!text) {
    setStatus('Nulla da copiare')
    return
  }

  try {
    await navigator.clipboard.writeText(text)
    setStatus('Copiato')
  } catch {
    const helper = document.createElement('textarea')
    helper.value = text
    document.body.appendChild(helper)
    helper.select()
    document.execCommand('copy')
    helper.remove()
    setStatus('Copiato')
  }
})

const applyTheme = (theme: 'light' | 'dark') => {
  document.body.classList.toggle('theme-dark', theme === 'dark')
  themeToggle?.setAttribute('aria-label', theme === 'dark' ? 'Tema chiaro' : 'Tema scuro')
}

const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
applyTheme(storedTheme ?? 'light')

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('theme-dark')
  const nextTheme: 'light' | 'dark' = isDark ? 'dark' : 'light'
  localStorage.setItem('theme', nextTheme)
  themeToggle?.setAttribute('aria-label', isDark ? 'Tema chiaro' : 'Tema scuro')
})

const buildSimplifiedOutput = (originalText: string, ipaText: string): string => {
  const ipaWords = ipaText.split(/\s+/).filter(Boolean)
  const wordMatches = [...originalText.matchAll(/\p{L}+/gu)]

  if (wordMatches.length === 0 || ipaWords.length === 0) {
    return originalText
  }

  const result: string[] = []
  let lastIndex = 0
  let wordIndex = 0

  for (const match of wordMatches) {
    const matchIndex = match.index ?? 0
    const word = match[0]
    const ipaWord = ipaWords[wordIndex] ?? ''

    result.push(originalText.slice(lastIndex, matchIndex))

    let simplifiedWord = replaceLettersWithIpa(word, ipaWord)
    simplifiedWord = applyGeminationFromIpa(simplifiedWord, ipaWord)
    result.push(simplifiedWord)

    lastIndex = matchIndex + word.length
    wordIndex += 1
  }

  result.push(originalText.slice(lastIndex))
  return result.join('')
}

const replaceLettersWithIpa = (word: string, ipaWord: string): string => {
  const eTokens = [...ipaWord.matchAll(/[eɛ]/g)].map(match => match[0])
  const oTokens = [...ipaWord.matchAll(/[oɔ]/g)].map(match => match[0])
  const zTokens = extractZTokens(ipaWord)
  let eIndex = 0
  let oIndex = 0
  let zIndex = 0

  return word.replace(/[eEoOzZ]/g, (char) => {
    const lower = char.toLowerCase()
    if (lower === 'e') {
      const replacement = eTokens[eIndex]
      eIndex += 1
      return replacement ?? char
    }
    if (lower === 'o') {
      const replacement = oTokens[oIndex]
      oIndex += 1
      return replacement ?? char
    }
    const replacement = zTokens[zIndex]
    zIndex += 1
    return replacement ?? char
  })
}

const applyGeminationFromIpa = (word: string, ipaWord: string): string => {
  const geminated = getGeminatedConsonant(ipaWord)
  if (!geminated) {
    return word
  }

  const startsWithVowel = /^[aeiouàèéìòóù]/i.test(word)
  if (startsWithVowel) {
    return `${geminated}${geminated}${word}`
  }

  return `${geminated}${geminated}${word.slice(1)}`
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

const extractZTokens = (ipaWord: string): string[] => {
  const tokens: string[] = []
  const affricates = ['t͡s', 'd͡z']
  let index = 0

  while (index < ipaWord.length) {
    let matched = false

    for (const affricate of affricates) {
      if (ipaWord.startsWith(affricate, index)) {
        const nextIndex = index + affricate.length
        const isLong = ipaWord[nextIndex] === 'ː'
        tokens.push(affricate)
        if (isLong) {
          tokens.push(affricate)
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
    if (char === 'z') {
      const isLong = ipaWord[index + 1] === 'ː'
      tokens.push('z')
      if (isLong) {
        tokens.push('z')
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
