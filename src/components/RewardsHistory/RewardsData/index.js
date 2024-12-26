import React, { useState, useEffect, useMemo, useCallback } from 'react'
import ReactPaginate from 'react-paginate'
import { useMediaQuery } from 'react-responsive'
import { useHistory } from 'react-router-dom'
import { IoArrowBackSharp, IoArrowForwardSharp } from 'react-icons/io5'
import SkeletonLoader from '../../DashboardComponents/SkeletonLoader'
import { useThemeContext } from '../../../providers/useThemeContext'
import { usePools } from '../../../providers/Pools'
import { useWallet } from '../../../providers/Wallet'
import ActionRow from '../ActionRow'
import { getRewardEntities } from '../../../utilities/apiCalls'
import AdvancedImg from '../../../assets/images/logos/sidebar/advanced.svg'
import { ROUTES } from '../../../constants'
import {
  TransactionDetails,
  HistoryPagination,
  TableContent,
  Header,
  Column,
  Col,
  ContentBox,
  EmptyPanel,
  EmptyInfo,
  ConnectButtonStyle,
  ExploreButtonStyle,
} from './style'

const RewardsData = ({ rewardsData: rewardsTotalData, account, token, isDashboard, noData }) => {
  const { push } = useHistory()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const itemsPerPage = isMobile ? 5 : isDashboard ? 25 : 5

  const {
    borderColorBox,
    bgColorNew,
    fontColor,
    fontColor1,
    fontColor2,
    hoverColorButton,
    inputBorderColor,
  } = useThemeContext()

  const { disableWallet } = usePools()
  const { connected, connectAction } = useWallet()
  const [itemOffset, setItemOffset] = useState(0)
  const [rewardsData, setRewardsData] = useState([])

  const { currentItems, pageCount } = useMemo(() => {
    const endOffset = itemOffset + itemsPerPage
    const currentItems1 = rewardsData?.slice(itemOffset, endOffset)
    const pageCount1 = Math.ceil(rewardsData?.length / itemsPerPage)

    return { currentItems: currentItems1, pageCount: pageCount1 }
  }, [rewardsData, itemOffset, itemsPerPage])

  const handlePageClick = useCallback(
    event => {
      const newOffset = (event.selected * itemsPerPage) % rewardsData.length
      setItemOffset(newOffset)
    },
    [rewardsData, itemsPerPage],
  )

  const CustomPreviousComponent = () => (
    <span>
      <IoArrowBackSharp /> {isMobile ? '' : 'Previous'}
    </span>
  )

  const CustomNextComponent = () => (
    <span>
      {isMobile ? '' : 'Next'} <IoArrowForwardSharp />
    </span>
  )

  useEffect(() => {
    let isMounted = true
    const initData = async () => {
      if (account) {
        if (isDashboard) {
          setRewardsData(rewardsTotalData)
        } else {
          try {
            const { rewardsData: rewardsAPIData, rewardsFlag } = await getRewardEntities(
              account,
              token.vaultAddress,
              token.chain || token.data.chain,
            )

            if (isMounted && rewardsFlag) {
              setRewardsData(rewardsAPIData)
            }
          } catch (error) {
            console.log('An error ocurred', error)
          }
        }
      }
    }

    initData()

    return () => {
      isMounted = false
    }
  }, [account, token, isDashboard, rewardsTotalData])

  return (
    <TransactionDetails hasData={(connected && rewardsData?.length > 0) || '80vh'}>
      <TableContent>
        <Header borderColor={borderColorBox} backColor={bgColorNew}>
          <Column width={isMobile ? '25%' : '33%'} color={fontColor}>
            <Col>Event</Col>
          </Column>
          <Column width={isMobile ? '30%' : '33%'} color={fontColor}>
            <Col>Date</Col>
          </Column>
          <Column width={isMobile ? '45%' : '34%'} color={fontColor}>
            <Col>Other</Col>
          </Column>
        </Header>
        {connected && rewardsData?.length > 0 ? (
          <div>
            <ContentBox>
              {currentItems
                .map((el, i) => {
                  const info = currentItems[i]
                  return <ActionRow key={i} info={info} />
                })
                .slice(0, isMobile ? 5 : isDashboard ? 25 : 5)}
            </ContentBox>
            <HistoryPagination
              bgColor={bgColorNew}
              fontColor={fontColor}
              fontColor1={fontColor1}
              fontColor2={fontColor2}
              borderColor={borderColorBox}
            >
              <ReactPaginate
                breakLabel="..."
                nextLabel={<CustomNextComponent />}
                onPageChange={handlePageClick}
                pageRangeDisplayed={isMobile ? 2 : 5}
                marginPagesDisplayed={isMobile ? 0 : 3}
                pageCount={pageCount}
                previousLabel={<CustomPreviousComponent />}
                renderOnZeroPageCount={null}
                containerClassName="paginate-container"
                className="paginate-wrapper"
                pageClassName="paginate-item"
                pageLinkClassName="paginate-item-link"
              />
            </HistoryPagination>
          </div>
        ) : connected ? (
          !noData ? (
            <SkeletonLoader isPosition="false" />
          ) : (
            <EmptyPanel borderColor={borderColorBox}>
              <EmptyInfo
                weight={500}
                size={14}
                lineHeight={20}
                color={fontColor}
                flexFlow="column"
                gap="0px"
              >
                <div>
                  {isDashboard
                    ? 'No Claimed Rewards found for this wallet.'
                    : 'No Claimed Rewards found for this wallet in this strategy.'}
                </div>
                <ExploreButtonStyle
                  color="connectwallet"
                  onClick={() => {
                    push(ROUTES.ADVANCED)
                  }}
                  minWidth="190px"
                  inputBorderColor={inputBorderColor}
                  bordercolor={fontColor}
                  disabled={disableWallet}
                >
                  <img src={AdvancedImg} className="explore-farms" alt="" />
                  Explore Farms
                </ExploreButtonStyle>
              </EmptyInfo>
            </EmptyPanel>
          )
        ) : (
          <EmptyPanel borderColor={borderColorBox}>
            <EmptyInfo weight={500} size={14} lineHeight={20} color={fontColor}>
              Connect wallet to see full event history.
            </EmptyInfo>
            <ConnectButtonStyle
              color="connectwallet"
              onClick={() => {
                connectAction()
              }}
              minWidth="190px"
              inputBorderColor={inputBorderColor}
              bordercolor={fontColor}
              disabled={disableWallet}
              hoverColor={hoverColorButton}
            >
              Connect Wallet
            </ConnectButtonStyle>
          </EmptyPanel>
        )}
      </TableContent>
    </TransactionDetails>
  )
}

export default RewardsData
