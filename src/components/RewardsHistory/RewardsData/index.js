import React, { useState, useEffect, useMemo, useCallback } from 'react'
import ReactPaginate from 'react-paginate'
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp, IoArrowForwardSharp } from 'react-icons/io5'
import SkeletonLoader from '../../DashboardComponents/SkeletonLoader'
import { useThemeContext } from '../../../providers/useThemeContext'
import { usePools } from '../../../providers/Pools'
import { useWallet } from '../../../providers/Wallet'
import ActionRow from '../ActionRow'
import { getRewardEntities } from '../../../utilities/apiCalls'
import AdvancedImg from '../../../assets/images/logos/sidebar/advanced.svg'
import { ROUTES } from '../../../constants'
import { fromWei } from '../../../services/viem'
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

const RewardsData = ({ historyData, account, token, isDashboard, noData, setNoData }) => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const itemsPerPage = isMobile ? 5 : isDashboard ? 25 : 5

  const {
    btnColor,
    borderColorBox,
    bgColorNew,
    fontColor,
    fontColor1,
    fontColor2,
    btnHoverColor,
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
          const rewardsTotalData = historyData.filter(item => item.event === 'Rewards')
          setRewardsData(rewardsTotalData)
          if (rewardsTotalData.length === 0) setNoData(true)
        } else {
          try {
            const { rewardsData: rewardsAPIData, rewardsFlag } = await getRewardEntities(
              account,
              token.vaultAddress,
              token.chain || token.data.chain,
            )

            if (isMounted && rewardsFlag) {
              const filteredRewardsData = rewardsAPIData.map(reward => ({
                event: 'Rewards',
                symbol: reward.token.symbol,
                timestamp: reward.timestamp,
                rewards: fromWei(reward.value, reward.token.decimals, reward.token.decimals, true),
                rewardsUSD:
                  parseFloat(reward.price) *
                  fromWei(reward.value, reward.token.decimals, reward.token.decimals, true),
              }))
              setRewardsData(filteredRewardsData)
              if (filteredRewardsData.length === 0) setNoData(true)
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
  }, [account, token, isDashboard, historyData, setNoData])

  return (
    <TransactionDetails $hasdata={(connected && rewardsData?.length > 0) || '80vh'}>
      <TableContent>
        <Header $bordercolor={borderColorBox} $backcolor={bgColorNew}>
          <Column $width={isMobile ? '25%' : '33%'} $fontcolor={fontColor}>
            <Col>Event</Col>
          </Column>
          <Column $width={isMobile ? '30%' : '33%'} $fontcolor={fontColor}>
            <Col>Date</Col>
          </Column>
          <Column $width={isMobile ? '45%' : '34%'} $fontcolor={fontColor}>
            <Col>Rewards</Col>
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
              $bgcolor={bgColorNew}
              $fontcolor={fontColor}
              $fontcolor1={fontColor1}
              $fontcolor2={fontColor2}
              $bordercolor={borderColorBox}
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
            <EmptyPanel $bordercolor={borderColorBox}>
              <EmptyInfo
                $weight={500}
                $size={14}
                $lineheight={20}
                $fontcolor={fontColor}
                $flexflow="column"
                $gap="0px"
              >
                <div>
                  {isDashboard
                    ? 'No Claimed Rewards found for this wallet.'
                    : 'No Claimed Rewards found for this wallet in this strategy.'}
                </div>
                <ExploreButtonStyle
                  onClick={() => {
                    navigate(ROUTES.ADVANCED)
                  }}
                  $inputbordercolor={inputBorderColor}
                  $bordercolor={fontColor}
                  $disabled={disableWallet}
                  $backcolor={btnColor}
                  $hovercolor={btnHoverColor}
                >
                  <img src={AdvancedImg} className="explore-farms" alt="" />
                  Explore Vaults
                </ExploreButtonStyle>
              </EmptyInfo>
            </EmptyPanel>
          )
        ) : (
          <EmptyPanel $bordercolor={borderColorBox}>
            <EmptyInfo $weight={500} $size={14} $lineheight={20} $fontcolor={fontColor}>
              Connect wallet to see full event history.
            </EmptyInfo>
            <ConnectButtonStyle
              onClick={() => {
                connectAction()
              }}
              $inputbordercolor={inputBorderColor}
              $bordercolor={fontColor}
              $disabled={disableWallet}
              $hovercolor={btnHoverColor}
              $backcolor={btnColor}
            >
              Connect
            </ConnectButtonStyle>
          </EmptyPanel>
        )}
      </TableContent>
    </TransactionDetails>
  )
}

export default RewardsData
