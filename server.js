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

// Serve static assets (no fall‑through so 404 for missing files)
app.use(express.static(builtDirectory, { fallthrough: false }))

// SPA fallback: always return index.html
app.get('/{*splat}', async (req, res) => {
  await res.sendFile(path.join(builtDirectory, 'index.html'))
})

// Central error handler — catches rejections from async handlers automatically (v5)
app.use((err, req, res, next) => {
  console.error(err)
  if (res.headersSent) return next(err)
  res.status(500).send('Internal Server Error')
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
