import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import ChartButtonsGroup from '../ChartButtonsGroup'
import balanceImg from '../../../assets/images/logos/advancedfarm/coins.svg'
import usdbalance from '../../../assets/images/logos/advancedfarm/money.svg'
import { getUserBalanceHistories } from '../../../utils'
import { useWallet } from '../../../providers/Wallet'
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
  FilterGroup,
} from './style'

const recommendLinks = [
  { name: '1D', type: 0, state: '1D' },
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: '1Y', type: 3, state: '1Y' },
]

const filterList = [
  { id: 1, name: `fTokens' USD Value History`, img: usdbalance },
  { id: 2, name: 'Underlying Balance History', img: balanceImg },
]

const UserBalanceData = ({ token, vaultPool }) => {
  const [clickedId, setClickedId] = useState(0)
  const [selectedState, setSelectedState] = useState('1M')

  const { account } = useWallet()
  const address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

  const [apiData, setApiData] = useState({})
  const [loadComplete, setLoadComplete] = useState(true)
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('')
  const [tooltipLabel, setTooltipLabel] = useState('')

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  useEffect(() => {
    const label = clickedId === 0 ? `My Balance` : 'My Underlying Balance'
    setTooltipLabel(label)
  }, [clickedId])

  useEffect(() => {
    const initData = async () => {
      const { data, flag } = await getUserBalanceHistories(address, chainId, account)
      setLoadComplete(flag)
      setApiData(data)
      if (data && data.length > 0) {
        const curTimestamp = new Date().getTime() / 1000
        const between = curTimestamp - Number(data[data.length - 1].timestamp)
        const day = between / (24 * 3600)
        setSelectedState(day < 90 ? '1M' : '1Y')
      }
    }

    initData()
  }, [address, chainId, account])

  return (
    <Container>
      <Header>
        <Total>
          <FlexDiv>
            <TooltipInfo>
              <TokenSymbol className="priceshare">{tooltipLabel}</TokenSymbol>
              <FlexDiv>
                <CurContent color="#1b1b1b">
                  {curDate}&nbsp;<span>|</span>&nbsp;
                </CurContent>
                <CurContent color="#15B088">
                  {clickedId === 0 ? '$' : ''}
                  {curContent}
                </CurContent>
              </FlexDiv>
            </TooltipInfo>
          </FlexDiv>
          {!isMobile && (
            <FilterGroup>
              <ChartButtonsGroup
                buttons={filterList}
                clickedId={clickedId}
                setClickedId={setClickedId}
              />
            </FilterGroup>
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
          token={token}
          data={apiData}
          loadComplete={loadComplete}
          range={selectedState}
          filter={clickedId}
          setCurDate={setCurDate}
          setCurContent={setCurContent}
        />
      </ChartDiv>
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
    </Container>
  )
}
export default UserBalanceData
