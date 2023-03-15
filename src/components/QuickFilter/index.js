import React, { useState, useEffect } from 'react'
import { debounce } from 'lodash'
import { Dropdown } from 'react-bootstrap'
import { useWindowWidth } from '@react-hook/window-size'
import { useWallet } from '../../providers/Wallet'
import { CHAINS_ID, VAULT_CATEGORIES_IDS } from '../../data/constants'
import {
  QuickFilterContainer, InputsContainer, UserDropDown, UserDropDownItem, UserDropDownMenu, DivWidth, ClearFilter,
  ChainButton, Counter, WebView, MobileView, FarmButtonPart, FarmFiltersPart, MobileClearFilter,
  MobileListHeaderSearch, FarmFilter, FilterOffCanvas, FilterOffCanvasHeader, FilterOffCanvasBody, ChainATag, BadgeText
} from './style'
import SearchBar from '../SearchBar'
import ButtonGroup from '../ButtonGroup'
import { useThemeContext } from '../../providers/useThemeContext'
import MobileButtonGroup from '../MobileButtonGroup'
import Beginner from '../../assets/images/logos/filter/risks/beginner.svg'
import Degen from '../../assets/images/logos/filter/risks/degens.svg'
import RadioActive from '../../assets/images/logos/filter/risks/radioactive.svg'
import Stable from '../../assets/images/logos/filter/assets/stablecoin.svg'
import LPTokens from '../../assets/images/logos/filter/assets/lptokens.svg'
import SingleStakes from '../../assets/images/logos/filter/assets/singlestakes.svg'
import All from '../../assets/images/logos/filter/farms/all.svg'
import My from '../../assets/images/logos/filter/farms/my.svg'
import Moon from '../../assets/images/logos/filter/farms/moon.svg'
import POLYGON from '../../assets/images/chains/polygon.svg'
import ETHEREUM from '../../assets/images/chains/ethereum.svg'
import BNB from '../../assets/images/chains/bnb.svg'
import ARBITRUM from '../../assets/images/chains/arbitrum.svg'
import AllChains from '../../assets/images/chains/all_chain.svg'
import MobileFiltersIcon from '../../assets/images/chains/mobilefiltersicon.svg'
import FarmTypeMobile from '../../assets/images/logos/filter/farmtype-mobile.svg'
import DropDownNarrow from '../../assets/images/logos/filter/dropdown-narrow.svg'
import AssetTypeMobile from '../../assets/images/logos/filter/assettype-mobile.svg'
import ExternalLink from '../../assets/images/logos/filter/external_link.svg'

const ChainsList = [
  { id: 0, name: "Ethereum", img: ETHEREUM, chainId: CHAINS_ID.ETH_MAINNET},
  { id: 1, name: "Polygon", img: POLYGON, chainId: CHAINS_ID.MATIC_MAINNET},
  { id: 2, name: "BNB", img: BNB, chainId: CHAINS_ID.BSC_MAINNET},
  // { id: 3, name: "Arbitrum", img: ARBITRUM, chainId: '42161'},
]

const MobileChainsList = [
  { id: 0, name: "All Chains", img: AllChains, chainId: ''},
  { id: 1, name: "Ethereum", img: ETHEREUM, chainId: CHAINS_ID.ETH_MAINNET},
  { id: 2, name: "Polygon", img: POLYGON, chainId: CHAINS_ID.MATIC_MAINNET},
  { id: 3, name: "BNB", img: BNB, chainId: CHAINS_ID.BSC_MAINNET},
  { id: 4, name: "Arbitrum", img: ARBITRUM, chainId: '42161'},
]

const FarmsList = [
  { id: 1, name: "All Farms", img: All},
  { id: 2, name: "My Farms", img: My},
  { id: 3, name: "Inactive", img: Moon},
]

const RiskList = [
  { id: 1, name: "Beginners", img: Beginner},
  { id: 2, name: "Advanced", img: Degen},
  { id: 3, name: "Labs", img: RadioActive},
]

const AssetsList = [
  { id: 1, name: "LP Tokens", img: LPTokens},
  { id: 2, name: "Single Stakes", img: SingleStakes},
  { id: 3, name: "Stablecoins", img: Stable},
]

const QuickFilter = ({
  onCategoryClick = () => {},
  selectedCategory,
  setSearchQuery,
  onDepositedOnlyClick = () => {},
  onAssetClick = () => {},
  onSelectStableCoin = () => {},
  onSelectFarmType = () => {},
}) => {

  // Search string is null, it will be false, otherwise true.
  const [stringSearch, setStringSearch] = useState(false)

  const clearQuery = () => {
    document.getElementById("search-input").value = ''
    setSearchQuery('')
    setStringSearch(false)
  }

  const updateSearchQuery = event => {
    event.persist()

    const debouncedFn = debounce(() => {
      const searchString = event.target.value
      setSearchQuery(searchString)
      setStringSearch(searchString.length > 0 ? true : false)
    }, 300)

    debouncedFn()
  }

  const printFarm = (id) => {
    let text = []
    switch(id) {
      case 2:
        text = [VAULT_CATEGORIES_IDS.INACTIVE]
        break
      case 1:
        // text = ["Deposited"]
        onDepositedOnlyClick(true)
        break
      case 0:
        text = ["Active"]
        onDepositedOnlyClick(false)
        break
      default:
        text = ["Active"]
        break
    }

    onCategoryClick(text)
  }

  const [flag, setFlag] = useState(false)

  useEffect(()=>{
    onCategoryClick(["Active"])
    setFlag(true)
  }, [flag, onCategoryClick])

  const printAsset = (id) => {
    let text = "", stable = false
    switch(id) {
      case 0: 
        text = "LP Token"
        break
      case 1:
        text = "Single Asset"
        break
      case 2:
        text = ""
        stable = true
        break
      default:
        break
    }
    onAssetClick(text)
    onSelectStableCoin(stable)
  }

  const printRisk = (id) => {
    let text = ""
    switch(id) {
      case 0: 
        text = "Beginners"
        break
      case 1:
        text = "Advanced"
        break
      default:
        break
    }
    onSelectFarmType(text)
  }

  const [filterCount, setFilterCount] = useState(0)
  const [mobileFilterCount, setMobileFilterCount] = useState(0)

  const [riskId, setRiskId] = useState(-1)  // for risk id
  const [riskImg, setRiskImg] = useState(FarmTypeMobile)  // for risk img
  const [assetsId, setAssetsId] = useState(-1)  // for asset id
  const [assetsImg, setAssetsImg] = useState(AssetTypeMobile)  // for asset img
  const [farmId, setFarmId] = useState(-1)  // for chain

  const [mobileChainName, setMobileChainId] = useState('All Chains')  // for mobilechain
  const [mobileChainImg, setMobileChainImg] = useState(AllChains)  // for mobilechain

  const { selChain, setSelChain } = useWallet()
  // for Chain
  let curChain = []
  if(selChain.includes(CHAINS_ID.ETH_MAINNET)) {
    curChain.push(0)
  }
  if(selChain.includes(CHAINS_ID.MATIC_MAINNET)) {
    curChain.push(1)
  }
  if(selChain.includes(CHAINS_ID.BSC_MAINNET)) {
    curChain.push(2)
  }
  // if(chain.includes('42161')) {  //arbitrum
  //   curChain.push(3)
  // }
  const [selectedClass, setSelectedClass] = useState(curChain)
  
  let selectedClasses = []
  
  useEffect(()=>{
    let count = (riskId >= 0 ? 1 : 0) + (assetsId >= 0 ? 1 : 0) + (farmId >= 0 ? 1 : 0) + 
        ((selectedClass.length ===0 || selectedClass.length === ChainsList.length) ? 0 : selectedClass.length) + 
        // (platform !== 'All Platform' ? 1 : 0) + 
        (stringSearch ? 1 : 0)
    setFilterCount(count >= 0 ? count : 0)

    count = (riskId !== -1 ? 1 : 0) + 
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
  //set window mode - pc or mobile
  const [windowMode, setWindowMode] = useState(true)

  useEffect(()=>{
    // pc - true, mobile - false
    onlyWidth >= 992 ? setWindowMode(true) : setWindowMode(false)
  }, [onlyWidth])

  const { backColor, borderColor, fontColor, filterColor, filterChainHoverColor, mobileFilterDisableColor } = useThemeContext()

  return (
    <div>
      {
        windowMode ? 
          <WebView>
            <QuickFilterContainer>
              <DivWidth className="chain" width={"100%"} marginBottom={"15px"} backColor={backColor}>
                  <DivWidth className="chain" background={"none"} width={"100%"} display={"flex"} padding={"2px 0 0 0"} justifyContent={"start"} backColor={backColor}>
                    <>
                    {
                      ChainsList.map((item, i) => (
                        <ChainButton backColor={backColor} hoverColor={filterChainHoverColor} borderColor={borderColor} className={`${selectedClass.includes(i) ? 'active' : ''}`} data-tip data-for={`chain-${item.name}`} key={i} onClick={()=>{
                          let tempIds = []
                          if(selectedClass.length !== ChainsList.length) {
                            tempIds = [...selectedClass]
                          }

                          if(!tempIds.includes(i)) {
                            tempIds.push(i)
                          }
                          else {
                            for(var el = 0; el < tempIds.length; el++) {
                              if(tempIds[el] === i) {
                                tempIds.splice(el, 1)
                              }
                            }
                          }
                          
                          if(tempIds.length === 0 || tempIds.length === ChainsList.length) {
                            setSelectedClass([0, 1, 2])
                            tempIds = [0, 1, 2]
                          }
                          else {
                            setSelectedClass(tempIds)
                          }
                          tempIds.map(item=>{
                            return (selectedClasses.push(ChainsList[item].name))
                          })
                          let tempChains = []
                          for (let i = 0; i < tempIds.length; i++) {
                            tempChains.push(ChainsList[tempIds[i]].chainId)
                          }
                          setSelChain(tempChains)
                          printFarm(farmId)
                        }}>
                          <img src={item.img} width={25} height={25} alt="" />
                        </ChainButton>
                      ))
                    }
                      <ChainATag filterColor={filterColor} hoverColor={filterChainHoverColor} backColor={backColor} borderColor={borderColor} className={'active'} data-tip data-for={`chain-arbitrum`} 
                        href="https://harvest.dolomite.io/" target="_blank">
                        <img src={ARBITRUM} width={25} height={25} alt="" />
                        <img className="link" src={ExternalLink} width={11} height={11} alt="" />
                      </ChainATag>
                    </>
                  </DivWidth>
                </DivWidth>
              <DivWidth borderRadius="10" backColor={backColor}>
                <ButtonGroup
                  buttons={FarmsList}
                  doSomethingAfterClick={printFarm}
                  clickedId= { farmId }
                  setClickedId = { setFarmId }
                />
              </DivWidth>
            </QuickFilterContainer>
            <QuickFilterContainer position={"relative"} justifyContent={"space-between"}>
              <DivWidth className="first" borderRadius="10" backColor={backColor}>
                <ButtonGroup
                  buttons={RiskList}
                  doSomethingAfterClick={printRisk}
                  clickedId={riskId}
                  setClickedId={setRiskId}
                />
              </DivWidth>

              <QuickFilterContainer sub justifyContent={"space-between"}>
                <DivWidth borderRadius="10" marginBottom={"15px"} marginRight={"20px"} backColor={backColor}>
                  <ButtonGroup
                    buttons={AssetsList}
                    doSomethingAfterClick={printAsset}
                    clickedId= { assetsId }
                    setClickedId = { setAssetsId }
                  />
                </DivWidth>
              
                <DivWidth right={"0"} borderRadius={"10"} backColor={backColor}>
                  <ClearFilter fontColor={fontColor} backColor={backColor} borderColor={borderColor} onClick={()=>{
                    document.getElementById("search-input").value = ''
                    setSearchQuery('')
                    onCategoryClick(['Active'])
                    setStringSearch(false)
                    setRiskId(-1)
                    setAssetsId(-1)
                    setFarmId(-1)
                    setSelectedClass([0, 1, 2])
                    onSelectStableCoin(false)
                    onAssetClick("")
                    onSelectFarmType("")
                    setSelChain([CHAINS_ID.ETH_MAINNET, CHAINS_ID.MATIC_MAINNET, CHAINS_ID.BSC_MAINNET])
                  }}>
                    <Counter count={filterCount}>{filterCount > 0 ? filterCount : ''}</Counter>&nbsp;
                    Clear Filters
                  </ClearFilter> 
                </DivWidth>
              </QuickFilterContainer>
              <DivWidth className="searchbar" backColor={backColor}>
                <InputsContainer>
                  <SearchBar placeholder="Search assets" onChange={updateSearchQuery} onClose={clearQuery}/>
                </InputsContainer>
              </DivWidth>
            </QuickFilterContainer>
          </WebView>
        : 
          <MobileView>
            <FarmButtonPart>
              <Dropdown>
                <UserDropDown id="dropdown-basic" backcolor={backColor} bordercolor={borderColor} filtercolor={filterColor} fontcolor={fontColor}>
                  <img width={12} height={12} src={mobileChainImg} alt="" />
                  <div className="chain-name">{mobileChainName}</div>
                  <img className="narrow" src={DropDownNarrow} alt="" />
                </UserDropDown>

                <UserDropDownMenu>
                  {
                    MobileChainsList.map((item, i) => (
                      <UserDropDownItem key={i} onClick={() => {
                        setMobileChainId(item.name)
                        setMobileChainImg(item.img)
                        item.name === 'All Chains' ? onCategoryClick([]) : setSelChain([item.chainId])
                      }}>
                        <img src={item.img} width={"12"} height={"12"} alt="" />
                        <div>{item.name}</div>
                        </UserDropDownItem>
                    ))
                  }
                </UserDropDownMenu>
              </Dropdown>
            </FarmButtonPart>

            <FarmButtonPart>
              <MobileButtonGroup
                buttons={FarmsList}
                doSomethingAfterClick={printFarm}
                clickedId= { farmId }
                setClickedId = { setFarmId }
              />
            </FarmButtonPart>

            <FarmFiltersPart backColor={backColor} fontColor={fontColor} borderColor={borderColor} filterColor={filterColor}>
              <div className='filter-part'>
                <button type="button" placeholder='Filters' onClick={()=>{ handleFilterShow() }}>
                  <img src={MobileFiltersIcon} alt="" />Filters
                </button>
              </div>

              <FilterOffCanvas show={filterShow} onHide={handleFilterClose} placement="end" backColor={backColor}>
                <FilterOffCanvasHeader closeButton>
                  <FarmFilter fontColor={fontColor}>
                    Farm Filters
                  </FarmFilter>
                </FilterOffCanvasHeader>
                <FilterOffCanvasBody className="filter-show" filterColor={filterColor} backColor={backColor} 
                  fontColor={fontColor} borderColor={borderColor} mobileFilterDisableColor={mobileFilterDisableColor}>
                  <Dropdown className="asset-type">
                    <Dropdown.Toggle className="toggle">
                      <div><img width={12} height={12} src={assetsImg} alt="" /></div>
                      <div>{assetsId === -1 ? 'Asset Type' : assetsId}</div>
                      <img className="narrow" src={DropDownNarrow} alt="" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="menu">
                      {
                        AssetsList.map((item, i) => (
                          <Dropdown.Item className="item" key={i} onClick={() => {
                            setAssetsId(item.name)
                            setAssetsImg(item.img)
                            item.name === 'All Chains' ? onCategoryClick([]) : onCategoryClick([item.name])
                          }}>
                            <div><img src={item.img} width={"12"} height={"12"} alt="" /></div>
                            <div>{item.name}</div>
                          </Dropdown.Item>
                        ))
                      }
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown className="risk-type">
                    <Dropdown.Toggle className="toggle">
                      <div><img width={12} height={12} src={riskImg} alt="" /></div>
                      <div>{riskId === -1 ? 'Farm Type' : riskId}</div>
                      <img className="narrow" src={DropDownNarrow} alt="" />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="menu">
                      {
                        RiskList.map((item, i) => (
                          <Dropdown.Item className="item" key={i} disabled={item.name === 'Labs' ? true : false} onClick={() => {
                            setRiskId(item.name)
                            setRiskImg(item.img)
                            item.name === 'All Chains' ? onCategoryClick([]) : onCategoryClick([item.name])
                          }}>
                            <div><img src={item.img} width={"12"} height={"12"} alt="" /></div>
                            <div>{item.name}</div>
                            {
                              item.name === 'Labs' ? 
                              <BadgeText mobileFilterDisableColor={mobileFilterDisableColor}>Soon TM</BadgeText>
                              : <></>
                            }
                          </Dropdown.Item>
                        ))
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                </FilterOffCanvasBody>
              </FilterOffCanvas>

              <div className='clear-filter'>
                <MobileClearFilter onClick={()=>{
                  document.getElementById("search-input").value = ''
                  setSearchQuery('')
                  setStringSearch(false)
                  onCategoryClick(['active'])
                  onSelectStableCoin(false)
                  onAssetClick("")
                  onSelectFarmType("")
                  onDepositedOnlyClick(false)
                  setAssetsId(-1)
                  setRiskId(-1)
                  setFarmId(-1)
                  setMobileChainId('All Chains')
                  setMobileChainImg(AllChains)
                  setMobileFilterCount(0)
                  setSelectedClass([0, 1, 2])
                }} borderColor={borderColor} fontColor={fontColor}>
                  <Counter count={mobileFilterCount}>{mobileFilterCount > 0 ? mobileFilterCount : ''}</Counter>&nbsp;
                  Clear All Filters
                </MobileClearFilter> 
              </div>
            </FarmFiltersPart>
            <MobileListHeaderSearch>
              <SearchBar placeholder="Search assets" onChange={updateSearchQuery} onClose={clearQuery}/>
            </MobileListHeaderSearch>
          </MobileView>
      }
    </div>
  )
}

export default QuickFilter
