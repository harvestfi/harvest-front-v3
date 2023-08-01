import React from 'react'
import { useHistory } from 'react-router-dom'
import { useThemeContext } from '../../providers/useThemeContext'
import CoinGroup from '../../assets/images/logos/home/coin-group.svg'
import AdvancedBack from '../../assets/images/logos/home/advanced-back.svg'
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
          <img className="coin-group" src={CoinGroup} alt="" />
        </FirstPart>
        <SecondPart>
          <FirstFarmingPart>
            <Title>First time Farming?</Title>
            <Desc>Learn how to earn with Harvest in 5 minutes. </Desc>
            <DirectBtn>Get Started</DirectBtn>
          </FirstFarmingPart>
          <AdvancedFarms>
            <Title>Advanced Farms</Title>
            <Desc>Farm with a curated list of 100 farms</Desc>
            <DirectBtn>View List</DirectBtn>
            <img src={AdvancedBack} alt="" />
          </AdvancedFarms>
        </SecondPart>
      </Inner>
    </Container>
  )
}

export default Home
