const express = require('express')
const helmet = require('helmet')
const path = require('path')

const builtDirectory = path.join(__dirname, 'build')
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
        ],
        connectSrc: ["'self'", '*'],
        imgSrc: ["'self'", 'https: data:'],
      },
    },
    frameguard: false,
  }),
)

app.use('/manifest.json', function addOrigin(req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
  })
  next()
})

app.use(express.static(builtDirectory))
app.get('*', (req, res) => res.sendFile(path.join(builtDirectory, 'index.html')))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
