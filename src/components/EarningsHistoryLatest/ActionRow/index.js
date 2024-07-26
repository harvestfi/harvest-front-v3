import React from 'react'
import { useMediaQuery } from 'react-responsive'
import ListItem from '../ListItem'
import { useThemeContext } from '../../../providers/useThemeContext'
import { formatDateTimeMobile } from '../../../utilities/formats'
import { Content, DetailView, FlexDiv } from './style'

const ActionRow = ({ info }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const { switchMode, backColor, borderColor, hoverColorSoft, fontColor } = useThemeContext()

  return (
    <DetailView
      borderColor={borderColor}
      hoverColor={hoverColorSoft}
      mode={switchMode}
      background={backColor}
    >
      <FlexDiv padding={isMobile ? '10px' : '0'}>
        <Content width="30%" color={fontColor} paddingRight={isMobile ? '8px' : '0px'}>
          <div
            className="timestamp"
            dangerouslySetInnerHTML={formatDateTimeMobile(info.timestamp)}
          />
        </Content>
        <Content width="57%">
          <ListItem
            weight={600}
            size={12}
            height={20}
            color="#5FCF76"
            justifyContent="end"
            value={`${info.netChangeUsd === '<$0.01' ? '' : '≈'}${info.netChangeUsd}`}
          />
          <ListItem
            weight={500}
            size={10}
            height={20}
            color="#8884D8"
            justifyContent="end"
            value={info.netChange}
          />
          <ListItem
            weight={400}
            size={10}
            height={20}
            color="#8884D8"
            justifyContent="end"
            value={info.tokenSymbol}
          />
        </Content>
      </FlexDiv>
    </DetailView>
  )
}
export default ActionRow
