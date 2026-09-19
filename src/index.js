import React from 'react'
import { createRoot } from 'react-dom/client'

const hsid = new URLSearchParams(window.location.search).get('hsid')
if (hsid) {
  localStorage.setItem('hsid', hsid)
}
import 'react-toastify/dist/ReactToastify.css'
import '@fontsource/roboto-mono'
import '@fontsource/roboto-mono/500.css'
import App from './App'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
