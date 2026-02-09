import './style.css'
import { phonemize } from './core/espeak'

const app = document.querySelector<HTMLDivElement>('#app')

if (app) {
  app.innerHTML = `
    <div class="app-shell">
      <header class="app-header">
        <div class="brand">
          <span class="brand-mark">IPA</span>
          <div>
            <h1>Dizionario IPA</h1>
            <p>Italian text to IPA, powered by eSpeak-ng (WASM).</p>
          </div>
        </div>
        <div class="status" id="status">Engine: not wired yet</div>
      </header>

      <section class="panel">
        <label class="panel-label" for="input-text">Input text</label>
        <textarea id="input-text" placeholder="Type or paste Italian text..."></textarea>
        <div class="panel-actions">
          <button id="example-btn" type="button">Load example</button>
          <button id="clear-btn" class="ghost" type="button">Clear</button>
        </div>
      </section>

      <section class="panel output-panel">
        <div class="panel-head">
          <label class="panel-label" for="output-text">IPA output</label>
          <button id="copy-btn" class="ghost" type="button">Copy IPA</button>
        </div>
        <pre id="output-text" aria-live="polite"></pre>
      </section>

      <section class="panel symbol-guide" aria-labelledby="ipa-guide-title">
        <div>
          <p class="panel-label">Quick guide</p>
          <h2 id="ipa-guide-title">Italian IPA symbols in this app</h2>
          <p class="panel-subtitle">Common symbols with quick examples to help you read the output.</p>
        </div>
        <div class="symbol-grid">
          <div class="symbol-card">
            <div class="symbol">a</div>
            <div>
              <div class="symbol-name">open a</div>
              <div class="symbol-example">casa → /ˈka.sa/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">e</div>
            <div>
              <div class="symbol-name">closed e</div>
              <div class="symbol-example">perché → /perˈke/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ɛ</div>
            <div>
              <div class="symbol-name">open e</div>
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
              <div class="symbol-name">closed o</div>
              <div class="symbol-example">dopo → /ˈdo.po/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ɔ</div>
            <div>
              <div class="symbol-name">open o</div>
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
              <div class="symbol-name">y sound</div>
              <div class="symbol-example">ieri → /ˈjɛ.ri/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">w</div>
            <div>
              <div class="symbol-name">w sound</div>
              <div class="symbol-example">uomo → /ˈwɔ.mo/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ʃ</div>
            <div>
              <div class="symbol-name">sh sound</div>
              <div class="symbol-example">scena → /ˈʃe.na/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ɲ</div>
            <div>
              <div class="symbol-name">gn sound</div>
              <div class="symbol-example">gnocchi → /ˈɲɔk.ki/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ʎ</div>
            <div>
              <div class="symbol-name">gl sound</div>
              <div class="symbol-example">figlio → /ˈfiʎ.ʎo/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">t͡ʃ</div>
            <div>
              <div class="symbol-name">c/ci sound</div>
              <div class="symbol-example">cena → /ˈt͡ʃe.na/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">d͡ʒ</div>
            <div>
              <div class="symbol-name">g/gi sound</div>
              <div class="symbol-example">giro → /ˈd͡ʒi.ro/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">t͡s</div>
            <div>
              <div class="symbol-name">z (voiceless)</div>
              <div class="symbol-example">zio → /ˈt͡sio/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">d͡z</div>
            <div>
              <div class="symbol-name">z (voiced)</div>
              <div class="symbol-example">zero → /ˈd͡ze.ro/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ˈ</div>
            <div>
              <div class="symbol-name">primary stress</div>
              <div class="symbol-example">città → /t͡ʃitˈtaː/</div>
            </div>
          </div>
          <div class="symbol-card">
            <div class="symbol">ː</div>
            <div>
              <div class="symbol-name">length mark</div>
              <div class="symbol-example">città → /t͡ʃitˈtaː/</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
}

const input = document.querySelector<HTMLTextAreaElement>('#input-text')
const output = document.querySelector<HTMLPreElement>('#output-text')
const status = document.querySelector<HTMLDivElement>('#status')
const copyBtn = document.querySelector<HTMLButtonElement>('#copy-btn')
const clearBtn = document.querySelector<HTMLButtonElement>('#clear-btn')
const exampleBtn = document.querySelector<HTMLButtonElement>('#example-btn')

const exampleText = 'Nel mezzo del cammin di nostra vita'

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
    setStatus('Ready')
    return
  }

  setStatus('Converting...')
  const ipa = await phonemize(value)
  output.textContent = ipa
  setStatus('Ready')
}

input?.addEventListener('input', () => {
  void updateOutput()
})

clearBtn?.addEventListener('click', () => {
  if (input && output) {
    input.value = ''
    output.textContent = ''
    setStatus('Ready')
  }
})

exampleBtn?.addEventListener('click', () => {
  if (input) {
    input.value = exampleText
    void updateOutput()
  }
})

copyBtn?.addEventListener('click', async () => {
  if (!output) {
    return
  }

  const text = output.textContent ?? ''
  if (!text) {
    setStatus('Nothing to copy')
    return
  }

  try {
    await navigator.clipboard.writeText(text)
    setStatus('Copied to clipboard')
  } catch {
    const helper = document.createElement('textarea')
    helper.value = text
    document.body.appendChild(helper)
    helper.select()
    document.execCommand('copy')
    helper.remove()
    setStatus('Copied to clipboard')
  }
})
