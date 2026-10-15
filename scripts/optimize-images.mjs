// Converts the original assets in .originals/ into optimized files in public/.
import sharp from 'sharp'
import { copyFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SRC = join(ROOT, '.originals')
const IMG = join(ROOT, 'public', 'assets', 'img')
const PUBLIC = join(ROOT, 'public')

const jobs = [
  { src: 'foto site freteq.png', out: 'hero-freteq', widths: [768, 1280, 1920], quality: 70 },
  { src: 'banner2.png', out: 'equipe-freteq', widths: [640, 1024], quality: 75 },
  { src: 'LOGO_SF.png', out: 'logo-freteq', widths: [256, 512], quality: 90 },
  { src: 'correios.webp', out: 'correios', height: 112, quality: 85 },
  { src: 'loggi.png', out: 'loggi', height: 112, quality: 85, trim: true },
  { src: 'total-express-logo-0.png', out: 'total-express', height: 112, quality: 85, trim: true },
  { src: 'J&T.jpg', out: 'jt-express', height: 112, quality: 85 },
  { src: 'braspress.png', out: 'braspress', height: 112, quality: 85, trim: true },
  { src: 'latam.png', out: 'latam', height: 112, quality: 85, trim: true },
]

await mkdir(IMG, { recursive: true })

for (const job of jobs) {
  const input = join(SRC, job.src)
  const base = () => (job.trim ? sharp(input).trim() : sharp(input))
  if (job.widths) {
    for (const width of job.widths) {
      const info = await base().resize({ width, withoutEnlargement: true }).webp({ quality: job.quality }).toFile(join(IMG, `${job.out}-${width}.webp`))
      console.log(`${job.out}-${width}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`)
    }
  } else {
    const info = await base().resize({ height: job.height, withoutEnlargement: true }).webp({ quality: job.quality }).toFile(join(IMG, `${job.out}.webp`))
    console.log(`${job.out}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`)
  }
}

const heroMobile = await sharp(join(SRC, 'foto site freteq.png'))
  .resize(720, 960, { fit: 'cover', position: 'centre' })
  .webp({ quality: 65 })
  .toFile(join(IMG, 'hero-freteq-mobile.webp'))
console.log(`hero-freteq-mobile.webp ${heroMobile.width}x${heroMobile.height} ${(heroMobile.size / 1024).toFixed(0)}KB`)

const og = await sharp(join(SRC, 'foto site freteq.png'))
  .resize(1200, 630, { fit: 'cover' })
  .composite([{ input: Buffer.from('<svg width="1200" height="630"><rect width="1200" height="630" fill="black" fill-opacity="0.55"/></svg>') }])
  .jpeg({ quality: 80 })
  .toBuffer()
const logo = await sharp(join(SRC, 'LOGO_SF.png')).trim().resize({ width: 640 }).negate({ alpha: false }).png().toBuffer()
const ogInfo = await sharp(og)
  .composite([{ input: logo, gravity: 'center' }])
  .jpeg({ quality: 80 })
  .toFile(join(PUBLIC, 'og-image.jpg'))
console.log(`og-image.jpg ${ogInfo.width}x${ogInfo.height}`)

for (const f of ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png']) {
  await copyFile(join(SRC, f), join(PUBLIC, f))
}
console.log('favicons copiados')
