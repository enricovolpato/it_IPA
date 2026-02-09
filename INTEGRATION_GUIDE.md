# Integration Guide: Adding eSpeak-ng WASM to Your Project

This guide walks you through integrating eSpeak-ng WASM into a Vite + TypeScript project from scratch.

## Prerequisites

- Node.js 18+ installed
- Basic understanding of TypeScript and Vite
- Familiarity with async/await

## Step 1: Install Dependencies

```bash
npm install @echogarden/espeak-ng-emscripten
```

For Vite to properly handle WASM files, you also need:

```bash
npm install -D vite-plugin-wasm vite-plugin-top-level-await
```

## Step 2: Configure Vite

Update your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
  plugins: [
    wasm(),              // Enables WASM module loading
    topLevelAwait(),     // Allows top-level await for WASM init
  ],
  optimizeDeps: {
    // Prevent Vite from pre-bundling the WASM module
    exclude: ['@echogarden/espeak-ng-emscripten'],
  },
})
```

### Why These Plugins?

- **vite-plugin-wasm**: Vite doesn't support WASM out of the box. This plugin adds `?init` imports and proper WASM bundling.
- **vite-plugin-top-level-await**: WASM modules often need async initialization. This plugin enables top-level await.

## Step 3: Create the eSpeak Wrapper

Create `src/core/espeak.ts`:

```typescript
import { loadModule, type SpeakOptions } from '@echogarden/espeak-ng-emscripten'

// Singleton pattern: load module once and reuse
let espeakModule: Awaited<ReturnType<typeof loadModule>> | null = null

/**
 * Initialize the eSpeak-ng WASM module
 * This is called automatically by phonemize()
 */
async function initEspeak() {
  if (!espeakModule) {
    console.log('Loading eSpeak-ng WASM module...')
    espeakModule = await loadModule()
    console.log('eSpeak-ng ready')
  }
  return espeakModule
}

/**
 * Convert text to IPA phonemes
 * @param text - Text to convert
 * @param voice - Language/voice code (default: 'it' for Italian)
 * @returns IPA transcription
 */
export async function phonemize(
  text: string,
  voice: string = 'it'
): Promise<string> {
  const cleaned = text.trim()
  if (!cleaned) {
    return ''
  }

  try {
    const espeak = await initEspeak()

    const options: SpeakOptions = {
      voice,
      ssml: false,  // We're passing plain text, not SSML
    }

    const result = espeak.synthesize(cleaned, options)

    // The result object contains both audio and IPA
    if (result.ipa) {
      return result.ipa
    }

    return '[No IPA output]'
  } catch (error) {
    console.error('eSpeak error:', error)
    return `[Error: ${error instanceof Error ? error.message : 'Unknown error'}]`
  }
}

/**
 * Get list of available voices
 * Useful for language selection UI
 */
export async function getVoices(): Promise<string[]> {
  const espeak = await initEspeak()
  // Note: The actual API may vary - check the package docs
  return espeak.getVoices?.() || []
}
```

### Key Points

1. **Singleton Pattern**: Load the WASM module once and cache it
2. **Lazy Loading**: Module loads only when first needed
3. **Error Handling**: Wrap in try-catch to handle WASM errors gracefully
4. **Type Safety**: Import `SpeakOptions` type for better IDE support

## Step 4: Use in Your UI

In your `main.ts` or component:

```typescript
import { phonemize } from './core/espeak'

// Get DOM elements
const input = document.querySelector<HTMLTextAreaElement>('#input-text')!
const output = document.querySelector<HTMLPreElement>('#output-text')!
const status = document.querySelector<HTMLDivElement>('#status')!

// Handle input changes
input.addEventListener('input', async () => {
  const text = input.value.trim()
  
  if (!text) {
    output.textContent = ''
    status.textContent = 'Ready'
    return
  }

  status.textContent = 'Converting...'
  
  // Convert to IPA
  const ipa = await phonemize(text)
  
  output.textContent = ipa
  status.textContent = 'Ready'
})
```

## Step 5: Test It

Create a simple HTML structure:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>eSpeak Test</title>
  </head>
  <body>
    <div id="status">Loading...</div>
    <textarea id="input-text" placeholder="Type Italian text..."></textarea>
    <pre id="output-text"></pre>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Run the dev server:

```bash
npm run dev
```

Navigate to `http://localhost:5173` and type some Italian text!

## Troubleshooting

### Issue: "Failed to fetch WASM module"

**Cause**: Vite isn't properly configured for WASM.

**Fix**: Make sure you have both plugins installed and configured:
```typescript
plugins: [wasm(), topLevelAwait()]
```

### Issue: "Top-level await is not supported"

**Cause**: Missing top-level await plugin or old browser.

**Fix**: 
1. Install `vite-plugin-top-level-await`
2. Or use dynamic import:
   ```typescript
   import('./core/espeak').then(({ phonemize }) => {
     // Use phonemize here
   })
   ```

### Issue: Build works but production fails

**Cause**: Base path might be incorrect for GitHub Pages.

**Fix**: Set the base in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

### Issue: Module takes too long to load

**Cause**: WASM module is ~25 MB and downloads on first use.

**Optimization Ideas**:
1. Show a loading indicator
2. Pre-load on page load (not recommended for all use cases):
   ```typescript
   // At the top of main.ts
   import { phonemize } from './core/espeak'
   phonemize('').catch(() => {}) // Warm up the module
   ```
3. Use a CDN for faster downloads

### Issue: Getting strange IPA output

**Cause**: Wrong voice/language selected.

**Fix**: Make sure you're using the correct voice code:
```typescript
const ipa = await phonemize(text, 'it')  // Italian
```

Available common voices:
- `'en'` - English
- `'it'` - Italian
- `'es'` - Spanish
- `'fr'` - French
- `'de'` - German

## Advanced Usage

### Custom Voice Settings

```typescript
const result = espeak.synthesize(text, {
  voice: 'it',
  ssml: false,
  rate: 175,        // Speech rate (words per minute)
  pitch: 50,        // Pitch (0-100)
  volume: 100,      // Volume (0-200)
})
```

### Processing Multiple Texts

```typescript
async function phonemizeBatch(texts: string[]): Promise<string[]> {
  const results = await Promise.all(
    texts.map(text => phonemize(text))
  )
  return results
}
```

### Custom Error Messages

```typescript
export async function phonemize(text: string): Promise<string> {
  try {
    // ... conversion logic
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('voice')) {
        return '[Voice not found]'
      }
      if (error.message.includes('memory')) {
        return '[Out of memory]'
      }
    }
    return '[Conversion failed]'
  }
}
```

## Performance Tips

1. **Cache the module**: The singleton pattern already does this
2. **Debounce input**: Don't convert on every keystroke
   ```typescript
   let timeout: number
   input.addEventListener('input', () => {
     clearTimeout(timeout)
     timeout = setTimeout(async () => {
       const ipa = await phonemize(input.value)
       output.textContent = ipa
     }, 300)  // Wait 300ms after typing stops
   })
   ```
3. **Use Web Workers**: For heavy processing, run eSpeak in a worker
4. **Limit text length**: Very long texts can slow down conversion

## Deployment

### GitHub Pages

1. Build your app:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains everything needed, including WASM files

3. Deploy `dist/` to GitHub Pages (or use the included workflow)

### Other Platforms

The built app works on:
- Netlify
- Vercel
- Cloudflare Pages
- Any static host

Just upload the `dist/` folder!

## Next Steps

- Check [ARCHITECTURE.md](ARCHITECTURE.md) for deeper technical details
- See the [eSpeak-ng documentation](https://github.com/espeak-ng/espeak-ng/blob/master/docs/index.md) for voice options
- Explore the [Echogarden repo](https://github.com/echogarden-project/espeak-ng-emscripten) for API details

## Package Documentation

### @echogarden/espeak-ng-emscripten

**Version**: 0.3.5  
**License**: GPL-3.0  
**Size**: ~25 MB uncompressed  
**Repository**: https://github.com/echogarden-project/espeak-ng-emscripten

**Main API**:
```typescript
import { loadModule, type SpeakOptions } from '@echogarden/espeak-ng-emscripten'

const espeak = await loadModule()

const result = espeak.synthesize(text, {
  voice: 'it',
  ssml: false,
})

console.log(result.ipa)       // IPA transcription
console.log(result.audio)     // Audio data (Int16Array)
```

### vite-plugin-wasm

**Version**: 3.5+  
**License**: MIT  
**Purpose**: Enables WASM module loading in Vite

### vite-plugin-top-level-await

**Version**: Latest  
**License**: MIT  
**Purpose**: Enables top-level await for WASM initialization
