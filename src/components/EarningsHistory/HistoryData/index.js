import React, { useState, useMemo, useCallback } from 'react'
import ReactPaginate from 'react-paginate'
import { IoArrowBackSharp, IoArrowForwardSharp } from 'react-icons/io5'
import ConnectDisableIcon from '../../../assets/images/logos/sidebar/connect-disable.svg'
import { useThemeContext } from '../../../providers/useThemeContext'
import { usePools } from '../../../providers/Pools'
import { useWallet } from '../../../providers/Wallet'
import ActionRow from '../ActionRow'
import {
  TransactionDetails,
  HistoryPagination,
  TableContent,
  Header,
  Column,
  Col,
  EmptyPanel,
  EmptyInfo,
  ConnectButtonStyle,
} from './style'

const itemsPerPage = 7

const HistoryData = ({ tokenSymbol, historyData }) => {
  const {
    borderColor,
    backColor,
    bgColorFarm,
    fontColor,
    fontColor1,
    fontColor2,
    hoverColorButton,
    inputBorderColor,
  } = useThemeContext()

  const { disableWallet } = usePools()
  const { connected, connectAction } = useWallet()
  const [itemOffset, setItemOffset] = useState(0)

  const { currentItems, pageCount } = useMemo(() => {
    const endOffset = itemOffset + itemsPerPage
    console.log(`Loading items from ${itemOffset} to ${endOffset}`)
    const currentItems1 = historyData?.slice(itemOffset, endOffset)
    const pageCount1 = Math.ceil(historyData?.length / itemsPerPage)

    return { currentItems: currentItems1, pageCount: pageCount1 }
  }, [historyData, itemOffset])

  const handlePageClick = useCallback(
    event => {
      const newOffset = (event.selected * itemsPerPage) % historyData.length
      console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`)
      setItemOffset(newOffset)
    },
    [historyData],
  )

  const CustomPreviousComponent = () => (
    <span>
      <IoArrowBackSharp /> Previous
    </span>
  )

  const CustomNextComponent = () => (
    <span>
      Next <IoArrowForwardSharp />
    </span>
  )

  return (
    <TransactionDetails>
      <TableContent borderColor={borderColor}>
        <Header borderColor={borderColor} backColor={backColor}>
          <Column width="20%" color={fontColor}>
            <Col>Event</Col>
          </Column>
          <Column width="20%" color={fontColor}>
            <Col>Date</Col>
          </Column>
          <Column width="30%" color={fontColor}>
            <Col>Total Balance</Col>
          </Column>
          <Column width="30%" color={fontColor}>
            <Col>Net change</Col>
          </Column>
        </Header>
        {connected && historyData?.length > 0 ? (
          <>
            {currentItems
              .map((el, i) => {
                const info = currentItems[i]
                return <ActionRow key={i} info={info} tokenSymbol={tokenSymbol} />
              })
              .slice(0, 7)}
            <HistoryPagination
              bgColor={bgColorFarm}
              fontColor={fontColor}
              fontColor1={fontColor1}
              fontColor2={fontColor2}
              borderColor={inputBorderColor}
            >
              <ReactPaginate
                breakLabel="..."
                nextLabel={<CustomNextComponent />}
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel={<CustomPreviousComponent />}
                renderOnZeroPageCount={null}
                containerClassName="paginate-container"
                className="paginate-wrapper"
                pageClassName="paginate-item"
                pageLinkClassName="paginate-item-link"
              />
            </HistoryPagination>
          </>
        ) : (
          <EmptyPanel borderColor={borderColor}>
            {connected ? (
              <EmptyInfo weight={500} size={14} height={20} color={fontColor}>
                {historyData?.length === 0
                  ? 'Loading ...'
                  : `You're not farming in this farm. Let's put your assets to work!`}
              </EmptyInfo>
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

export default HistoryData
