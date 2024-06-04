import React, { useEffect, useState } from 'react'
import apyActive from '../../../assets/images/logos/earn/percent-circle.svg'
import tvlActive from '../../../assets/images/logos/earn/bank.svg'
import myBalanceActive from '../../../assets/images/logos/earn/chart-graph.svg'
import { addresses } from '../../../data/index'
import { getDataQuery, getSequenceId, getTotalTVLData } from '../../../utilities/apiCalls'
import { formatDate, numberWithCommas } from '../../../utilities/formats'
import { useThemeContext } from '../../../providers/useThemeContext'
import ApexChart from '../ApexChart'
import ChartButtonsGroup from '../ChartButtonsGroup'
import ChartRangeSelect from '../../ChartRangeSelect'
import {
  ButtonGroup,
  ChartDiv,
  Container,
  FilterGroup,
  Header,
  Total,
  CurDate,
  TooltipInfo,
  FlexDiv,
  LabelInfo,
} from './style'

const filterList = [
  { id: 1, name: 'APY', img: apyActive },
  { id: 2, name: 'TVL in USD', img: tvlActive },
  { id: 3, name: 'Share Price', img: myBalanceActive },
]

const recommendLinks = [
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: '1Y', type: 3, state: '1Y' },
  { name: 'ALL', type: 4, state: 'ALL' },
]

const FarmDetailChart = ({
  token,
  vaultPool,
  lastTVL,
  lastAPY,
  set7DApy,
  set30DApy,
  set180DApy,
  set360DApy,
  setLifetimeApy,
  setVaultBirthday,
  setVaultTotalPeriod,
}) => {
  const { fontColor3, fontColor4 } = useThemeContext()

  const [clickedId, setClickedId] = useState(2)
  const [selectedState, setSelectedState] = useState('1Y')
  const [apiData, setApiData] = useState({})
  const [iFarmTVLData, setIFarmTVLData] = useState({})
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('')
  const [tooltipLabel, setTooltipLabel] = useState('')
  const [roundNumber, setRoundNumber] = useState(0)
  const [fixedLen, setFixedLen] = useState(0)

  const isIFARM = token.tokenAddress === addresses.FARM
  const address = isIFARM
    ? token.tokenAddress
    : token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

  const handleTooltipContent = payload => {
    if (payload && payload.length) {
      setCurDate(formatDate(payload[0].payload.x))
      const content = numberWithCommas(
        Number(payload[0].payload.y).toFixed(
          clickedId === 1 ? 2 : clickedId === 0 ? fixedLen : roundNumber,
        ),
      )
      setCurContent(content)
    }
  }

  useEffect(() => {
    const label = clickedId === 0 ? 'APY' : clickedId === 1 ? 'TVL' : 'Share Price'
    setTooltipLabel(label)
  }, [clickedId])

  useEffect(() => {
    let isMounted = true
    const initData = async () => {
      if (address && chainId) {
        try {
          const { vaultTVLCount } = await getSequenceId(address, chainId)
          const data = await getDataQuery(address, chainId, vaultTVLCount, false)
          const filteredData = {
            ...data,
            generalApies: data.generalApies.filter(entry => parseFloat(entry.apy) <= 100000),
          }
          const updatedData = { ...filteredData }
          updatedData.vaultHistories = updatedData.vaultHistories.filter(
            history => history.sharePrice !== '0',
          )

          // Calculate Detailed APY Breakdown values
          const vaultInitialDate = formatDate(
            Number(updatedData.generalApies[updatedData.generalApies.length - 1].timestamp) * 1000,
          )
          const totalPeriod =
            (Number(updatedData.generalApies[0].timestamp) -
              Number(updatedData.generalApies[updatedData.generalApies.length - 1].timestamp)) /
            (24 * 3600)

          let [sevenDaysApy, thirtyDaysApy, oneEightyDaysApy, threeSixtyFiveDaysApy] = Array(
              4,
            ).fill('-'),
            lifetimeApyValue = 0

          updatedData.generalApies.forEach(item => {
            lifetimeApyValue += Number(item.apy)
          })
          lifetimeApyValue /= updatedData.generalApies.length
          lifetimeApyValue = `${lifetimeApyValue.toFixed(2)}%`

          if (totalPeriod >= 7) {
            const lastSevenDaysData = updatedData.generalApies.filter(
              entry =>
                Number(entry.timestamp) >=
                Number(updatedData.generalApies[0].timestamp) - 7 * 24 * 3600,
            )
            const sumApy = lastSevenDaysData.reduce(
              (accumulator, currentValue) => accumulator + parseFloat(currentValue.apy),
              0,
            )
            sevenDaysApy = `${(sumApy / lastSevenDaysData.length).toFixed(2)}%`
          }

          if (totalPeriod >= 30) {
            const lastThirtyDaysData = updatedData.generalApies.filter(
              entry =>
                Number(entry.timestamp) >=
                Number(updatedData.generalApies[0].timestamp) - 30 * 24 * 3600,
            )
            const sumApy = lastThirtyDaysData.reduce(
              (accumulator, currentValue) => accumulator + parseFloat(currentValue.apy),
              0,
            )
            thirtyDaysApy = `${(sumApy / lastThirtyDaysData.length).toFixed(2)}%`
          }

          if (totalPeriod >= 180) {
            const lastOneEightyDaysData = updatedData.generalApies.filter(
              entry =>
                Number(entry.timestamp) >=
                Number(updatedData.generalApies[0].timestamp) - 180 * 24 * 3600,
            )
            const sumApy = lastOneEightyDaysData.reduce(
              (accumulator, currentValue) => accumulator + parseFloat(currentValue.apy),
              0,
            )
            oneEightyDaysApy = `${(sumApy / lastOneEightyDaysData.length).toFixed(2)}%`
          }

          if (totalPeriod >= 365) {
            const lastThreeSixtyFiveDaysData = updatedData.generalApies.filter(
              entry =>
                Number(entry.timestamp) >=
                Number(updatedData.generalApies[0].timestamp) - 365 * 24 * 3600,
            )
            const sumApy = lastThreeSixtyFiveDaysData.reduce(
              (accumulator, currentValue) => accumulator + parseFloat(currentValue.apy),
              0,
            )
            threeSixtyFiveDaysApy = `${(sumApy / lastThreeSixtyFiveDaysData.length).toFixed(2)}%`
          }

          set7DApy(sevenDaysApy)
          set30DApy(thirtyDaysApy)
          set180DApy(oneEightyDaysApy)
          set360DApy(threeSixtyFiveDaysApy)
          setLifetimeApy(lifetimeApyValue)
          setVaultBirthday(vaultInitialDate)
          setVaultTotalPeriod(totalPeriod.toFixed())

          if (isMounted) {
            setApiData(updatedData)
            if (isIFARM && updatedData) {
              data.apyRewards = updatedData.apyRewards
              data.tvls = updatedData.tvls

              const iFarmTVL = await getTotalTVLData()
              setIFarmTVLData(iFarmTVL)
            }
          }
        } catch (error) {
          console.log('An error ocurred', error)
        }
      }
    }

    initData()

    return () => {
      isMounted = false
    }
  }, [address, chainId, isIFARM]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Header>
        <Total>
          <FlexDiv>
            <TooltipInfo>
              <LabelInfo fontColor4={fontColor4}>{tooltipLabel}</LabelInfo>
              <CurDate fontColor3={fontColor3}>
                {curDate}&nbsp;<span>|</span>&nbsp;
                <p>
                  {clickedId === 1 ? '$' : ''}
                  {curContent}
                  {clickedId === 0 ? '%' : ''}
                </p>
              </CurDate>
            </TooltipInfo>
            <FilterGroup>
              <ChartButtonsGroup
                buttons={filterList}
                clickedId={clickedId}
                setClickedId={setClickedId}
              />
            </FilterGroup>
          </FlexDiv>
        </Total>
      </Header>
      <ChartDiv className="advanced-farm">
        <ApexChart
          token={token}
          data={apiData}
          iFarmTVL={iFarmTVLData}
          isIFARM={isIFARM}
          range={selectedState}
          filter={clickedId}
          lastTVL={lastTVL}
          lastAPY={lastAPY}
          setCurDate={setCurDate}
          setCurContent={setCurContent}
          handleTooltipContent={handleTooltipContent}
          setRoundNumber={setRoundNumber}
          setFixedLen={setFixedLen}
          fixedLen={fixedLen}
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
export default FarmDetailChart
