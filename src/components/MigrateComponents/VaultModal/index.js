import React, { useState, useEffect, useRef } from 'react'
import { isEmpty, get } from 'lodash'
import Modal from 'react-bootstrap/Modal'
import { BsArrowDown } from 'react-icons/bs'
import BigNumber from 'bignumber.js'
import { Spinner } from 'react-bootstrap'
import { isAddress } from 'ethers'
import { FTokenInfo, NewLabel, IconCard, ImgBtn } from '../PositionModal/style'
import { useThemeContext } from '../../../providers/useThemeContext'
import CloseIcon from '../../../assets/images/logos/beginners/close.svg'
import { fromWei, checkNativeToken } from '../../../services/viem'
import AnimatedDots from '../../AnimatedDots'
import { formatNetworkName, formatNumber, formatNumberWido } from '../../../utilities/formats'
import VaultList from '../VaultList'
import { getMatchedVaultList } from '../../../utilities/parsers'
import { USD_BALANCES_DECIMALS } from '../../../constants'
import { usePortals } from '../../../providers/Portals'
import { VaultBox } from '../PositionList/style'

const VaultModal = ({
  showVaultModal,
  setShowVaultModal,
  networkName,
  setHighestApyVault,
  setHighestVaultAddress,
  filteredFarmList,
  chain,
  isMobile,
  currencySym,
  currencyRate,
  setIsFromModal,
  stopPropagation,
  groupOfVaults,
  pools,
  matchVaultList,
  setMatchVaultList,
  setToken,
  setId,
  token,
  id,
  balances,
  account,
  setPickedToken,
  positionAddress,
  setBalance,
  pickedToken,
  setInputAmount,
  balance,
  setSupportedVault,
  convertSuccess,
  startPoint,
  setStartPoint,
  connected,
  setAllMatchVaultList,
  userStats,
}) => {
  const { darkMode, inputFontColor, fontColor } = useThemeContext()
  const [countFarm, setCountFarm] = useState(0)
  const [hasPortalsError, setHasPortalsError] = useState(true)
  const [balanceList, setBalanceList] = useState([])
  const [defaultToken, setDefaultToken] = useState(null)

  const [, setSupTokenList] = useState([])
  const [supTokenNoBalanceList, setSupTokenNoBalanceList] = useState([])
  const [defaultCurToken, setDefaultCurToken] = useState(defaultToken)
  const [balanceTokenList, setBalanceTokenList] = useState(balanceList)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [newMatchesList, setNewMatchesList] = useState([])
  const [matchingList, setMatchingList] = useState([])
  const [startSpinner, setStartSpinner] = useState(false)
  const [isEnd, setIsEnd] = useState(false)
  const isFetchingRef = useRef(false)

  const {
    getPortalsSupport,
    getPortalsBalances,
    getPortalsBaseTokens,
    getPortalsToken,
    getPortalsSupportBatch,
  } = usePortals()

  const { tokens } = require('../../../data')

  const filterWord = ''

  let tokenDecimals

  if (token) {
    tokenDecimals = token.decimals || tokens[id].decimals
  }

  useEffect(() => {
    setNewMatchesList([])
    setIsEnd(false)
    setStartPoint(10)
    setMatchVaultList([])
  }, [connected])

  useEffect(() => {
    setMatchVaultList([])
  }, [chain])

  useEffect(() => {
    let matched = []
    const activedList = []
    if (chain && !isEmpty(userStats) && connected) {
      matched = getMatchedVaultList(groupOfVaults, chain, pools)
    } else if (!connected) {
      matched = getMatchedVaultList(groupOfVaults, 8453, pools)
    }

    if (matched.length > 0) {
      matched.forEach(item => {
        const vaultValue = new BigNumber(get(item.vault, 'totalValueLocked', 0))
        if (Number(item.vaultApy) !== 0 && Number(vaultValue) > 500) {
          activedList.push(item)
        }
      })
      if (activedList.length > 0) {
        activedList.sort((a, b) => b.vaultApy - a.vaultApy)
        setMatchingList(activedList)
        setAllMatchVaultList(activedList)
      }
    }

    const fetchSupportedMatches = async () => {
      if (isFetchingRef.current) {
        return
      }
      isFetchingRef.current = true
      const filteredMatchList = []

      if (activedList.length > 0) {
        const newArray = activedList.slice(0, 10)

        const tokensToCheck = newArray
          .filter(item => item.vaultApy !== 0)
          .map(item => {
            const mToken = item.vault
            const tokenAddress = mToken.vaultAddress || mToken.tokenAddress
            const chainId = mToken.chain || mToken.data.chain
            return {
              address: tokenAddress,
              chainId: chainId,
              item: item,
            }
          })

        if (tokensToCheck.length > 0) {
          try {
            const tokensByChain = tokensToCheck.reduce((acc, token) => {
              if (!acc[token.chainId]) {
                acc[token.chainId] = []
              }
              acc[token.chainId].push(token)
              return acc
            }, {})

            for (const [chainId, tokens] of Object.entries(tokensByChain)) {
              const addresses = tokens.map(t => t.address)
              const supportResults = await getPortalsSupportBatch(chainId, addresses)

              supportResults.forEach((result, index) => {
                if (result.status === 200 && result.data.totalItems !== 0) {
                  filteredMatchList.push(tokens[index].item)
                }
              })
            }
          } catch (error) {
            console.log('Error in fetching Portals supported batch:', error)
          }
        }
      }
      if (filteredMatchList.length > 0) {
        setMatchVaultList(filteredMatchList)
        setCountFarm(filteredMatchList.length)
      }

      isFetchingRef.current = false
    }

    fetchSupportedMatches()
  }, [chain, connected, userStats])

  const fetchMoreMatches = async () => {
    if (!isEnd) {
      setStartSpinner(true)
      const filteredMatchList = []
      const nextArray = matchingList.slice(startPoint, startPoint + 10)

      const tokensToCheck = nextArray.map(item => {
        const mToken = item.vault
        const tokenAddress = mToken.vaultAddress || mToken.tokenAddress
        const chainId = mToken.chain || mToken.data.chain
        return {
          address: tokenAddress,
          chainId: chainId,
          item: item,
        }
      })

      if (tokensToCheck.length > 0) {
        try {
          const tokensByChain = tokensToCheck.reduce((acc, token) => {
            if (!acc[token.chainId]) {
              acc[token.chainId] = []
            }
            acc[token.chainId].push(token)
            return acc
          }, {})

          for (const [chainId, tokens] of Object.entries(tokensByChain)) {
            const addresses = tokens.map(t => t.address)
            const supportResults = await getPortalsSupportBatch(chainId, addresses)

            supportResults.forEach((result, index) => {
              if (result.status === 200 && result.data.totalItems !== 0) {
                filteredMatchList.push(tokens[index].item)
              }
            })
          }
        } catch (error) {
          console.log('Error in fetching Portals supported batch:', error)
        }
      }

      const newMathcing = [...newMatchesList, ...filteredMatchList]
      setStartPoint(startPoint + 10)
      setNewMatchesList(newMathcing)
      setCountFarm(countFarm + filteredMatchList.length)
      if (newMathcing.length > 0) {
        setStartSpinner(false)
      }

      if (
        nextArray[nextArray.length - 1].vault.vaultAddress.toLowerCase() ===
        matchingList[matchingList.length - 1].vault.vaultAddress.toLowerCase()
      ) {
        setIsEnd(true)
      }
    }
  }

  const positions = matchVaultList.map((item, i) => {
    return (
      <VaultList
        key={i}
        matchVault={item}
        currencySym={currencySym}
        currencyRate={currencyRate}
        networkName={networkName}
        setShowVaultModal={setShowVaultModal}
        setHighestVaultAddress={setHighestVaultAddress}
        setHighestApyVault={setHighestApyVault}
        setIsFromModal={setIsFromModal}
        stopPropagation={stopPropagation}
        darkMode={darkMode}
        filteredFarmList={filteredFarmList}
        chainId={chain}
        setToken={setToken}
        setId={setId}
        groupOfVaults={groupOfVaults}
        connected={connected}
      />
    )
  })

  const newPositions = newMatchesList.map((item, i) => {
    return (
      <VaultList
        key={i}
        matchVault={item}
        currencySym={currencySym}
        currencyRate={currencyRate}
        networkName={networkName}
        setShowVaultModal={setShowVaultModal}
        setHighestVaultAddress={setHighestVaultAddress}
        setHighestApyVault={setHighestApyVault}
        setIsFromModal={setIsFromModal}
        stopPropagation={stopPropagation}
        darkMode={darkMode}
        filteredFarmList={filteredFarmList}
        chainId={chain}
        setToken={setToken}
        setId={setId}
        groupOfVaults={groupOfVaults}
        connected={connected}
      />
    )
  })

  useEffect(() => {
    async function fetchData() {
      if (token) {
        const tokenAddress = token.vaultAddress || token.tokenAddress
        const chainId = token.chain || token.data.chain
        const portalsToken = await getPortalsSupport(chainId, tokenAddress)

        if (portalsToken) {
          if (portalsToken === undefined || portalsToken.status !== 200) {
            setHasPortalsError(true)
          } else if (portalsToken.status === 200) {
            setHasPortalsError(false)
            if (portalsToken.data.totalItems === 0) {
              setSupportedVault(false)
            } else {
              setSupportedVault(true)
            }
          }
        }
      }
    }

    fetchData()
  }, [token])

  useEffect(() => {
    const getTokenBalance = async () => {
      try {
        if (chain && account && Object.keys(balances).length !== 0 && token) {
          if (!hasPortalsError) {
            let supList = [],
              directInSup = {},
              directInBalance = {}

            const portalsRawBalances = await getPortalsBalances(account, chain.toString())
            const portalsBaseTokens = await getPortalsBaseTokens(chain.toString())
            const curNoBalances = portalsBaseTokens
              .map(baseToken => {
                const balToken = portalsRawBalances.find(
                  el => el.address.toLowerCase() === baseToken.address.toLowerCase(),
                )
                if (balToken === undefined) {
                  const item = {
                    symbol: baseToken.symbol,
                    address: baseToken.address,
                    balance: 0,
                    default: false,
                    usdValue: 0,
                    usdPrice: baseToken.price,
                    logoURI: baseToken.image
                      ? baseToken.image
                      : baseToken.images
                        ? baseToken.images[0]
                        : 'https://etherscan.io/images/main/empty-token.png',
                    decimals: baseToken.decimals,
                    chainId: chain,
                  }
                  return item
                }

                return null
              })
              .filter(item => item !== null)

            const curBalances = portalsRawBalances
              .map(rawBalance => {
                if (!isAddress(rawBalance.address))
                  rawBalance.address = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                const item = {
                  symbol: rawBalance.symbol,
                  address: rawBalance.address,
                  balance: new BigNumber(rawBalance.rawBalance)
                    .div(10 ** rawBalance.decimals)
                    .toFixed(),
                  rawBalance: rawBalance.rawBalance,
                  default: false,
                  usdValue: rawBalance.balanceUSD,
                  usdPrice: rawBalance.price,
                  logoURI: rawBalance.image
                    ? rawBalance.image
                    : rawBalance.images
                      ? rawBalance.images[0]
                      : 'https://etherscan.io/images/main/empty-token.png',
                  decimals: rawBalance.decimals,
                  chainId: chain,
                }
                return item
              })
              .filter(item => item.address)

            const tokenAddress =
              token.tokenAddress !== undefined && token.tokenAddress.length !== 2
                ? token.tokenAddress
                : token.vaultAddress

            const fTokenAddr = token.vaultAddress || token.tokenAddress
            const curSortedBalances = curBalances
              .sort(function reducer(a, b) {
                return b.usdValue - a.usdValue
              })
              .filter(item => item.address.toLowerCase() !== fTokenAddr.toLowerCase())

            setBalanceList(curSortedBalances)

            supList = [...curBalances, ...curNoBalances]

            supList = supList.map(sup => {
              const supToken = curBalances.find(el => el.address === sup.address)
              if (supToken) {
                sup.balance = supToken.balance
                sup.usdValue = supToken.usdValue
                sup.usdPrice = supToken.usdPrice
              } else {
                sup.balance = '0'
                sup.usdValue = '0'
              }
              sup.default = false

              if (Object.keys(directInSup).length === 0 && tokenAddress.length !== 2) {
                if (sup.address.toLowerCase() === tokenAddress.toLowerCase()) {
                  directInSup = sup
                }
              }
              return sup
            })

            supList = supList.sort(function reducer(a, b) {
              return b.usdValue - a.usdValue
            })
            const cl = curBalances.length
            for (let j = 0; j < cl; j += 1) {
              if (Object.keys(directInBalance).length === 0 && tokenAddress.length !== 2) {
                if (curBalances[j].address.toLowerCase() === tokenAddress.toLowerCase()) {
                  directInBalance = curBalances[j]
                }
              }
            }

            const directData = curBalances.find(
              el => el.address.toLowerCase() === tokenAddress.toLowerCase(),
            )
            const directBalance = directData
              ? directData.balance
              : balances[id]
                ? new BigNumber(balances[id]).div(10 ** token.decimals).toFixed()
                : '0'
            const directUsdPrice = id === 'FARM_GRAIN_LP' ? 0 : token.usdPrice
            const directUsdValue = directData
              ? directData.usdValue
              : new BigNumber(directBalance).times(directUsdPrice).toFixed()
            if (!(Object.keys(directInSup).length === 0 && directInSup.constructor === Object)) {
              directInSup.balance = directBalance
              directInSup.usdPrice =
                directInSup.usdPrice > 0 ? directInSup.usdPrice : directUsdPrice
              directInSup.usdValue =
                directInSup.usdValue > 0 ? directInSup.usdValue : directUsdValue
              supList = supList.sort(function result(x, y) {
                return x === directInSup ? -1 : y === directInSup ? 1 : 0
              })
              supList[0].default = true
            } else if (
              !(Object.keys(directInBalance).length === 0 && directInBalance.constructor === Object)
            ) {
              directInBalance.balance = directBalance || '0'
              directInBalance.usdPrice =
                directInBalance.usdPrice > 0 ? directInBalance.usdPrice : directUsdPrice
              directInBalance.usdValue =
                directInBalance.usdValue > 0 ? directInBalance.usdValue : directUsdValue
              supList.unshift(directInBalance)
              supList[0].default = true
            } else {
              const direct = {
                symbol: 'lpSymbol',
                address: tokenAddress,
                balance: directBalance || '0',
                default: true,
                usdPrice: directUsdPrice || '0',
                usdValue: directUsdValue || '0',
                logoURI: 'https://etherscan.io/images/main/empty-token.png',
                decimals: tokenDecimals,
                chainId: parseInt(chain, 0),
              }
              supList.unshift(direct)
            }

            if (supList[0].default) {
              if (supList[0].balance === '0' && balances[supList[0].symbol]) {
                const defaultBalance = fromWei(
                  balances[supList[0].symbol],
                  supList[0].decimals,
                  supList[0].decimals,
                )
                const defaultUsdBalance = formatNumber(
                  Number(supList[0].usdPrice) * Number(defaultBalance),
                  2,
                )
                supList[0].balance = defaultBalance
                supList[0].usdValue = defaultUsdBalance
              }
              setDefaultToken(supList[0])
            } else {
              setDefaultToken({})
            }
            setSupTokenList(supList)

            const supNoBalanceList = [],
              sl = supList.length
            if (sl > 0) {
              for (let i = 0; i < sl; i += 1) {
                if (Number(supList[i].balance) === 0) {
                  supNoBalanceList.push(supList[i])
                }
              }
            }
            supNoBalanceList.shift()
            setSupTokenNoBalanceList(supNoBalanceList)
          } else {
            let tokenSymbol,
              decimals = 18

            decimals = token.decimals
            tokenSymbol = id

            if (tokenSymbol && tokenSymbol.substring(0, 1) === 'f') {
              tokenSymbol = tokenSymbol.substring(1)
            }

            const tokenAddress = token.tokenAddress
            const tokenId = token?.pool?.id || id
            const tokenBalance = fromWei(balances[tokenId], decimals, decimals)
            const tokenPrice = token.usdPrice
            const usdValue = formatNumberWido(
              Number(tokenBalance) * Number(tokenPrice),
              USD_BALANCES_DECIMALS,
            )
            const logoURI =
              token.logoUrl.length === 1
                ? token.logoUrl[0].substring(1)
                : 'https://etherscan.io/images/main/empty-token.png'

            const defaultTokenData = {
              symbol: tokenSymbol,
              address: tokenAddress,
              balance: tokenBalance,
              default: true,
              usdValue,
              usdPrice: tokenPrice,
              logoURI,
              decimals,
              chainId: token.chain,
            }
            setDefaultToken(defaultTokenData)
          }
        }
      } catch (err) {
        console.log('getTokenBalance: ', err)
      }
      console.debug('convert status', convertSuccess)
    }
    getTokenBalance()
  }, [
    account,
    chain,
    balances,
    hasPortalsError,
    getPortalsBalances,
    getPortalsBaseTokens,
    id,
    token,
    tokenDecimals,
    convertSuccess,
  ])

  useEffect(() => {
    if (account && pickedToken) {
      if (checkNativeToken(pickedToken)) {
        setInputAmount(new BigNumber((Number(balance) * 0.95).toFixed(5)).toString())
      } else {
        setInputAmount(new BigNumber(balance).toString())
      }
    }
  }, [account, balance, pickedToken, setInputAmount])

  useEffect(() => {
    const fetch = async () => {
      if (supTokenNoBalanceList && balanceList && filterWord !== undefined && filterWord !== '') {
        const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/
        if (ethereumAddressRegex.test(filterWord)) {
          let TokenDetail = {},
            defaultTokenInvolve = false,
            balanceListInvolve = false
          try {
            TokenDetail = (await getPortalsToken(chain, filterWord)) || {}
          } catch (e) {
            TokenDetail = {}
          }
          if (Object.keys(TokenDetail).length !== 0) {
            TokenDetail = {
              ...TokenDetail,
              logoURI: TokenDetail.image,
              balance: 0,
              default: false,
              usdValue: 0,
              usdPrice: TokenDetail.price,
              chain,
            }
          }
          if (Object.keys(TokenDetail).length !== 0) {
            if (!(Object.keys(defaultToken).length === 0 && defaultToken.constructor === Object)) {
              if (defaultToken.symbol.includes(TokenDetail.symbol.toLowerCase().trim())) {
                defaultTokenInvolve = true
                setDefaultCurToken(defaultToken)
              } else {
                setDefaultCurToken(null)
              }
            }
            if (balanceList.length !== 0) {
              const newList = balanceList.filter(el =>
                el.symbol.toLowerCase().includes(TokenDetail.symbol.toLowerCase().trim()),
              )
              if (newList.length > 0) {
                balanceListInvolve = true
              }
              setBalanceTokenList(newList)
            }
            if (defaultCurToken === null) {
              const newList = balanceList.filter(el =>
                el.symbol.toLowerCase().includes(TokenDetail.symbol.toLowerCase().trim()),
              )
              if (newList.length === 0) {
                setSupTokenList([TokenDetail])
              } else {
                setSupTokenList([])
              }
            } else {
              setSupTokenList([])
            }
            if (supTokenNoBalanceList.length !== 0 && !defaultTokenInvolve && !balanceListInvolve) {
              const newList = supTokenNoBalanceList.filter(el =>
                el.symbol.toLowerCase().includes(TokenDetail.symbol.toLowerCase().trim()),
              )
              if (newList.length > 0) {
                setSupTokenList(newList)
              } else {
                setSupTokenList([TokenDetail])
              }
            }
          } else {
            setSupTokenList([])
            if (!(Object.keys(defaultToken).length === 0 && defaultToken.constructor === Object)) {
              setDefaultCurToken(null)
            }
            setBalanceTokenList([])
          }
        } else {
          if (supTokenNoBalanceList.length !== 0) {
            const newList = supTokenNoBalanceList.filter(el =>
              el.symbol.toLowerCase().includes(filterWord.toLowerCase().trim()),
            )
            setSupTokenList(newList)
          }
          if (
            defaultToken &&
            !(Object.keys(defaultToken).length === 0 && defaultToken.constructor === Object)
          ) {
            if (defaultToken.symbol.includes(filterWord.toLowerCase().trim())) {
              setDefaultCurToken(defaultToken)
            } else {
              setDefaultCurToken(null)
            }
          }
          if (balanceList.length !== 0) {
            const newList = balanceList.filter(el =>
              el.symbol.toLowerCase().includes(filterWord.toLowerCase().trim()),
            )
            setBalanceTokenList(newList)
          }
        }
      }
      if (filterWord === '') {
        setSupTokenList(supTokenNoBalanceList)
        setBalanceTokenList(balanceList)
        setDefaultCurToken(defaultToken)
      }
    }
    fetch()
  }, [supTokenNoBalanceList, balanceList, chain, defaultCurToken, defaultToken, getPortalsToken])

  useEffect(() => {
    if (filteredFarmList.length > 0 && positionAddress) {
      const matchingVault = filteredFarmList.find(item => {
        const compareAddress = item.token.poolVault
          ? item.token.tokenAddress
          : item.token.vaultAddress
        return compareAddress.toLowerCase() === positionAddress.toLowerCase()
      })

      if (matchingVault) {
        let staked, unstaked, total, hasStakeUnstake

        staked = matchingVault.stake

        unstaked = matchingVault.unstake

        total = unstaked
        hasStakeUnstake = staked

        const newAddress = matchingVault.token.vaultAddress
        const newSymbol = matchingVault.token.id || matchingVault.token.pool.id
        const newToken = {
          address: newAddress,
          balance: total,
          chain,
          decimals: Number(matchingVault.token.vaultDecimals || matchingVault.token.decimals),
          default: false,
          symbol: newSymbol,
          staked: Number(hasStakeUnstake),
        }

        if (newToken) {
          setPickedToken(newToken)
          setBalance(newToken.balance)
        }
      }
    }
  }, [balanceTokenList, positionAddress, setPickedToken, setBalance])

  return (
    <Modal
      show={showVaultModal}
      dialogClassName="migrate-modal-notification"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header className="migrate-position-modal-header">
        <FTokenInfo>
          <div className="modal-header-part">
            <NewLabel $margin="auto 16px auto 0px">
              <IconCard $bgcolor="#5dcf46">
                <BsArrowDown />
              </IconCard>
            </NewLabel>
            <NewLabel $align="left" $marginright="12px">
              <NewLabel
                $fontcolor="#5dcf46"
                $size={isMobile ? '18px' : '18px'}
                $height={isMobile ? '28px' : '28px'}
                $weight="600"
                $marginbottom="4px"
              >
                Choose new Strategy
              </NewLabel>
              <NewLabel
                $fontcolor={fontColor}
                $size={isMobile ? '14px' : '14px'}
                $height={isMobile ? '20px' : '20px'}
                $weight="400"
                $marginbottom="5px"
              >
                Pick a destination strategy
              </NewLabel>
            </NewLabel>
          </div>
          <NewLabel>
            <NewLabel
              $display="flex"
              $marginbottom={isMobile ? '18px' : '18px'}
              $width="fit-content"
              $cursortype="pointer"
              $weight="600"
              $size={isMobile ? '14px' : '14px'}
              $height={isMobile ? '20px ' : '20px'}
              $darkmode={darkMode}
              $fontcolor={inputFontColor}
              $align="center"
              onClick={() => {
                setShowVaultModal(false)
              }}
            >
              <ImgBtn src={CloseIcon} alt="" />
            </NewLabel>
          </NewLabel>
        </FTokenInfo>
      </Modal.Header>
      <Modal.Body className="migrate-position-modal-body">
        {countFarm === 0 ? (
          <NewLabel
            $fontcolor={fontColor}
            $size={isMobile ? '12px' : '12px'}
            $height={isMobile ? '20px' : '20px'}
            $weight="400"
            $padding="15px"
            $borderbottom={darkMode ? '1px solid #1F242F' : '1px solid #ECECEC'}
            $display="flex"
            $justifycontent="center"
          >
            Loading Strategy List
            <AnimatedDots />
          </NewLabel>
        ) : (
          <>
            <NewLabel
              $fontcolor={fontColor}
              $size={isMobile ? '12px' : '12px'}
              $height={isMobile ? '20px' : '20px'}
              $weight="400"
              $padding="15px"
              $borderbottom={darkMode ? '1px solid #1F242F' : '1px solid #ECECEC'}
            >
              {`25+ Opportunities found on ${formatNetworkName(networkName)}`}
            </NewLabel>
            {positions}
            {isLoadingMore && newPositions}
            {matchingList.length > 0 && (
              <VaultBox
                $borderbottom={darkMode ? '1px solid #1F242F' : '1px solid #ECECEC'}
                $hoverbgcolor={darkMode ? '#1F242F' : '#e9f0f7'}
                $fontcolor={darkMode ? '#ffffff' : '#414141'}
                onClick={() => {
                  setIsLoadingMore(true)
                  fetchMoreMatches()
                }}
              >
                {!isEnd ? 'Display more results' : 'All results are loaded'}
                {!startSpinner ? (
                  <></>
                ) : (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </VaultBox>
            )}
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default VaultModal
