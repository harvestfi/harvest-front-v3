import { useHistory, useLocation } from 'react-router-dom'
import { useWindowWidth } from '@react-hook/window-size'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import AllChains from '../../assets/images/chains/all_chain.svg'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import MobileFiltersIcon from '../../assets/images/chains/mobilefiltersicon.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import AssetTypeMobile from '../../assets/images/logos/filter/assettype-mobile.svg'
import DropDownNarrow from '../../assets/images/logos/filter/dropdown-narrow.svg'
import FarmTypeMobile from '../../assets/images/logos/filter/farmtype-mobile.svg'
import Beginner from '../../assets/images/logos/filter/risks/beginner.svg'
import Degen from '../../assets/images/logos/filter/risks/degens.svg'
import Camelot from '../../assets/images/logos/camelot/camelot_black.svg'
import UsdIcon from '../../assets/images/ui/usd.svg'
import TokensIcon from '../../assets/images/ui/tokens.svg'
import CollaborationBack from '../../assets/images/logos/filter/collaborationback.svg'
import TrendsBack from '../../assets/images/logos/filter/trendsback.svg'
import SpecNarrowDown from '../../assets/images/logos/filter/spec-narrowdown.svg'
import DesciBack from '../../assets/images/logos/filter/desciback.svg'
import LSDBack from '../../assets/images/logos/filter/lsdback.svg'
import { CHAIN_IDS } from '../../data/constants'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { isLedgerLive, isSpecialApp } from '../../utils'
import ButtonGroup from '../ButtonGroup'
import MobileButtonGroup from '../MobileButtonGroup'
import SearchBar from '../SearchBar'
import {
  BadgeText,
  ChainButton,
  ClearFilter,
  Counter,
  DivWidth,
  FarmButtonPart,
  FarmFilter,
  FarmFiltersPart,
  FilterOffCanvas,
  FilterOffCanvasBody,
  FilterOffCanvasHeader,
  MobileClearFilter,
  MobileListHeaderSearch,
  MobileView,
  QuickFilterContainer,
  UserDropDown,
  UserDropDownItem,
  UserDropDownMenu,
  WebView,
  SpecDropDown,
  SpecDropDownMenu,
  SpecDropDownItem,
  ChainGroup,
  SwitchBalanceButton,
} from './style'

const ChainsList = isLedgerLive()
  ? [
      { id: 0, name: 'Ethereum', img: ETHEREUM, chainId: CHAIN_IDS.ETH_MAINNET },
      { id: 1, name: 'Polygon', img: POLYGON, chainId: CHAIN_IDS.POLYGON_MAINNET },
    ]
  : [
      { id: 0, name: 'Ethereum', img: ETHEREUM, chainId: CHAIN_IDS.ETH_MAINNET },
      { id: 1, name: 'Polygon', img: POLYGON, chainId: CHAIN_IDS.POLYGON_MAINNET },
      { id: 2, name: 'Arbitrum', img: ARBITRUM, chainId: CHAIN_IDS.ARBITRUM_ONE },
    ]

const SwitchBalanceList = [
  { id: 0, img: UsdIcon },
  { id: 1, img: TokensIcon },
]

const TrendsList = [
  { id: 0, name: 'LSD', backImg: LSDBack },
  { id: 1, name: 'DeSci', backImg: DesciBack },
]

const MobileChainsList = isLedgerLive()
  ? [
      { id: 0, name: 'All Chains', img: AllChains, chainId: '' },
      { id: 1, name: 'Ethereum', img: ETHEREUM, chainId: CHAIN_IDS.ETH_MAINNET },
      { id: 2, name: 'Polygon', img: POLYGON, chainId: CHAIN_IDS.POLYGON_MAINNET },
    ]
  : [
      { id: 0, name: 'All Chains', img: AllChains, chainId: '' },
      { id: 1, name: 'Ethereum', img: ETHEREUM, chainId: CHAIN_IDS.ETH_MAINNET },
      { id: 2, name: 'Polygon', img: POLYGON, chainId: CHAIN_IDS.POLYGON_MAINNET },
      { id: 3, name: 'Arbitrum', img: ARBITRUM, chainId: CHAIN_IDS.ARBITRUM_ONE },
    ]

const FarmsList = [
  { id: 1, name: 'All Farms', filter: 'allfarm' },
  { id: 2, name: 'My Farms', filter: 'myfarm' },
  { id: 3, name: 'Inactive', filter: 'inactive' },
]

const RiskList = [
  { id: 1, name: 'Beginners', filter: 'beginners' },
  { id: 2, name: 'Advanced', filter: 'advanced' },
]

const MobileRiskList = [
  { id: 1, name: 'Beginners', img: Beginner, filter: 'beginners' },
  { id: 2, name: 'Advanced', img: Degen, filter: 'advanced' },
  { id: 3, name: 'Camelot', img: Camelot },
]

const AssetsList = [
  { id: 1, name: 'LP', filter: 'lptokens' },
  { id: 2, name: 'Single', filter: 'singlestakes' },
  { id: 3, name: 'Stable', filter: 'stablecoins' },
]

const QuickFilter = ({
  onSelectActiveType = () => {},
  setSearchQuery,
  onDepositedOnlyClick = () => {},
  onAssetClick = () => {},
  onSelectStableCoin = () => {},
  onSelectFarmType = () => {},
}) => {
  // Search string is null, it will be false, otherwise true.
  const [stringSearch, setStringSearch] = useState(false)

  const [flag, setFlag] = useState(false)

  useEffect(() => {
    onSelectActiveType(['Active'])
    setFlag(true)
  }, [flag, onSelectActiveType])

  const { pathname } = useLocation()
  const { push } = useHistory()

  const [paramObj, setParamObj] = useState({})

  const updateSearchQuery = event => {
    event.persist()

    const debouncedFn = debounce(() => {
      const searchString = event.target.value
      setSearchQuery(searchString)
      setStringSearch(searchString.length > 0)
      if (searchString !== '') {
        const updateValue = { search: searchString }
        setParamObj(newParamObj => ({
          ...newParamObj,
          ...updateValue,
        }))
      } else {
        const newObj = { ...paramObj }
        delete newObj.search
        setParamObj(() => ({
          ...newObj,
        }))
      }
    }, 300)

    if (event.key === 'Enter') {
      debouncedFn()
    }
  }

  const onClickSearch = text => {
    const searchString = text
    setSearchQuery(searchString)
    setStringSearch(searchString.length > 0)
    if (searchString !== '') {
      const updateValue = { search: searchString }
      setParamObj(newParamObj => ({
        ...newParamObj,
        ...updateValue,
      }))
    } else {
      const newObj = { ...paramObj }
      delete newObj.search
      setParamObj(() => ({
        ...newObj,
      }))
    }
  }

  const printFarm = id => {
    let text = []
    switch (id) {
      case 2:
        text = ['Inactive']
        break
      case 1:
        onDepositedOnlyClick(true)
        break
      case 0:
        text = ['Active']
        onDepositedOnlyClick(false)
        break
      default:
        text = ['Active']
        break
    }
    const updateValue = { farm: FarmsList[id].filter }
    setParamObj(newParamObj => ({
      ...newParamObj,
      ...updateValue,
    }))
    onSelectActiveType(text)
  }

  const printAsset = id => {
    let text = '',
      stable = ''
    switch (id) {
      case 0:
        text = 'LP Token'
        break
      case 1:
        text = 'Single Asset'
        break
      case 2:
        text = ''
        stable = 'Stable'
        break
      default:
        break
    }
    const updateValue = { asset: AssetsList[id].filter }
    setParamObj(newParamObj => ({
      ...newParamObj,
      ...updateValue,
    }))
    onAssetClick(text)
    onSelectStableCoin(stable)
  }

  const printRisk = id => {
    let text = ''
    switch (id) {
      case 0:
        text = 'Beginners'
        break
      case 1:
        text = 'Advanced'
        break
      default:
        break
    }
    const updateValue = { risk: RiskList[id].filter }
    setParamObj(newParamObj => ({
      ...newParamObj,
      ...updateValue,
    }))
    onSelectFarmType(text)
  }

  const [filterCount, setFilterCount] = useState(0)
  const [mobileFilterCount, setMobileFilterCount] = useState(0)

  const [riskId, setRiskId] = useState(-1) // for risk id
  const [riskImg, setRiskImg] = useState(FarmTypeMobile) // for risk img
  const [assetsId, setAssetsId] = useState(-1) // for asset id
  const [assetsImg, setAssetsImg] = useState(AssetTypeMobile) // for asset img
  const [farmId, setFarmId] = useState(-1) // for chain

  const [mobileChainName, setMobileChainId] = useState('All Chains') // for mobilechain
  const [mobileChainImg, setMobileChainImg] = useState(AllChains) // for mobilechain

  const { selChain, setSelChain, chainId } = useWallet()
  // for Chain
  const curChain = []
  if (selChain.includes(CHAIN_IDS.ETH_MAINNET)) {
    curChain.push(0)
  }
  if (selChain.includes(CHAIN_IDS.POLYGON_MAINNET)) {
    curChain.push(1)
  }
  if (selChain.includes(CHAIN_IDS.ARBITRUM_ONE)) {
    curChain.push(2)
  }

  const [selectedClass, setSelectedClass] = useState(curChain)

  const selectedClasses = []

  useEffect(() => {
    const setUrlData = () => {
      const chains = [],
        chainIds = []
      const params = new URLSearchParams(window.location.search)
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of params.entries()) {
        if (key === 'risk') {
          for (let j = 0; j < RiskList.length; j += 1) {
            if (RiskList[j].filter === value) {
              printRisk(j)
              setRiskId(j)
              break
            }
          }
        } else if (key === 'asset') {
          for (let i = 0; i < AssetsList.length; i += 1) {
            if (AssetsList[i].filter === value) {
              printAsset(i)
              setAssetsId(i)
              break
            }
          }
        } else if (key === 'farm') {
          for (let k = 0; k < FarmsList.length; k += 1) {
            if (FarmsList[k].filter === value) {
              printFarm(k)
              setFarmId(k)
              break
            }
          }
        } else if (key === 'search') {
          document.getElementById('search-input').value = value
          setSearchQuery(value)
          const updateValue = { search: value }
          setParamObj(newParamObj => ({
            ...newParamObj,
            ...updateValue,
          }))
          setStringSearch(true)
        } else if (key === 'chain') {
          for (let i = 0; i < ChainsList.length; i += 1) {
            if (ChainsList[i].name.toLowerCase() === value.toString()) {
              chains.push(ChainsList[i].chainId)
              chainIds.push(ChainsList[i].id)
              break
            }
          }
        }
      }
      if (chains.length !== 0) {
        setSelectedClass(chainIds)
        setSelChain(chains)
      }
    }

    setUrlData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const params = new URLSearchParams(paramObj)

    if (selectedClass.length !== 0 && selectedClass.length !== ChainsList.length) {
      if (isSpecialApp) params.append('chain', chainId)
      else {
        for (let i = 0; i < selectedClass.length; i += 1) {
          params.append('chain', ChainsList[selectedClass[i]].name.toLowerCase())
        }
      }
    }
    push(`${pathname}?${params.toString()}`)
  }, [selectedClass, paramObj]) // eslint-disable-line react-hooks/exhaustive-deps

  const clearFilter = () => {
    setParamObj({})
    push(pathname)
  }

  useEffect(() => {
    let count =
      (riskId >= 0 ? 1 : 0) +
      (assetsId >= 0 ? 1 : 0) +
      (farmId >= 0 ? 1 : 0) +
      (selectedClass.length === 0 || selectedClass.length === ChainsList.length
        ? 0
        : selectedClass.length) +
      // (platform !== 'All Platform' ? 1 : 0) +
      (stringSearch ? 1 : 0)
    setFilterCount(count >= 0 ? count : 0)

    count =
      (riskId !== -1 ? 1 : 0) +
      (assetsId !== -1 ? 1 : 0) +
      (farmId >= 0 ? 1 : 0) +
      (mobileChainName !== 'All Chains' ? 1 : 0) +
      (stringSearch ? 1 : 0)
    setMobileFilterCount(count >= 0 ? count : 0)
  }, [riskId, assetsId, farmId, selectedClass, mobileChainName, stringSearch])

  // When clicked 'filter' button, show filter panel
  const [filterShow, setFilterShow] = useState(false)

  const handleFilterClose = () => setFilterShow(false)
  const handleFilterShow = () => setFilterShow(true)

  // get window width
  const onlyWidth = useWindowWidth()
  // set window mode - pc or mobile
  const [windowMode, setWindowMode] = useState(true)

  useEffect(() => {
    // pc - true, mobile - false
    if (onlyWidth >= 992) {
      setWindowMode(true)
    } else {
      setWindowMode(false)
    }
  }, [onlyWidth])

  const {
    backColor,
    borderColor,
    fontColor,
    filterColor,
    filterChainHoverColor,
    mobileFilterDisableColor,
    mobileFilterHoverColor,
    switchBalance,
    setSwitchBalance,
    hoverImgColor,
  } = useThemeContext()

  const [clickBalanceId, setClickBalanceId] = useState(1)
  const handleClickSwitch = (event, id) => {
    setClickBalanceId(id)
    setSwitchBalance(!switchBalance)
  }

  const [collaborationName, setCollaborationName] = useState('Collaboration')
  const [trendName, setTrendName] = useState('Trends')

  return (
    <div>
      {windowMode ? (
        <WebView>
          <QuickFilterContainer>
            <DivWidth className="chain" width="100%" marginBottom="15px" backColor={backColor}>
              <DivWidth
                className="chain"
                background="none"
                width="100%"
                display="flex"
                justifyContent="start"
                backColor={backColor}
              >
                {isSpecialApp ? (
                  <></>
                ) : (
                  <ChainGroup borderColor={borderColor}>
                    {ChainsList.map((item, i) => (
                      <ChainButton
                        backColor={backColor}
                        hoverColor={filterChainHoverColor}
                        borderColor={borderColor}
                        className={`${selectedClass.includes(i) ? 'active' : ''}`}
                        data-tip
                        data-for={`chain-${item.name}`}
                        key={i}
                        onClick={() => {
                          let tempIds = []
                          if (selectedClass.length !== ChainsList.length) {
                            tempIds = [...selectedClass]
                          }

                          if (!tempIds.includes(i)) {
                            tempIds.push(i)
                          } else {
                            for (let el = 0; el < tempIds.length; el += 1) {
                              if (tempIds[el] === i) {
                                tempIds.splice(el, 1)
                              }
                            }
                          }

                          if (tempIds.length === 0 || tempIds.length === ChainsList.length) {
                            tempIds = isLedgerLive() ? [0, 1] : [0, 1, 2]
                            setSelectedClass(tempIds)
                          } else {
                            setSelectedClass(tempIds)
                          }
                          tempIds.map(tempId => {
                            return selectedClasses.push(ChainsList[tempId].name)
                          })
                          const tempChains = []
                          for (let j = 0; j < tempIds.length; j += 1) {
                            tempChains.push(ChainsList[tempIds[j]].chainId)
                          }
                          setSelChain(tempChains)
                          if (farmId !== -1) {
                            printFarm(farmId)
                          }
                        }}
                      >
                        <img src={item.img} alt="" />
                      </ChainButton>
                    ))}
                  </ChainGroup>
                )}
              </DivWidth>
            </DivWidth>
            <DivWidth borderRadius="10">
              <ButtonGroup
                buttons={FarmsList}
                doSomethingAfterClick={printFarm}
                clickedId={farmId}
                setClickedId={setFarmId}
              />
            </DivWidth>
          </QuickFilterContainer>
          <QuickFilterContainer position="relative" justifyContent="space-between">
            <DivWidth className="first" borderRadius="10" display="flex">
              <SearchBar
                placeholder="Assets, platforms..."
                onKeyDown={updateSearchQuery}
                onSearch={onClickSearch}
              />
              <DivWidth marginRight="15px" height="fit-content">
                <Dropdown>
                  <SpecDropDown
                    id="dropdown-basic"
                    backcolor={CollaborationBack}
                    bordercolor={borderColor}
                    filtercolor={filterColor}
                    fontcolor={fontColor}
                  >
                    <div className="chain-name">{collaborationName}</div>
                    <img className="narrow" src={SpecNarrowDown} alt="" />
                  </SpecDropDown>

                  {isSpecialApp ? (
                    <></>
                  ) : (
                    <SpecDropDownMenu>
                      {TrendsList.map((item, i) => (
                        <SpecDropDownItem
                          key={i}
                          className={i === 0 ? 'first' : i === TrendsList.length - 1 ? 'last' : ''}
                          backimg={item.backImg}
                          onClick={() => {
                            setCollaborationName(item.name)
                          }}
                        >
                          <div>{item.name}</div>
                        </SpecDropDownItem>
                      ))}
                    </SpecDropDownMenu>
                  )}
                </Dropdown>
              </DivWidth>
              <DivWidth marginRight="15px" height="fit-content">
                <Dropdown>
                  <SpecDropDown
                    id="dropdown-basic"
                    backcolor={TrendsBack}
                    bordercolor={borderColor}
                    filtercolor={filterColor}
                    fontcolor={fontColor}
                  >
                    <div className="chain-name">{trendName}</div>
                    <img className="narrow" src={SpecNarrowDown} alt="" />
                  </SpecDropDown>

                  {isSpecialApp ? (
                    <></>
                  ) : (
                    <SpecDropDownMenu>
                      {TrendsList.map((item, i) => (
                        <SpecDropDownItem
                          key={i}
                          className={i === 0 ? 'first' : i === TrendsList.length - 1 ? 'last' : ''}
                          backimg={item.backImg}
                          onClick={() => {
                            setTrendName(item.name)
                          }}
                        >
                          <div>{item.name}</div>
                        </SpecDropDownItem>
                      ))}
                    </SpecDropDownMenu>
                  )}
                </Dropdown>
              </DivWidth>
              <DivWidth borderRadius="10" marginRight="15px" backColor={backColor}>
                <ButtonGroup
                  buttons={RiskList}
                  doSomethingAfterClick={printRisk}
                  clickedId={riskId}
                  setClickedId={setRiskId}
                />
              </DivWidth>
              <DivWidth borderRadius="10" marginRight="15px" backColor={backColor}>
                <ButtonGroup
                  buttons={AssetsList}
                  doSomethingAfterClick={printAsset}
                  clickedId={assetsId}
                  setClickedId={setAssetsId}
                />
              </DivWidth>
            </DivWidth>

            <QuickFilterContainer sub justifyContent="space-between">
              <DivWidth right="0" marginRight="15px" borderRadius="10" backColor={backColor}>
                <ClearFilter
                  fontColor={fontColor}
                  backColor={backColor}
                  borderColor={borderColor}
                  onClick={() => {
                    document.getElementById('search-input').value = ''
                    setSearchQuery('')
                    onSelectActiveType(['Active'])
                    setStringSearch(false)
                    setRiskId(-1)
                    setAssetsId(-1)
                    setFarmId(-1)
                    setSelectedClass(isLedgerLive() ? [0, 1] : [0, 1, 2])
                    onSelectStableCoin(false)
                    onAssetClick('')
                    onSelectFarmType('')
                    setSelChain([
                      CHAIN_IDS.ETH_MAINNET,
                      CHAIN_IDS.POLYGON_MAINNET,
                      CHAIN_IDS.ARBITRUM_ONE,
                    ])
                    clearFilter()
                  }}
                >
                  <Counter count={filterCount}>{filterCount > 0 ? filterCount : ''}</Counter>&nbsp;
                  {onlyWidth > 1600 ? 'Clear Filters' : 'Clear'}
                </ClearFilter>
              </DivWidth>
              <DivWidth borderRadius="10" backColor={backColor}>
                <ChainGroup borderColor={borderColor}>
                  {SwitchBalanceList.map((item, num) => (
                    <SwitchBalanceButton
                      key={num}
                      backColor={backColor}
                      borderColor={borderColor}
                      filterColor={hoverImgColor}
                      className={clickBalanceId === num ? 'active' : ''}
                      onClick={event => handleClickSwitch(event, num)}
                    >
                      <img src={item.img} alt="" />
                    </SwitchBalanceButton>
                  ))}
                </ChainGroup>
              </DivWidth>
            </QuickFilterContainer>
          </QuickFilterContainer>
        </WebView>
      ) : (
        <MobileView>
          <FarmButtonPart>
            <Dropdown>
              <UserDropDown
                id="dropdown-basic"
                backcolor={backColor}
                bordercolor={borderColor}
                filtercolor={filterColor}
                fontcolor={fontColor}
              >
                <img width={12} height={12} src={mobileChainImg} alt="" />
                <div className="chain-name">{mobileChainName}</div>
                <img className="narrow" src={DropDownNarrow} alt="" />
              </UserDropDown>

              {isSpecialApp ? (
                <></>
              ) : (
                <UserDropDownMenu>
                  {MobileChainsList.map((item, i) => (
                    <UserDropDownItem
                      key={i}
                      onClick={() => {
                        setMobileChainId(item.name)
                        setMobileChainImg(item.img)
                        if (item.name === 'All Chains') {
                          onSelectActiveType([])
                        } else {
                          setSelChain([item.chainId])
                        }
                      }}
                    >
                      <img src={item.img} width="12" height="12" alt="" />
                      <div>{item.name}</div>
                    </UserDropDownItem>
                  ))}
                </UserDropDownMenu>
              )}
            </Dropdown>
          </FarmButtonPart>

          <FarmButtonPart>
            <MobileButtonGroup
              buttons={FarmsList}
              doSomethingAfterClick={printFarm}
              clickedId={farmId}
              setClickedId={setFarmId}
            />
          </FarmButtonPart>

          <FarmFiltersPart
            backColor={backColor}
            fontColor={fontColor}
            borderColor={borderColor}
            filterColor={filterColor}
          >
            <div className="filter-part">
              <button
                type="button"
                placeholder="Filters"
                onClick={() => {
                  handleFilterShow()
                }}
              >
                <img src={MobileFiltersIcon} alt="" />
                Filters
              </button>
            </div>

            <FilterOffCanvas
              show={filterShow}
              onHide={handleFilterClose}
              placement="end"
              backcolor={backColor}
            >
              <FilterOffCanvasHeader closeButton>
                <FarmFilter fontColor={fontColor}>Farm Filters</FarmFilter>
              </FilterOffCanvasHeader>
              <FilterOffCanvasBody
                className="filter-show"
                filtercolor={filterColor}
                backcolor={backColor}
                fontcolor={fontColor}
                bordercolor={borderColor}
                hovercolor={mobileFilterHoverColor}
                mobilefilterdisablecolor={mobileFilterDisableColor}
              >
                <Dropdown className="asset-type">
                  <Dropdown.Toggle className="toggle">
                    <div>
                      <img width={12} height={12} src={assetsImg} alt="" />
                    </div>
                    <div>{assetsId === -1 ? 'Asset Type' : AssetsList[assetsId].name}</div>
                    <img className="narrow" src={DropDownNarrow} alt="" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="menu">
                    {AssetsList.map((item, i) => (
                      <Dropdown.Item
                        className="item"
                        key={i}
                        onClick={() => {
                          setAssetsId(i)
                          setAssetsImg(item.img)
                          printAsset(i)
                        }}
                      >
                        <div>
                          <img src={item.img} width="12" height="12" alt="" />
                        </div>
                        <div>{item.name}</div>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                <Dropdown className="risk-type">
                  <Dropdown.Toggle className="toggle">
                    <div>
                      <img width={12} height={12} src={riskImg} alt="" />
                    </div>
                    <div>{riskId === -1 ? 'Farm Type' : RiskList[riskId].name}</div>
                    <img className="narrow" src={DropDownNarrow} alt="" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="menu">
                    {MobileRiskList.map((item, i) => (
                      <Dropdown.Item
                        className="item"
                        key={i}
                        disabled={item.name === 'Labs'}
                        onClick={() => {
                          if (item.name === 'Camelot') {
                            push('/camelot')
                          } else {
                            setRiskId(i)
                            setRiskImg(item.img)
                            printRisk(i)
                          }
                        }}
                      >
                        <div>
                          <img src={item.img} width="12" height="12" alt="" />
                        </div>
                        <div>{item.name}</div>
                        {item.name === 'Labs' ? (
                          <BadgeText mobilefilterdisablecolor={mobileFilterDisableColor}>
                            Soon TM
                          </BadgeText>
                        ) : (
                          <></>
                        )}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </FilterOffCanvasBody>
            </FilterOffCanvas>

            <div className="clear-filter">
              <MobileClearFilter
                onClick={() => {
                  document.getElementById('search-input').value = ''
                  setSearchQuery('')
                  setStringSearch(false)
                  onSelectActiveType(['Active'])
                  onSelectStableCoin(false)
                  onAssetClick('')
                  onSelectFarmType('')
                  onDepositedOnlyClick(false)
                  setAssetsId(-1)
                  setRiskId(-1)
                  setFarmId(-1)
                  setMobileChainId('All Chains')
                  setMobileChainImg(AllChains)
                  setMobileFilterCount(0)
                  setSelectedClass(isLedgerLive() ? [0, 1] : [0, 1, 2])
                  setSelChain([
                    CHAIN_IDS.ETH_MAINNET,
                    CHAIN_IDS.POLYGON_MAINNET,
                    CHAIN_IDS.ARBITRUM_ONE,
                  ])
                  clearFilter()
                }}
                borderColor={borderColor}
                fontColor={fontColor}
              >
                <Counter count={mobileFilterCount}>
                  {mobileFilterCount > 0 ? mobileFilterCount : ''}
                </Counter>
                &nbsp; Clear All Filters
              </MobileClearFilter>
            </div>
          </FarmFiltersPart>
          <MobileListHeaderSearch>
            <SearchBar
              placeholder="Assets, platforms..."
              onKeyDown={updateSearchQuery}
              onSearch={onClickSearch}
            />
          </MobileListHeaderSearch>
        </MobileView>
      )}
    </div>
  )
}

export default QuickFilter
