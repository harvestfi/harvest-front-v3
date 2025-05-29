import BigNumber from 'bignumber.js'
import { debounce, find, get, isArray, isEqual, keys, orderBy } from 'lodash'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import useEffectWithPrevious from 'use-effect-with-previous'
import EmptyIcon from '../../../assets/images/logos/farm/empty.svg'
import SortAPY from '../../../assets/images/logos/farm/sortAPY.svg'
import SortBank from '../../../assets/images/logos/farm/sortBank.svg'
import SortCurrency from '../../../assets/images/logos/farm/sortCurrency.svg'
import sortAscIcon from '../../../assets/images/ui/asc.svg'
import sortDescIcon from '../../../assets/images/ui/desc.svg'
import sortIcon from '../../../assets/images/ui/sort.svg'
import {
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
  MAX_DECIMALS,
  chainList,
} from '../../../constants'
import { fromWei } from '../../../services/web3'
import { CHAIN_IDS } from '../../../data/constants'
import { usePools } from '../../../providers/Pools'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useVaults } from '../../../providers/Vault'
import { useWallet } from '../../../providers/Wallet'
import { isSpecialApp } from '../../../utilities/formats'
import { getTotalApy, getVaultValue } from '../../../utilities/parsers'
import { getPublishDate } from '../../../utilities/apiCalls'
import VaultPanel from '../VaultPanel'
import VaultsListHeader from '../VaultsListHeader'
import {
  Container,
  EmptyImg,
  EmptyInfo,
  EmptyPanel,
  FlexDiv,
  Header,
  HeaderCol,
  VaultsListBody,
  DisplayCount,
} from './style'

if (typeof window !== 'undefined' && window.localStorage) {
  localStorage.setItem('sortingStatus', JSON.stringify('deposits'))
}

const { tokens } = require('../../../data')

const SortsList = [
  { id: 0, name: 'TVL', type: 'deposits', img: SortBank },
  { id: 1, name: 'Live APY', type: 'apy', img: SortAPY },
  { id: 2, name: 'My Balance', type: 'balance', img: SortCurrency },
]

const getNetworkNames = selChain => {
  const isAllChainsSelected = selChain.length === chainList.length
  if (isAllChainsSelected) {
    return ''
  }

  const selectedChains = chainList.filter(chain => selChain.includes(chain.chainId.toString()))

  if (selectedChains.length === 1) {
    return `on ${selectedChains[0].name} network`
  }
  const networkNames = selectedChains.map(chain => chain.name || 'Unknown')

  if (selectedChains.length === 2) {
    return `on ${networkNames[0]} and ${networkNames[1]} networks`
  }

  return `on ${networkNames.slice(0, -1).join(', ')} and ${networkNames.slice(-1)} networks`
}

const formatVaults = (
  groupOfVaults,
  pools,
  userStats,
  selChain,
  searchQuery = '',
  sortParam,
  sortOrder,
  depositedOnly,
  selectAsset,
  selectStableCoin,
  selectFarmType,
  selectedActiveType,
) => {
  let vaultsSymbol = keys(groupOfVaults)

  vaultsSymbol = vaultsSymbol.filter(
    tokenSymbol =>
      selChain.includes(groupOfVaults[tokenSymbol]?.chain) ||
      (groupOfVaults[tokenSymbol]?.data &&
        selChain.includes(groupOfVaults[tokenSymbol]?.data.chain)),
  )

  if (selectedActiveType.length !== 0) {
    let result = []
    selectedActiveType.forEach(item => {
      const temp = vaultsSymbol.filter(tokenSymbol => {
        if (item === 'Active') {
          return !(groupOfVaults[tokenSymbol].inactive || groupOfVaults[tokenSymbol].testInactive)
        }
        return groupOfVaults[tokenSymbol].inactive || groupOfVaults[tokenSymbol].testInactive
      })
      result = result.concat(temp)
    })
    vaultsSymbol = result
  } else if (!depositedOnly) {
    vaultsSymbol = vaultsSymbol.filter(
      tokenSymbol =>
        !groupOfVaults[tokenSymbol].inactive && !groupOfVaults[tokenSymbol].testInactive,
    )
  }

  if (depositedOnly) {
    const vaultsWithStakedBalances = Object.keys(userStats)
      .filter(
        poolId =>
          new BigNumber(userStats[poolId].totalStaked).gt(0) ||
          new BigNumber(userStats[poolId].lpTokenBalance).gt(0),
      )
      .map(poolId => {
        const selectedPool = find(pools, pool => pool.id === poolId)
        const collateralAddress = get(selectedPool, 'collateralAddress', poolId)

        const vaultSymbol = vaultsSymbol.find(
          tokenKey =>
            groupOfVaults[tokenKey].vaultAddress === collateralAddress ||
            (groupOfVaults[tokenKey].data &&
              groupOfVaults[tokenKey].data.collateralAddress === collateralAddress) ||
            tokenKey == poolId,
        )

        return vaultSymbol
      })

    vaultsSymbol = vaultsSymbol.filter(tokenSymbol =>
      vaultsWithStakedBalances.includes(tokenSymbol),
    )
  }

  const totalVaultsCount = vaultsSymbol.length

  if (searchQuery) {
    vaultsSymbol = vaultsSymbol.filter(
      symbol =>
        symbol.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (get(groupOfVaults[symbol], 'tokenAddress') &&
          !isArray(groupOfVaults[symbol].tokenAddress) &&
          groupOfVaults[symbol].tokenAddress.toLowerCase() === searchQuery.toLowerCase()) ||
        (get(groupOfVaults[symbol], 'tokenNames') &&
          groupOfVaults[symbol].tokenNames
            .join(', ')
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim())) ||
        (get(groupOfVaults[symbol], 'subLabel') &&
          groupOfVaults[symbol].subLabel
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim())) ||
        (get(
          symbol === FARM_TOKEN_SYMBOL ? tokens[IFARM_TOKEN_SYMBOL] : groupOfVaults[symbol],
          'platform',
        )[0] &&
          (symbol === FARM_TOKEN_SYMBOL
            ? tokens[IFARM_TOKEN_SYMBOL]
            : groupOfVaults[symbol]
          ).platform[0]
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim())),
    )
  }

  if (sortParam) {
    switch (sortParam) {
      case 'displayName':
        vaultsSymbol = orderBy(
          vaultsSymbol,
          v => get(groupOfVaults, `${v}.${sortParam}`),
          sortOrder,
        )
        break
      case 'deposits':
        vaultsSymbol = orderBy(
          vaultsSymbol,
          v => Number(getVaultValue(groupOfVaults[v])),
          sortOrder,
        )
        break
      case 'apy':
        vaultsSymbol = orderBy(
          vaultsSymbol,
          v => {
            const isSpecialVault = groupOfVaults[v].poolVault
            const tokenVault = groupOfVaults[v]
            let vaultPool
            if (isSpecialVault) {
              vaultPool = groupOfVaults[v].data
            } else {
              vaultPool = find(
                pools,
                pool => pool.collateralAddress === get(tokenVault, `vaultAddress`),
              )
            }

            return Number(
              isSpecialVault
                ? getTotalApy(null, tokenVault, true)
                : getTotalApy(vaultPool, tokenVault),
            )
          },
          sortOrder,
        )
        break
      case 'balance':
        vaultsSymbol = orderBy(
          vaultsSymbol,
          v => {
            const token = groupOfVaults[v]

            const userStat = userStats[v]
            const userBalance = Number(
              fromWei(
                new BigNumber(get(userStat, `lpTokenBalance`, 0))
                  .plus(get(userStat, `totalStaked`, 0))
                  .toFixed(),
                token.decimals,
                MAX_DECIMALS,
              ),
            )

            if (!userBalance) {
              return 0
            }

            const tempPricePerFullShare = get(token, `pricePerFullShare`, 0)
            const pricePerFullShare = fromWei(tempPricePerFullShare, token.decimals)

            const usdPrice = groupOfVaults[v].usdPrice * pricePerFullShare

            const usdBalance = Number(new BigNumber(userBalance).times(usdPrice).toFixed())
            return usdBalance
          },
          sortOrder,
        )
        break
      default:
        break
    }
  }

  if (selectAsset !== '') {
    vaultsSymbol = vaultsSymbol.filter(tokenSymbol => {
      const assetLength = groupOfVaults[tokenSymbol].tokenNames.length
      if (assetLength === 1 && selectAsset === 'Single Asset') {
        return true
      }
      if (assetLength === 2 && selectAsset === 'LP Token') {
        return true
      }

      if (assetLength === 1 && selectAsset === 'Autopilot') {
        return get(groupOfVaults[tokenSymbol], 'isIPORVault')
      }

      return false
    })
  }

  if (selectStableCoin) {
    vaultsSymbol = vaultsSymbol.filter(
      tokenSymbol =>
        get(groupOfVaults[tokenSymbol], 'tags') &&
        groupOfVaults[tokenSymbol].tags
          .join(', ')
          .toLowerCase()
          .includes(selectStableCoin.toLowerCase().trim()),
    )
  }

  if (selectFarmType !== '') {
    if (selectFarmType === 'New') {
      vaultsSymbol = orderBy(vaultsSymbol, v => get(groupOfVaults, `${v}.publishDate`), 'desc')
    } else if (selectFarmType === 'PopularNow') {
      vaultsSymbol = orderBy(
        vaultsSymbol,
        [v => Number(getVaultValue(groupOfVaults[v])), v => get(groupOfVaults, `${v}.publishDate`)],
        ['desc', 'desc'],
      ).slice(0, 10)
    }
  }
  vaultsSymbol = [...new Set(vaultsSymbol)]

  return { vaultsSymbol, totalVaultsCount }
}

const SortingIcon = ({ sortType, sortField, selectedField, riskId }) => {
  switch (true) {
    case riskId !== -1:
      return <img className="sort-icon" src={sortIcon} alt="Sort" />
    case sortType === 'asc' && selectedField === sortField:
      return <img className="sort-icon" src={sortAscIcon} alt="Sort ASC" />
    case sortType === 'desc' && selectedField === sortField:
      return <img className="sort-icon" src={sortDescIcon} alt="Sort DESC" />
    default:
      return <img className="sort-icon" src={sortIcon} alt="Sort" />
  }
}

const VaultList = () => {
  const { fontColor, filterColor, bgColorNew, borderColorBox, darkMode } = useThemeContext()

  const { vaultsData, getFarmingBalances, loadedUserVaultsWeb3Provider } = useVaults()

  const { pools, totalPools, fetchUserPoolStats, userStats, loadedUserPoolsWeb3Provider } =
    usePools()

  const { account, chain, selChain, chainId } = useWallet()
  const showNetworks = getNetworkNames(selChain)
  const [loaded, setLoaded] = useState(null)
  const [sortParam, setSortParam] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc')
  const [depositedOnly, selectDepositedOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectAsset, onSelectAsset] = useState('')
  const [selectStableCoin, onSelectStableCoin] = useState('')
  const [selectFarmType, onSelectFarmType] = useState('')
  const [selectedActiveType, selectActiveType] = useState([])
  const [riskId, setRiskId] = useState(-1) // for risk id

  const [loadComplete, setLoadComplete] = useState(false)

  React.useEffect(() => {
    setLoadComplete(true)
  }, [])

  const farmProfitSharingPool = totalPools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )

  let groupOfVaults = []
  if (isSpecialApp) {
    if (chainId === CHAIN_IDS.ETH_MAINNET) {
      if (selectFarmType !== '') {
        groupOfVaults = { ...vaultsData }
      } else {
        groupOfVaults = { ...vaultsData }
      }
    } else {
      groupOfVaults = { ...vaultsData }
    }
  } else if (selectFarmType !== '') {
    groupOfVaults = { ...vaultsData }
  } else {
    groupOfVaults = { ...vaultsData }
  }

  groupOfVaults = Object.fromEntries(
    Object.entries(groupOfVaults).filter(
      ([, vault]) => !(vault.isIPORVault && vault.chain !== '8453'),
    ),
  )

  useEffect(() => {
    const getCreatedAtData = async () => {
      if (groupOfVaults) {
        const { data, flag } = await getPublishDate()
        if (flag) {
          const vaultsKey = Object.keys(groupOfVaults)
          vaultsKey.map(async symbol => {
            // Add 'publishDate' to every vault
            const token = groupOfVaults[symbol]
            const isSpecialVault = token.liquidityPoolVault || token.poolVault
            const paramAddress = isSpecialVault
              ? token.data.collateralAddress
              : token.vaultAddress || token.tokenAddress
            const vaultIds = vaultsKey.filter(
              vaultId =>
                groupOfVaults[vaultId].vaultAddress === paramAddress ||
                groupOfVaults[vaultId].tokenAddress === paramAddress,
            )
            const id = vaultIds[0]
            const tokenVault = get(vaultsData, token.hodlVaultId || id)
            const vaultPool = isSpecialVault
              ? token.data
              : find(totalPools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))
            const address =
              token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress

            const dl = data.length
            for (let i = 0; i < dl; i += 1) {
              if (address.toLowerCase() === data[i].id) {
                groupOfVaults[symbol].publishDate = data[i].timestamp
                return
              }
            }
          })
        }
      }
    }

    getCreatedAtData()
  }, [])

  const { vaultsSymbol, totalVaultsCount } = useMemo(
    () =>
      formatVaults(
        groupOfVaults,
        pools,
        userStats,
        selChain,
        searchQuery,
        sortParam,
        sortOrder,
        depositedOnly,
        selectAsset,
        selectStableCoin,
        selectFarmType,
        selectedActiveType,
      ),
    [
      groupOfVaults,
      pools,
      userStats,
      selChain,
      searchQuery,
      sortParam,
      sortOrder,
      depositedOnly,
      selectAsset,
      selectStableCoin,
      selectFarmType,
      selectedActiveType,
    ],
  )

  const firstFarmingBalancesLoad = useRef(true)

  useEffectWithPrevious(
    ([prevChain]) => {
      const hasSwitchedChain = chain !== prevChain

      if (hasSwitchedChain) {
        selectActiveType([])
        onSelectAsset('')
        onSelectStableCoin(false)
      }
    },
    [
      chain,
      account,
      loadedUserPoolsWeb3Provider,
      loadedUserVaultsWeb3Provider,
      farmProfitSharingPool,
      fetchUserPoolStats,
      userStats,
      onSelectAsset,
    ],
  )

  const setSortingParams = param => {
    if (sortParam === param) {
      if (sortOrder === 'desc') {
        setSortOrder('asc')
      } else {
        setSortOrder('desc')
      }
    } else {
      setSortOrder('desc')
      setSortParam(param)
      localStorage.setItem('sortingStatus', JSON.stringify(param))
    }
  }

  useEffectWithPrevious(
    ([prevChain, prevAccount, prevUserStats]) => {
      const hasSwitchedChain = chain !== prevChain
      const hasSwitchedAccount = account !== prevAccount && account

      if (
        (hasSwitchedChain ||
          hasSwitchedAccount ||
          firstFarmingBalancesLoad.current ||
          (userStats && !isEqual(userStats, prevUserStats))) &&
        loadedUserVaultsWeb3Provider
      ) {
        setLoaded(false)
        const loadUserFarmingBalances = async () => {
          firstFarmingBalancesLoad.current = false
          await getFarmingBalances(vaultsSymbol)
          setLoaded(true)
        }
        loadUserFarmingBalances()
      }

      const storedSortingStatus = localStorage.getItem('sortingStatus')
      if (storedSortingStatus) {
        setSortParam(JSON.parse(storedSortingStatus))
      } else if (hasSwitchedAccount) {
        setSortingParams('deposits')
      }
    },
    [chain, account, userStats],
  )

  const [sortId, setSortId] = useState(0)

  const updateSortQuery = sort => {
    const debouncedFn = debounce(() => {
      if (sort === 'deposits') {
        setSortingParams(sort)
      } else {
        setSortingParams(sort)
      }
    }, 300)

    debouncedFn()
  }

  return (
    <Container id="vault-list">
      {loadComplete && (
        <VaultsListHeader
          setSearchQuery={setSearchQuery}
          onDepositedOnlyClick={selectDepositedOnly}
          onAssetClick={onSelectAsset}
          onSelectStableCoin={onSelectStableCoin}
          onSelectFarmType={onSelectFarmType}
          onSelectActiveType={selectActiveType}
          SortsList={SortsList}
          sortId={sortId}
          setSortId={setSortId}
          updateSortQuery={updateSortQuery}
          riskId={riskId}
          setRiskId={setRiskId}
          setSortOrder={setSortOrder}
        />
      )}
      <DisplayCount $fontcolor={fontColor} $mobilecolor={darkMode ? '#fff' : '#000'}>
        Displaying <span>{vaultsSymbol.length}</span> of <span>{totalVaultsCount}</span>{' '}
        {selectedActiveType.length === 0
          ? 'my'
          : selectedActiveType[0] === 'Active'
            ? 'active'
            : 'inactive'}{' '}
        farms {showNetworks}
      </DisplayCount>
      <VaultsListBody $bordercolor={borderColorBox} $backcolor={bgColorNew}>
        <Header $bordercolor={borderColorBox} $fontcolor={fontColor} $filtercolor={filterColor}>
          <HeaderCol $width="45%" $justifycontent="start">
            Farm
          </HeaderCol>
          <HeaderCol
            $width="15%"
            $justifycontent="start"
            $textalign="left"
            onClick={() => {
              setSortingParams('apy')
              onSelectFarmType('')
              setRiskId(-1)
            }}
          >
            <div className="hoverable">Live APY</div>
            <SortingIcon
              className="sort-icon"
              sortType={sortOrder}
              sortField={sortParam}
              selectedField="apy"
              riskId={riskId}
            />
          </HeaderCol>
          <HeaderCol
            $width="15%"
            $justifycontent="start"
            $textalign="left"
            onClick={() => {
              setSortingParams('apy')
              onSelectFarmType('')
              setRiskId(-1)
            }}
          >
            <div className="hoverable">Daily APY</div>
            <SortingIcon
              className="sort-icon"
              sortType={sortOrder}
              sortField={sortParam}
              selectedField="apy"
              riskId={riskId}
            />
          </HeaderCol>
          <HeaderCol
            $width="15%"
            $justifycontent="start"
            $textalign="left"
            onClick={() => {
              setSortingParams('deposits')
              onSelectFarmType('')
              setRiskId(-1)
            }}
          >
            <div className="hoverable">TVL</div>
            <SortingIcon
              className="sort-icon"
              sortType={sortOrder}
              sortField={sortParam}
              selectedField="deposits"
              riskId={riskId}
            />
          </HeaderCol>
          <HeaderCol
            onClick={() => {
              setSortingParams('balance')
              onSelectFarmType('')
              setRiskId(-1)
            }}
            $justifycontent="start"
            $width="10%"
            $textalign="left"
          >
            <div className="hoverable">My Balance </div>
            <SortingIcon
              className="sort-icon"
              sortType={sortOrder}
              sortField={sortParam}
              selectedField="balance"
              riskId={riskId}
            />
          </HeaderCol>
        </Header>
        <div>
          {vaultsSymbol.length > 0 ? (
            vaultsSymbol.map((vaultSymbol, i) => {
              const token = groupOfVaults[vaultSymbol]
              return (
                <VaultPanel
                  key={vaultSymbol}
                  loaded={loaded}
                  token={token}
                  tokenSymbol={vaultSymbol}
                  tokenNum={i}
                  vaultsCount={vaultsSymbol.length - 1}
                />
              )
            })
          ) : (
            <EmptyPanel $fontcolor={fontColor}>
              <FlexDiv>
                <EmptyImg src={EmptyIcon} alt="Empty" />
              </FlexDiv>
              <EmptyInfo $weight={700} $size={16} $height={21} $marginbottom="28">
                There are no such farms.
              </EmptyInfo>
              <EmptyInfo $weight={400} $size={12} $height={16} $marginbottom="10">
                Hey farmer, you might change or disable filters!
              </EmptyInfo>
            </EmptyPanel>
          )}
        </div>
      </VaultsListBody>
    </Container>
  )
}

export default VaultList
