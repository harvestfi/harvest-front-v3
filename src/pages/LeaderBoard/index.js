import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { PiQuestion } from 'react-icons/pi'
import ReactTooltip from 'react-tooltip'
import { useThemeContext } from '../../providers/useThemeContext'
import sortDescIcon from '../../assets/images/ui/desc.svg'
import sortAscIcon from '../../assets/images/ui/asc.svg'
import sortIcon from '../../assets/images/ui/sort.svg'
import expandIcon from '../../assets/images/ui/expand.svg'
import { fetchLeaderboardData } from '../../utilities/apiCalls'
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
  const [leadersApiData, setLeadersApiData] = useState(null)

  let correctedApiData = {}

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchLeaderboardData()
        setLeadersApiData(data)
      } catch (error) {
        console.error('Error fetching leaderboard data:', error)
      }
    }

    getData()
  }, [])

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

  const getTokenNames = (userVault, dataVaults) => {
    const vaults = userVault.vaults
    const tokenNames = []
    const matchedVaults = {}

    Object.entries(vaults).forEach(([vaultKey, vaultValue]) => {
      if (vaultValue.dailyYield === 0 || vaultValue.dailyReward + vaultValue.dailyReward === 0) {
        return
      }

      const match = Object.entries(dataVaults).find(([, vaultData]) => {
        return (
          vaultData.vaultAddress &&
          vaultData.vaultAddress.toLowerCase() === vaultKey.toLowerCase() &&
          !vaultData.inactive
        )
      })

      if (match) {
        const [, vaultData] = match
        if (vaultData.tokenNames.length > 1) {
          tokenNames.push(vaultData.tokenNames.join(', '))
        } else {
          tokenNames.push(...vaultData.tokenNames)
        }
        matchedVaults[vaultKey] = vaults[vaultKey]
      }
    })

    userVault.vaults = matchedVaults
    return tokenNames
  }

  const rearrangeApiData = apiData => {
    const sortedEntries = Object.entries(apiData).sort(
      ([, a], [, b]) => b.totalBalance - a.totalBalance,
    )

    sortedEntries.forEach(([, value]) => {
      if (value.vaults) {
        value.vaults = Object.fromEntries(
          Object.entries(value.vaults).sort(([, a], [, b]) => b.balance - a.balance),
        )
      }
    })

    const allWalletInfo = Object.fromEntries(sortedEntries.slice(0, 150))

    const filteredWalletInfo = Object.entries(allWalletInfo).reduce((acc, [key, value]) => {
      const countMatchingVaults = getTokenNames(value, groupOfVaults)

      if (countMatchingVaults.length !== 0) {
        acc[key] = value
      }

      return acc
    }, {})

    const top100Data = Object.entries(filteredWalletInfo).slice(0, 100)

    const sortedApiData = Object.fromEntries(top100Data)

    return sortedApiData
  }

  if (leadersApiData) {
    correctedApiData = rearrangeApiData(leadersApiData)
  }

  const handleSort = useCallback(
    key => {
      let direction = 'descending'
      if (sortConfig.key === key && sortConfig.direction === 'descending') {
        direction = 'ascending'
      }
      setSortConfig({ key, direction })
    },
    [sortConfig],
  )

  const sortedData = useMemo(() => {
    const sortableItems = Object.entries(correctedApiData)
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
        } else if (sortConfig.key === 'balance') {
          valueA = Math.max(...Object.values(a[1].vaults).map(vault => vault.balance))
          valueB = Math.max(...Object.values(b[1].vaults).map(vault => vault.balance))
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
  }, [correctedApiData, sortConfig])

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
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col>Wallet</Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col onClick={() => handleSort('totalBalance')} cursor="pointer">
                  Balance
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="totalBalance"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
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
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col onClick={() => handleSort('balance')} cursor="pointer">
                  Highest Allocation
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="balance"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col onClick={() => handleSort('Efficiency')} cursor="pointer">
                  Efficiency
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="Efficiency"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col onClick={() => handleSort('MonthlyYield')} cursor="pointer">
                  Monthly Yield
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="MonthlyYield"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '5%'} color={fontColor} justifyContent="center">
                <Col cursor="pointer">
                  <img src={expandIcon} alt="expand-icon" />
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
                    getTokenNames={getTokenNames}
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
