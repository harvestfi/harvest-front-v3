import React from 'react'
import { useHistory } from 'react-router-dom'
import FirstFarmBottom from '../../assets/images/logos/home/first-farming-bottom.svg'
import FirstFarmSun from '../../assets/images/logos/home/first-farming-sun.svg'
import AdvancedBottom from '../../assets/images/logos/home/advanced-bottom.svg'
import AdvancedSun from '../../assets/images/logos/home/advanced-sun.svg'
import { useThemeContext } from '../../providers/useThemeContext'
import {
  Container,
  Inner,
  FirstPart,
  FirstBack,
  Title,
  Desc,
  StartBeginners,
  SecondPart,
  FirstFarmingPart,
  DirectBtn,
  AdvancedFarms,
  FirstFarmTitle,
  FirstFarmDesc,
  AdvancedTitle,
  AdvancedDesc,
  AdvancedDirectBtn,
} from './style'
import { ROUTES } from '../../constants'

const Home = () => {
  const { push } = useHistory()
  const { pageBackColor, fontColor } = useThemeContext()

  return (
    <Container pageBackColor={pageBackColor} fontColor={fontColor}>
      <Inner>
        <FirstPart>
          <FirstBack
            onClick={() => {
              push(ROUTES.BEGINNERS)
            }}
          >
            <Title>Farms of Beginners</Title>
            <Desc>The easiest way to put your crypto tokens to work.</Desc>
            <StartBeginners
              onClick={() => {
                push(ROUTES.BEGINNERS)
              }}
            >
              Start Earning Now
            </StartBeginners>
          </FirstBack>
        </FirstPart>
        <SecondPart>
          <FirstFarmingPart>
            <FirstFarmTitle>First time Farming?</FirstFarmTitle>
            <FirstFarmDesc>Learn how to earn with Harvest in 5 minutes. </FirstFarmDesc>
            <DirectBtn>Learn Now</DirectBtn>
            <img className="sun" src={FirstFarmSun} alt="" />
            <img className="bottom" src={FirstFarmBottom} alt="" />
          </FirstFarmingPart>
          <AdvancedFarms
            onClick={() => {
              push(ROUTES.ADVANCED)
            }}
          >
            <AdvancedTitle>Advanced Farms</AdvancedTitle>
            <AdvancedDesc>Over 100 farms on Ethereum, Polygon and Arbitrum await!</AdvancedDesc>
            <AdvancedDirectBtn
              onClick={() => {
                push(ROUTES.ADVANCED)
              }}
            >
              Discover
            </AdvancedDirectBtn>
            <img className="sun" src={AdvancedSun} alt="" />
            <img className="bottom" src={AdvancedBottom} alt="" />
          </AdvancedFarms>
        </SecondPart>
      </Inner>
    </Container>
  )
}

export default Home
