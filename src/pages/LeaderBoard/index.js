import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { PiQuestion } from 'react-icons/pi'
import ReactTooltip from 'react-tooltip'
// import { get, find } from 'lodash'
import { Dropdown } from 'react-bootstrap'
import { IoCheckmark } from 'react-icons/io5'
import { useThemeContext } from '../../providers/useThemeContext'
import sortDescIcon from '../../assets/images/ui/desc.svg'
import sortAscIcon from '../../assets/images/ui/asc.svg'
import sortIcon from '../../assets/images/ui/sort.svg'
import dropDown from '../../assets/images/ui/drop-down.e85f7fdc.svg'
import { fetchLeaderboardData } from '../../utilities/apiCalls'
import { getWalletApy, rearrangeApiData } from '../../utilities/parsers'
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
  BetaBadge,
  HeaderButton,
  CurrencyDropDown,
  CurrencySelect,
  CurrencyDropDownMenu,
  CurrencyDropDownItem,
  LeaderBoardTop,
  RankIntro,
} from './style'
import HolderRow from '../../components/LeaderboardComponents/HolderRow'
import { useVaults } from '../../providers/Vault'
import { FARM_TOKEN_SYMBOL, SPECIAL_VAULTS } from '../../constants'
import { useStats } from '../../providers/Stats'
import { usePools } from '../../providers/Pools'
import { addresses } from '../../data'
// import ChevronDown from '../../assets/images/ui/chevron-down.svg'
import Pagination from '../../components/LeaderboardComponents/Pagination'
import { useWallet } from '../../providers/Wallet'

const LeaderBoard = () => {
  const { vaultsData } = useVaults()
  const { profitShareAPY } = useStats()
  const { totalPools } = usePools()
  const {
    bgColor,
    backColor,
    fontColor,
    borderColor,
    darkMode,
    backColorButton,
    hoverColorNew,
    fontColor1,
    fontColor2,
    hoverColor,
    inputBorderColor,
    bgColorFarm,
    filterColor,
  } = useThemeContext()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

  const [sortConfig, setSortConfig] = useState({ key: 'totalBalance', direction: 'descending' })
  const [leadersApiData, setLeadersApiData] = useState(null)
  const [selectedItem, setSelectedItem] = useState('Top Allocation')
  const [itemOffset, setItemOffset] = useState(0)
  const itemsPerPage = 100

  const { account } = useWallet()
  const { pools } = usePools()

  let correctedApiData = {}

  const handleItemClick = useCallback(item => {
    setSelectedItem(item)
  }, [])

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

  if (leadersApiData) {
    correctedApiData = rearrangeApiData(leadersApiData, groupOfVaults, vaultsData, pools)
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

  const SortingIcon = ({ sortType, sortField, selectedField }) => {
    return (
      <>
        {sortType === 'ascending' && sortField === selectedField && (
          <img
            className="sort-icon"
            src={sortAscIcon}
            alt="Sort ASC"
            style={{ marginLeft: '5px' }}
          />
        )}
        {sortType === 'descending' && sortField === selectedField && (
          <img
            className="sort-icon"
            src={sortDescIcon}
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

  const fixedBalanceRanks = useMemo(() => {
    return Object.entries(correctedApiData)
      .sort((a, b) => {
        const vaultAArray = Object.entries(a[1].vaults)
        const vaultBArray = Object.entries(b[1].vaults)
        const balanceA = vaultAArray.reduce((acc, [, vault]) => acc + vault.balance, 0)
        const balanceB = vaultBArray.reduce((acc, [, vault]) => acc + vault.balance, 0)
        return balanceB - balanceA
      })
      .map(([wallet], index) => ({ wallet, rank: index + 1 }))
  }, [correctedApiData])

  const sortedData = useMemo(() => {
    const sortableItems = Object.entries(correctedApiData)
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let valueA = 0,
          valueB = 0

        if (sortConfig.key === 'totalBalance') {
          const vaultAArray = Object.entries(a[1].vaults)
          const vaultBArray = Object.entries(b[1].vaults)
          for (let i = 0; i < vaultAArray.length; i += 1) {
            valueA += vaultAArray[i][1].balance
          }
          for (let i = 0; i < vaultBArray.length; i += 1) {
            valueB += vaultBArray[i][1].balance
          }
        } else if (sortConfig.key === 'Efficiency') {
          const [realWalletApyA] = getWalletApy(a[1], groupOfVaults, vaultsData, pools)
          const [realWalletApyB] = getWalletApy(b[1], groupOfVaults, vaultsData, pools)
          valueA = realWalletApyA
          valueB = realWalletApyB
        } else if (sortConfig.key === 'MonthlyYield') {
          const [, totalMonthlyYieldA] = getWalletApy(a[1], groupOfVaults, vaultsData, pools)
          const [, totalMonthlyYieldB] = getWalletApy(b[1], groupOfVaults, vaultsData, pools)
          valueA = totalMonthlyYieldA
          valueB = totalMonthlyYieldB
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
  }, [correctedApiData, sortConfig]) // eslint-disable-line react-hooks/exhaustive-deps

  const { currentItems, pageCount } = useMemo(() => {
    const endOffset = itemOffset + itemsPerPage
    const currentItems1 = Object.entries(sortedData).slice(itemOffset, endOffset)
    const pageCount1 = Math.ceil(Object.entries(sortedData).length / itemsPerPage)
    return { currentItems: currentItems1, pageCount: pageCount1 }
  }, [sortedData, itemOffset, itemsPerPage])

  const handlePageClick = useCallback(
    event => {
      const newOffset = (event.selected * itemsPerPage) % Object.entries(sortedData).length
      setItemOffset(newOffset)
    },
    [sortedData, itemsPerPage],
  )

  const sortedByBalance = useMemo(() => {
    return Object.entries(correctedApiData).sort((a, b) => {
      const vaultAArray = Object.entries(a[1].vaults)
      const vaultBArray = Object.entries(b[1].vaults)
      const balanceA = vaultAArray.reduce((acc, [, vault]) => acc + vault.balance, 0)
      const balanceB = vaultBArray.reduce((acc, [, vault]) => acc + vault.balance, 0)
      return balanceB - balanceA
    })
  }, [correctedApiData])

  const sortedByEfficiency = useMemo(() => {
    return Object.entries(correctedApiData).sort((a, b) => {
      const [realWalletApyA] = getWalletApy(a[1], groupOfVaults, vaultsData, pools)
      const [realWalletApyB] = getWalletApy(b[1], groupOfVaults, vaultsData, pools)
      const efficiencyA = realWalletApyA
      const efficiencyB = realWalletApyB
      return efficiencyB - efficiencyA
    })
  }, [correctedApiData]) // eslint-disable-line react-hooks/exhaustive-deps

  const balanceRank = useMemo(() => {
    if (account && Object.entries(correctedApiData).length > 0) {
      return (
        sortedByBalance.findIndex(([wallet]) => wallet.toLowerCase() === account.toLowerCase()) + 1
      )
    }
    return false
  }, [sortedByBalance, account]) // eslint-disable-line react-hooks/exhaustive-deps

  const efficiencyRank = useMemo(() => {
    if (account && Object.entries(correctedApiData).length > 0) {
      return (
        sortedByEfficiency.findIndex(([wallet]) => wallet.toLowerCase() === account.toLowerCase()) +
        1
      )
    }
    return false
  }, [sortedByEfficiency, account]) // eslint-disable-line react-hooks/exhaustive-deps

  return isMobile ? (
    <Container bgColor={bgColor} fontColor={fontColor}>
      <Inner style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
        <LeaderBoardTop>
          <div>
            <TableTitle color={darkMode ? '#ffffff' : '#101828'}>
              Leaderboard <BetaBadge>Beta</BetaBadge>
            </TableTitle>
            <TableIntro color={darkMode ? '#ffffff' : '#475467'} marginBottom="0px">
              Displaying data from all networks.
            </TableIntro>
          </div>
          <HeaderButton style={{ width: '42%' }}>
            <Dropdown>
              <CurrencyDropDown
                id="dropdown-basic"
                bgcolor={backColorButton}
                fontcolor2={fontColor2}
                hovercolor={hoverColorNew}
                style={{ padding: 0 }}
              >
                <CurrencySelect
                  backcolor={backColor}
                  fontcolor2={fontColor2}
                  hovercolor={hoverColor}
                >
                  <div>{selectedItem}</div>
                  <img src={dropDown} alt="Chevron Down" />
                </CurrencySelect>
              </CurrencyDropDown>
              <CurrencyDropDownMenu backcolor={backColorButton}>
                <CurrencyDropDownItem
                  onClick={() => {
                    handleItemClick('Top Allocation')
                    handleSort('balance')
                  }}
                  fontcolor={fontColor2}
                >
                  <div>Top Allocation</div>
                  {selectedItem === 'Top Allocation' && <IoCheckmark className="check-icon" />}
                </CurrencyDropDownItem>
                <CurrencyDropDownItem
                  onClick={() => {
                    handleItemClick('Efficiency')
                    handleSort('Efficiency')
                  }}
                  fontcolor={fontColor2}
                >
                  <div>Efficiency</div>
                  {selectedItem === 'Efficiency' && <IoCheckmark className="check-icon" />}
                </CurrencyDropDownItem>
                <CurrencyDropDownItem
                  onClick={() => {
                    handleItemClick('Monthly Yield')
                    handleSort('MonthlyYield')
                  }}
                  fontcolor={fontColor2}
                >
                  <div>Monthly Yield</div>
                  {selectedItem === 'Monthly Yield' && <IoCheckmark className="check-icon" />}
                </CurrencyDropDownItem>
              </CurrencyDropDownMenu>
            </Dropdown>
          </HeaderButton>
        </LeaderBoardTop>
        <div>
          {account &&
            (balanceRank > 0 && efficiencyRank > 0 ? (
              <RankIntro>
                You are ranked <b>#{balanceRank}</b> by balance and <b>#{efficiencyRank}</b> by
                efficiency.
              </RankIntro>
            ) : (
              <RankIntro>
                You&apos;re user <b>&lt;#1000</b> by balance, and <b>&lt;#1000</b> by efficiency.
              </RankIntro>
            ))}
        </div>
      </Inner>
      <Inner style={{ padding: '0px', borderRadius: '0px' }}>
        <TableContent borderColor={borderColor} count={100}>
          <Header
            borderColor={borderColor}
            backColor={darkMode ? '#20273A' : '#ffffff'}
            borderRadius="0px"
            padding="0px"
          >
            <Column width="50%" color={fontColor} fontSize="14px" padding="14px 28px">
              <Col># User</Col>
            </Column>
            <Column
              width="50%"
              color={fontColor}
              fontSize="14px"
              padding="14px 28px"
              onClick={() => {
                if (selectedItem === 'Top Allocation') {
                  handleSort('balance')
                } else if (selectedItem === 'Efficiency') {
                  handleSort('Efficiency')
                } else if (selectedItem === 'Monthly Yield') {
                  handleSort('MonthlyYield')
                }
              }}
            >
              <Col>{selectedItem}</Col>
            </Column>
          </Header>
          {currentItems &&
            currentItems.map(([key, [accounts, value]], index) => {
              const lastItem = index === currentItems.length - 1
              const totalBalanceRank =
                fixedBalanceRanks.find(item => item.wallet === accounts)?.rank || null
              return (
                <HolderRow
                  key={key}
                  value={value}
                  cKey={totalBalanceRank}
                  accounts={accounts}
                  groupOfVaults={groupOfVaults}
                  lastItem={lastItem}
                  // getTokenNames={getTokenNames}
                  darkMode={darkMode}
                  pools={pools}
                  vaultsData={vaultsData}
                  selectedItem={selectedItem}
                />
              )
            })}
        </TableContent>
        <Pagination
          pageCount={pageCount}
          onPageChange={handlePageClick}
          isMobile={isMobile}
          bgColor={bgColorFarm}
          fontColor={fontColor}
          fontColor1={fontColor1}
          fontColor2={fontColor2}
          inputBorderColor={inputBorderColor}
        />
      </Inner>
    </Container>
  ) : (
    <Container bgColor={bgColor} fontColor={fontColor}>
      <Inner>
        <LeaderBoardTop>
          <div>
            <TableTitle color={darkMode ? '#ffffff' : '#101828'}>
              Leaderboard <BetaBadge>Beta</BetaBadge>
            </TableTitle>
            <TableIntro color={darkMode ? '#ffffff' : '#475467'}>
              Displaying data from all networks.
            </TableIntro>
          </div>
          <div>
            {account &&
              (balanceRank > 0 && efficiencyRank > 0 ? (
                <RankIntro>
                  You are ranked <b>#{balanceRank}</b> by balance and <b>#{efficiencyRank}</b> by
                  efficiency.
                </RankIntro>
              ) : (
                <RankIntro>
                  You&apos;re user <b>&lt;#1000</b> by balance, and <b>&lt;#1000</b> by efficiency.
                </RankIntro>
              ))}
          </div>
        </LeaderBoardTop>
        <SpaceLine />
        <TransactionDetails>
          <TableContent borderColor={borderColor} count={100}>
            <Header borderColor={borderColor} backColor={darkMode ? '#20273A' : '#f9fafb'}>
              <Column width={isMobile ? '5%' : '10%'} color={fontColor}>
                <Col>#</Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col>Wallet</Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col
                  onClick={() => handleSort('totalBalance')}
                  cursor="pointer"
                  filterColor={filterColor}
                >
                  Balance
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="totalBalance"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col># of Farms</Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col
                  onClick={() => handleSort('balance')}
                  cursor="pointer"
                  filterColor={filterColor}
                >
                  Top Allocation
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="balance"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col
                  onClick={() => handleSort('Efficiency')}
                  cursor="pointer"
                  filterColor={filterColor}
                >
                  Efficiency
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
                      width="296px"
                    >
                      <div>
                        <p>This metric shows how effectively a wallet generates yield:</p>
                        <ul style={{ paddingLeft: '20px' }}>
                          <li>
                            <strong>APY:</strong> The estimated yearly growth based on wallet&apos;s
                            balance on Harvest.
                          </li>
                          <li>
                            <strong>$ per $1 Allocated:</strong> Yearly yield for every $1 allocated
                            in Harvest.
                          </li>
                        </ul>
                      </div>
                    </NewLabel>
                  </ReactTooltip>
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="Efficiency"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col
                  onClick={() => handleSort('MonthlyYield')}
                  cursor="pointer"
                  filterColor={filterColor}
                >
                  Monthly Yield
                  <SortingIcon
                    sortType={sortConfig.direction}
                    sortField={sortConfig.key}
                    selectedField="MonthlyYield"
                  />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '5%'} color={fontColor} justifyContent="center">
                <Col cursor="pointer" />
              </Column>
            </Header>
            {currentItems &&
              currentItems.map(([key, [accounts, value]], index) => {
                const lastItem = index === currentItems.length - 1
                const totalBalanceRank =
                  fixedBalanceRanks.find(item => item.wallet === accounts)?.rank || null
                return (
                  <HolderRow
                    key={key}
                    value={value}
                    cKey={totalBalanceRank}
                    accounts={accounts}
                    groupOfVaults={groupOfVaults}
                    lastItem={lastItem}
                    // getTokenNames={getTokenNames}
                    darkMode={darkMode}
                    pools={pools}
                    vaultsData={vaultsData}
                  />
                )
              })}
          </TableContent>
          <Pagination
            pageCount={pageCount}
            onPageChange={handlePageClick}
            isMobile={isMobile}
            bgColor={bgColorFarm}
            fontColor={fontColor}
            fontColor1={fontColor1}
            fontColor2={fontColor2}
            inputBorderColor={inputBorderColor}
          />
        </TransactionDetails>
      </Inner>
    </Container>
  )
}

export default LeaderBoard
