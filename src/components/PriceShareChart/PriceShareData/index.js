import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import ReactTooltip from 'react-tooltip'
// import CheckCircle from '../../../assets/images/logos/beginners/check-green-circle.svg'
// import Close from '../../../assets/images/logos/beginners/x-close.svg'
import Help from '../../../assets/images/logos/beginners/help-circle.svg'
import { getPriceFeed } from '../../../utils'
import ApexChart from '../ApexChart'
import ChartRangeSelect from '../ChartRangeSelect'
import {
  ButtonGroup,
  ChartDiv,
  Container,
  Header,
  Total,
  TokenSymbol,
  TooltipInfo,
  FlexDiv,
  CurContent,
  // ChartInfo,
  // ChartHeaderDiv,
  // ChartDescText,
  // ChartBottom,
  // ChartBottomAction,
  // ChartBottomHide,
  // ChartClose,
  NewLabel,
} from './style'

const recommendLinks = [
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: '1Y', type: 3, state: '1Y' },
]

const PriceShareData = ({ token, vaultPool, tokenSymbol, setLoadData }) => {
  const [selectedState, setSelectedState] = useState('1Y')

  const address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

  const [apiData, setApiData] = useState({})
  const [loadComplete, setLoadComplete] = useState(true)
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('')
  // const [chartShow, setChartShow] = useState(!localStorage.getItem('chartInfoShow'))

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  useEffect(() => {
    const initData = async () => {
      const { data, flag } = await getPriceFeed(address, chainId)
      setLoadComplete(flag)
      setLoadData(flag)
      setApiData(data)
      if (data && data.length > 0) {
        const curTimestamp = new Date().getTime() / 1000
        const between = curTimestamp - Number(data[data.length - 1].timestamp)
        const day = between / (24 * 3600)
        setSelectedState(day < 180 ? '1M' : '1Y')
      }
    }

    initData()
  }, [address, chainId, setLoadData])

  return (
    <Container>
      <Header>
        <Total>
          <FlexDiv>
            <TooltipInfo>
              <TokenSymbol className="priceshare">
                {`f${tokenSymbol}`}
                <img src={Help} alt="Help" data-tip data-for="tooltip-priceShare" />
                {!isMobile && (
                  <ReactTooltip id="tooltip-priceShare" backgroundColor="white">
                    <NewLabel
                      size={isMobile ? '10px' : '12px'}
                      height={isMobile ? '15px' : '18px'}
                      color="#344054"
                    >
                      <p weight="600">The power of auto-compounding</p>
                      <p className="priceShareText" weight="500">
                        It is the exchange rate between the auto-compounding
                        <span>fToken</span> and its underlying token. When a farm is launched,
                        harvested rewards are compounded, it grows.
                      </p>
                    </NewLabel>
                  </ReactTooltip>
                )}
              </TokenSymbol>
              <FlexDiv>
                <CurContent color="#1b1b1b">{curDate}&nbsp;:&nbsp;</CurContent>
                <CurContent color="#00D26B">{curContent}</CurContent>
              </FlexDiv>
            </TooltipInfo>
          </FlexDiv>
          {!isMobile && (
            <ButtonGroup>
              {recommendLinks.map((item, i) => (
                <ChartRangeSelect
                  key={i}
                  onClick={() => {
                    setSelectedState(item.state)
                  }}
                  state={selectedState}
                  type={item.type}
                  text={item.name}
                />
              ))}
            </ButtonGroup>
          )}
        </Total>
      </Header>
      {isMobile && (
        <ButtonGroup>
          {recommendLinks.map((item, i) => (
            <ChartRangeSelect
              key={i}
              onClick={() => {
                setSelectedState(item.state)
              }}
              state={selectedState}
              type={item.type}
              text={item.name}
            />
          ))}
        </ButtonGroup>
      )}
      <ChartDiv className="advanced-price">
        <ApexChart
          data={apiData}
          loadComplete={loadComplete}
          range={selectedState}
          setCurDate={setCurDate}
          setCurContent={setCurContent}
        />
      </ChartDiv>
      {/* {chartShow ? (
        <ChartInfo>
          <div>
            <img src={CheckCircle} alt="check" />
          </div>
          <div>
            <ChartHeaderDiv>Chart info</ChartHeaderDiv>
            <ChartDescText>
              This chart represents the power of Harvest’s auto-compounding. It&apos;s the exchange
              rate between the auto-compounding fToken and its underlying token. When a farm is
              launched, it is exactly 1:1. As rewards are compounded, it grows. Example: If now 1
              fToken is worth 1.025 underlying tokens, it means that its value has increased by 2.5%
              since launch.
            </ChartDescText>
            <ChartBottom>
              <ChartBottomAction
                onClick={() => {
                  setChartShow(false)
                }}
              >
                Got it!
              </ChartBottomAction>
              <ChartBottomHide
                onClick={() => {
                  setChartShow(false)
                  localStorage.setItem('chartInfoShow', true)
                }}
              >
                Hide this message from all farms
              </ChartBottomHide>
            </ChartBottom>
          </div>
          <ChartClose
            onClick={() => {
              setChartShow(false)
            }}
          >
            <img src={Close} alt="close" />
          </ChartClose>
        </ChartInfo>
      ) : (
        <></>
      )} */}
    </Container>
  )
}
export default PriceShareData
