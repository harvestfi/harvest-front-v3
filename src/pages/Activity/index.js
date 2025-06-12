import React, { useRef, useEffect, useState } from 'react'
import useEffectWithPrevious from 'use-effect-with-previous'
import { isEmpty, isEqual } from 'lodash'
import { useMediaQuery } from 'react-responsive'
import 'react-loading-skeleton/dist/skeleton.css'
import EarningsHistory from '../../components/EarningsHistory/HistoryData'
import RewardsHistory from '../../components/RewardsHistory/RewardsData'
import { FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL, historyTags } from '../../constants'
import { usePools } from '../../providers/Pools'
import { useThemeContext } from '../../providers/useThemeContext'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import { fetchAndParseVaultData } from '../../utilities/parsers'
import { Container, Inner, HeaderWrap, HeaderTitle, NewLabel, SwitchTabTag } from './style'

const Activity = () => {
  const { account, balances, getWalletBalances } = useWallet()
  const { userStats } = usePools()
  const { vaultsData } = useVaults()

  const {
    darkMode,
    bgColorNew,
    fontColor,
    fontColor1,
    fontColor3,
    fontColor4,
    activeColorNew,
    boxShadowColor2,
  } = useThemeContext()

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const [onceRun, setOnceRun] = useState(false)
  const [safeFlag, setSafeFlag] = useState(true)
  const [noHarvestsData, setNoHarvestsData] = useState(false)
  const [noRewardsData, setNoRewardsData] = useState(false)
  const [activeHarvests, setActiveHarvests] = useState(true)
  const [totalHistoryData, setTotalHistoryData] = useState([])

  const groupOfVaults = { ...vaultsData }

  const firstWalletBalanceLoad = useRef(true)
  useEffectWithPrevious(
    ([prevAccount, prevBalances]) => {
      const hasSwitchedAccount = account !== prevAccount && account
      if (
        hasSwitchedAccount ||
        firstWalletBalanceLoad.current ||
        (balances && !isEqual(balances, prevBalances))
      ) {
        const getBalance = async () => {
          firstWalletBalanceLoad.current = false
          await getWalletBalances([IFARM_TOKEN_SYMBOL, FARM_TOKEN_SYMBOL], false, true)
        }

        getBalance()
      }
    },
    [account, balances],
  )

  useEffect(() => {
    if (!isEmpty(userStats) && account && !onceRun) {
      setOnceRun(true)
      const getNetProfitValue = async () => {
        const { sortedCombinedEnrichedArray, stakedVaults, rewardsAPIDataLength } =
          await fetchAndParseVaultData({
            account,
            groupOfVaults,
            setSafeFlag,
          })

        if (stakedVaults.length === 0) {
          setNoHarvestsData(true)
        }

        if (rewardsAPIDataLength === 0) {
          setNoRewardsData(true)
        }

        setTotalHistoryData(sortedCombinedEnrichedArray)
      }

      getNetProfitValue()
      setOnceRun(false)
    } else {
      setTotalHistoryData([])
    }
  }, [account, userStats, safeFlag])

  return (
    <Container $bgcolor={bgColorNew} $fontcolor={fontColor}>
      <Inner>
        <HeaderWrap $padding="25px 15px 20px" $bordercolor="unset">
          <HeaderTitle $fontcolor={fontColor} $fontcolor1={fontColor1}>
            <div className="title">Full History</div>
            <div className="desc">
              History of all harvest, claimed rewards, and convert/revert events for connected
              wallet.
            </div>
          </HeaderTitle>
        </HeaderWrap>

        <NewLabel $width={isMobile ? '90%' : '40%'} $margin={isMobile ? 'auto' : 'unset'}>
          <NewLabel
            $backcolor={darkMode ? '#373737' : '#ebebeb'}
            $size={isMobile ? '16px' : '16px'}
            $height={isMobile ? '24px' : '24px'}
            $weight="600"
            $fontcolor={fontColor1}
            $display="flex"
            $justifycontent="center"
            $marginbottom="13px"
            $borderradius="8px"
            $transition="0.25s"
          >
            {historyTags.map((tag, i) => (
              <SwitchTabTag
                key={i}
                onClick={() => {
                  if ((i === 0 && !activeHarvests) || (i === 1 && activeHarvests))
                    setActiveHarvests(prev => !prev)
                }}
                $fontcolor={
                  (i === 0 && activeHarvests) || (i === 1 && !activeHarvests)
                    ? fontColor4
                    : fontColor3
                }
                $backcolor={
                  (i === 0 && activeHarvests) || (i === 1 && !activeHarvests) ? activeColorNew : ''
                }
                $boxshadow={
                  (i === 0 && activeHarvests) || (i === 1 && !activeHarvests) ? boxShadowColor2 : ''
                }
              >
                <p>{tag.name}</p>
              </SwitchTabTag>
            ))}
          </NewLabel>
        </NewLabel>

        {activeHarvests ? (
          <EarningsHistory historyData={totalHistoryData} isDashboard noData={noHarvestsData} />
        ) : (
          <RewardsHistory
            historyData={totalHistoryData}
            account={account}
            token={null}
            isDashboard
            noData={noRewardsData}
            setNoData={setNoRewardsData}
          />
        )}
      </Inner>
    </Container>
  )
}

export default Activity
