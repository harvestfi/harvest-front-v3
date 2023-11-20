import React from 'react'
import { useHistory } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import FristBg from '../../assets/images/logos/home/beginner-coins.svg'
import FirstFarmCloud from '../../assets/images/logos/home/new-farming.png'
import AdvancedBottom from '../../assets/images/logos/home/advanced-coins.svg'
// import AdvancedBottom from '../../assets/images/logos/home/advanced-bottom.svg'
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
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

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
            <StartBeginners
              onClick={() => {
                push(ROUTES.BEGINNERS)
              }}
            >
              {isMobile ? 'Get Started' : 'Get Started Now'}
            </StartBeginners>
            <img src={FristBg} alt="bg" />
          </FirstBack>
        </FirstPart>
        <SecondPart>
          <FirstFarmingPart>
            <FirstFarmTitle>New to Crypto Farming?</FirstFarmTitle>
            <FirstFarmDesc>Learn how to earn with Harvest.</FirstFarmDesc>
            <DirectBtn>Learn</DirectBtn>
            <img className="cloud" src={FirstFarmCloud} alt="" />
          </FirstFarmingPart>
          <AdvancedFarms
            onClick={() => {
              push(ROUTES.ADVANCED)
            }}
          >
            <AdvancedTitle>Advanced Farms</AdvancedTitle>
            <AdvancedDesc>Over 100 farms to explore.</AdvancedDesc>
            <AdvancedDirectBtn
              onClick={() => {
                push(ROUTES.ADVANCED)
              }}
            >
              Discover
            </AdvancedDirectBtn>
            <img className="bottom" src={AdvancedBottom} alt="" />
          </AdvancedFarms>
        </SecondPart>
      </Inner>
    </Container>
  )
}

export default Home
