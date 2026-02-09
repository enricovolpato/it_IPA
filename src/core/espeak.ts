import EspeakInitializer from '@echogarden/espeak-ng-emscripten'
import { postProcessItalianIPA } from './postprocessor'

const ESPEAK_INIT_TIMEOUT_MS = 15000

let espeakInstance: any = null
let espeakInitPromise: Promise<any> | null = null

const withTimeout = async <T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeoutPromise = new Promise<T>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    return await Promise.race([promise, timeoutPromise])
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

/**
 * Initialize the eSpeak-ng WASM module
 */
async function initEspeak() {
  if (!espeakInstance) {
    if (!espeakInitPromise) {
      espeakInitPromise = (async () => {
        // Initialize the Emscripten module
        const module = await withTimeout(EspeakInitializer(), ESPEAK_INIT_TIMEOUT_MS, 'eSpeak init')
        
        // Create an eSpeak worker instance
        espeakInstance = new module.eSpeakNGWorker()
        return espeakInstance
      })()
    }

    try {
      await espeakInitPromise
    } catch (error) {
      espeakInitPromise = null
      throw error
    }
  }
  return espeakInstance
}

/**
 * Convert Italian text to IPA phonemes using eSpeak-ng
 * @param text - Italian text to convert
 * @returns IPA transcription
 */
export async function phonemize(text: string): Promise<string> {
  const cleaned = text.trim()
  if (!cleaned) {
    return ''
  }

  try {
    const espeak = await initEspeak()

    // Set voice to Italian
    espeak.set_voice('it')

    // Get IPA phonemes for the text
    const ipaResult = espeak.synthesize_ipa(cleaned)

    // Clean up the IPA output by removing phoneme separators while preserving word boundaries
    const ipa = ipaResult.ipa || ''
    const cleanedIpa = ipa
      .replace(/_+/g, '')   // Remove phoneme separators
      .replace(/ +/g, ' ')  // Normalize multiple spaces to single space
      .trim()

    // Apply Italian phonological post-processing (including raddoppiamento fonosintattico)
    const postProcessed = postProcessItalianIPA(cleaned, cleanedIpa)
    
    return postProcessed
  } catch (error) {
    console.error('eSpeak error:', error)
    return `[Error: ${error instanceof Error ? error.message : 'Unknown error'}]`
  }
}
