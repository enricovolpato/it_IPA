// Type definitions for @echogarden/espeak-ng-emscripten
// Project: https://github.com/echogarden-project/espeak-ng-emscripten
// Definitions by: Dizionario IPA contributors

declare module '@echogarden/espeak-ng-emscripten' {
  export interface eSpeakNGWorker {
    set_voice(voice: string): void
    set_rate(rate: number): void
    set_pitch(pitch: number): void
    set_range(range: number): void
    synthesize(text: string, callback: (samples: Int16Array, events: any[]) => void): void
    synthesize_ipa(text: string): { ipa: string }
    list_voices(): any[]
  }

  export interface ESpeakModule {
    eSpeakNGWorker: new () => eSpeakNGWorker
  }

  export default function EspeakInitializer(): Promise<ESpeakModule>
}
