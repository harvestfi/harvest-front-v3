import React, { useState } from 'react'
import { PiQuestion } from 'react-icons/pi'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Header, ChartDiv, TooltipContent, CurDate } from './style'
import ApexChart from '../ApexChart'

const LifetimeYieldData = ({ noData, totalHistoryData }) => {
  const { fontColor } = useThemeContext()
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('')

  const nowDate = new Date()
  const currentTimeStamp = Math.floor(nowDate.getTime() / 1000)
  const firstDate = totalHistoryData[totalHistoryData.length - 1]?.timestamp
  const allPeriodDate = ((currentTimeStamp - Number(firstDate)) / (24 * 60 * 60)).toFixed(2)

  return (
    <Container fontColor={fontColor}>
      <Header>
        <TooltipContent>
          <div className="title">
            Lifetime Yield
            <PiQuestion />
          </div>
          <div className="content">
            <CurDate>{curDate}</CurDate>
            <div dangerouslySetInnerHTML={{ __html: curContent }} />
          </div>
        </TooltipContent>
      </Header>
      <ChartDiv>
        <ApexChart
          noData={noData}
          data={totalHistoryData}
          range={allPeriodDate}
          setCurDate={setCurDate}
          setCurContent={setCurContent}
        />
      </ChartDiv>
    </Container>
  )
}
export default LifetimeYieldData
