import BigNumber from 'bignumber.js'
import { debounce, find, get, isArray, isEqual, keys, orderBy, sortBy, uniq } from 'lodash'
import move from 'lodash-move'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Dropdown } from 'react-bootstrap'
import useEffectWithPrevious from 'use-effect-with-previous'
import EmptyIcon from '../../../assets/images/logos/farm/empty.svg'
import sortAscIcon from '../../../assets/images/ui/asc.svg'
import sortDescIcon from '../../../assets/images/ui/desc.svg'
import sortIcon from '../../../assets/images/ui/sort.svg'
import SortFilterIcon from '../../../assets/images/logos/filter/sort-icon.svg'
import MobileSortCheckedIcon from '../../../assets/images/logos/filter/mobile-sort-checked.svg'
import {
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
} from '../../../constants'
import { CHAIN_IDS } from '../../../data/constants'
import { usePools } from '../../../providers/Pools'
import { useStats } from '../../../providers/Stats'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useVaults } from '../../../providers/Vault'
import { useWallet } from '../../../providers/Wallet'
import {
  convertAmountToFARM,
  getTotalApy,
  getUserVaultBalance,
  getVaultValue,
  isSpecialApp,
  getPriceFeed,
} from '../../../utils'
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
  MobileListFilter,
  VaultsListBody,
  MobileFilterBtn,
} from './style'

const { tokens } = require('../../../data')

const SortsList = [
  { id: 0, name: 'APY', type: 'apy' },
  { id: 1, name: 'My Balance', type: 'balance' },
  { id: 2, name: 'TVL', type: 'deposits' },
]

const formatVaults = (
  groupOfVaults,
  pools,
  userStats,
  balances,
  farmingBalances,
  selChain,
  chainId,
  searchQuery = '',
  sortParam,
  sortOrder,
  depositedOnly,
  selectAsset,
  selectStableCoin,
  selectFarmType,
  selectedActiveType,
) => {
  let vaultsSymbol = sortBy(keys(groupOfVaults), [
    // eslint-disable-next-line consistent-return
    key => {
      if (get(groupOfVaults, `[${key}].isNew`, get(groupOfVaults, `[${key}].data.isNew`))) {
        return groupOfVaults[key]
      }
    },
    // eslint-disable-next-line consistent-return
    key => {
      if (!get(groupOfVaults, `[${key}].isNew`, get(groupOfVaults, `[${key}].data.isNew`))) {
        return groupOfVaults[key]
      }
    },
  ])

  if (
    (isSpecialApp && chainId === CHAIN_IDS.ETH_MAINNET) ||
    (!isSpecialApp && selChain.includes(CHAIN_IDS.ETH_MAINNET))
  ) {
    const farmIdx = vaultsSymbol.findIndex(symbol => symbol === FARM_TOKEN_SYMBOL)
    vaultsSymbol = move(vaultsSymbol, farmIdx, 0)

    const wethIdx = vaultsSymbol.findIndex(symbol => symbol === 'WETH')
    vaultsSymbol = move(vaultsSymbol, wethIdx, 1)
  }

  vaultsSymbol = vaultsSymbol.filter(
    tokenSymbol =>
      tokenSymbol !== IFARM_TOKEN_SYMBOL &&
      (selChain.includes(groupOfVaults[tokenSymbol]?.chain) ||
        (groupOfVaults[tokenSymbol]?.data &&
          selChain.includes(groupOfVaults[tokenSymbol]?.data.chain))),
  )

  if (searchQuery) {
    if (searchQuery.toLowerCase() === 'lsd' || searchQuery.toLowerCase() === 'desci') {
      vaultsSymbol = vaultsSymbol.filter(
        symbol =>
          get(groupOfVaults[symbol], 'tags') &&
          groupOfVaults[symbol].tags
            .join(', ')
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim()),
      )
    } else {
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
            const isSpecialVault = groupOfVaults[v].liquidityPoolVault || groupOfVaults[v].poolVault

            const tokenVault = get(groupOfVaults, groupOfVaults[v].hodlVaultId || v)
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
                ? getTotalApy(null, groupOfVaults[v], true)
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
            let iFARMinFARM, vaultPool

            if (v === FARM_TOKEN_SYMBOL) {
              const iFARMBalance = get(balances, IFARM_TOKEN_SYMBOL, 0)
              iFARMinFARM = convertAmountToFARM(
                IFARM_TOKEN_SYMBOL,
                iFARMBalance,
                tokens[FARM_TOKEN_SYMBOL].decimals,
                groupOfVaults,
              )
            }
            const isSpecialVault = groupOfVaults[v].liquidityPoolVault || groupOfVaults[v].poolVault

            const tokenVault = get(groupOfVaults, groupOfVaults[v].hodlVaultId || v)

            if (isSpecialVault) {
              vaultPool = groupOfVaults[v].data
            } else {
              vaultPool = find(
                pools,
                pool => pool.collateralAddress === get(tokenVault, `vaultAddress`),
              )
            }
            const poolId = get(vaultPool, 'id')
            const totalStakedInPool = get(userStats, `[${poolId}]['totalStaked']`, 0)

            // eslint-disable-next-line one-var
            let usdPrice
            if (isSpecialVault) {
              usdPrice = groupOfVaults[v].data && groupOfVaults[v].data.lpTokenData?.price
            } else {
              usdPrice = groupOfVaults[v].usdPrice
            }
            return (
              Number(getUserVaultBalance(v, farmingBalances, totalStakedInPool, iFARMinFARM)) *
              Number(usdPrice)
            )
          },
          sortOrder,
        )
        break
      default:
        break
    }
  }

  if (selectedActiveType.length !== 0) {
    let result = []
    selectedActiveType.map(item => {
      const temp = vaultsSymbol.filter(tokenSymbol => {
        if (item === 'Active') {
          return !(groupOfVaults[tokenSymbol].inactive || groupOfVaults[tokenSymbol].testInactive)
        }
        return groupOfVaults[tokenSymbol].inactive || groupOfVaults[tokenSymbol].testInactive
      })
      result = result.concat(temp)
      return result
    })
    vaultsSymbol = [...result]
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
          new BigNumber(userStats[poolId].lpTokenBalance).gt(0) ||
          (poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
            new BigNumber(balances[IFARM_TOKEN_SYMBOL]).gt(0)),
      )
      .map(poolId => {
        const selectedPool = find(pools, pool => pool.id === poolId)
        const collateralAddress = get(selectedPool, 'collateralAddress', poolId)

        const vaultSymbol = vaultsSymbol.find(
          tokenKey =>
            groupOfVaults[tokenKey].vaultAddress === collateralAddress ||
            (groupOfVaults[tokenKey].data &&
              groupOfVaults[tokenKey].data.collateralAddress === collateralAddress),
        )

        return vaultSymbol
      })

    vaultsSymbol = vaultsSymbol.filter(tokenSymbol =>
      vaultsWithStakedBalances.includes(tokenSymbol),
    )
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
        orderBy(vaultsSymbol, v => get(groupOfVaults, `${v}.publishDate`), 'desc').slice(0, 15),
        v => Number(getVaultValue(groupOfVaults[v])),
        'desc',
      )
    }
    // vaultsSymbol = vaultsSymbol.filter(
    //   tokenSymbol =>
    //     get(groupOfVaults[tokenSymbol], 'tags') &&
    //     groupOfVaults[tokenSymbol].tags
    //       .join(', ')
    //       .toLowerCase()
    //       .includes(selectFarmType.toLowerCase().trim()),
    // )
  }
  vaultsSymbol = [...new Set(vaultsSymbol)]
  return vaultsSymbol
}

const SortingIcon = ({ sortType, sortField, selectedField }) => {
  switch (true) {
    case sortType === 'asc' && selectedField === sortField:
      return <img className="sort-icon" src={sortAscIcon} alt="Sort ASC" />
    case sortType === 'desc' && selectedField === sortField:
      return <img className="sort-icon" src={sortDescIcon} alt="Sort DESC" />
    default:
      return <img className="sort-icon" src={sortIcon} alt="Sort" />
  }
}

const VaultList = () => {
  const {
    vaultsData,
    getFarmingBalances,
    loadedUserVaultsWeb3Provider,
    farmingBalances,
  } = useVaults()
  const { profitShareAPY } = useStats()
  const { pools, fetchUserPoolStats, userStats, loadedUserPoolsWeb3Provider } = usePools()
  const { account, chain, selChain, getWalletBalances, balances, chainId } = useWallet()
  const [openVault, setOpen] = useState(null)
  const [loaded, setLoaded] = useState(null)
  const [sortParam, setSortParam] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc')
  const [depositedOnly, selectDepositedOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectAsset, onSelectAsset] = useState('')
  const [selectStableCoin, onSelectStableCoin] = useState('')
  const [selectFarmType, onSelectFarmType] = useState('')
  const [selectedActiveType, selectActiveType] = useState([])

  const [loadComplete, setLoadComplete] = useState(false)

  React.useEffect(() => {
    setLoadComplete(true)
  }, [])

  const farmProfitSharingPool = pools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )
  const farmWethPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_WETH_POOL_ID)
  const farmGrainPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_GRAIN_POOL_ID)

  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: ['./icons/ifarm.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        tokenNames: ['FARM'],
        platform: ['Uniswap'],
        tags: ['Beginners'],
      },
      [FARM_WETH_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        platform: ['Uniswap'],
        data: farmWethPool,
        logoUrl: ['./icons/farm.svg', './icons/eth.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        tokenNames: ['FARM', 'ETH'],
        assetType: 'LP Token',
        tags: ['Advanced'],
      },
      [FARM_GRAIN_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        tokenNames: ['FARM', 'GRAIN'],
        platform: ['Uniswap'],
        data: farmGrainPool,
        logoUrl: ['./icons/farm.svg', './icons/grain.svg'],
        rewardSymbol: FARM_TOKEN_SYMBOL,
        tags: ['Advanced'],
      },
    }),
    [farmGrainPool, farmWethPool, farmProfitSharingPool, profitShareAPY],
  )

  let groupOfVaults = []
  if (isSpecialApp) {
    if (chainId === CHAIN_IDS.ETH_MAINNET) groupOfVaults = { ...vaultsData, ...poolVaults }
    else groupOfVaults = { ...vaultsData }
  } else {
    groupOfVaults = { ...vaultsData, ...poolVaults }
  }

  useEffect(() => {
    const getCreatedAtData = async () => {
      if (groupOfVaults) {
        const vaultsKey = Object.keys(groupOfVaults)
        vaultsKey.map(async symbol => {
          const token = groupOfVaults[symbol]
          const tokenChainId = token.chain || token.data.chain
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
            : find(pools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))
          const address =
            token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
          const { data, flag } = await getPriceFeed(address, tokenChainId)
          groupOfVaults[symbol].publishDate = flag ? Number(data[data.length - 1].timestamp) : null
        })
      }
    }

    getCreatedAtData()
  }, [pools, vaultsData]) // eslint-disable-line react-hooks/exhaustive-deps

  const vaultsSymbol = useMemo(
    () =>
      formatVaults(
        groupOfVaults,
        pools,
        userStats,
        balances,
        farmingBalances,
        selChain,
        chainId,
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
      balances,
      farmingBalances,
      selChain,
      chainId,
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

  const hasLoadedSpecialEthPools =
    !!get(farmWethPool, 'contractInstance') &&
    !!get(farmGrainPool, 'contractInstance') &&
    !!get(farmProfitSharingPool, 'contractInstance')

  const firstPoolsBalancesLoad = useRef(true)
  const firstVaultsBalancesLoad = useRef(true)
  const firstFarmingBalancesLoad = useRef(true)

  useEffectWithPrevious(
    ([prevChain, prevAccount, prevOpenVault]) => {
      const hasSwitchedChain = chain !== prevChain
      const hasSwitchedChainToETH = hasSwitchedChain && chain === CHAIN_IDS.ETH_MAINNET
      const hasSwitchedAccount = account !== prevAccount && account
      const hasSwitchedVault = openVault !== prevOpenVault

      if (hasSwitchedChain) {
        selectActiveType([])
        onSelectAsset('')
        onSelectStableCoin(false)
        setOpen(null)
      }

      if (
        (hasSwitchedChainToETH || hasSwitchedAccount || firstPoolsBalancesLoad.current) &&
        loadedUserPoolsWeb3Provider &&
        hasLoadedSpecialEthPools
      ) {
        const fetchUserTotalStakedInFarmAndFarmUsdc = async () => {
          firstPoolsBalancesLoad.current = false
          await fetchUserPoolStats(
            [farmWethPool, farmGrainPool, farmProfitSharingPool],
            account,
            userStats,
          )
        }

        fetchUserTotalStakedInFarmAndFarmUsdc()
      }

      if (
        (hasSwitchedVault ||
          hasSwitchedChain ||
          hasSwitchedAccount ||
          firstVaultsBalancesLoad.current) &&
        loadedUserVaultsWeb3Provider
      ) {
        const loadUserVaultBalances = async selectedVault => {
          let balancesToLoad = selectedVault ? [selectedVault] : []

          if (
            firstVaultsBalancesLoad.current &&
            !selectedVault &&
            selChain.includes(CHAIN_IDS.ETH_MAINNET)
          ) {
            // firstVaultsBalancesLoad.current = false
            balancesToLoad = [
              FARM_TOKEN_SYMBOL,
              IFARM_TOKEN_SYMBOL,
              FARM_GRAIN_TOKEN_SYMBOL,
              FARM_WETH_TOKEN_SYMBOL,
            ]
          } else if (selectedVault) {
            if (isArray(tokens[selectedVault].tokenAddress)) {
              const multipleAssets = tokens[selectedVault].tokenAddress.map(address => {
                const selectedSymbol = Object.keys(tokens).find(
                  tokenSymbol =>
                    !isArray(tokens[tokenSymbol].tokenAddress) &&
                    tokens[tokenSymbol].tokenAddress.toLowerCase() === address.toLowerCase(),
                )
                return selectedSymbol
              })
              balancesToLoad = [...balancesToLoad, ...multipleAssets]
            }

            if (chain === CHAIN_IDS.ETH_MAINNET) {
              balancesToLoad = [
                ...balancesToLoad,
                FARM_TOKEN_SYMBOL,
                IFARM_TOKEN_SYMBOL,
                FARM_GRAIN_TOKEN_SYMBOL,
                FARM_WETH_TOKEN_SYMBOL,
              ]
            }
          }

          if (balancesToLoad.length) {
            setLoaded(!!selectedVault)
            await getWalletBalances(uniq(balancesToLoad), account, true)
            setLoaded(true)
          }
        }

        loadUserVaultBalances(openVault)
      }
    },
    [
      chain,
      account,
      openVault,
      loadedUserPoolsWeb3Provider,
      loadedUserVaultsWeb3Provider,
      farmProfitSharingPool,
      farmWethPool,
      farmGrainPool,
      fetchUserPoolStats,
      userStats,
      hasLoadedSpecialEthPools,
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

      if (hasSwitchedAccount) {
        setSortingParams('deposits')
      }
    },
    [chain, account, userStats],
  )

  const [sortId, setSortId] = useState(2)

  const updateSortQuery = sort => {
    const debouncedFn = debounce(() => {
      if (sort === 'balance') {
        if (account) {
          setSortingParams(sort)
        }
      } else {
        setSortingParams(sort)
      }
    }, 300)

    debouncedFn()
  }

  const {
    fontColor,
    filterColor,
    backColor,
    mobileFilterBackColor,
    mobileFilterBorderColor,
    darkMode,
  } = useThemeContext()

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
        />
      )}
      <VaultsListBody backColor={backColor}>
        <MobileListFilter
          mobileBackColor={mobileFilterBackColor}
          backColor={backColor}
          borderColor={mobileFilterBorderColor}
          fontColor={fontColor}
          filterColor={filterColor}
        >
          <Dropdown className="filter-sort">
            <Dropdown.Toggle className="toggle">
              <div>Sort By: {sortId === -1 ? '' : SortsList[sortId].name}</div>
              <MobileFilterBtn type="button" darkmode={darkMode ? 'true' : 'false'}>
                <img src={SortFilterIcon} alt="" />
              </MobileFilterBtn>
            </Dropdown.Toggle>

            <Dropdown.Menu className="menu">
              {SortsList.map((item, i) => (
                <Dropdown.Item
                  className={`item ${
                    sortId !== -1 && item.type === SortsList[sortId].type ? 'active-item' : ''
                  }`}
                  key={i}
                  onClick={() => {
                    setSortId(item.id)
                    updateSortQuery(item.type)
                  }}
                >
                  <div>{item.name}</div>
                  <img className="checked" src={MobileSortCheckedIcon} alt="" />
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </MobileListFilter>
        <Header fontColor={fontColor} filterColor={filterColor}>
          <HeaderCol width="45%" justifyContent="start">
            Farm
          </HeaderCol>
          <HeaderCol
            width="15%"
            justifyContent="start"
            textAlign="left"
            onClick={() => setSortingParams('apy')}
          >
            <div className="hoverable">APY</div>
            <SortingIcon
              className="sort-icon"
              sortType={sortOrder}
              sortField={sortParam}
              selectedField="apy"
            />
          </HeaderCol>
          <HeaderCol
            width="15%"
            justifyContent="start"
            textAlign="left"
            onClick={() => setSortingParams('apy')}
          >
            <div className="hoverable">Daily APY</div>
            <SortingIcon
              className="sort-icon"
              sortType={sortOrder}
              sortField={sortParam}
              selectedField="apy"
            />
          </HeaderCol>
          <HeaderCol
            data-tip
            data-for="total-deposits-column-header"
            width="15%"
            justifyContent="start"
            textAlign="left"
            onClick={() => setSortingParams('deposits')}
          >
            <div className="hoverable">TVL</div>
            <SortingIcon
              className="sort-icon"
              sortType={sortOrder}
              sortField={sortParam}
              selectedField="deposits"
            />
          </HeaderCol>
          <HeaderCol
            onClick={() => setSortingParams('balance')}
            justifyContent="start"
            width="10%"
            textAlign="left"
          >
            <div className="hoverable">My Balance </div>
            <SortingIcon
              className="sort-icon"
              sortType={sortOrder}
              sortField={sortParam}
              selectedField="balance"
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
            <EmptyPanel fontColor={fontColor}>
              <FlexDiv>
                <EmptyImg src={EmptyIcon} alt="Empty" />
              </FlexDiv>
              <EmptyInfo weight={700} size={16} height={21} marginBottom="28">
                There are no such farms.
              </EmptyInfo>
              <EmptyInfo weight={400} size={12} height={16} marginBottom="10">
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
