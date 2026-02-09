import { mkdir, copyFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const sourceFile = path.join(
  projectRoot,
  'node_modules',
  '@echogarden',
  'espeak-ng-emscripten',
  'espeak-ng.data'
)
const targetDir = path.join(projectRoot, 'public', 'assets')
const targetFile = path.join(targetDir, 'espeak-ng.data')

const ensureFile = async () => {
  try {
    await access(sourceFile)
  } catch {
    throw new Error('Missing source file: node_modules/@echogarden/espeak-ng-emscripten/espeak-ng.data')
  }

  await mkdir(targetDir, { recursive: true })
  await copyFile(sourceFile, targetFile)
}

ensureFile().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
