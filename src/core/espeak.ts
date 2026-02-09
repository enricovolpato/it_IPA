import EspeakInitializer from '@echogarden/espeak-ng-emscripten'
import { postProcessItalianIPA } from './postprocessor'


let espeakInstance: any = null

/**
 * Initialize the eSpeak-ng WASM module
 */
async function initEspeak() {
  if (!espeakInstance) {
    // Initialize the Emscripten module
    const module = await EspeakInitializer()
    
    // Create an eSpeak worker instance
    espeakInstance = new module.eSpeakNGWorker()
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
