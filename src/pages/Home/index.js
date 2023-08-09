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
} from './style'

const Home = () => {
  const { push } = useHistory()
  const { pageBackColor, fontColor } = useThemeContext()

  return (
    <Container pageBackColor={pageBackColor} fontColor={fontColor}>
      <Inner>
        <FirstPart>
          <FirstBack>
            <Title>Farms of Beginners</Title>
            <Desc>The easiest way to put your crypto tokens to work.</Desc>
            <StartBeginners
              onClick={() => {
                push('/beginners')
              }}
            >
              Start Earning Now
            </StartBeginners>
          </FirstBack>
        </FirstPart>
        <SecondPart>
          <FirstFarmingPart>
            <Title>First time Farming?</Title>
            <Desc>Learn how to earn with Harvest in 5 minutes. </Desc>
            <DirectBtn>Get Started</DirectBtn>
            <img className="sun" src={FirstFarmSun} alt="" />
            <img className="bottom" src={FirstFarmBottom} alt="" />
          </FirstFarmingPart>
          <AdvancedFarms>
            <Title>Advanced Farms</Title>
            <Desc>Farm with a curated list of 100 farms</Desc>
            <DirectBtn>View List</DirectBtn>
            <img className="sun" src={AdvancedSun} alt="" />
            <img className="bottom" src={AdvancedBottom} alt="" />
          </AdvancedFarms>
        </SecondPart>
      </Inner>
    </Container>
  )
}

export default Home
