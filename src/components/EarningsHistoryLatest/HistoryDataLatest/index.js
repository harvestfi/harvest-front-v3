import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import ActionRow from '../ActionRow'
import AnimatedDots from '../../AnimatedDots'
import {
  TransactionDetails,
  TableContent,
  Header,
  Column,
  Col,
  EmptyPanel,
  EmptyInfo,
  ContentBox,
} from './style'

const HistoryDataLatest = ({ historyData, isDashboard, noData }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const filteredHistoryData = historyData.filter(el => el.event === 'Harvest' && el.netChange >= 0)

  const { borderColor, bgColorTable, fontColor } = useThemeContext()
  const { connected } = useWallet()

  return (
    <TransactionDetails
      hasData={
        (connected && filteredHistoryData?.length > 0) || isDashboard === 'true' ? 'unset' : '80vh'
      }
    >
      <TableContent borderColor={borderColor}>
        <Header borderColor={borderColor} backColor={bgColorTable}>
          <Column width={isMobile ? '20%' : '20%'} color={fontColor}>
            <Col>Date</Col>
          </Column>
          <Column width={isMobile ? '0%' : '30%'} color={fontColor} justifyContent="end">
            <Col>Yield</Col>
          </Column>
        </Header>
        {connected && filteredHistoryData?.length > 0 ? (
          <ContentBox borderColor={borderColor}>
            {filteredHistoryData
              .map((el, i) => {
                const info = filteredHistoryData[i]
                return <ActionRow key={i} info={info} />
              })
              .slice(0, 7)}
          </ContentBox>
        ) : (
          <EmptyPanel borderColor={borderColor}>
            {connected ? (
              !noData ? (
                <EmptyInfo
                  height="100%"
                  weight={500}
                  size={14}
                  lineHeight={20}
                  color={fontColor}
                  gap="2px"
                >
                  <div className="desc-text">
                    Loading latest yield data for the connected wallet. It might take up to 30s{' '}
                    <AnimatedDots />
                  </div>
                </EmptyInfo>
              ) : (
                <EmptyInfo height="100%" weight={500} size={14} lineHeight={20} color={fontColor}>
                  No activity found for this wallet.
                </EmptyInfo>
              )
            ) : (
              <>
                <EmptyInfo height="100%" weight={500} size={14} lineHeight={20} color={fontColor}>
                  Connect wallet to see your latest yield
                </EmptyInfo>
              </>
            )}
          </EmptyPanel>
        )}
      </TableContent>
    </TransactionDetails>
  )
}

export default HistoryDataLatest
