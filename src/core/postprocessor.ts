/**
 * Italian Phonological Post-Processor
 * 
 * Applies Italian phonological rules to IPA output, including:
 * - Raddoppiamento fonosintattico (phonosyntactic gemination)
 * - Other standard Italian pronunciation rules
 * 
 * Based on:
 * - https://it.wikipedia.org/wiki/Raddoppiamento_fonosintattico
 * - https://it.wikipedia.org/wiki/Dizione_della_lingua_italiana
 */

/**
 * Monosillabi cogeminanti (monosyllables that trigger gemination)
 * Organized by grammatical category as per Wikipedia sources
 */
const COGEMINANT_MONOSYLLABLES = {
  // Verbi (verbs)
  verbs: ['è', 'fu', 'ho', 'ha', 'vo', 'va', 'do', 'dà', 'da', 'fo', 'fa', 'fé', 'so', 'sa', 'sto', 'sta', 'stiè', 'può', 'dì'],
  
  // Congiunzioni (conjunctions)
  conjunctions: ['che', 'ché', 'e', 'ma', 'né', 'o', 'se'],
  
  // Pronomi (pronouns)
  pronouns: ['che', 'chi', 'ciò', 'sé', 'tu', 'me', 'te'],
  
  // Preposizioni (prepositions)
  prepositions: ['a', 'da', 'su', 'tra', 'fra', 'de', 'ne'],
  
  // Avverbi (adverbs)
  adverbs: ['su', 'sù', 'giù', 'qui', 'qua', 'lì', 'là', 'sì', 'no', 'già', 'più', 've', 'mo'],
  
  // Sostantivi (nouns)
  nouns: ['blu', 'co', 'dì', 'gru', 'gnu', 'pro', 're', 'sci', 'tè', 'tre'],
  
  // Troncamenti (truncations) - excluding 'po' and 'pro' (valoroso)
  truncations: ['fé', 'fra\'', 'pre\'', 'piè'],
  
  // Lettere e note musicali (letters and musical notes)
  letters: ['a', 'bi', 'ci', 'di', 'e', 'gi', 'i', 'o', 'pi', 'qu', 'cu', 'ti', 'u', 'vu', 'vi', 'be', 'ce', 'de', 'ge', 'pe', 'te', 've', 'ca', 'mi', 'chi', 'ni', 'csi', 'pi'],
  musicalNotes: ['do', 're', 'mi', 'fa', 'la', 'si']
};

/**
 * Altre parole cogeminanti (other words that trigger gemination)
 */
const OTHER_COGEMINANT_WORDS = ['come', 'dove', 'qualche', 'sopra'];

/**
 * Monosillabi NON cogeminanti (monosyllables that do NOT trigger gemination)
 * These are primarily articles and clitic pronouns
 */
const NON_COGEMINANT_MONOSYLLABLES = new Set([
  // Articoli (articles)
  'il', 'lo', 'la', 'i', 'gli', 'le',
  // Pronomi clitici (clitic pronouns)
  'mi', 'ti', 'si', 'ci', 'vi', 'li', 'ne'
]);

/**
 * Monosillabi con dittongo discendente che non innescano il raddoppiamento
 */
const NON_COGEMINANT_FALLING_DIPHTHONGS = new Set([
  'poi',
  'mai',
  'sei'
]);

/**
 * Parole pregeminanti (words that trigger gemination before them when preceded by vowel)
 */
const PREGEMINANT_WORDS = ['dio', 'dèi', 'dea', 'dee'];

/**
 * Consonanti non geminabili o con comportamento speciale
 * (consonants that don't geminate or have special behavior)
 * 
 * In standard Italian, most consonants can geminate, but there are some exceptions
 * and special cases depending on phonological context.
 */
const NON_GEMINABLE_CONSONANTS = new Set<string>([
  // Note: /ʃ/, /ʎ/, /ɲ/ can geminate but have restrictions
  // /dz/, /ts/ usually geminate as double letters (zz)
]);

/**
 * Flatten all cogeminant monosyllables into a single set for faster lookup
 */
const ALL_COGEMINANT_MONOSYLLABLES = new Set([
  ...COGEMINANT_MONOSYLLABLES.verbs,
  ...COGEMINANT_MONOSYLLABLES.conjunctions,
  ...COGEMINANT_MONOSYLLABLES.pronouns,
  ...COGEMINANT_MONOSYLLABLES.prepositions,
  ...COGEMINANT_MONOSYLLABLES.adverbs,
  ...COGEMINANT_MONOSYLLABLES.nouns,
  ...COGEMINANT_MONOSYLLABLES.truncations,
  ...COGEMINANT_MONOSYLLABLES.letters,
  ...COGEMINANT_MONOSYLLABLES.musicalNotes,
  ...OTHER_COGEMINANT_WORDS
]);

/**
 * Check if a word is oxytone (tronca - stressed on the last syllable)
 */
function isOxytone(word: string): boolean {
  // Words ending with an accent mark are oxytone
  return /[àèéìòóù]$/.test(word);
}

/**
 * Check if a word triggers raddoppiamento fonosintattico
 */
function isCogeminant(word: string): boolean {
  const normalized = word.toLowerCase().replace(/[.,;:!?'"]/g, '');
  
  // Check if it's explicitly NON-cogeminant
  if (NON_COGEMINANT_MONOSYLLABLES.has(normalized)) {
    return false;
  }

  if (NON_COGEMINANT_FALLING_DIPHTHONGS.has(normalized)) {
    return false;
  }
  
  // Check if it's in our list of cogeminant words
  if (ALL_COGEMINANT_MONOSYLLABLES.has(normalized)) {
    return true;
  }
  
  // Check if it's an oxytone (parola tronca)
  if (isOxytone(normalized)) {
    return true;
  }
  
  return false;
}

/**
 * Get the first consonant sound from an IPA string
 */
function getFirstConsonant(ipaWord: string): string | null {
  // Remove stress marks at the beginning
  const cleaned = ipaWord.replace(/^[ˈˌ]+/, '');
  
  // Match common IPA consonants at the start of the word
  const consonantMatch = cleaned.match(/^[pbktdɡfvszʃʒmnɲŋlʎrʝɟçʝβðɣχʁħʕʔ]/);
  if (consonantMatch) {
    return consonantMatch[0];
  }
  
  // Match affricates
  const affricateMatch = cleaned.match(/^(t͡ʃ|d͡ʒ|t͡s|d͡z)/);
  if (affricateMatch) {
    return affricateMatch[0];
  }
  
  return null;
}

/**
 * Geminate a consonant in IPA
 */
function geminateConsonant(consonant: string): string {
  // Affricates with tie bar
  if (consonant.includes('͡')) {
    return consonant + consonant;
  }
  
  // Check if already geminated (appears twice)
  if (consonant.length >= 2 && consonant[0] === consonant[1]) {
    return consonant;
  }
  
  // Single consonant: double it
  return consonant + consonant;
}

/**
 * Apply gemination to an IPA word, handling stress marks correctly
 */
function applyGeminationToIpaWord(ipaWord: string, consonantToGeminate: string): string {
  // Find any leading stress marks
  const stressMatch = ipaWord.match(/^[ˈˌ]+/);
  const stressMarks = stressMatch ? stressMatch[0] : '';
  
  // Get the rest of the word after stress marks
  const withoutStress = ipaWord.slice(stressMarks.length);
  
  // Check if the word starts with the consonant we want to geminate
  if (withoutStress.startsWith(consonantToGeminate)) {
    const geminated = geminateConsonant(consonantToGeminate);
    return stressMarks + geminated + withoutStress.slice(consonantToGeminate.length);
  }
  
  // If not found at start (shouldn't happen), return original
  return ipaWord;
}

/**
 * Check if a consonant can be geminated
 */
function canGeminate(consonant: string): boolean {
  if (!consonant) return false;
  
  // Most Italian consonants can geminate
  // Excluding non-geminable ones from our set
  const firstChar = consonant[0];
  return !NON_GEMINABLE_CONSONANTS.has(firstChar);
}

/**
 * Split text into words while preserving punctuation context
 */
function tokenize(text: string): string[] {
  // Split by spaces but keep punctuation attached to words
  return text.split(/\s+/).filter(word => word.length > 0);
}

/**
 * Clean a word of punctuation for processing
 */
function cleanWord(word: string): string {
  return word.toLowerCase().replace(/[.,;:!?'"«»„""]/g, '');
}

/**
 * Apply raddoppiamento fonosintattico rules to IPA output
 * 
 * @param originalText The original Italian text
 * @param ipaText The IPA transcription from eSpeak
 * @returns Modified IPA with raddoppiamento fonosintattico applied
 */
export function applyRaddoppianmentoFonosintattico(
  originalText: string,
  ipaText: string
): string {
  // Tokenize both original text and IPA
  const words = tokenize(originalText);
  const ipaWords = ipaText.split(/\s+/);
  
  // If word counts don't match, we can't reliably apply rules
  // Return original IPA
  if (words.length !== ipaWords.length) {
    console.warn('Word count mismatch between original and IPA text. RAF not applied.');
    return ipaText;
  }
  
  // Process each word pair
  const processedIpaWords: string[] = [];
  
  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i];
    const currentIpa = ipaWords[i];
    const cleanedWord = cleanWord(currentWord);
    
    // Check if previous word triggers raddoppiamento
    if (i > 0) {
      const previousWord = words[i - 1];
      const cleanedPrevious = cleanWord(previousWord);

      if (cleanedPrevious === 'ave' && cleanedWord === 'maria') {
        const firstConsonant = getFirstConsonant(currentIpa);

        if (firstConsonant && canGeminate(firstConsonant)) {
          const modifiedIpa = applyGeminationToIpaWord(currentIpa, firstConsonant);
          processedIpaWords.push(modifiedIpa);
          continue;
        }
      }

      if (cleanedPrevious === 'spirito' && cleanedWord === 'santo') {
        const firstConsonant = getFirstConsonant(currentIpa);

        if (firstConsonant && canGeminate(firstConsonant)) {
          const modifiedIpa = applyGeminationToIpaWord(currentIpa, firstConsonant);
          processedIpaWords.push(modifiedIpa);
          continue;
        }
      }
      
      // Check cogeminant condition
      if (isCogeminant(cleanedPrevious)) {
        // Get first consonant of current word's IPA
        const firstConsonant = getFirstConsonant(currentIpa);
        
        if (firstConsonant && canGeminate(firstConsonant)) {
          // Apply gemination
          const modifiedIpa = applyGeminationToIpaWord(currentIpa, firstConsonant);
          processedIpaWords.push(modifiedIpa);
          continue;
        }
      }
      
      // Check pregeminant words (dio, dea, etc.) when previous word ends in vowel
      if (PREGEMINANT_WORDS.includes(cleanedWord) && /[aeiouàèéìòóù]$/i.test(cleanedPrevious)) {
        const firstConsonant = getFirstConsonant(currentIpa);
        
        if (firstConsonant && canGeminate(firstConsonant)) {
          const modifiedIpa = applyGeminationToIpaWord(currentIpa, firstConsonant);
          processedIpaWords.push(modifiedIpa);
          continue;
        }
      }
    }
    
    // No modification needed
    processedIpaWords.push(currentIpa);
  }
  
  return processedIpaWords.join(' ');
}

/**
 * Main post-processing function that applies all Italian phonological rules
 * 
 * @param originalText The original Italian text
 * @param ipaText The IPA transcription from eSpeak
 * @returns Post-processed IPA with Italian phonological rules applied
 */
export function postProcessItalianIPA(
  originalText: string,
  ipaText: string
): string {
  // Apply raddoppiamento fonosintattico
  let processed = applyRaddoppianmentoFonosintattico(originalText, ipaText);
  
  // Additional rules can be added here:
  // - Vowel quality adjustments (è vs é, ò vs ó)
  // - S-voicing rules (casa, rosa, etc.)
  // - Z-voicing rules
  // - Regional variations
  
  return processed;
}
