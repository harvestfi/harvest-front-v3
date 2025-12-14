import express from 'express'
import helmet from 'helmet'
import path from 'path'
import { fileURLToPath } from 'url'

// __dirname replacement in ESM
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const builtDirectory = path.join(dirname, 'build')
const PORT = process.env.PORT || '3000'
const app = express()

app.disable('x-powered-by')
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        frameAncestors: ['https://dapp-browser.apps.ledger.com/', 'https://app.safe.global/'],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://static.cloudflareinsights.com',
          'https://cdn.jsdelivr.net/npm/@ledgerhq/connect-kit@1',
          'https://cdn.usefathom.com/script.js',
          'https://tag.safary.club',
        ],
        connectSrc: ["'self'", '*'],
        imgSrc: ["'self'", 'https: data:'],
        frameSrc: ["'self'", 'https://verify.walletconnect.com/'],
      },
    },
    frameguard: false,
  }),
)

// Allow cross‑origin `GET /manifest.json`
app.use('/manifest.json', (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
  })
  next()
})

app.use(express.static(builtDirectory))

// SPA fallback: always return index.html
app.get('/{*splat}', async (req, res) => {
  await res.sendFile(path.join(builtDirectory, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
