const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

module.exports = () => {
  // 1) resolve the path to your .env file
  const envPath = path.resolve(__dirname, '../.env')

  // 2) if it exists, load its vars into process.env
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
  }

  // 3) export a function that picks up all REACT_APP_* from process.env
  return Object.entries(process.env)
    .filter(([key]) => key.startsWith('REACT_APP_'))
    .reduce((acc, [key, val]) => {
      acc[`process.env.${key}`] = JSON.stringify(val)
      return acc
    }, {})
}
