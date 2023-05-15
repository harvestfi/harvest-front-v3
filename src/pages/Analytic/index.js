import React, { useState, useEffect } from 'react'
import Countdown from 'react-countdown'
import CountUp from 'react-countup'
import { useMediaQuery } from 'react-responsive'
import ReactTooltip from 'react-tooltip'
import ExchangeBancor from '../../assets/images/logos/analytics/exchange_bancor.svg'
import ExchangeBinance from '../../assets/images/logos/analytics/exchange_binance.svg'
import ExchangeCoinbase from '../../assets/images/logos/analytics/exchange_coinbase.svg'
import ExchangeCrypto from '../../assets/images/logos/analytics/exchange_crypto.svg'
import ExchangeKraken from '../../assets/images/logos/analytics/exchange_kraken.svg'
import ExchangeUniswap from '../../assets/images/logos/analytics/exchange_uniswap.svg'
import ExternalDefiLlama from '../../assets/images/logos/analytics/externalDefiLlama.svg'
import ExternalDuno from '../../assets/images/logos/analytics/externalDuno.svg'
import ExternalCamelot from '../../assets/images/logos/analytics/exchange_camelot.svg'
import Farm from '../../assets/images/logos/analytics/farm.svg'
import IFarm from '../../assets/images/logos/iFarm.svg'
import GasSavedImage from '../../assets/images/logos/analytics/GasFeeSave.svg'
import AutoHarvest from '../../assets/images/logos/analytics/AutoHarvest.svg'
import TotalDeposit from '../../assets/images/logos/analytics/TotalDeposit.svg'
import MonthlyProfit from '../../assets/images/logos/analytics/MonthlyProfit.svg'
import ExternalLink from '../../assets/images/logos/analytics/ExternalLink.svg'
import AnalyticChart from '../../components/AnalyticChart'
import AnimatedDots from '../../components/AnimatedDots'
import CountdownLabel from '../../components/CountdownLabel'
import { Divider, Monospace, TextContainer } from '../../components/GlobalStyle'
import { CURVE_APY } from '../../constants'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { getNextEmissionsCutDate, truncateNumberString } from '../../utils'
import {
  BigStatsExchange,
  Container,
  Content,
  DataSource,
  DataSourceDirect,
  DataSourceInner,
  EmissionsCountdownText,
  FarmStatsContainer,
  FarmSubTitle,
  ImgList,
  StatsBox,
  StatsChart,
  StatsContainer,
  StatsContainerRow,
  StatsExchange,
  StatsExternal,
  StatsTooltip,
  StatsValue,
  ValueComponent,
  CompHeader,
  FlexDiv,
} from './style'

const MemoizedCounter = React.memo(CountUp)
const MemoizedCountdown = React.memo(Countdown)
const imgList = [
  { url: 'https://pro.coinbase.com/trade/FARM-USD', img: ExchangeCoinbase },
  { url: 'https://pro.kraken.com/app/trade/farm-usd', img: ExchangeKraken },
  { url: 'https://www.binance.com/en/trade/FARM_USDT', img: ExchangeBinance },
  { url: 'https://crypto.com/exchange/trade/spot/FARM_USD', img: ExchangeCrypto },
  {
    url: 'https://app.uniswap.org/#/tokens/ethereum/0xa0246c9032bc3a600820415ae600c6388619a14d',
    img: ExchangeUniswap,
  },
  {
    url:
      'https://app.bancor.network/trade?from=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&to=0xa0246c9032bC3A600820415aE600c6388619A14D',
    img: ExchangeBancor,
  },
]
const dataSources = [
  {
    id: 1,
    img: ExternalDefiLlama,
    text: 'DefiLlama',
    url: 'https://defillama.com/protocol/harvest-finance',
    soon: false,
    background: 'rgba(0, 99, 238, 0.17)',
    color: '#013F92',
  },
  {
    id: 2,
    img: ExternalDuno,
    text: 'Dune Dashboard',
    url: 'https://dune.com/cryptjs13/harvest-finance',
    soon: false,
    background: 'rgba(241, 96, 63, 0.21)',
    color: '#F1603F',
  },
]

const Analytic = () => {
  const {
    monthlyProfit,
    totalValueLocked,
    percentOfFarmStaked,
    totalGasSaved,
    profitShareAPY,
    profitShareAPYFallback,
  } = useStats()

  const ratePerDay = Number(CURVE_APY) / 365 / 100
  const {
    pageBackColor,
    fontColor,
    borderColor,
    backColor,
    boxShadowColor,
    analyticTitleColor,
  } = useThemeContext()
  const MINUTE_MS = 60000
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const [loadComplete, setLoadComplete] = useState(false)

  useEffect(() => {
    setLoadComplete(true)
    const interval = setInterval(() => {}, MINUTE_MS)

    return () => clearInterval(interval) // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])

  return (
    <Container pageBackColor={pageBackColor}>
      <Content>
        <FarmStatsContainer>
          <ValueComponent
            borderColor={borderColor}
            backColor={backColor}
            fontColor={fontColor}
            width={isMobile ? '100%' : '25%'}
          >
            <CompHeader fontColor={analyticTitleColor}>
              <img src={TotalDeposit} alt="total deposit" />
              Total Deposits
            </CompHeader>
            <FarmSubTitle bold={600} size="30px" lineHeight="38px">
              {Number(totalValueLocked) === 0 ? (
                <AnimatedDots />
              ) : (
                <>
                  $&nbsp;
                  <MemoizedCounter
                    start={Number(totalValueLocked)}
                    end={Number(totalValueLocked) + Number(totalValueLocked) * Number(ratePerDay)}
                    separator=","
                    useEasing={false}
                    delay={0}
                    decimals={0}
                    duration={864000}
                  />{' '}
                </>
              )}
            </FarmSubTitle>
          </ValueComponent>

          <ValueComponent
            borderColor={borderColor}
            backColor={backColor}
            fontColor={fontColor}
            width={isMobile ? '100%' : '25%'}
          >
            <CompHeader fontColor={analyticTitleColor}>
              <img src={MonthlyProfit} alt="monthly profit" />
              Monthly Profits to Farmers
            </CompHeader>
            <FarmSubTitle
              data-tip
              data-for="profits-to-farmers"
              bold={600}
              size="30px"
              lineHeight="38px"
            >
              {!monthlyProfit ? (
                <AnimatedDots />
              ) : (
                <>$&nbsp;{Number(truncateNumberString(monthlyProfit)).toLocaleString('en-US')}</>
              )}
            </FarmSubTitle>
            <ReactTooltip
              id="profits-to-farmers"
              backgroundColor="white"
              borderColor="black"
              border
              textColor="black"
              effect="float"
              getContent={() => (
                <TextContainer textAlign="left" margin="0px">
                  <b>70%</b> of profits goes to farmers depositing in <b>asset pools</b>
                  <br /> <b>30%</b> goes to those farmers staking <b>FARM</b>
                </TextContainer>
              )}
            />
          </ValueComponent>

          <ValueComponent
            borderColor={borderColor}
            backColor={backColor}
            fontColor={fontColor}
            width={isMobile ? '100%' : '25%'}
          >
            <CompHeader fontColor={analyticTitleColor}>
              <img src={Farm} width="32px" height="32px" alt="" />
              FARM staking APY:
            </CompHeader>
            <FarmSubTitle data-tip data-for="details-box" bold={600} size="30px" lineHeight="38px">
              {profitShareAPY ? `${Number(profitShareAPY).toFixed(2)}%` : <AnimatedDots />}
            </FarmSubTitle>
          </ValueComponent>
          <ValueComponent
            fontColor={fontColor}
            borderColor={borderColor}
            backColor={backColor}
            width={isMobile ? '100%' : '25%'}
          >
            <CompHeader fontColor={analyticTitleColor}>
              <img src={Farm} width="32px" height="32px" alt="" />
              Total FARM staked:
            </CompHeader>
            <FarmSubTitle data-tip data-for="details-box" bold={600} size="30px" lineHeight="38px">
              {percentOfFarmStaked ? (
                `${Math.round(Number(percentOfFarmStaked))}%`
              ) : (
                <AnimatedDots />
              )}
            </FarmSubTitle>
            <ReactTooltip
              id="details-box"
              backgroundColor="white"
              borderColor="black"
              border
              textColor="black"
              effect="float"
              getContent={() => (
                <StatsTooltip>
                  <b>FARM</b> stakers receive <b>30%</b> of profits generated by all other pools
                  <br />
                  {profitShareAPYFallback ? (
                    <>
                      <b>FARM</b> staking APY is a <b>realtime estimate</b>, updated <b>hourly</b>
                    </>
                  ) : (
                    <>
                      <b>FARM</b> staking APY is a <b>7 day</b> historical average
                    </>
                  )}
                </StatsTooltip>
              )}
            />
          </ValueComponent>
        </FarmStatsContainer>
        <Divider height="20px" />
        <FarmStatsContainer>
          <StatsChart
            width={isMobile ? '100%' : '50%'}
            align="flex-start"
            direction="row"
            height="450px"
            fontColor={fontColor}
            backColor={backColor}
            borderColor={borderColor}
          >
            <AnalyticChart loadComplete={loadComplete} />
          </StatsChart>
          <StatsBox
            width={isMobile ? '100%' : '50%'}
            align="flex-start"
            compNum={2}
            boxShadow="unset"
            height="450px"
            minHeight="270px"
            fontColor={fontColor}
            backColor={backColor}
            borderColor={borderColor}
          >
            <div className="emission-header">
              <img className="rect" src={Farm} alt="" />
            </div>
            <MemoizedCountdown
              intervalDelay={50}
              precision={2}
              date={getNextEmissionsCutDate()}
              renderer={({ formatted: { days, hours, minutes }, completed }) => {
                if (completed) {
                  return (
                    <span>
                      Join the <b>Harvest</b>
                    </span>
                  )
                }
                return (
                  <>
                    <EmissionsCountdownText fontColor={fontColor}>
                      Next Emissions Decrease In:
                    </EmissionsCountdownText>
                    <CountdownLabel
                      display="block"
                      days={days}
                      hours={hours}
                      minutes={minutes}
                      // seconds={seconds}
                      // milliseconds={milliseconds}
                    />
                  </>
                )
              }}
            />
          </StatsBox>
        </FarmStatsContainer>
        <Divider height="30px" />
        <FarmStatsContainer>
          <StatsValue width={isMobile ? '100%' : '50%'}>
            <StatsValue width="100%" direction="row" fontColor={fontColor}>
              <ValueComponent
                borderColor={borderColor}
                fontColor={fontColor}
                backColor={backColor}
                width="48%"
                className="child first-comp"
              >
                <CompHeader fontColor={analyticTitleColor}>
                  <img src={GasSavedImage} alt="" />
                  Gas fees saved
                </CompHeader>
                <FarmSubTitle
                  bold={600}
                  size={isMobile ? '16px' : '30px'}
                  lineHeight={isMobile ? '24px' : '38px'}
                >
                  <Monospace>
                    {!Number(totalGasSaved) ? (
                      <AnimatedDots />
                    ) : (
                      <>
                        $
                        <MemoizedCounter
                          start={Number(totalGasSaved)}
                          end={Number(totalGasSaved) + Number(totalGasSaved) * Number(ratePerDay)}
                          separator=","
                          useEasing={false}
                          delay={0}
                          decimals={0}
                          duration={86400 * 200}
                        />
                      </>
                    )}
                  </Monospace>
                </FarmSubTitle>
              </ValueComponent>

              <ValueComponent
                borderColor={borderColor}
                backColor={backColor}
                fontColor={fontColor}
                width="48%"
                className="child"
              >
                <CompHeader fontColor={analyticTitleColor}>
                  <img src={AutoHarvest} alt="" />
                  Auto Harvesting Yields
                </CompHeader>
                <FarmSubTitle
                  bold={600}
                  size={isMobile ? '16px' : '30px'}
                  lineHeight={isMobile ? '24px' : '38px'}
                >
                  <Monospace>
                    {!Number(totalValueLocked) ? (
                      <AnimatedDots />
                    ) : (
                      <>
                        $
                        <MemoizedCounter
                          start={Number(totalValueLocked)}
                          end={
                            Number(totalValueLocked) + Number(totalValueLocked) * Number(ratePerDay)
                          }
                          separator=","
                          useEasing={false}
                          delay={0}
                          decimals={0}
                          duration={86400 * 20}
                        />
                      </>
                    )}
                  </Monospace>
                </FarmSubTitle>
              </ValueComponent>
            </StatsValue>
            <Divider height="20px" />
            <StatsExternal
              width="100%"
              align="flex-start"
              direction="column"
              fontColor={fontColor}
              backColor={backColor}
              borderColor={borderColor}
            >
              <StatsContainerRow margin="27px 29px">
                <DataSourceInner>
                  <BigStatsExchange>
                    <img src={ExternalLink} alt="" />
                    External Data Sources
                  </BigStatsExchange>
                  <FlexDiv>
                    {dataSources.map((el, i) => (
                      <DataSourceDirect key={i} href={el.url} target="_blank">
                        <div className="back">
                          <DataSource
                            background={el.background}
                            color={el.color}
                            boxShadowColor={boxShadowColor}
                          >
                            <div className="avatar">
                              <img src={el.img} alt="" />
                            </div>
                            {el.text}
                          </DataSource>
                        </div>
                      </DataSourceDirect>
                    ))}
                  </FlexDiv>
                </DataSourceInner>
              </StatsContainerRow>
            </StatsExternal>
          </StatsValue>
          <StatsExchange
            width={isMobile ? '100%' : '50%'}
            direction="row"
            fontColor={fontColor}
            backColor={backColor}
            borderColor={borderColor}
          >
            <StatsContainer>
              <BigStatsExchange fontColor={fontColor}>
                <img src={Farm} width="32px" height="32px" alt="" />
                FARM Exchanges
              </BigStatsExchange>
              <ImgList>
                {imgList.map((el, i) => (
                  <a key={i} href={el.url} target="_blank" rel="noopener noreferrer">
                    <img src={el.img} alt="" />
                  </a>
                ))}
              </ImgList>
              <Divider height="16px" />
              <BigStatsExchange fontColor={fontColor}>
                <img src={IFarm} width="32px" height="32px" alt="" />
                iFARM Exchanges
              </BigStatsExchange>
              <ImgList>
                {/* <a href="#" target="_blank" rel="noopener noreferrer"> */}
                <img src={ExternalCamelot} alt="" />
                {/* </a> */}
              </ImgList>
            </StatsContainer>
          </StatsExchange>
        </FarmStatsContainer>
      </Content>
    </Container>
  )
}

export default Analytic
