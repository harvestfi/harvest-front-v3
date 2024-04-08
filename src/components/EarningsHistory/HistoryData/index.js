import React, { useState, useEffect, useMemo, useCallback } from 'react'
import ReactPaginate from 'react-paginate'
import { getUserBalanceHistories1, getUserBalanceHistories2 } from '../../../utils'
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

const HistoryData = ({ token, tokenSymbol, vaultPool, setUnderlyingEarnings, setUsdEarnings }) => {
  const {
    borderColor,
    backColor,
    fontColor,
    fontColor2,
    hoverColorButton,
    inputBorderColor,
  } = useThemeContext()

  const { disableWallet } = usePools()
  const { connected, connectAction, account } = useWallet()
  const [historyData, setHistoryData] = useState([])
  const [itemOffset, setItemOffset] = useState(0)

  const address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

  useEffect(() => {
    const initData = async () => {
      const { data1, flag1 } = await getUserBalanceHistories1(address, chainId, account)
      const { data2, flag2 } = await getUserBalanceHistories2(address, chainId)
      const uniqueData2 = []
      const timestamps = []

      data2.forEach(obj => {
        if (!timestamps.includes(obj.timestamp)) {
          timestamps.push(obj.timestamp)
          const modifiedObj = { ...obj, priceUnderlying: obj.price } // Rename the 'price' property to 'priceUnderlying'
          delete modifiedObj.price // Remove the 'value' property from modifiedObj
          uniqueData2.push(modifiedObj)
        }
      })
      const mergedData = []
      let enrichedData, uniqueData

      if (flag1 && flag2) {
        // const nowDate = new Date()
        // const currentTimeStamp = Math.floor(nowDate.getTime() / 1000)

        if (data1[0].timestamp > uniqueData2[0].timestamp) {
          let i = 0,
            z = 0,
            addFlag = false

          while (data1[i].timestamp > uniqueData2[0].timestamp) {
            data1[i].priceUnderlying = uniqueData2[0].priceUnderlying
            data1[i].sharePrice = uniqueData2[0].sharePrice
            mergedData.push(data1[i])
            i += 1
          }
          while (i < data1.length) {
            if (z < uniqueData2.length) {
              while (uniqueData2[z].timestamp >= data1[i].timestamp) {
                uniqueData2[z].value = data1[i].value
                mergedData.push(uniqueData2[z])
                z += 1
                if (!addFlag) {
                  addFlag = true
                }
              }
            }
            if (!addFlag) {
              data1[i].priceUnderlying =
                uniqueData2[z === uniqueData2.length ? z - 1 : z].priceUnderlying
              data1[i].sharePrice = uniqueData2[z === uniqueData2.length ? z - 1 : z].sharePrice
              mergedData.push(data1[i])
            }
            addFlag = false
            i += 1
          }
          while (z < uniqueData2.length) {
            uniqueData2[z].value = 0
            mergedData.push(uniqueData2[z])
            z += 1
          }
          while (i < data1.length) {
            data1[i].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
            data1[i].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
            mergedData.push(data1[i])
            i += 1
          }
        } else {
          let i = 0,
            z = 0,
            addFlag = false
          while (i < uniqueData2.length && uniqueData2[i].timestamp > data1[0].timestamp) {
            uniqueData2[i].value = data1[0].value
            mergedData.push(uniqueData2[i])
            i += 1
          }
          while (z < data1.length) {
            if (i < uniqueData2.length) {
              while (uniqueData2[i].timestamp >= data1[z].timestamp) {
                uniqueData2[i].value = data1[z].value
                mergedData.push(uniqueData2[i])
                i += 1
                if (i >= uniqueData2.length) {
                  break
                }
                if (!addFlag) {
                  addFlag = true
                }
              }
            }
            if (!addFlag) {
              data1[z].priceUnderlying =
                uniqueData2[i === uniqueData2.length ? i - 1 : i].priceUnderlying
              data1[z].sharePrice = uniqueData2[i === uniqueData2.length ? i - 1 : i].sharePrice
              mergedData.push(data1[z])
            }
            addFlag = false
            z += 1
          }
          while (i < uniqueData2.length) {
            uniqueData2[i].value = 0
            mergedData.push(uniqueData2[i])
            i += 1
          }
          while (z < data1.length) {
            data1[z].priceUnderlying = uniqueData2[uniqueData2.length - 1].priceUnderlying
            data1[z].sharePrice = uniqueData2[uniqueData2.length - 1].sharePrice
            mergedData.push(data1[z])
            z += 1
          }
        }

        // Filter out objects where 'value' is not equal to 0 or '0'
        const filteredData = mergedData.filter(item => item.value !== '0' && item.value !== 0)

        // Create a map to keep track of unique combinations of 'value' and 'sharePrice'
        const map = new Map()
        filteredData.forEach(item => {
          const key = `${item.value}_${item.sharePrice}`
          map.set(key, item)
        })

        // Convert the map back to an array
        uniqueData = Array.from(map.values())
        uniqueData.sort((a, b) => b.timestamp - a.timestamp)

        enrichedData = uniqueData.map((item, index, array) => {
          const nextItem = array[index + 1]
          let event, balance, netChange

          if (nextItem) {
            if (Number(item.value) === Number(nextItem.value)) {
              event = 'Harvest'
            } else if (Number(item.value) > Number(nextItem.value)) {
              event = 'Convert'
            } else {
              event = 'Revert'
            }

            balance = Number(item.value) * Number(item.sharePrice)
            const nextBalance = Number(nextItem.value) * Number(nextItem.sharePrice)
            netChange = balance - nextBalance
          } else {
            event = 'Convert'
            balance = Number(item.value) * Number(item.sharePrice)
            netChange = Number(item.value) * Number(item.sharePrice)
          }

          return {
            ...item,
            event,
            balance,
            netChange,
          }
        })

        const sumNetChange = enrichedData.reduce((sum, item) => {
          if (item.event === 'Harvest') {
            return sum + item.netChange
          }
          return sum
        }, 0)
        const sumNetChangeUsd = (
          Number(sumNetChange) * Number(enrichedData[0].priceUnderlying)
        ).toFixed(2)
        setUnderlyingEarnings(sumNetChange)
        setUsdEarnings(sumNetChangeUsd)

        // console.log('data1 -------------', data1)
        // console.log('data2 -------------', data2)
        console.log('historyData1 -------------', mergedData)
        console.log('historyData2 -------------', uniqueData)
        console.log('historyData3 -------------', enrichedData)
      }
      setHistoryData(enrichedData)
    }

    initData()
  }, [address, chainId, account, setUnderlyingEarnings, setUsdEarnings])

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
            <HistoryPagination>
              <ReactPaginate
                breakLabel="..."
                nextLabel="Next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< Previous"
                renderOnZeroPageCount={null}
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
                Syncing ...
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
