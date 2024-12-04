import React, { useEffect, useState } from 'react'
import { PiQuestion } from 'react-icons/pi'
import ReactTooltip from 'react-tooltip'
import { useMediaQuery } from 'react-responsive'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import { useRate } from '../../../providers/Rate'
import { Container, Header, ChartDiv, TooltipContent, CurDate, NewLabel } from './style'
import ApexChart from '../ApexChart'
import { formatDate, numberWithCommas } from '../../../utilities/formats'

const LifetimeYieldData = ({ noData, totalHistoryData }) => {
  const { connected } = useWallet()
  const { darkMode, fontColor } = useThemeContext()
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('')
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const nowDate = new Date()
  const currentTimeStamp = Math.floor(nowDate.getTime() / 1000)
  const firstDate = totalHistoryData[totalHistoryData.length - 1]?.timestamp
  const allPeriodDate = ((currentTimeStamp - Number(firstDate)) / (24 * 60 * 60)).toFixed(2)

  const { rates } = useRate()
  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  const handleTooltipContent = payload => {
    if (payload && payload.length) {
      const currentDate = formatDate(payload[0].payload.x)
      const content = `
          <div style="font-size: 25px; line-height: 38px;">
            <div style="color: #5DCF46; font-weight: 600;">
              ${currencySym}${numberWithCommas(
        (Number(payload[0].payload.y) * Number(currencyRate)).toFixed(2),
      )}
            </div>
          </div>`
      setCurContent(content)
      setCurDate(currentDate)
    }
  }

  return (
    <Container fontColor={fontColor}>
      <Header>
        <TooltipContent>
          <div className="title">
            Lifetime Yield
            <PiQuestion className="question" data-tip data-for="lifetime-yield-desktop" />
            <ReactTooltip
              id="lifetime-yield-desktop"
              backgroundColor={darkMode ? 'white' : '#101828'}
              borderColor={darkMode ? 'white' : 'black'}
              textColor={darkMode ? 'black' : 'white'}
              className="mobile-top-tooltip"
              place="top"
            >
              <NewLabel
                size={isMobile ? '10px' : '12px'}
                height={isMobile ? '15px' : '18px'}
                weight="600"
              >
                Your wallet&apos;s lifetime yield with Harvest originating from &apos;harvest&apos;
                events. It shows the value of your accumulated yield in the currency you chose (USD,
                EUR, etc.) at the time of each harvest event.
                <br />
                <br />
                Note: This does not include Claimable Rewards or yield originating from Liquidity
                Provision.
              </NewLabel>
            </ReactTooltip>
          </div>
          <div className="content">
            <div dangerouslySetInnerHTML={{ __html: connected ? curContent : '' }} />
            <CurDate>{curDate}</CurDate>
          </div>
        </TooltipContent>
      </Header>
      <ChartDiv>
        <ApexChart
          noData={noData}
          data={totalHistoryData}
          range={allPeriodDate}
          handleTooltipContent={handleTooltipContent}
          setCurDate={setCurDate}
          setCurContent={setCurContent}
        />
      </ChartDiv>
    </Container>
  )
}
export default LifetimeYieldData
