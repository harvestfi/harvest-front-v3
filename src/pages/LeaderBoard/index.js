import React, { useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
// import axios from 'axios'
import { useThemeContext } from '../../providers/useThemeContext'
import Sort from '../../assets/images/logos/dashboard/sort.svg'
import {
  Column,
  Container,
  Header,
  Inner,
  // ThemeMode,
  TransactionDetails,
  Col,
  TableContent,
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

  const { bgColor, backColor, fontColor, borderColor } = useThemeContext()
  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })

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

  // eslint-disable-next-line no-unused-vars
  const groupOfVaults = { ...vaultsData, ...poolVaults }

  // const vaultDataObject = Object.entries(groupOfVaults).reduce((acc, [vaultSymbol, vault]) => {
  //   const networkId = vault.poolvault ? vault.data.chain : vault.chain
  //   const tokenAddress = vault.poolVault
  //     ? '0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651'
  //     : vault.vaultAddress

  //   acc[vaultSymbol] = { networkId, tokenAddress }
  //   return acc
  // }, {})

  // useEffect(() => {
  //   const getTokenHolders = async () => {
  //     if (!hasCalledApi.current) {
  //       try {
  //         const holders = await Promise.all(
  //           Object.values(groupOfVaultsTest).map(async vault => {
  //             const networkId = vault.poolvault ? vault.data.chain : vault.chain
  //             const tokenAddress = vault.poolVault
  //               ? vault.data.collateralAddress
  //               : vault.vaultAddress
  //             const holderData = await fetchTopHolders(networkId, tokenAddress)
  //             return holderData
  //           }),
  //         )

  //         setTokenHolders(holders)
  //         hasCalledApi.current = true
  //       } catch (error) {
  //         console.error('Error fetching holders:', error)
  //       }
  //     }
  //   }

  //   getTokenHolders()
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   const getTokenHolders = async () => {
  //     try {
  //       const holders = []
  //       const vaultDataArray = Object.values(vaultDataObject)

  //       for (let i = 0; i < vaultDataArray.length; i += 1) {
  //         const { networkId, tokenAddress } = vaultDataArray[i]
  //         // eslint-disable-next-line no-await-in-loop
  //         const holderData = await fetchTopHolders(networkId, tokenAddress)
  //         holders.push(holderData)
  //       }

  //       console.log('holders', holders)
  //       setTokenHolders(holders)
  //     } catch (error) {
  //       console.error('Error fetching holders:', error)
  //     }
  //   }

  //   getTokenHolders()
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // const transformHoldersData = (holdersData, vaultsInfo) => {
  //   const walletMap = {}

  //   Object.keys(vaultsInfo).forEach((vaultSymbol, index) => {
  //     const holders = holdersData[index]
  //     const { tokenNames } = vaultsInfo[vaultSymbol]
  //     let tempPricePerFullShare

  //     if (vaultSymbol === 'FARM') {
  //       tempPricePerFullShare = get(vaultsData, `${IFARM_TOKEN_SYMBOL}.pricePerFullShare`, 0)
  //     } else {
  //       tempPricePerFullShare = get(vaultsInfo[vaultSymbol], `pricePerFullShare`, 0)
  //     }

  //     const tokenDecimals = vaultsInfo[vaultSymbol].decimals
  //     const pricePerFullShare = fromWei(tempPricePerFullShare, tokenDecimals, tokenDecimals)

  //     const tokenUsdPrice =
  //       Number(vaultsInfo[vaultSymbol].vaultPrice) ||
  //       Number(
  //         vaultsInfo[vaultSymbol].data &&
  //           vaultsInfo[vaultSymbol].data.lpTokenData &&
  //           vaultsInfo[vaultSymbol].data.lpTokenData.price,
  //       ) * Number(pricePerFullShare)

  //     if (holders) {
  //       holders.forEach(holder => {
  //         let usdValue = 0
  //         // eslint-disable-next-line camelcase
  //         const { wallet_address, amount, original_amount, usd_value } = holder

  //         if (vaultSymbol === 'FARM') {
  //           // eslint-disable-next-line camelcase
  //           usdValue = usd_value
  //         } else {
  //           usdValue = parseFloat(amount) * tokenUsdPrice * Number(currencyRate)
  //         }

  //         if (!walletMap[wallet_address]) {
  //           // eslint-disable-next-line camelcase
  //           walletMap[wallet_address] = {
  //             // eslint-disable-next-line camelcase
  //             wallet_address,
  //             entries: [],
  //             // eslint-disable-next-line camelcase
  //             total_value: 0,
  //           }
  //         }

  //         walletMap[wallet_address].entries.push({
  //           amount,
  //           // eslint-disable-next-line camelcase
  //           original_amount,
  //           // eslint-disable-next-line camelcase
  //           usdValue,
  //           vaultSymbol,
  //           tokenNames,
  //         })

  //         // eslint-disable-next-line camelcase
  //         walletMap[wallet_address].total_value += parseFloat(usdValue)
  //       })
  //     }
  //   })

  //   return Object.values(walletMap)
  //     .map(wallet => {
  //       const walletObject = {
  //         // eslint-disable-next-line camelcase
  //         wallet_address: wallet.wallet_address,
  //         // eslint-disable-next-line camelcase
  //         total_value: wallet.total_value,
  //       }

  //       walletObject.entries = wallet.entries.sort(
  //         (a, b) => parseFloat(b.usd_value) - parseFloat(a.usd_value),
  //       )

  //       return walletObject
  //     })
  //     .sort((a, b) => b.total_value - a.total_value)
  // }

  // const formattedData = transformHoldersData(tokenHolders, groupOfVaultsTest)

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
        '0x5Ff62fb3fC1dFBcC5Bd01593d811192E3b8050e3': {
          balance: 709379.275375685,
          dailyYield: 48.371,
        },
      },
      totalDailyYield: 48.371,
    },
    '0x4161fa43eaa1ac3882aeed12c5fc05249e533e67': {
      totalBalance: 619615.927458208,
      vaults: {
        '0xc3f7ffb5d5869b3ade9448d094d81b0521e8326f': {
          balance: 619615.927458208,
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

  return (
    <Container bgColor={bgColor} fontColor={fontColor}>
      <Inner>
        <TransactionDetails>
          <TableContent borderColor={borderColor} count={100}>
            <Header borderColor={borderColor} backColor={backColor}>
              <Column width={isMobile ? '5%' : '5%'} color={fontColor}>
                <Col>No.</Col>
              </Column>
              <Column width={isMobile ? '5%' : '15%'} color={fontColor}>
                <Col>Wallet/ENS name</Col>
              </Column>
              <Column width={isMobile ? '5%' : '20%'} color={fontColor}>
                <Col>
                  Portfolio Balance
                  <img className="sortIcon" src={Sort} alt="sort" />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '20%'} color={fontColor}>
                <Col>
                  Farms a user is in
                  <img className="sortIcon" src={Sort} alt="sort" />
                </Col>
              </Column>
              <Column width={isMobile ? '5%' : '30%'} color={fontColor}>
                <Col>Highest allocation</Col>
              </Column>
              <Column width={isMobile ? '5%' : '10%'} color={fontColor}>
                <Col>
                  Daily Yield
                  <img className="sortIcon" src={Sort} alt="sort" />
                </Col>
              </Column>
            </Header>
            {testApiEndpoint &&
              Object.entries(testApiEndpoint).map(([key, value], i) => {
                return (
                  <HolderRow
                    key={key}
                    value={value}
                    cKey={i}
                    accounts={key}
                    groupOfVaults={groupOfVaults}
                  />
                )
              })}
          </TableContent>
        </TransactionDetails>
      </Inner>
    </Container>
  )
}

export default LeaderBoard
