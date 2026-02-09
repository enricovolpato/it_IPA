# Italian Phonological Post-Processing

This document describes the phonological rules implemented in the post-processor module.

## Overview

The `postprocessor.ts` module applies Italian phonological rules to the IPA output from eSpeak-ng, improving accuracy for standard Italian pronunciation.

## Raddoppiamento Fonosintattico

**Raddoppiamento fonosintattico** (phonosyntactic gemination) is a phonological phenomenon in Italian where the initial consonant of a word is geminated (doubled) in certain syntactic contexts.

### When RAF Occurs

#### 1. After Oxytone Words (Parole Tronche)

Words ending with a stressed vowel trigger gemination of the following word's initial consonant.

**Examples**:
- "La città nuova" → `/la tʃitˈtaː ˈnnwɔːva/`
- "Andrò subito" → `/andˈrɔ sˈsuːbito/`

#### 2. After Cogeminant Monosyllables

Specific monosyllables trigger gemination. These include:

**Verbs**:
- `è, fu, ho, ha, vo, va, do, dà, da, fo, fa, fé, so, sa, sto, sta, stiè, può, dì`

**Conjunctions**:
- `che (ché), e, ma, né, o, se`

**Pronouns**:
- `che, chi, ciò, sé, tu, me, te`

**Prepositions**:
- `a, da, su, tra, fra`  
- Also: `de, ne` in poetry

**Adverbs**:
- `su (sù), giù, qui, qua, lì, là, sì, no, già, più, ve, mo`

**Nouns**:
- `blu, co, dì, gru, gnu, pro, re, sci, tè, tre`

**Truncations** (excluding `po'` and `pro'` meaning "valoroso"):
- `fé(de), fra'(te), a mo'(do) di, pre'(te), piè(de)`

**Letters and musical notes**:
- All letter names and musical note names

**Examples**:
- "Andiamo a casa" → `/anˈdjaːmo a ˈkkaːsa/`
- "È bello" → `/ɛ ˈbbɛllo/`
- "da Roma" → `/da ˈrroːma/`
- "più forte" → `/pju ˈffɔrte/`

#### 3. After Specific Words

Certain words always trigger gemination:
- `come, dove, qualche, sopra`

**Examples**:
- "Come va?" → `/ˈkoːme vˈva/`
- "Dove sei?" → `/ˈdoːve sˈsɛi̯/`
- "Qualche volta" → `/ˈkwalke vˈvɔlta/`
- "Sopra la tavola" → `/ˈsoːpra llaˈtaːvola/`

#### 4. Pregeminant Words

Words like `dio, dèi, dea, dee` trigger gemination when *preceded* by a vowel:
- "Mio Dio" → `/ˈmiːo dˈdiːo/`

Special cases:
- "Ave Maria" → `/ˈaːve mmaˈriːa/`
- "Spirito Santo" → `/ˈspiːrito sˈsanto/`

### Words That Do NOT Trigger RAF

**Articles**:
- `il, lo, la, i, gli, le`

**Clitic pronouns**:
- `mi, ti, si, ci, vi, li, ne`

**Monosyllables with falling diphthongs**:
- `poi, mai, sei` (the noun), etc.

### Implementation Details

The post-processor:

1. **Tokenizes** the original Italian text and IPA output
2. **Matches** words from text to IPA representations
3. **Identifies** cogeminant contexts (previous word is oxytone or cogeminant monosyllable)
4. **Extracts** the first consonant of the target word (handling stress marks)
5. **Geminates** the consonant by doubling it
6. **Preserves** stress marks in their correct position

#### Edge Cases Handled

- **Stress marks**: IPA words like `ˈbɛllo` have the stress mark before the consonant
  - Gemination produces: `ˈbbɛllo` (not `bˈbɛllo`)
- **Affricates**: Sounds like `/t͡ʃ/` are doubled as a unit: `/t͡ʃt͡ʃ/`
- **Word boundaries**: Only processes words that can be reliably matched between text and IPA
- **Non-geminable consonants**: Future versions may exclude specific consonants

## Future Enhancements

### Vowel Quality Rules

Implement rules for open vs. closed vowels:
- **è** (open) vs. **é** (closed)
- **ò** (open) vs. **ó** (closed)

Based on etymological rules and exceptions.

### S-Voicing

Italian /s/ has complex voicing rules:
- Word-initial + vowel: voiceless `/s/` (Sara)
- Intervocalic: often voiced `/z/` (casa, rosa) with many exceptions
- Before voiceless consonant: voiceless `/s/` (spuntare)
- Before voiced consonant: voiced `/z/` (sbranare)

### Z-Voicing

Italian /z/ (actually affricates /ts/ or /dz/) also has complex distribution:
- Generally voiceless `/ts/` in certain contexts
- Voiced `/dz/` in others
- Many exceptions and regional variations

### Syllabification

Add explicit syllable boundaries in IPA output:
- "casa" → `/ˈka.sa/`
- "bello" → `/ˈbɛl.lo/`

## Sources

All rules are based on authoritative linguistic sources:

### Primary Sources

1. **Wikipedia: Raddoppiamento fonosintattico**  
   https://it.wikipedia.org/wiki/Raddoppiamento_fonosintattico
   
   Comprehensive documentation of RAF rules, contexts, and examples.

2. **Wikipedia: Dizione della lingua italiana**  
   https://it.wikipedia.org/wiki/Dizione_della_lingua_italiana
   
   Standard Italian pronunciation rules including vowel qualities, consonant voicing, and raddoppiamento fonosintattico.

### Reference Works Cited in Sources

- **Dizionario di Ortografia e di Pronunzia (DOP)** - Bruno Migliorini, Carlo Tagliavini, Piero Fiorelli (RAI)
- **Dizionario di Pronuncia Italiana (DiPI)** - Luciano Canepari
- Various academic linguistics publications on Italian phonology

## Technical Notes

### IPA Notation Conventions

- Primary stress: `ˈ` (before stressed syllable)
- Secondary stress: `ˌ` (before syllable with secondary stress)
- Long vowel: `ː` (after vowel)
- Geminate consonant: consonant written twice (e.g., `kk`, `nn`, `bb`)

### Limitations

1. **eSpeak-ng base output**: The quality of RAF application depends on eSpeak's initial IPA output accuracy
2. **Context ambiguity**: Some cases are ambiguous without semantic or pragmatic information
3. **Regional variation**: Standard Italian RAF rules don't apply equally across all regions
4. **Stylistic variation**: Formal vs. informal speech may have different RAF patterns

### Testing

The implementation includes unit tests for:
- Common cogeminant monosyllables (`a casa`, `è bello`, `da Roma`)
- Oxytone words (`città nuova`)
- Special trigger words (`come va`)
- Non-cogeminant words (articles, clitics)
- Stress mark handling

## Contributing

When adding new phonological rules:

1. **Document** the linguistic rule with examples
2. **Cite sources** (preferably authoritative linguistic references)
3. **Add tests** for the rule and edge cases
4. **Update** this document with the rule description
5. **Consider** regional variations and exceptions

## References

- Canepari, L. (1999). *Manuale di Pronuncia Italiana* (MaPI). Bologna: Zanichelli.
- Loporcaro, M. (1997). *L'origine del raddoppiamento fonosintattico*. Basel: Francke Verlag.
- Marotta, G. (2011). "Raddoppiamento sintattico" in *Enciclopedia dell'Italiano*, Treccani.
- Serianni, L. (2003). *Italiano*. Milano: Garzanti.
