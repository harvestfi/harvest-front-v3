import React, { useState, useEffect } from 'react'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Header, ButtonGroup, ChartDiv, TooltipContent } from './style'
import { getTotalTVLData } from '../../../utilities/apiCalls'
import ApexChart from '../ApexChart'
import ChartRangeSelect from '../../ChartRangeSelect'

const recommendLinks = [
  { name: '1D', type: 0, state: '1D' },
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: '1Y', type: 3, state: '1Y' },
]

const AnalyticChart = () => {
  const [selectedState, setSelectedState] = useState('1Y')

  const [apiData, setApiData] = useState([])

  useEffect(() => {
    const initData = async () => {
      const data = await getTotalTVLData()
      setApiData(data)
    }

    initData()
  }, [])

  const { fontColor } = useThemeContext()

  return (
    <>
      <Container $fontcolor={fontColor}>
        <Header>
          <TooltipContent></TooltipContent>
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
        </Header>
        <ChartDiv>
          <ApexChart data={apiData} range={selectedState} />
        </ChartDiv>
      </Container>
    </>
  )
}
export default AnalyticChart
