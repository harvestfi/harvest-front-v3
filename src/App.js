import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'
import { get } from 'lodash'
// import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
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

const NewLoginModal = () => {
  const newLogin = sessionStorage.getItem('newLogin')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (newLogin === null || newLogin === 'true') {
      sessionStorage.setItem('newLogin', true)
      setOpen(true)
    }
  }, [newLogin])

  return (
    <>
      {newLogin ? (
        <Modal
          title="Important Notice"
          confirmationLabel="I certify that I read and agree with this warning"
          open={open}
          onClose={() => {
            setOpen(false)
            sessionStorage.setItem('newLogin', false)
          }}
        >
          Due to regulatory uncertainty, Harvest Finance is not available to people or companies,
          who are residents in the <b>United States</b> or other restricted territory, or who are
          subject to other restrictions. <br /> <br /> By interacting with the Harvest Finance
          website and/or smart contracts, the user acknowledges the experimental nature of yield
          farming with Harvest Finance, its dependency on 3rd party protocols, and the potential for
          total loss of funds deposited. The user accepts full liability for their usage of Harvest
          Finance, and no financial responsibility is placed on the protocol developers and
          contributors.
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
    <NewLoginModal />
    <Providers>
      <Body id="page-content">
        <Sidebar width="320px" />
        <Switch>
          <Route exact path={ROUTES.HOME} component={Farm} />
          <Route exact path={ROUTES.PORTFOLIO} component={Portfolio} />
          <Route exact path={ROUTES.ANALYTIC} component={Analytic} />
          <Route path={ROUTES.WIDODETAIL} component={WidoDetail} />
          <Route path={ROUTES.FAQ} component={FAQ} />
        </Switch>
      </Body>
    </Providers>
  </Router>
)

export default App
