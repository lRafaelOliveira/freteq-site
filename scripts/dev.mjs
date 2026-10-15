import { spawn } from 'node:child_process'

const isWin = process.platform === 'win32'
const npx = isWin ? 'npx.cmd' : 'npx'

const css = spawn(npx, ['tailwindcss', '-i', 'src/styles.css', '-o', 'public/assets/css/styles.css', '--watch'], {
  stdio: 'inherit',
  shell: isWin,
})
const server = spawn(process.execPath, ['scripts/serve.mjs'], { stdio: 'inherit' })

const stop = () => {
  css.kill()
  server.kill()
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
