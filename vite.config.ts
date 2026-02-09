import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? process.env.BASE_PATH ?? '/' : '/',
  plugins: [wasm(), topLevelAwait()],
  optimizeDeps: {
    exclude: ['@echogarden/espeak-ng-emscripten'],
  },
}))
