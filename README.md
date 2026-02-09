# Dizionario IPA

> Italian text to IPA converter powered by eSpeak-ng (WASM)

A GPL-3.0 open source web application that converts Italian text to International Phonetic Alphabet (IPA) notation, running entirely in your browser with no server required.

**🌐 Live Demo**: *Coming soon on GitHub Pages*

## Features

- ✨ **Real-time conversion** - Type Italian text and get instant IPA output
- 🎯 **Phonological accuracy** - Applies raddoppiamento fonosintattico and other Italian phonological rules
- 🌍 **Browser-based** - No server, no API keys, all processing happens locally
- 🚀 **Fast** - WebAssembly-powered eSpeak-ng engine
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🔒 **Private** - Your text never leaves your browser
- 📖 **Open Source** - GPL-3.0 licensed, fully transparent

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/dizionario.git
cd dizionario

# Install dependencies
npm install

# Run development server
npm run dev
```

Navigate to `http://localhost:5173` and start converting!

### Build for Production

```bash
npm run build    # Output to dist/
npm run preview  # Preview the production build
```

## Project Structure

```
dizionario/
├── src/
│   ├── core/
│   │   ├── espeak.ts           # eSpeak-ng WASM integration
│   │   └── postprocessor.ts    # Italian phonological post-processing
│   ├── main.ts                 # Application entry & UI logic
│   └── style.css               # Styles
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── INTEGRATION_GUIDE.md        # Step-by-step integration guide
├── LICENSE                     # GPL-3.0 license
└── README.md                   # This file
```

## Technologies & Packages

### Core Stack
- **Vite 7.3+** - Build tool and dev server
- **TypeScript 5.9+** - Type-safe JavaScript
- **eSpeak-ng (WASM)** - Text-to-speech engine compiled to WebAssembly

### Key Dependencies

| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `@echogarden/espeak-ng-emscripten` | 0.3.5 | eSpeak-ng WASM module | GPL-3.0 |
| `vite-plugin-wasm` | 3.5+ | WASM bundling for Vite | MIT |
| `vite-plugin-top-level-await` | Latest | Top-level await support | MIT |
| `vitest` | 2.1+ | Testing framework | MIT |

### Development Dependencies
- TypeScript compiler
- Vite dev server
- ESLint (optional)

## Documentation

- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Step-by-step guide to integrate eSpeak-ng WASM into your own project

## Usage

### Basic Usage

1. Type or paste Italian text into the input field
2. IPA transcription appears instantly in the output area
3. Click "Copy IPA" to copy to clipboard
4. Use "Load example" to see a sample text
5. "Clear" removes all text

### Example

**Input**: `Nel mezzo del cammin di nostra vita`

**Output**: `nɛl mˈɛddzo ddɛl kammˈin ddi nnˈɔstra vˈiːta`

Notice the raddoppiamento fonosintattico applied:
- "del" → "ddɛl" (after "mezzo", which ends with a stressed vowel)
- "di" → "ddi" (after "cammin", which ends with a stressed vowel)  
- "nostra" → "nnɔstra" (after "di", a cogeminant monosyllable)

### Phonological Features

The app applies several Italian phonological rules automatically:

**Raddoppiamento Fonosintattico (Phonosyntactic Gemination)**:
- After oxytone words (parole tronche): "città bella" → /tʃitˈtaː ˈbbɛlla/
- After cogeminant monosyllables: "a casa" → /a ˈkkaːsa/
- After specific words: "come va" → /ˈkoːme vˈva/

Based on authoritative sources:
- [Wikipedia: Raddoppiamento fonosintattico](https://it.wikipedia.org/wiki/Raddoppiamento_fonosintattico)
- [Wikipedia: Dizione della lingua italiana](https://it.wikipedia.org/wiki/Dizione_della_lingua_italiana)

### Supported Text

- Plain Italian text (no markup)
- Sentences, paragraphs, or single words
- Punctuation is preserved in output

## Development

### Run Tests

```bash
npm run test        # Run tests in watch mode
npm run test:run    # Run tests once
```

### Development Server

```bash
npm run dev
```

Features:
- Hot Module Replacement (HMR)
- Instant updates on save
- TypeScript type checking
- WASM module hot reload

### Build Pipeline

```bash
npm run build
```

Steps:
1. TypeScript compilation (`tsc`)
2. Vite bundling and optimization
3. WASM files copied to `dist/`
4. Minification and tree-shaking
5. Output to `dist/` folder

## Deployment

### GitHub Pages (Automatic)

This repo includes a GitHub Actions workflow that automatically deploys to GitHub Pages on push to `main`:

1. Enable GitHub Pages in repo settings (Source: GitHub Actions)
2. Push to `main` branch
3. Workflow builds and deploys automatically
4. Site available at `https://YOUR_USERNAME.github.io/dizionario/`

### Manual Deployment

For other platforms (Netlify, Vercel, Cloudflare Pages):

```bash
npm run build
```

Upload the `dist/` folder to your hosting provider.

**Important**: Set the base path if deploying to a subdirectory:
```bash
BASE_PATH=/your-repo-name/ npm run build
```

## Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome | 61+ |
| Firefox | 60+ |
| Safari | 11+ |
| Edge | 16+ |

Requirements:
- WebAssembly support
- ES Modules support
- Async/await support

## Performance

| Metric | Value |
|--------|-------|
| Initial load (cold) | ~2-3s |
| Initial load (cached) | ~200ms |
| Average conversion | 50-100ms |
| Bundle size (gzipped) | ~8 MB |

*Note: Most of the size is the eSpeak-ng WASM module and Italian language data*

## Contributing

Contributions are welcome! This project follows the GPL-3.0 license.

### Areas for Contribution
- Enhance phonological rules (vowel quality, S-voicing, Z-voicing)
- Build an exceptions lexicon for irregular words
- Implement syllabification
- Add stress detection
- Support regional variants
- Improve UI/UX
- Write tests
- Improve documentation

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test:run`)
5. Build to verify (`npm run build`)
6. Commit (`git commit -m 'Add amazing feature'`)
7. Push to your fork (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Roadmap

- [x] Raddoppiamento fonosintattico (phonosyntactic gemination)
- [ ] Vowel quality rules (è/é open vs closed, ò/ó open vs closed)
- [ ] S-voicing rules (casa, rosa, etc.)
- [ ] Z-voicing rules
- [ ] Exceptions dictionary (JSON file with irregular words)
- [ ] Syllable boundary markers
- [ ] Stress inference for unmarked words
- [ ] Audio playback option
- [ ] Batch processing (convert multiple texts)
- [ ] Export options (CSV, JSON, plain text)
- [ ] Regional pronunciation variants
- [ ] Dark mode
- [ ] Keyboard shortcuts

## Credits

### Built With

- [eSpeak-ng](https://github.com/espeak-ng/espeak-ng) - Text-to-speech engine
- [Echogarden Project](https://github.com/echogarden-project/espeak-ng-emscripten) - WASM compilation
- [Vite](https://vitejs.dev) - Build tool
- Italian phonological rules from authoritative linguistic sources

### Acknowledgments

- eSpeak-ng developers for the amazing TTS engine
- Echogarden project for the WASM compilation
- Wikipedia Italian linguistics community for comprehensive documentation of Italian phonology
- Contributors and testers

## License

This project is licensed under the **GNU General Public License v3.0 or later** (GPL-3.0-or-later).

See [LICENSE](LICENSE) file for details.

### Why GPL-3.0?

This project uses eSpeak-ng, which is GPL-3.0 licensed. To comply with GPL requirements and keep the project fully open, we've adopted the same license.

## Support

- 🐛 **Bug reports**: Open an issue on GitHub
- 💡 **Feature requests**: Open an issue with the "enhancement" label
- 💬 **Questions**: Open a discussion on GitHub
- 📧 **Contact**: [Create an issue](https://github.com/YOUR_USERNAME/dizionario/issues)

## Status

**Current Version**: 0.0.0 (MVP)

**Status**: ✅ Enhanced - eSpeak-ng integrated with Italian phonological post-processing

The application now includes raddoppiamento fonosintattico and is ready for additional Italian phonological rule enhancements.

---

Made with ❤️ for Italian language learners and linguists
