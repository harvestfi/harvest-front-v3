import React, { useEffect, useState, useRef } from 'react'
import { isEmpty, find, get, isNaN, orderBy, isEqual } from 'lodash'
import BigNumber from 'bignumber.js'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import useEffectWithPrevious from 'use-effect-with-previous'
import { useMediaQuery } from 'react-responsive'
import { useSetChain } from '@web3-onboard/react'
import { Dropdown } from 'react-bootstrap'
import { useVaults } from '../../providers/Vault'
import { fromWei } from '../../services/viem'
import ChevronDown from '../../assets/images/ui/chevron-down.svg'
import ETHEREUM from '../../assets/images/logos/badge/ethereum.svg'
import EXPANDED from '../../assets/images/ui/minus.svg'
import COLLAPSED from '../../assets/images/ui/plus.svg'
import { usePools } from '../../providers/Pools'
import { useWallet } from '../../providers/Wallet'
import { getChainIcon, getTotalApy, getVaultApy } from '../../utilities/parsers'
import { usePortals } from '../../providers/Portals'
import dropDown from '../../assets/images/ui/drop-down.e85f7fdc.svg'
import { useThemeContext } from '../../providers/useThemeContext'
import { useRate } from '../../providers/Rate'
import AnimatedDots from '../../components/AnimatedDots'
import { formatNumber, formatNetworkName, isSpecialApp } from '../../utilities/formats'
import MigrateStart from '../../components/MigrateComponents/MigrateStart'
import PositionModal from '../../components/MigrateComponents/PositionModal'
import VaultModal from '../../components/MigrateComponents/VaultModal'
import { NewLabel } from '../../components/MigrateComponents/PositionModal/style'
import Accordian from '../../components/MigrateComponents/Accordian'
import ARBITRUM from '../../assets/images/logos/badge/arbitrum.svg'
import POLYGON from '../../assets/images/logos/badge/polygon.svg'
import BASE from '../../assets/images/logos/badge/base.svg'
import { CHAIN_IDS } from '../../data/constants'
import { getTokenPriceFromApi, getCoinListFromApi } from '../../utilities/apiCalls'
import { FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL } from '../../constants'
import {
  Container,
  Inner,
  MigrateTop,
  PageIntro,
  PageTitle,
  SpaceLine,
  MigrateBox,
  VaultBox,
  BoxTitle,
  Button,
  ButtonDiv,
  Content,
  BadgeToken,
  BadgeIcon,
  Token,
  ChainGroup,
  ChainButton,
  BoxHeading,
  CurrencyDropDown,
  CurrencySelect,
  CurrencyDropDownMenu,
  CurrencyDropDownItem,
} from './style'

const Migrate = () => {
  const location = useLocation()
  const { search } = useLocation()

  const { vaultsData, getFarmingBalances } = useVaults()
  const { account, balances, getWalletBalances, chainId, connected, connectAction } = useWallet()
  const { userStats, fetchUserPoolStats, totalPools, pools } = usePools()
  const { rates } = useRate()
  const { getPortalsSupport } = usePortals()

  const { tokens } = require('../../data')
  const {
    darkMode,
    bgColorNew,
    backColor,
    filterChainHoverColor,
    borderColorBox,
    backColorButton,
    fontColor2,
    hoverColorNew,
    hoverColor,
  } = useThemeContext()

  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)
  const [apiData, setApiData] = useState([])
  const [farmTokenList, setFarmTokenList] = useState([])
  const [, setNoFarm] = useState(false)
  const [depositToken, setDepositToken] = useState([])
  const [highestPosition, setHighestPosition] = useState()
  const [positionVaultAddress, setPositionVaultAddress] = useState('')
  const [highestVaultAddress, setHighestVaultAddress] = useState('')
  const [curChain, setCurChain] = useState()
  const [highestApyVault, setHighestApyVault] = useState()
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [showVaultModal, setShowVaultModal] = useState(false)
  const [isFromModal, setIsFromModal] = useState(false)
  const [, setMatchedVault] = useState()
  const [matchVaultList, setMatchVaultList] = useState([])
  const [positionId, setPositionId] = useState()
  const [highVaultId, setHighVaultId] = useState()
  const [tokenWith, setTokenWith] = useState()
  const [tokenDepo, setTokenDepo] = useState()
  const [pickedTokenWith, setPickedTokenWith] = useState()
  const [, setCurSupportedVaultWith] = useState(false)
  const [showMigrate, setShowMigrate] = useState(false)
  const [balance, setBalance] = useState('0')
  const [inputAmount, setInputAmount] = useState('0')
  const [supportedVaultDepo, setSupportedVaultDepo] = useState(false)
  const [failureCount, setFailureCount] = useState(0)
  const [convertSuccess, setConvertSuccess] = useState(false)
  const [networkMatchList, setNetworkMatchList] = useState([])
  const [buttonName, setButtonName] = useState(<AnimatedDots />)
  const [networkName, setNetworkName] = useState('')
  const [startPoint, setStartPoint] = useState(10)
  const [chainUrl, setChainUrl] = useState()
  const [noPosition, setNoPosition] = useState(false)
  const [selectedChain, setSelectedChain] = useState(chainId)
  const [allMatchVaultList, setAllMatchVaultList] = useState([])
  const [highPositionPlatform, setHighPositionPlatform] = useState('')
  const [highVaultPlatform, setHighVaultPlatform] = useState('')
  const [positionBalance, setPositionBalance] = useState(0)
  const isFetchingRef = useRef(false)

  const isMobile = useMediaQuery({ query: '(max-width: 992px)' })
  const isFromAdvanced = location.search.includes('from=')
  const [
    ,
    setChain, // function to call to initiate user to switch chains in their wallet
  ] = useSetChain()

  const ChainsList = [
    { id: 0, name: 'Ethereum', img: ETHEREUM, chainId: CHAIN_IDS.ETH_MAINNET },
    { id: 1, name: 'Polygon', img: POLYGON, chainId: CHAIN_IDS.POLYGON_MAINNET },
    { id: 2, name: 'Arbitrum', img: ARBITRUM, chainId: CHAIN_IDS.ARBITRUM_ONE },
    { id: 3, name: 'Base', img: BASE, chainId: CHAIN_IDS.BASE },
  ]

  const isSpecialChain = Number(chainId) === 324

  useEffect(() => {
    let badgeUrl, network
    if (connected && !isEmpty(userStats)) {
      badgeUrl =
        Number(selectedChain) === 42161
          ? ARBITRUM
          : Number(selectedChain) === 8453
            ? BASE
            : Number(selectedChain) === 137
              ? POLYGON
              : ETHEREUM
    } else if (!isEmpty(userStats) && isSpecialChain) {
      badgeUrl = BASE
    } else if (!connected) {
      badgeUrl = BASE
    }

    if (connected) {
      network =
        Number(selectedChain) === 42161
          ? 'arbitrum'
          : Number(selectedChain) === 8453
            ? 'base'
            : Number(selectedChain) === 324
              ? 'zksync'
              : Number(selectedChain) === 137
                ? 'polygon'
                : 'ethereum'
    } else if (!connected) {
      network = 'base'
    }

    setChainUrl(badgeUrl)
    setNetworkName(network)
  }, [selectedChain, connected, userStats])

  useEffect(() => {
    if (isSpecialChain) {
      setSelectedChain(8453)
    } else {
      setSelectedChain(chainId)
    }
  }, [chainId])

  useEffect(() => {
    if (highestApyVault && connected) {
      setIsFromModal(false)
    }
  }, [connected])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  useEffect(() => {
    const getCoinList = async () => {
      const data = await getCoinListFromApi()
      setApiData(data)
    }

    getCoinList()
  }, [])

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
    if (account && !isEmpty(userStats) && !isEmpty(depositToken)) {
      const loadUserPoolsStats = async () => {
        const poolsToLoad = [],
          dl = depositToken.length
        for (let i = 0; i < dl; i += 1) {
          const token = groupOfVaults[depositToken[i]]

          const vaultPool = find(totalPools, pool => pool.collateralAddress === token.vaultAddress)

          if (vaultPool) {
            poolsToLoad.push(vaultPool)
          }
        }
        await fetchUserPoolStats(poolsToLoad, account, userStats)
        await getFarmingBalances(depositToken)
      }
      loadUserPoolsStats()
    }
  }, [account, totalPools, depositToken])

  useEffect(() => {
    if (!isEmpty(userStats) && account) {
      const getFarmTokenInfo = async () => {
        if (isFetchingRef.current) return
        isFetchingRef.current = true
        let stakedVaults = [],
          sortedTokenList

        const stakedVaultsTemp = Object.keys(userStats).filter(
          poolId =>
            new BigNumber(userStats[poolId].totalStaked).gt(0) ||
            new BigNumber(userStats[poolId].lpTokenBalance).gt(0),
        )

        stakedVaults = stakedVaultsTemp.filter(
          poolId => groupOfVaults[poolId] && groupOfVaults[poolId].inactive !== true,
        )

        if (depositToken.length !== stakedVaults.length) {
          setDepositToken(stakedVaults)
        }

        const newStats = [],
          sl = stakedVaults.length

        for (let i = 0; i < sl; i += 1) {
          const stats = {
            chain: '',
            symbol: '',
            logos: [],
            status: '',
            platform: '',
            unstake: '',
            stake: '',
            reward: [],
            rewardSymbol: [],
            rewardUSD: [],
            totalRewardUsd: 0,
            token: {},
          }
          let symbol = stakedVaults[i],
            fAssetPool = {},
            token = null

          token = groupOfVaults[symbol]
          fAssetPool = find(totalPools, pool => pool.collateralAddress === token?.vaultAddress)

          if (token) {
            let tokenName = '',
              totalRewardAPRByPercent = 0,
              usdPrice = 1,
              portalsToken

            const ttl = token.tokenNames.length
            for (let k = 0; k < ttl; k += 1) {
              tokenName += token.tokenNames[k]
              if (k !== ttl - 1) {
                tokenName += ' - '
              }
            }
            const statsTvl = new BigNumber(get(token, 'totalValueLocked', 0))
            stats.tvl = statsTvl
            stats.token = token
            stats.symbol = tokenName
            stats.logos = token.logoUrl
            stats.chain = getChainIcon(token.chain)
            stats.platform = token.subLabel
              ? token.platform[0] && `${token.platform[0]} - ${token.subLabel}`
              : token.platform[0] && token.platform[0]
            stats.status = token.inactive ? 'Inactive' : 'Active'

            usdPrice = token.vaultPrice

            const unstake = fromWei(
              get(userStats, `[${symbol}]['lpTokenBalance']`, 0),
              token?.vaultDecimals || token?.decimals || 18,
              token?.vaultDecimals || token?.decimals || 18,
            )
            stats.unstake = isNaN(unstake) ? 0 : unstake

            const stake = fromWei(
              get(userStats, `[${symbol}]['totalStaked']`, 0),
              token?.vaultDecimals || token?.decimals,
              token?.vaultDecimals || token?.decimals,
            )
            stats.stake = isNaN(stake) ? 0 : stake

            const finalBalance = Number(stake) + Number(unstake)
            stats.balance = finalBalance * usdPrice

            const rewardTokenSymbols = get(fAssetPool, 'rewardTokenSymbols', [])
            for (let l = 0; l < rewardTokenSymbols.length; l += 1) {
              let rewardSymbol = rewardTokenSymbols[l].toUpperCase(),
                rewards,
                rewardToken,
                usdRewardPrice = 0,
                rewardDecimal = get(tokens[rewardSymbol], 'decimals', 18)

              if (rewardTokenSymbols.includes(IFARM_TOKEN_SYMBOL)) {
                rewardSymbol = IFARM_TOKEN_SYMBOL
              }

              if (rewardTokenSymbols[l].substring(0, 1) === 'f') {
                if (rewardTokenSymbols[l] === 'fLODE') {
                  rewardToken = groupOfVaults.lodestar_LODE
                } else if (rewardTokenSymbols[l] === 'fSUSHI') {
                  rewardToken = groupOfVaults.SUSHI_HODL
                } else if (rewardTokenSymbols[l] === 'fDEN_4EUR') {
                  rewardToken = groupOfVaults.jarvis_DEN_4EUR
                } else if (rewardTokenSymbols[l] === 'fDEN2_4EUR') {
                  rewardToken = groupOfVaults.jarvis_DEN2_4EUR
                } else if (rewardTokenSymbols[l] === 'fDENMAY22_4EUR') {
                  rewardToken = groupOfVaults.jarvis_DENMAY22_4EUR
                } else if (rewardTokenSymbols[l] === 'fDENJUL22_4EUR') {
                  rewardToken = groupOfVaults.jarvis_DENJUL22_4EUR
                } else if (rewardTokenSymbols[l] === 'fAURFEB22_USDC') {
                  rewardToken = groupOfVaults.jarvis_AUR_USDC_V2
                } else if (
                  rewardTokenSymbols[l] === 'fQUI_2CAD' ||
                  rewardTokenSymbols[l] === 'fSES_2JPY' ||
                  rewardTokenSymbols[l] === 'fJRTMAY22_USDC' ||
                  rewardTokenSymbols[l] === 'fJRTJUL22_USDC' ||
                  rewardTokenSymbols[l] === 'fJRTSEP22_USDC' ||
                  rewardTokenSymbols[l] === 'fJRTNOV22_USDC' ||
                  rewardTokenSymbols[l] === 'fAURAPR22_USDC'
                ) {
                  rewardToken = groupOfVaults.jarvis_AUR_USDC_V2
                } else {
                  const underlyingRewardSymbol = rewardTokenSymbols[l].substring(1)
                  rewardToken = groupOfVaults[underlyingRewardSymbol]
                }
              } else {
                rewardToken = groupOfVaults[rewardSymbol]
              }

              if (rewardTokenSymbols.length > 1) {
                const rewardsEarned = userStats[stakedVaults[i]].rewardsEarned
                if (
                  rewardsEarned !== undefined &&
                  !(Object.keys(rewardsEarned).length === 0 && rewardsEarned.constructor === Object)
                ) {
                  rewards = rewardsEarned[rewardTokenSymbols[l]]
                }
              } else {
                rewards = userStats[stakedVaults[i]].totalRewardsEarned
              }

              if (rewardToken) {
                usdRewardPrice = Number(rewardToken.vaultPrice) || 0

                rewardDecimal = rewardToken.decimals
              } else {
                try {
                  const al = apiData.length
                  for (let ids = 0; ids < al; ids += 1) {
                    const tempData = apiData[ids]
                    const tempSymbol = tempData.symbol
                    if (
                      rewardSymbol === 'ECOCNG'
                        ? tempSymbol.toLowerCase() === 'cng'
                        : rewardSymbol === 'GENE'
                          ? tempSymbol.toLowerCase() === '$gene'
                          : rewardSymbol.toLowerCase() === tempSymbol.toLowerCase()
                    ) {
                      usdRewardPrice = await getTokenPriceFromApi(tempData.id)
                      break
                    }
                  }
                } catch (error) {
                  console.error('Error:', error)
                }
              }
              const rewardValues =
                rewards === undefined ? 0 : fromWei(rewards, rewardDecimal, rewardDecimal, true)
              stats.reward.push(Number(rewardValues))
              stats.totalRewardUsd += Number(rewardValues * Number(usdRewardPrice))
              stats.rewardSymbol.push(rewardSymbol)

              const rewardPriceUSD = rewardValues * Number(usdRewardPrice)
              stats.rewardUSD.push(rewardPriceUSD)
            }

            const totalApy = getTotalApy(fAssetPool, token)
            stats.apy = totalApy == null ? Number(-1) : Number(totalApy)

            const estimatedApyByPercent = get(token, `estimatedApy`, 0)
            const estimatedApy = estimatedApyByPercent / 100
            const vaultAPRDaily = (1 + estimatedApy) ** (1 / 365) - 1
            const vaultAPYMonthly = (1 + vaultAPRDaily) ** 30 - 1
            if (fAssetPool) {
              const frl = fAssetPool.rewardAPR?.length || 0

              for (let j = 0; j < frl; j += 1) {
                totalRewardAPRByPercent += Number(fAssetPool.rewardAPR[j])
              }
            }
            const totalRewardAPR = totalRewardAPRByPercent / 100
            const poolAPRDaily = totalRewardAPR / 365
            const poolAPRMonthly = totalRewardAPR / 12

            const swapFeeAPRYearly = Number(fAssetPool?.tradingApy) / 100 || 0
            const swapFeeAPRDaily = swapFeeAPRYearly / 365
            const swapFeeAPRMonthly = swapFeeAPRYearly / 12

            const dailyYield =
              Number(stake) * usdPrice * (vaultAPRDaily + poolAPRDaily + swapFeeAPRDaily) +
              Number(unstake) * usdPrice * (vaultAPRDaily + swapFeeAPRDaily)
            const monthlyYield =
              Number(stake) * usdPrice * (vaultAPYMonthly + poolAPRMonthly + swapFeeAPRMonthly) +
              Number(unstake) * usdPrice * (vaultAPYMonthly + swapFeeAPRMonthly)

            stats.dailyYield = dailyYield
            stats.monthlyYield = monthlyYield
            const statsAddress = stats.token.vaultAddress
            if (Number(statsTvl) > 500) {
              portalsToken = await getPortalsSupport(selectedChain, statsAddress)
            }
            if (portalsToken) {
              if (portalsToken.status === 200) {
                if (portalsToken.data.totalItems !== 0) {
                  newStats.push(stats)
                }
              }
            }
          }
        }

        const storedSortingDashboard = localStorage.getItem('sortingDashboard')
        if (storedSortingDashboard && JSON.parse(storedSortingDashboard) !== 'lifetimeYield') {
          sortedTokenList = orderBy(newStats, [JSON.parse(storedSortingDashboard)], ['desc'])
        } else {
          sortedTokenList = orderBy(newStats, ['balance'], ['desc'])
        }
        if (newStats.length === 0) {
          setNoPosition(true)
        }
        setFarmTokenList(sortedTokenList)
        if (sortedTokenList.length === 0) {
          setNoFarm(true)
        }

        isFetchingRef.current = false
      }

      getFarmTokenInfo()
    }
  }, [account, userStats])

  useEffect(() => {
    const values = queryString.parse(search)
    const advanceChain = values.chain

    if (!isFromModal && isFromAdvanced && Number(advanceChain) === Number(selectedChain)) {
      let fromVault, toVault, secToVault
      const urlFromAddress = values.from
      const urlToAddress = values.to
      if (networkMatchList.length > 0 && matchVaultList.length > 0) {
        const urlFrom = networkMatchList.find(item => {
          const compareAddress = item.token.vaultAddress
          return compareAddress.toLowerCase() === urlFromAddress.toLowerCase()
        })
        if (urlFrom) {
          fromVault = urlFrom
        } else {
          fromVault = networkMatchList[0]
        }
        const urlTo = allMatchVaultList.find(item => {
          const compareAddress = item.vault.vaultAddress
          return compareAddress.toLowerCase() === urlToAddress.toLowerCase()
        })
        if (urlTo) {
          toVault = urlTo
        } else {
          toVault = matchVaultList[0]
        }
        secToVault = matchVaultList[1]
      }

      if (fromVault && toVault) {
        console.log('fromVault', fromVault)
        console.log('toVault', toVault)
        const fromId = fromVault.token.id || fromVault.token.pool.id
        const toId = toVault.vault.id || toVault.vault.pool.id
        const secId = secToVault?.vault.id || secToVault?.vault.pool.id
        const fromAddress = fromVault.token.vaultAddress
        const toAddress = toVault.vault.vaultAddress
        const secToAddress = secToVault?.vault.vaultAddress
        const chain = Number(fromVault.token.chain)

        setHighestPosition(fromVault)
        setPositionVaultAddress(fromAddress)
        setPositionId(fromId)
        setTokenWith(groupOfVaults[fromId.toString()])
        setButtonName('Preview & Migrate')
        setCurChain(chain)

        if (
          fromAddress.toLowerCase() === toAddress.toLowerCase() &&
          Number(selectedChain) !== 324
        ) {
          setHighestApyVault(secToVault)
          setHighestVaultAddress(secToAddress)
          setHighVaultId(secId)
          setTokenDepo(groupOfVaults[secId.toString()])
        } else {
          setHighestApyVault(toVault)
          setHighestVaultAddress(toAddress)
          setHighVaultId(toId)
          setTokenDepo(groupOfVaults[toId.toString()])
        }
      }
    }

    if (
      (!isFromModal && !isFromAdvanced && farmTokenList.length > 0) ||
      (Number(advanceChain) !== Number(selectedChain) && !isFromModal)
    ) {
      let fromVault,
        toVault,
        fromId,
        toId,
        fromAddress,
        toAddress,
        secToVault,
        secToId,
        secToAddress
      if (networkMatchList.length > 0) {
        fromVault = networkMatchList[0]
        fromId = fromVault.token.id || fromVault.token.pool.id
        fromAddress = fromVault.token.vaultAddress
      }
      if (matchVaultList.length > 0) {
        toVault = matchVaultList[0]
        toId = toVault.vault.id || toVault.vault.pool.id
        toAddress = toVault.vault.vaultAddress
        secToVault = matchVaultList[1]
        secToId = secToVault.vault.id || secToVault.vault.pool.id
        secToAddress = secToVault.vault.vaultAddress
      }

      if (!connected) {
        if (toVault) {
          const defaultVault = {
            vaultApy: 0,
            vault: {},
          }
          toId = 'moonwell_USDC'
          const noConToken = groupOfVaults[toId.toString()]
          const noConAddress = '0x90613e167D42CA420942082157B42AF6fc6a8087'
          const defaultApy = getVaultApy(toId, groupOfVaults, pools)
          defaultVault.vaultApy = defaultApy
          defaultVault.vault = noConToken
          setHighestApyVault(defaultVault)
          setHighestVaultAddress(noConAddress)
          setTokenDepo(noConToken)
        }
        setButtonName('Connect Wallet')
      } else if (isSpecialChain && !isEmpty(userStats)) {
        const defaultVault = {
          vaultApy: 0,
          vault: {},
        }
        toId = 'moonwell_USDC'
        const noConToken = groupOfVaults[toId.toString()]
        const noConAddress = '0x90613e167D42CA420942082157B42AF6fc6a8087'
        const defaultApy = getVaultApy(toId, groupOfVaults, pools)
        defaultVault.vaultApy = defaultApy
        defaultVault.vault = noConToken
        setHighestApyVault(defaultVault)
        setHighestVaultAddress(noConAddress)
        setTokenDepo(noConToken)
        setButtonName('Change Network to Base')
      } else if (connected && Number(selectedChain) !== 324) {
        setButtonName(<AnimatedDots />)
        setHighestApyVault()
        setHighestPosition()
        if (fromVault && toVault) {
          const chain = fromVault.token.data
            ? Number(fromVault.token.data.chain)
            : Number(fromVault.token.chain)

          if (fromAddress !== toAddress) {
            setHighestApyVault(toVault)
            setHighestVaultAddress(toAddress)
            setHighVaultId(toId)
            setTokenDepo(groupOfVaults[toId.toString()])
          } else if (fromAddress.toLowerCase() === toAddress.toLowerCase()) {
            setHighestApyVault(secToVault)
            setHighestVaultAddress(secToAddress)
            setHighVaultId(secToId)
            setTokenDepo(groupOfVaults[secToId.toString()])
          }
          setHighestPosition(fromVault)
          setPositionVaultAddress(fromAddress)
          setPositionId(fromId)
          setTokenWith(groupOfVaults[fromId.toString()])
          setButtonName('Preview & Migrate')
          setCurChain(chain)
          setNoPosition(false)
        } else if (noPosition && toVault) {
          setHighestApyVault(toVault)
          setHighestVaultAddress(toAddress)
          setTokenDepo(groupOfVaults[toId.toString()])
          setButtonName('Preview & Migrate')
        }
      }
    }
  }, [
    selectedChain,
    connected,
    farmTokenList,
    isFromAdvanced,
    search,
    isFromModal,
    networkMatchList,
    matchVaultList,
    noPosition,
    userStats,
  ])

  useEffect(() => {
    let isFound = false
    if (farmTokenList && highestVaultAddress) {
      farmTokenList.map(stakedVault => {
        const eachTokenAddress = stakedVault.token.vaultAddress
        if (eachTokenAddress.toLowerCase() === highestVaultAddress.toLowerCase()) {
          setMatchedVault(stakedVault)
          isFound = true
          return true
        }
        if (!isFound && eachTokenAddress.toLowerCase() !== highestVaultAddress.toLowerCase()) {
          setMatchedVault()
          return true
        }
        return false
      })
    }
  }, [highestVaultAddress])

  useEffect(() => {
    if (highestPosition) {
      setPositionBalance(highestPosition.balance)
    }
  }, [highestPosition])

  const stopPropagation = event => {
    event.stopPropagation()
  }

  const onClickMigrate = async () => {
    if (!connected) {
      connectAction()
      return
    }
    if (Number(chainId) === 324) {
      const chain = 8453
      const chainHex = `0x${Number(chain).toString(16)}`
      if (!isSpecialApp) {
        setChain({ chainId: chainHex })
      }
    }
    if (chainId && curChain) {
      if (chainId.toString() !== curChain.toString()) {
        const chainHex = `0x${Number(curChain).toString(16)}`
        if (!isSpecialApp) {
          await setChain({ chainId: chainHex })
        }
      } else {
        setShowMigrate(true)
      }
    }
  }

  const onNetworkChange = chain => {
    const chainHex = `0x${Number(chain).toString(16)}`
    if (!isSpecialApp) {
      setChain({ chainId: chainHex })
    }
  }

  const accordianText = [
    {
      question: <>What is the Migrate tool about?</>,
      answer: (
        <>
          The migrate pool allows you to switch between Harvest strategies on the same network at
          ease.
        </>
      ),
    },
    {
      question: <>If I don&apos;t like the new strategy, can I exit at any time?</>,
      answer: (
        <>
          Yes, you can switch back to your original strategy or another at any time without any
          platform fees.
        </>
      ),
    },
    {
      question: <>What should I know about the new APY that I&apos;ll be getting?</>,
      answer: (
        <>
          APYs vary between strategies because each one carries different risks and exposures.
          Before migrating, it&apos;s good to learn about the new strategy&apos;s mechanics. For
          example, some strategies might offer a higher APY but involve assets with more price
          fluctuations. Our Migrate tool provides this flexibility, but remember that APYs can
          change based on market conditions and strategy performance.
        </>
      ),
    },
    {
      question: <>What is the cost of migrating?</>,
      answer: (
        <>
          There are no platform fees when migrating a position. Only network and standard swap fees
          apply.
        </>
      ),
    },
    {
      question: <>What happens when I click on &apos;Preview & Migrate&apos;?</>,
      answer: (
        <>
          You&apos;ll be prompted with a preview of the fToken conversion between the involved
          strategies.
        </>
      ),
    },
    {
      question: <>I can&apos;t find a strategy on the &apos;Migrate to&apos; list.</>,
      answer: (
        <>
          If a strategy you&apos;re looking for is not listed, it might be on a different network or
          not yet supported by the Migrate tool.
        </>
      ),
    },
    {
      question: <>Encountering issues?</>,
      answer: <>Please open a Discord ticket and we&apos;ll help.</>,
    },
    {
      question: <>I can&apos;t find my position on the &quot;My existing position&quot; list.</>,
      answer: (
        <>
          A position cannot be migrated if all its fTokens of are staked. Unstake fTokens partially,
          or in full (via the Rewards tab), to use it with the Migrate tool.
        </>
      ),
    },
  ]

  useEffect(() => {
    let positionToken, vaultToken, positionPlatform, vaultPlatform
    if (highestPosition) {
      positionToken = highestPosition.token
      positionPlatform = positionToken.subLabel
        ? positionToken.platform[0] && `${positionToken.platform[0]} - ${positionToken.subLabel}`
        : positionToken.platform[0] && positionToken.platform[0]
    }
    if (highestApyVault) {
      if (highestApyVault.vault.vaultPrice) {
        vaultToken = highestApyVault.vault
        vaultPlatform = vaultToken.subLabel
          ? vaultToken.platform[0] && `${vaultToken.platform[0]} - ${vaultToken.subLabel}`
          : vaultToken.platform[0] && vaultToken.platform[0]
      }
    }
    if (highestPosition) {
      setHighPositionPlatform(positionPlatform)
    }
    if (vaultPlatform) {
      setHighVaultPlatform(vaultPlatform)
    }
  }, [highestPosition, highestApyVault])

  return (
    <Container $bgcolor={bgColorNew}>
      <Inner $marginbottom={isMobile ? '0px' : '55px'}>
        <MigrateTop>
          <PageTitle $fontcolor={darkMode ? '#ffffff' : '"#101828"'}>Migrate</PageTitle>
        </MigrateTop>
        <PageIntro $fontcolor={darkMode ? '#ffffff' : '#475467'}>
          Find alternatives for your existing positions and migrate in one click.
        </PageIntro>
        <SpaceLine $bordercolor={borderColorBox} />
      </Inner>
      <Inner
        className="box-faq"
        $display="flex"
        $justifycontent="center"
        $alignitems="flex-start"
        $padding="0px 100px"
        $bordercolor={borderColorBox}
      >
        <MigrateBox
          className="migrate-box"
          $width={isMobile ? '100%' : '40%'}
          $marginbottom={isMobile ? '70px' : '0px'}
        >
          <BoxHeading>
            <div>
              <NewLabel
                $weight="600"
                $height="28px"
                $size="16px"
                $fontcolor={darkMode ? '#ffffff' : '#101828'}
              >
                Migrate Position
              </NewLabel>
              <NewLabel
                $weight="400"
                $height="20px"
                $size="14px"
                $fontcolor={darkMode ? '#ffffff' : '#475467'}
              >
                Displaying strategies on{' '}
                <span
                  style={{ fontWeight: '500', fontSize: '14px', lineHeight: '20px' }}
                >{`${formatNetworkName(networkName)}`}</span>
                .
              </NewLabel>
            </div>
            {isMobile && connected ? (
              <Dropdown>
                <CurrencyDropDown
                  id="dropdown-basic"
                  $bgcolor={bgColorNew}
                  $fontcolor2={fontColor2}
                  $hovercolor={hoverColorNew}
                  style={{ padding: 0 }}
                >
                  <CurrencySelect
                    $backcolor={backColor}
                    $fontcolor2={fontColor2}
                    $hovercolor={hoverColor}
                  >
                    <img src={chainUrl} alt={networkName} />
                    <img src={dropDown} alt="Chevron Down" />
                  </CurrencySelect>
                </CurrencyDropDown>
                <CurrencyDropDownMenu $backcolor={backColorButton}>
                  {ChainsList.map((item, i) => (
                    <CurrencyDropDownItem
                      key={i}
                      $bgcolor={Number(selectedChain) === Number(item.chainId) ? '#F7F9FF' : ''}
                      $fontcolor={fontColor2}
                      onClick={() => {
                        setSelectedChain(item.chainId)
                        onNetworkChange(item.chainId)
                      }}
                    >
                      <img src={item.img} alt={item.name} />
                    </CurrencyDropDownItem>
                  ))}
                </CurrencyDropDownMenu>
              </Dropdown>
            ) : connected ? (
              <ChainGroup>
                {ChainsList.map((item, i) => (
                  <ChainButton
                    $backcolor={bgColorNew}
                    $hovercolor={filterChainHoverColor}
                    $bordercolor={borderColorBox}
                    className={selectedChain.toString() === item.chainId.toString() ? 'active' : ''}
                    data-tip
                    data-for={`chain-${item.name}`}
                    key={i}
                    onClick={() => {
                      setSelectedChain(item.chainId)
                      onNetworkChange(item.chainId)
                    }}
                  >
                    <img src={item.img} alt="" />
                  </ChainButton>
                ))}
              </ChainGroup>
            ) : (
              ''
            )}
          </BoxHeading>
          <BoxTitle $fontcolor={darkMode ? '#ffffff' : '#475467'}>My existing position</BoxTitle>
          <VaultBox
            $bgcolor="#ffffff"
            $border="1px solid #D0D5DD"
            onClick={() => {
              if (!connected || noPosition) {
                setShowPositionModal(false)
              } else if (!noPosition) {
                setShowPositionModal(true)
              }
            }}
            className={!connected || noPosition ? 'inactive' : ''}
          >
            {!connected || (noPosition && highestApyVault) || isSpecialChain ? (
              <NewLabel $size="12px" $height="20px" $weight="500">
                No positions found.
              </NewLabel>
            ) : (
              <>
                <Content $alignitems="start">
                  <BadgeToken>
                    <BadgeIcon
                      $width={!highestPosition ? 'auto' : '13.096px'}
                      $margin={!highestPosition ? '0px' : '0px 5px 0px 0px'}
                    >
                      {highestPosition ? (
                        <img
                          src={highestPosition.chain ? highestPosition.chain : ETHEREUM}
                          alt=""
                        />
                      ) : (
                        <NewLabel $size="12px" $height="20px" $weight="500">
                          Scanning your positions
                        </NewLabel>
                      )}
                    </BadgeIcon>
                    {highestPosition ? (
                      <Token>
                        <>
                          <span>{highestPosition.token.tokenNames.join(', ')}</span>
                          <span
                            style={{ fontWeight: '300', marginLeft: '5px' }}
                          >{`(${highPositionPlatform})`}</span>
                        </>
                      </Token>
                    ) : (
                      <AnimatedDots />
                    )}
                  </BadgeToken>
                </Content>
                <Content $alignitems="end">
                  <img src={ChevronDown} alt="Chevron Down" />
                </Content>
              </>
            )}
          </VaultBox>
          <PositionModal
            showPositionModal={showPositionModal}
            setShowPositionModal={setShowPositionModal}
            networkName={networkName}
            setPositionVaultAddress={setPositionVaultAddress}
            filteredFarmList={farmTokenList}
            chain={Number(selectedChain)}
            isMobile={isMobile}
            currencySym={currencySym}
            setHighestPosition={setHighestPosition}
            setIsFromModal={setIsFromModal}
            stopPropagation={stopPropagation}
            token={tokenWith}
            setId={setPositionId}
            setToken={setTokenWith}
            groupOfVaults={groupOfVaults}
            setCurSupportedVault={setCurSupportedVaultWith}
            setNetworkMatchList={setNetworkMatchList}
            networkMatchList={networkMatchList}
            setNoPosition={setNoPosition}
            connected={connected}
            currencyRate={currencyRate}
          />
          <BoxTitle $fontcolor={darkMode ? '#ffffff' : '#475467'}>Migrate to</BoxTitle>
          <VaultBox
            className="from-vault"
            $bgcolor="#ffffff"
            $border="1px solid #D0D5DD"
            onClick={() => {
              setShowVaultModal(true)
            }}
          >
            <Content $alignitems="start">
              <BadgeToken>
                <BadgeIcon
                  $width={!highestApyVault ? 'auto' : '13.096px'}
                  $margin={!highestApyVault ? '0px' : '0px 5px 0px 0px'}
                >
                  {highestApyVault ? (
                    <img src={chainUrl} alt="" />
                  ) : (
                    <NewLabel $size="12px" $height="20px" $weight="500">
                      Searching new opportunities
                    </NewLabel>
                  )}
                </BadgeIcon>
                {highestApyVault ? (
                  <Token>
                    <>
                      <span>{highestApyVault.vault.tokenNames.join(', ')}</span>
                      <span
                        style={{ fontWeight: '300', marginLeft: '5px' }}
                      >{`(${highVaultPlatform})`}</span>
                    </>
                  </Token>
                ) : (
                  <AnimatedDots />
                )}
              </BadgeToken>
            </Content>
            <Content $alignitems="end">
              <img src={ChevronDown} alt="Chevron Down" />
            </Content>
          </VaultBox>
          <VaultModal
            showVaultModal={showVaultModal}
            setShowVaultModal={setShowVaultModal}
            networkName={networkName}
            setHighestApyVault={setHighestApyVault}
            setHighestVaultAddress={setHighestVaultAddress}
            filteredFarmList={farmTokenList}
            chain={Number(selectedChain)}
            isMobile={isMobile}
            currencySym={currencySym}
            setIsFromModal={setIsFromModal}
            stopPropagation={stopPropagation}
            groupOfVaults={groupOfVaults}
            pools={pools}
            setMatchVaultList={setMatchVaultList}
            matchVaultList={matchVaultList}
            id={highVaultId}
            setId={setHighVaultId}
            setToken={setTokenDepo}
            token={tokenDepo}
            tokenWith={tokenWith}
            account={account}
            balances={balances}
            positionAddress={positionVaultAddress}
            setPickedToken={setPickedTokenWith}
            setBalance={setBalance}
            pickedToken={pickedTokenWith}
            setInputAmount={setInputAmount}
            balance={balance}
            setSupportedVault={setSupportedVaultDepo}
            convertSuccess={convertSuccess}
            setStartPoint={setStartPoint}
            startPoint={startPoint}
            currencyRate={currencyRate}
            userStats={userStats}
            connected={connected}
            setAllMatchVaultList={setAllMatchVaultList}
          />
          <NewLabel
            $display="flex"
            $justifycontent="space-between"
            $alignitems="center"
            $flexdirection="column"
            $marginbottom="20px"
          >
            <NewLabel
              $weight="600"
              $size="14px"
              $height="24px"
              $marginbottom="10px"
              $margintop="16px"
              $fontcolor={darkMode ? '#ffffff' : '#344054'}
            >
              Details
            </NewLabel>
            <NewLabel $display="flex" $justifycontent="space-between" $marginbottom="10px">
              <NewLabel
                $display="flex"
                $justifycontent="start"
                $size="14px"
                $weight="400"
                $height="24px"
                $fontcolor={darkMode ? '#ffffff' : '#344054'}
              >
                APY change
              </NewLabel>
              <NewLabel
                $display="flex"
                $justifycontent="end"
                $size="14px"
                $weight="600"
                $height="24px"
                $fontcolor={darkMode ? '#ffffff' : '#344054'}
              >
                {!connected || (noPosition && highestApyVault) || isSpecialChain ? (
                  '0%'
                ) : highestPosition ? (
                  `${highestPosition.apy}%`
                ) : (
                  <AnimatedDots />
                )}{' '}
                <span style={{ marginLeft: '5px', marginRight: '5px' }}>
                  {highestPosition ||
                  !connected ||
                  (noPosition && highestApyVault) ||
                  isSpecialChain
                    ? '→'
                    : ''}
                </span>
                <span style={{ color: '#5fCf76' }}>
                  {highestApyVault ? `${highestApyVault.vaultApy}%` : <AnimatedDots />}
                </span>
              </NewLabel>
            </NewLabel>
            <NewLabel $display="flex" $justifycontent="space-between" $marginbottom="10px">
              <NewLabel
                $display="flex"
                $justifycontent="start"
                $size="14px"
                $weight="400"
                $height="24px"
                $fontcolor={darkMode ? '#ffffff' : '#344054'}
              >
                Expected Yield Change
              </NewLabel>
              <NewLabel
                $display="flex"
                $justifycontent="end"
                $size="14px"
                $weight="600"
                $height="24px"
                $fontcolor={darkMode ? '#ffffff' : '#344054'}
              >
                {!connected || (noPosition && highestApyVault) || isSpecialChain ? (
                  `${currencySym}0.00/yr`
                ) : highestPosition ? (
                  `${currencySym}${formatNumber((highestPosition.apy * positionBalance) / 100)}/yr`
                ) : (
                  <AnimatedDots />
                )}{' '}
                <span style={{ marginLeft: '5px', marginRight: '5px' }}>
                  {highestPosition ||
                  !connected ||
                  (noPosition && highestApyVault) ||
                  isSpecialChain
                    ? '→'
                    : ''}
                </span>
                <span style={{ color: '#5fCf76' }}>
                  {highestApyVault ? (
                    `${currencySym}${formatNumber(
                      (highestApyVault.vaultApy * positionBalance) / 100,
                    )}/yr`
                  ) : (
                    <AnimatedDots />
                  )}
                </span>
              </NewLabel>
            </NewLabel>
            <NewLabel $display="flex" $justifycontent="space-between" $marginbottom="10px">
              <NewLabel
                $display="flex"
                $justifycontent="start"
                $size="14px"
                $weight="400"
                $height="24px"
                $fontcolor={darkMode ? '#ffffff' : '#344054'}
              >
                Platform Fees
              </NewLabel>
              <NewLabel
                $display="flex"
                $justifycontent="end"
                $size="14px"
                $weight="600"
                $height="24px"
                $fontcolor={darkMode ? '#ffffff' : '#344054'}
              >
                Free
              </NewLabel>
            </NewLabel>
          </NewLabel>
          <ButtonDiv
            onClick={async () => {
              onClickMigrate()
            }}
          >
            <Button
              className={
                noPosition && highestApyVault && connected && !isSpecialChain ? 'inactive-btn' : ''
              }
            >
              {buttonName}
            </Button>
          </ButtonDiv>
          <MigrateStart
            find={find}
            pickedToken={pickedTokenWith}
            token={tokenDepo}
            id={positionId}
            pools={pools}
            currencySym={currencySym}
            currencyRate={currencyRate}
            showMigrate={showMigrate}
            setShowMigrate={setShowMigrate}
            toId={highVaultId}
            supportedVault={supportedVaultDepo}
            setSupportedVault={setSupportedVaultDepo}
            inputAmount={inputAmount}
            failureCount={failureCount}
            setFailureCount={setFailureCount}
            setConvertSuccess={setConvertSuccess}
            isNaN={isNaN}
            highestVaultAddress={highestVaultAddress}
            networkName={networkName}
            balance={balance}
            highestPosition={highestPosition}
            positionAddress={positionVaultAddress}
          />
        </MigrateBox>
        <NewLabel
          $marginleft={isMobile ? '0px' : '32px'}
          $width={isMobile ? '100%' : '60%'}
          className="migrate-faq"
        >
          {accordianText.map((text, i) => {
            return (
              <Accordian
                key={i}
                text={text}
                EXPANDED={EXPANDED}
                COLLAPSED={COLLAPSED}
                darkMode={darkMode}
                find={find}
              />
            )
          })}
        </NewLabel>
      </Inner>
    </Container>
  )
}

export default Migrate
