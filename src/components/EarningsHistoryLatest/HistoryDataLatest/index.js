import React from 'react'
import { useMediaQuery } from 'react-responsive'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useWallet } from '../../../providers/Wallet'
import ActionRow from '../ActionRow'
import {
  TransactionDetails,
  TableContent,
  Header,
  Column,
  Col,
  EmptyPanel,
  EmptyInfo,
  ContentBox,
  SkeletonItem,
} from './style'

const HistoryDataLatest = ({ historyData, isDashboard, noData }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const filteredHistoryData = historyData.filter(el => el.event === 'Harvest' && el.netChange >= 0)

  const { borderColorTable, bgColorTable, fontColor, highlightColor } = useThemeContext()
  const { connected } = useWallet()

  return (
    <TransactionDetails
      hasData={
        (connected && filteredHistoryData?.length > 0) || isDashboard === 'true' ? 'unset' : '80vh'
      }
    >
      <TableContent borderColor={borderColorTable}>
        <Header borderColor={borderColorTable} backColor={bgColorTable}>
          <Column width={isMobile ? '20%' : '20%'} color={fontColor}>
            <Col>Date</Col>
          </Column>
          <Column width={isMobile ? '0%' : '30%'} color={fontColor} justifyContent="end">
            <Col>Yield</Col>
          </Column>
        </Header>
        {connected && filteredHistoryData?.length > 0 ? (
          <ContentBox borderColor={borderColorTable}>
            {filteredHistoryData
              .map((el, i) => {
                const info = filteredHistoryData[i]
                return <ActionRow key={i} info={info} />
              })
              .slice(0, 7)}
          </ContentBox>
        ) : connected ? (
          !noData ? (
            <EmptyPanel borderColor={borderColorTable}>
              <SkeletonTheme baseColor="#ECECEC" highlightColor={highlightColor}>
                {[...Array(6)].map((_, index) => (
                  <SkeletonItem key={index}>
                    <div>
                      <Skeleton containerClassName="skeleton" width="50%" height={10} />
                    </div>
                    <div>
                      <Skeleton containerClassName="skeleton" width="25%" height={10} />
                    </div>
                  </SkeletonItem>
                ))}
              </SkeletonTheme>
            </EmptyPanel>
          ) : (
            <EmptyPanel borderColor={borderColorTable} height="400px">
              <EmptyInfo height="100%" weight={500} size={14} lineHeight={20} color={fontColor}>
                No activity found for this wallet.
              </EmptyInfo>
            </EmptyPanel>
          )
        ) : (
          <EmptyPanel borderColor={borderColorTable} height="400px">
            <EmptyInfo height="100%" weight={500} size={14} lineHeight={20} color={fontColor}>
              Connect wallet to see your latest yield
            </EmptyInfo>
          </EmptyPanel>
        )}
      </TableContent>
    </TransactionDetails>
  )
}

export default HistoryDataLatest
