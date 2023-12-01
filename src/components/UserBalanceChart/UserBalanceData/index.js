import React, { useEffect, useState } from 'react'
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

const UserBalanceData = ({ token, vaultPool, totalValue, useIFARM, iFarmPrice, usdPrice }) => {
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
        if (data1[0].timestamp > uniqueData2[0].timestamp) {
          let i = 0,
            z = 0,
            addFlag = false

          while (data1[i].timestamp > uniqueData2[0].timestamp) {
            data1[i].priceUnderlying = uniqueData2[0].priceUnderlying
            data1[i].sharePrice = uniqueData2[0].sharePrice
            mergedData.push(data1[i])
            i += 1
          }
          while (i < data1.length) {
            if (z < uniqueData2.length) {
              while (uniqueData2[z].timestamp >= data1[i].timestamp) {
                uniqueData2[z].value = data1[i].value
                mergedData.push(uniqueData2[z])
                z += 1
                if (!addFlag) {
                  addFlag = true
                }
              }
            }
            if (!addFlag) {
              data1[i].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
              data1[i].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
              mergedData.push(data1[i])
            }
            addFlag = false
            i += 1
          }
          while (z < uniqueData2.length) {
            uniqueData2[z].value = 0
            mergedData.push(uniqueData2[z])
            z += 1
          }
          while (i < data1.length) {
            data1[i].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
            data1[i].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
            mergedData.push(data1[i])
            i += 1
          }
        } else {
          let i = 0,
            z = 0,
            addFlag = false
          while (i < uniqueData2.length && uniqueData2[i].timestamp > data1[0].timestamp) {
            uniqueData2[i].value = data1[0].value
            mergedData.push(uniqueData2[i])
            i += 1
          }
          while (z < data1.length) {
            if (i < uniqueData2.length) {
              while (uniqueData2[i].timestamp >= data1[z].timestamp) {
                uniqueData2[i].value = data1[z].value
                mergedData.push(uniqueData2[i])
                i += 1
                if (i >= uniqueData2.length) {
                  break
                }
                if (!addFlag) {
                  addFlag = true
                }
              }
            }
            if (!addFlag) {
              data1[z].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
              data1[z].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
              mergedData.push(data1[z])
            }
            addFlag = false
            z += 1
          }
          while (i < uniqueData2.length) {
            uniqueData2[i].value = 0
            mergedData.push(uniqueData2[i])
            i += 1
          }
          while (z < data1.length) {
            data1[z].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
            data1[z].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
            mergedData.push(data1[z])
            z += 1
          }
        }
        const firstObject = {
          priceUnderlying: useIFARM ? iFarmPrice : usdPrice,
          sharePrice: mergedData[0].sharePrice,
          timestamp: mergedData[0].timestamp,
          value: totalValue,
        }
        mergedData.unshift(firstObject)
        // console.log('totalValue -------------', totalValue)
        // console.log('usdPrice -------------', usdPrice)
        // console.log('mergedData -------------', mergedData)
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
  }, [address, chainId, account, totalValue, usdPrice, iFarmPrice, useIFARM])

  return (
    <Container>
      <Header>
        <Total>
          <FlexDiv>
            <TooltipInfo>
              <TokenSymbol className="priceshare">{tooltipLabel}</TokenSymbol>
              <FlexDiv>
                <CurContent color="#6F78AA">
                  {curDate}&nbsp;<span>|</span>&nbsp;
                </CurContent>
                <CurContent color="#15B088">
                  {clickedId === 0 ? '$' : ''}
                  {curContent}
                </CurContent>
              </FlexDiv>
            </TooltipInfo>
          </FlexDiv>
          <FilterGroup>
            <ChartButtonsGroup
              buttons={filterList}
              clickedId={clickedId}
              setClickedId={setClickedId}
            />
          </FilterGroup>
        </Total>
      </Header>
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
    </Container>
  )
}
export default UserBalanceData
