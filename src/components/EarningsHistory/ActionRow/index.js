import React from 'react'
import { useMediaQuery } from 'react-responsive'
import ListItem from '../ListItem'
import { useThemeContext } from '../../../providers/useThemeContext'
import TrendUp from '../../../assets/images/logos/advancedfarm/trend-up.svg'
import TrendDown from '../../../assets/images/logos/advancedfarm/trend-down.svg'
import { Content, DetailView, FlexDiv, Badge, NetImg } from './style'

function formatDateTime(value) {
  const date = new Date(value * 1000) // Multiply by 1000 to convert seconds to milliseconds
  const year = date.getFullYear()
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const monthNum = date.getMonth()
  const month = monthNames[monthNum]
  const day = date.getDate()

  // Get hours and minutes
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours %= 12
  hours = hours || 12 // Convert 0 hours to 12

  // Format the time
  const time = `${hours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`

  return { __html: `${time}<br /> ${month} ${day}, ${year}` }
}

const ActionRow = ({ info, tokenSymbol }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const {
    switchMode,
    backColor,
    borderColor,
    hoverColor,
    fontColor1,
    fontColor,
  } = useThemeContext()

  return (
    <DetailView
      borderColor={borderColor}
      hoverColor={hoverColor}
      mode={switchMode}
      background={backColor}
    >
      <FlexDiv padding={isMobile ? '10px' : '0'}>
        <Content width={isMobile ? '25%' : '20%'} marginTop={isMobile ? '15px' : 'unset'}>
          <Badge
            bgColor={info.event === 'Revert' ? '#FEF3F2' : '#ecfdf3'}
            color={info.event === 'Revert' ? '#B42318' : '#027a48'}
          >
            {info.event}
          </Badge>
        </Content>
        <Content width={isMobile ? '25%' : '20%'} color={fontColor}>
          <div className="timestamp" dangerouslySetInnerHTML={formatDateTime(info.timestamp)} />
        </Content>
        <Content width={isMobile ? '25%' : '30%'} marginTop={isMobile ? '15px' : 'unset'}>
          <ListItem weight={500} size={14} height={20} color={fontColor1} value={info.balance} />
          <ListItem weight={400} size={14} height={20} color={fontColor} value={tokenSymbol} />
        </Content>
        <Content
          display="flex"
          width={isMobile ? '25%' : '30%'}
          marginTop={isMobile ? '15px' : 'unset'}
        >
          <NetImg>
            <img src={info.event === 'Revert' ? TrendDown : TrendUp} alt="trend" />
          </NetImg>
          <div>
            <ListItem
              weight={500}
              size={14}
              height={20}
              color={fontColor1}
              value={info.netChange}
            />
            <ListItem weight={400} size={14} height={20} color={fontColor} value={tokenSymbol} />
          </div>
        </Content>
      </FlexDiv>
    </DetailView>
  )
}
export default ActionRow
