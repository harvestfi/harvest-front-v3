import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useThemeContext } from '../../providers/useThemeContext'
import {
  Container,
  Inner,
  FirstPart,
  FirstBack,
  Title,
  Desc,
  SecondPart,
  FirstFarmingPart,
  AdvancedFarms,
  FirstFarmTitle,
  FirstFarmDesc,
  AdvancedTitle,
  AdvancedDesc,
} from './style'
import { ROUTES } from '../../constants'

const Home = () => {
  const { push } = useHistory()
  const { pageBackColor, fontColor } = useThemeContext()

  const handleNetworkChange = () => {
    window.location.reload() // Reload the page when the network changes
  }

  useEffect(() => {
    if (window.ethereum) {
      // Listen for network changes
      window.ethereum.on('chainChanged', handleNetworkChange)

      return () => {
        // Cleanup: Remove the event listener when the component unmounts
        window.ethereum.removeListener('chainChanged', handleNetworkChange)
      }
    }
    return () => {}
  }, [])

  return (
    <Container pageBackColor={pageBackColor} fontColor={fontColor}>
      <Inner>
        <FirstPart>
          <FirstBack
            onClick={() => {
              push(ROUTES.BEGINNERS)
            }}
          >
            <Title>Farms for Beginners</Title>
            <Desc>Become a crypto farmer today.</Desc>
          </FirstBack>
        </FirstPart>
        <SecondPart>
          <FirstFarmingPart
            onClick={() => {
              push(ROUTES.TUTORIAL)
            }}
          >
            <FirstFarmTitle>New to Crypto Farming?</FirstFarmTitle>
            <FirstFarmDesc>Get started with crypto farming at ease.</FirstFarmDesc>
          </FirstFarmingPart>
          <AdvancedFarms
            onClick={() => {
              push(ROUTES.ADVANCED)
            }}
          >
            <AdvancedTitle>Advanced Farms</AdvancedTitle>
            <AdvancedDesc>Over 100 farms to explore.</AdvancedDesc>
          </AdvancedFarms>
        </SecondPart>
      </Inner>
    </Container>
  )
}

export default Home
