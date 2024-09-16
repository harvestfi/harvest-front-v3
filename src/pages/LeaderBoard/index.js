import React, { useMemo, useState, useCallback } from 'react'
import { useMediaQuery } from 'react-responsive'
import { PiQuestion } from 'react-icons/pi'
import ReactTooltip from 'react-tooltip'
import { useThemeContext } from '../../providers/useThemeContext'
import sortDescIcon from '../../assets/images/ui/desc.svg'
import sortAscIcon from '../../assets/images/ui/asc.svg'
import sortIcon from '../../assets/images/ui/sort.svg'
import {
  Column,
  Container,
  Header,
  Inner,
  TransactionDetails,
  Col,
  TableContent,
  TableTitle,
  TableIntro,
  SpaceLine,
  NewLabel,
} from './style'
import HolderRow from '../../components/LeaderboardComponents/HolderRow'
import { useVaults } from '../../providers/Vault'
import { FARM_TOKEN_SYMBOL, SPECIAL_VAULTS } from '../../constants'
import { useStats } from '../../providers/Stats'
import { usePools } from '../../providers/Pools'
import { addresses } from '../../data'

const LeaderBoard = () => {
  const { vaultsData } = useVaults()
  const { profitShareAPY } = useStats()
  const { totalPools } = usePools()
  const { bgColor, backColor, fontColor, borderColor, darkMode } = useThemeContext()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })

  const farmProfitSharingPool = totalPools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )

  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: ['./icons/ifarm.svg'],
        tokenAddress: addresses.iFARM,
        rewardSymbol: 'iFarm',
        tokenNames: ['FARM'],
        platform: ['Harvest'],
        decimals: 18,
      },
    }),
    [farmProfitSharingPool, profitShareAPY],
  )

  const groupOfVaults = { ...vaultsData, ...poolVaults }

  const testApiEndpoint = {
    '0x62933bf74e3c3a3adea1ce935a9ccf5919c992de': {
      totalBalance: 1009113.39182823,
      vaults: {
        '0x2ec0160246461f0ce477887dde2c931ee8233de7': {
          balance: 620345.92,
          dailyYield: 116.7485,
          dailyReward: 122.6533,
        },
        '0x0d15225454474ab3cb124083278c7be03f8a99ff': {
          balance: 304885.746828233,
          dailyYield: 33.3251,
          dailyReward: 81.2921,
        },
        '0xbcc2b58ab9a4f6bb576f80def62ea2bc91fc49c2': {
          balance: 83881.725,
          dailyYield: 10.5118,
          dailyReward: 21.4578,
        },
      },
      totalDailyYield: 385.9886,
    },
    '0x8ccc40030365274f98d19b4c343fcebd0a2c37bc': {
      totalBalance: 709379.275375685,
      vaults: {
        '0x32db5cbac1c278696875eb9f27ed4cd7423dd126': {
          balance: 709379.275375685,
          dailyYield: 48.371,
        },
      },
      totalDailyYield: 48.371,
    },
    '0xd1621a7040cd9d0be444ef07621bead1c1166ad4': {
      totalBalance: 602904.442795107,
      vaults: {
        '0xbcc2b58ab9a4f6bb576f80def62ea2bc91fc49c2': {
          balance: 379006.77482403,
          dailyYield: 47.496,
          dailyReward: 96.9536,
        },
        '0x24174022d382cd155c33a847404cda5bc7978802': {
          balance: 223896.920436909,
          dailyYield: 14.0691,
          dailyReward: 36.0229,
        },
        '0x0d15225454474ab3cb124083278c7be03f8a99ff': {
          balance: 0.74753416851,
          dailyYield: 0.0001,
        },
      },
      totalDailyYield: 194.5417,
    },
  }

  const handleSort = useCallback(
    key => {
      let direction = 'ascending'
      if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending'
      }
      setSortConfig({ key, direction })
    },
    [sortConfig],
  )

  const sortedData = useMemo(() => {
    const sortableItems = Object.entries(testApiEndpoint)
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let valueA, valueB

        if (sortConfig.key === 'totalBalance') {
          valueA = a[1][sortConfig.key]
          valueB = b[1][sortConfig.key]
        } else if (sortConfig.key === 'Efficiency') {
          const monthlyYieldA = (a[1].totalDailyYield * 365) / 12
          const monthlyYieldB = (b[1].totalDailyYield * 365) / 12
          valueA = (monthlyYieldA / a[1].totalBalance) * 12 * 100 || 0
          valueB = (monthlyYieldB / b[1].totalBalance) * 12 * 100 || 0
        } else if (sortConfig.key === 'MonthlyYield') {
          valueA = (a[1].totalDailyYield * 365) / 12
          valueB = (b[1].totalDailyYield * 365) / 12
        } else {
          valueA = Object.values(a[1].vaults).reduce(
            (acc, vault) => acc + (vault[sortConfig.key] || 0),
            0,
          )
          valueB = Object.values(b[1].vaults).reduce(
            (acc, vault) => acc + (vault[sortConfig.key] || 0),
            0,
          )
        }
        if (valueA < valueB) return sortConfig.direction === 'ascending' ? -1 : 1
        if (valueA > valueB) return sortConfig.direction === 'ascending' ? 1 : -1
        return 0
      })
    }
    return sortableItems
  }, [testApiEndpoint, sortConfig])

  return (
    <Container bgColor={bgColor} fontColor={fontColor}>
      <Inner>
        <TableTitle>Farmer&apos;s Leaderboard</TableTitle>
        <TableIntro>Displaying top farmers across all networks. </TableIntro>
        <SpaceLine />
        <TransactionDetails>
          <TableContent borderColor={borderColor} count={100}>
            <Header borderColor={borderColor} backColor={backColor}>
              <Column width={isMobile ? '5%' : '10%'} color={fontColor}>
                <Col>#</Col>
              </Column>
              <Column width={isMobile ? '5%' : '16%'} color={fontColor}>
                <Col>Wallet</Col>
              </Column>
              <Column width={isMobile ? '5%' : '16%'} color={fontColor}>
                <Col onClick={() => handleSort('totalBalance')} cursor="pointer">
                  Balance
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="totalBalance"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '16%'} color={fontColor}>
                <Col>
                  # of Farms
                  <PiQuestion className="question" data-tip />
                  <ReactTooltip
                    backgroundColor={darkMode ? 'white' : '#101828'}
                    borderColor={darkMode ? 'white' : 'black'}
                    textColor={darkMode ? 'black' : 'white'}
                    place="top"
                  >
                    <NewLabel
                      size={isMobile ? '10px' : '12px'}
                      height={isMobile ? '15px' : '18px'}
                      weight="600"
                    >
                      ToolTip
                    </NewLabel>
                  </ReactTooltip>
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '16%'} color={fontColor}>
                <Col onClick={() => handleSort('dailyYield')} cursor="pointer">
                  Highest allocation
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="dailyYield"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '16%'} color={fontColor}>
                <Col onClick={() => handleSort('Efficiency')} cursor="pointer">
                  Efficiency
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="Efficiency"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '16%'} color={fontColor}>
                <Col onClick={() => handleSort('MonthlyYield')} cursor="pointer">
                  Monthly Yield
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="MonthlyYield"
                  />
                </Col>
              </Column>
            </Header>
            {sortedData &&
              sortedData.map(([key, value], index) => {
                const lastItem = index === sortedData.lendth - 1
                return (
                  <HolderRow
                    key={key}
                    value={value}
                    cKey={index + 1}
                    accounts={key}
                    groupOfVaults={groupOfVaults}
                    lastItem={lastItem}
                  />
                )
              })}
          </TableContent>
        </TransactionDetails>
      </Inner>
    </Container>
  )
}

const SortingIcon = ({ sortType, sortField, selectedField }) => {
  return (
    <>
      {sortType === 'ascending' && sortField === selectedField && (
        <img
          className="sort-icon"
          src={sortDescIcon}
          alt="Sort ASC"
          style={{ marginLeft: '5px' }}
        />
      )}
      {sortType === 'descending' && sortField === selectedField && (
        <img
          className="sort-icon"
          src={sortAscIcon}
          alt="Sort DESC"
          style={{ marginLeft: '5px' }}
        />
      )}
      {sortType !== selectedField && sortField !== selectedField && (
        <img className="sort-icon" src={sortIcon} alt="Sort" style={{ marginLeft: '5px' }} />
      )}
    </>
  )
}

export default LeaderBoard
