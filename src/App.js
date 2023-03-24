import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'
import { get } from 'lodash'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Farm from './pages/Farm'
import Analytic from './pages/Analytic'
import FAQ from './pages/FAQ'
import Sidebar from './components/Sidebar'
import WidoDetail from './pages/WidoDetail'
import { RESTRICTED_COUNTRIES, ROUTES } from './constants'
import { Body, GlobalStyle } from './components/GlobalStyle'
import Modal from './components/Modal'
import HeaderBanner from './components/HeaderBanner'
import Providers from './providers'
import '@fontsource/work-sans'
import '@fontsource/dm-sans'
import 'bootstrap/dist/css/bootstrap.min.css'

const RestrictCountries = () => {
  const [open, setOpen] = useState(false)
  const RCountriesAcknowledgedField = localStorage.getItem('RCountriesAcknowledged')

  useEffect(() => {
    const checkIPLocation = async () => {
      const geoResponse = await axios.get('https://geolocation-db.com/json/')
      const countryCode = get(geoResponse, 'data.country_code')

      if (RESTRICTED_COUNTRIES.includes(countryCode)) {
        setOpen(true)
      }
    }

    if (!RCountriesAcknowledgedField) {
      checkIPLocation()
    }
  }, [RCountriesAcknowledgedField])

  return (
    <>
      {RCountriesAcknowledgedField ? (
        <HeaderBanner>
          You indicated that you are not from a restricted country.{' '}
          <span
            role="tab"
            tabIndex={0}
            aria-hidden="true"
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => {
              localStorage.removeItem('RCountriesAcknowledged')
              setOpen(true)
            }}
          >
            Click here for details
          </span>
        </HeaderBanner>
      ) : null}
      {!RCountriesAcknowledgedField ? (
        <Modal
          title="Warning"
          confirmationLabel="I confirm I am not subject to these restrictions"
          open={open}
          onClose={() => {
            localStorage.setItem('RCountriesAcknowledged', true)
            setOpen(false)
          }}
        >
          Due to regulatory uncertainty, <b>Harvest</b> is not available to people or companies who
          are residents in the <b>United States</b> or a restricted territory, or are subject to
          other restrictions.
        </Modal>
      ) : null}
    </>
  )
}

const App = () => (
  <Router>
    <GlobalStyle />
    <ToastContainer />
    <RestrictCountries />
    <Providers>
      <Body id="page-content">
        <Sidebar width="320px" />
        <Switch>
          <Route exact path={ROUTES.MAIN}>
            <Redirect to={ROUTES.HOME} />
          </Route>
          <Route exact path={ROUTES.HOME} component={Home} />
          <Route exact path={ROUTES.DASHBOARD} component={Dashboard} />
          <Route exact path={ROUTES.FARM} component={Farm} />
          <Route exact path={ROUTES.ANALYTIC} component={Analytic} />
          <Route path={ROUTES.WIDODETAIL} component={WidoDetail} />
          <Route path={ROUTES.FAQ} component={FAQ} />
        </Switch>
      </Body>
    </Providers>
  </Router>
)

export default App
