import React, { useEffect } from 'react'
import Countdown from 'react-countdown'
import CountUp from 'react-countup'
import { useMediaQuery } from 'react-responsive'
import ReactTooltip from 'react-tooltip'
import DepositEffectImage from '../../assets/images/logos/analytics/depositEffect.svg'
import ExchangeBancor from '../../assets/images/logos/analytics/exchange_bancor.svg'
import ExchangeBinance from '../../assets/images/logos/analytics/exchange_binance.svg'
import ExchangeCoinbase from '../../assets/images/logos/analytics/exchange_coinbase.svg'
import ExchangeCrypto from '../../assets/images/logos/analytics/exchange_crypto.svg'
import ExchangeKraken from '../../assets/images/logos/analytics/exchange_kraken.svg'
import ExchangeSushiswap from '../../assets/images/logos/analytics/exchange_sushiswap.svg'
import ExchangeUniswap from '../../assets/images/logos/analytics/exchange_uniswap.svg'
import ExternalDefiLlama from '../../assets/images/logos/analytics/externalDefiLlama.svg'
import ExternalDuno from '../../assets/images/logos/analytics/externalDuno.svg'
import ExternalFarm from '../../assets/images/logos/analytics/externalFarm.svg'
import Farm from '../../assets/images/logos/analytics/farm.svg'
import FarmStakingEffectImage from '../../assets/images/logos/analytics/farmStakingEffect.svg'
import TotalDepositsImage from '../../assets/images/logos/common/apy.svg'
import GasSavedImage from '../../assets/images/logos/common/tvl.svg'
import AnalyticChart from '../../components/AnalyticChart'
import AnimatedDots from '../../components/AnimatedDots'
import CountdownLabel from '../../components/CountdownLabel'
import { Divider, Monospace, TextContainer } from '../../components/GlobalStyle'
import { CURVE_APY } from '../../constants'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { getNextEmissionsCutDate, truncateNumberString } from '../../utils'
import {
  BigStats,
  BigStatsExchange,
  BigStatsSubheader,
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
  StatsBoxTitle,
  StatsChart,
  StatsContainer,
  StatsContainerRow,
  StatsExchange,
  StatsExternal,
  StatsTooltip,
  StatsValue,
} from './style'

const MemoizedCounter = React.memo(CountUp)
const MemoizedCountdown = React.memo(Countdown)
const imgList = [
  { url: 'https://pro.coinbase.com/trade/FARM-USD', img: ExchangeCoinbase },
  { url: 'https://www.binance.com/en/trade/FARM_USDT', img: ExchangeBinance },
  { url: 'https://trade.kraken.com/markets/kraken/farm/usd', img: ExchangeKraken },
  { url: 'https://crypto.com/exchange/trade/spot/FARM_USD', img: ExchangeCrypto },
  {
    url:
      'https://app.sushi.com/swap?inputCurrency=0xa0246c9032bc3a600820415ae600c6388619a14d&outputCurrency=ETH',
    img: ExchangeSushiswap,
  },
  {
    url:
      'https://app.uniswap.org/#/swap?inputCurrency=0xa0246c9032bc3a600820415ae600c6388619a14d&outputCurrency=ETH',
    img: ExchangeUniswap,
  },
  {
    url: 'https://app.bancor.network/trade?inputCurrency=farm&outputCurrency=bnt',
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
    url: 'https://dune.com/llama/Harvest-Finance',
    soon: false,
    background: 'rgba(241, 96, 63, 0.21)',
    color: '#F1603F',
  },
  {
    id: 3,
    img: ExternalFarm,
    text: 'farmDashboard',
    url: '#',
    soon: true,
    background: '#E2FFC4',
    color: '#45423D',
  },
]

const Analytic = () => {
  const {
    monthlyProfit,
    totalValueLocked,
    percentOfFarmStaked,
    profitShareAPY,
    totalGasSaved,
    profitShareAPYFallback,
  } = useStats()

  const ratePerDay = Number(CURVE_APY) / 365 / 100
  const { pageBackColor, fontColor, borderColor, backColor, boxShadowColor } = useThemeContext()
  const MINUTE_MS = 60000
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  useEffect(() => {
    const interval = setInterval(() => {}, MINUTE_MS)

    return () => clearInterval(interval) // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])

  return (
    <Container pageBackColor={pageBackColor}>
      <Content>
        <FarmStatsContainer>
          <StatsBox
            width={isMobile ? '100%' : '32%'}
            align="flex-start"
            compNum={1}
            height="270px"
            minHheight="270px"
            fontColor={fontColor}
            backColor={backColor}
            borderColor={borderColor}
          >
            <StatsBoxTitle>
              Total Deposits: <br />
            </StatsBoxTitle>
            <FarmSubTitle bold={700} size="17px" lineHeight="23px">
              {Number(totalValueLocked) === 0 ? (
                <AnimatedDots />
              ) : (
                <>
                  <MemoizedCounter
                    start={Number(totalValueLocked)}
                    end={Number(totalValueLocked) + Number(totalValueLocked) * Number(ratePerDay)}
                    separator=","
                    useEasing={false}
                    delay={0}
                    decimals={0}
                    duration={864000}
                  />{' '}
                  USD
                </>
              )}
            </FarmSubTitle>
            {/* <Divider height="40px" /> */}
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
            <StatsBoxTitle>
              {' '}
              Monthly <b>Profits</b> to Farmers:{' '}
            </StatsBoxTitle>
            <FarmSubTitle
              data-tip
              data-for="profits-to-farmers"
              bold={700}
              size="17px"
              lineHeight="23px"
            >
              {!monthlyProfit ? (
                <AnimatedDots />
              ) : (
                <>{Number(truncateNumberString(monthlyProfit)).toLocaleString('en-US')}&nbsp;USD</>
              )}
            </FarmSubTitle>
            <img className="effect" src={DepositEffectImage} alt="DepositEffectImage" />
          </StatsBox>
          <StatsBox
            width={isMobile ? '100%' : '32%'}
            align="flex-start"
            compNum={2}
            boxShadow="unset"
            height="270px"
            minHheight="270px"
            fontColor={fontColor}
            backColor={backColor}
            borderColor={borderColor}
          >
            <div className="emission-header">
              <div className="rect">
                <img src={Farm} width="120px" height="120px" alt="" />
              </div>
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
            <Divider height="30px" />
          </StatsBox>
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
          <StatsBox
            width={isMobile ? '100%' : '32%'}
            align="flex-start"
            compNum={3}
            data-tip=""
            data-for="details-box"
            height="270px"
            minHeight="270px"
            fontColor={fontColor}
            backColor={backColor}
            borderColor={borderColor}
          >
            <StatsBoxTitle>
              <span>FARM staking APY:</span>
            </StatsBoxTitle>
            <FarmSubTitle bold={700} size="17px" lineHeight="23px">
              {profitShareAPY ? `${Number(profitShareAPY).toFixed(2)}%` : <AnimatedDots />}
            </FarmSubTitle>

            <StatsBoxTitle>
              <span>Total FARM staked:</span>
            </StatsBoxTitle>
            <FarmSubTitle bold={700} size="17px" lineHeight="23px">
              {percentOfFarmStaked ? (
                `${Math.round(Number(percentOfFarmStaked))}%`
              ) : (
                <AnimatedDots />
              )}
            </FarmSubTitle>
            <img className="effect" src={FarmStakingEffectImage} alt="" />
          </StatsBox>
        </FarmStatsContainer>
        <Divider height="20px" />
        <FarmStatsContainer>
          <StatsValue
            width={isMobile ? '100%' : '56%'}
            direction="row"
            height={isMobile ? 'fit-content' : '80px'}
            minHeight={isMobile ? 'fit-content' : '152px'}
            fontColor={fontColor}
            backColor={backColor}
            borderColor={borderColor}
          >
            <StatsContainerRow width="auto">
              <StatsContainer>
                <BigStatsSubheader>
                  <img src={GasSavedImage} alt="" />
                  Gas fees saved
                </BigStatsSubheader>
                <BigStats>
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
                </BigStats>
                <Divider height="20px" />
              </StatsContainer>
            </StatsContainerRow>
            <StatsContainerRow width="auto">
              <StatsContainer>
                <BigStatsSubheader>
                  <img src={TotalDepositsImage} alt="" />
                  Auto Harvesting Yields
                </BigStatsSubheader>
                <BigStats>
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
                </BigStats>
                <Divider height="20px" />
              </StatsContainer>
            </StatsContainerRow>
          </StatsValue>
          <StatsExchange
            width={isMobile ? '100%' : '42%'}
            direction="row"
            height="80px"
            fontColor={fontColor}
            backColor={backColor}
            borderColor={borderColor}
          >
            <StatsContainerRow width="auto">
              <StatsContainer>
                <BigStatsExchange>
                  <img src={Farm} alt="" />
                  $FARM on Exchanges
                </BigStatsExchange>
                <ImgList>
                  {imgList.map((el, i) => (
                    <a key={i} href={el.url}>
                      <img src={el.img} alt="" />
                    </a>
                  ))}
                </ImgList>
                <Divider height="15px" />
              </StatsContainer>
            </StatsContainerRow>
          </StatsExchange>
        </FarmStatsContainer>
        <Divider height="20px" />
        <FarmStatsContainer>
          <StatsChart
            width={isMobile ? '100%' : '60%'}
            align="flex-start"
            direction="row"
            height="350px"
            fontColor={fontColor}
            backColor={backColor}
            borderColor={borderColor}
          >
            <AnalyticChart />
          </StatsChart>
          <StatsExternal
            width={isMobile ? '100%' : '35%'}
            align="flex-start"
            direction="row"
            height="350px"
            fontColor={fontColor}
            backColor={backColor}
            borderColor={borderColor}
          >
            <StatsContainerRow margin="27px 29px" width="100%">
              <DataSourceInner>
                <BigStatsExchange>External Data Sources</BigStatsExchange>
                {dataSources.map((el, i) => (
                  <DataSourceDirect key={i} href={el.url}>
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
                        {el.soon ? <div className="soon">Soon TM</div> : <></>}
                      </DataSource>
                    </div>
                  </DataSourceDirect>
                ))}
                <Divider height="15px" />
              </DataSourceInner>
            </StatsContainerRow>
          </StatsExternal>
        </FarmStatsContainer>
      </Content>
    </Container>
  )
}

export default Analytic
