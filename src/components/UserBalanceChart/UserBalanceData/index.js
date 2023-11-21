import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { round } from 'lodash'
import ChartButtonsGroup from '../ChartButtonsGroup'
import balanceImg from '../../../assets/images/logos/advancedfarm/coins.svg'
import usdbalance from '../../../assets/images/logos/advancedfarm/money.svg'
import { getUserBalanceHistories1, getUserBalanceHistories2 } from '../../../utils'
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

const UserBalanceData = ({ token, vaultPool, totalValue, useIFARM, usdPrice }) => {
  const [clickedId, setClickedId] = useState(0)
  const [selectedState, setSelectedState] = useState('1M')

  const { account } = useWallet()
  const address = useIFARM
    ? '0x1571ed0bed4d987fe2b498ddbae7dfa19519f651'
    : token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

  const [apiData, setApiData] = useState({})
  const [loadComplete, setLoadComplete] = useState(true)
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('')
  const [tooltipLabel, setTooltipLabel] = useState('')

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  useEffect(() => {
    const label = clickedId === 0 ? `USD Balance` : 'Underlying Balance'
    setTooltipLabel(label)
  }, [clickedId])

  useEffect(() => {
    const initData = async () => {
      const { data1, flag1 } = await getUserBalanceHistories1(address, chainId, account)
      const { data2, flag2 } = await getUserBalanceHistories2(address, chainId)
      const uniqueData2 = []
      const timestamps = []
      data2.forEach(obj => {
        if (!timestamps.includes(obj.timestamp)) {
          timestamps.push(obj.timestamp)
          uniqueData2.push(obj)
        }
      })
      const mergedData = []
      if (flag1 && flag2) {
        for (let i = 0; i < uniqueData2.length; i++) {
          let vaultData = uniqueData2[i]
          let j = 0
          while (data1[j].timestamp > vaultData.timestamp) {
            j += 1
            if (j >= data1.length) {
              break
            }
          }
          let value
          if (j >= data1.length) {
            value = 0
          } else {
            value =data1[j].value
          }
          vaultData.value = value
          mergedData.push(vaultData)
        }
        const firstObject = {
          priceUnderlying: usdPrice,
          sharePrice: mergedData[0].sharePrice,
          timestamp: mergedData[0].timestamp,
          value: totalValue,
        }
        mergedData.unshift(firstObject)
      }
      setLoadComplete(flag1 && flag2)
      setApiData(mergedData)
      if (mergedData && mergedData.length > 0) {
        const curTimestamp = new Date().getTime() / 1000
        const between = curTimestamp - Number(mergedData[mergedData.length - 1].timestamp)
        const day = between / (24 * 3600)
        setSelectedState(day < 90 ? '1M' : '1Y')
      }
    }

    initData()
  }, [address, chainId, account, totalValue, usdPrice, useIFARM])

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
                  {round(curContent, 8)}
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
