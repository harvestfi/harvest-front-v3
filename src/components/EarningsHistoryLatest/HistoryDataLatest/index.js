import React from 'react'
import { useMediaQuery } from 'react-responsive'
import ConnectDisableIcon from '../../../assets/images/logos/sidebar/connect-disable.svg'
import { useThemeContext } from '../../../providers/useThemeContext'
import { usePools } from '../../../providers/Pools'
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
  ConnectButtonStyle,
  ContentBox,
} from './style'

const HistoryDataLatest = ({ historyData, isDashboard, noData }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const filteredHistoryData = historyData.filter(el => el.event === 'Harvest' && el.netChange >= 0)

  const {
    borderColor,
    backColor,
    fontColor,
    fontColor2,
    hoverColorButton,
    inputBorderColor,
  } = useThemeContext()

  const { disableWallet } = usePools()
  const { connected, connectAction } = useWallet()

  return (
    <TransactionDetails
      hasData={
        (connected && filteredHistoryData?.length > 0) || isDashboard === 'true' ? 'unset' : '80vh'
      }
    >
      <TableContent borderColor={borderColor}>
        <Header borderColor={borderColor} backColor={backColor}>
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
                <EmptyInfo weight={500} size={14} height={20} color={fontColor} gap="2px">
                  <div>
                    Loading all events data for the connected wallet. It might take up to 30s{' '}
                    <AnimatedDots />
                  </div>
                </EmptyInfo>
              ) : (
                <EmptyInfo weight={500} size={14} height={20} color={fontColor}>
                  No interaction history found for this wallet.
                </EmptyInfo>
              )
            ) : (
              <>
                <EmptyInfo weight={500} size={14} height={20} color={fontColor}>
                  Connect wallet to see your positions.
                </EmptyInfo>
                <ConnectButtonStyle
                  color="connectwallet"
                  onClick={() => {
                    connectAction()
                  }}
                  minWidth="190px"
                  inputBorderColor={inputBorderColor}
                  fontColor2={fontColor2}
                  backColor={backColor}
                  bordercolor={fontColor}
                  disabled={disableWallet}
                  hoverColorButton={hoverColorButton}
                >
                  <img src={ConnectDisableIcon} className="connect-wallet" alt="" />
                  Connect Wallet
                </ConnectButtonStyle>
              </>
            )}
          </EmptyPanel>
        )}
      </TableContent>
    </TransactionDetails>
  )
}

export default HistoryDataLatest
