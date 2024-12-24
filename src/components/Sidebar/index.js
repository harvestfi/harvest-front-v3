import React, { Fragment, useEffect, useState } from 'react'
import { Dropdown, Offcanvas } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import { PiSunDimFill, PiMoonBold } from 'react-icons/pi'
import { IoCloseCircleOutline, IoCheckmark } from 'react-icons/io5'
import { SlArrowDown } from 'react-icons/sl'
import ConnectSuccessIcon from '../../assets/images/logos/sidebar/connect-success.svg'
import ConnectFailureIcon from '../../assets/images/logos/sidebar/connect-failure.svg'
import connectAvatar from '../../assets/images/logos/sidebar/ellipse.svg'
import connectAvatarMobile from '../../assets/images/logos/sidebar/connectavatarmobile.svg'
import Docs from '../../assets/images/logos/sidebar/file-search.svg'
import FAQ from '../../assets/images/logos/sidebar/faq.svg'
import ActiveWhiteMobileBottomHome from '../../assets/images/logos/sidebar/active-white-home.svg'
import ActiveWhiteMobileBottomAdvanced from '../../assets/images/logos/sidebar/active-white-farms.svg'
import Home from '../../assets/images/logos/sidebar/bar-chart-square.svg'
import Diamond from '../../assets/images/logos/sidebar/diamond.svg'
import Activity from '../../assets/images/logos/sidebar/layout.svg'
import Settings from '../../assets/images/logos/sidebar/settings.svg'
import Support from '../../assets/images/logos/sidebar/discord-side.svg'
import Analytics from '../../assets/images/logos/sidebar/pie-chart.svg'
import BlackLeader from '../../assets/images/logos/sidebar/leader_icon_black.svg'
import BlackMigrate from '../../assets/images/logos/sidebar/Migrate_black.svg'
import Advanced from '../../assets/images/logos/sidebar/advanced.svg'
import logoNew from '../../assets/images/logos/sidebar/ifarm.svg'
import logoNewDark from '../../assets/images/logos/sidebar/ifarm_dark.svg'
import LogoutIcon from '../../assets/images/logos/sidebar/logout.svg'
import Wallet from '../../assets/images/logos/sidebar/wallet.svg'
import WalletOff from '../../assets/images/logos/sidebar/wallet_off.svg'
import WalletActive from '../../assets/images/logos/sidebar/wallet_active.svg'
import WalletInactive from '../../assets/images/logos/sidebar/wallet_inactive.svg'
import Toggle from '../../assets/images/logos/sidebar/dots-grid.svg'
// import DocsMobile from '../../assets/images/logos/sidebar/docs-mobile.svg'
import { ROUTES, supportedCurrencies } from '../../constants'
import { CHAIN_IDS } from '../../data/constants'
import DropDownIcon from '../../assets/images/logos/advancedfarm/drop-down.svg'
import { usePools } from '../../providers/Pools'
import { useRate } from '../../providers/Rate'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { fromWei } from '../../services/web3'
import {
  getChainIcon,
  totalHistoryDataKey,
  totalNetProfitKey,
  vaultProfitDataKey,
} from '../../utilities/parsers'
import { formatAddress, isLedgerLive, isSpecialApp } from '../../utilities/formats'
import Social from '../Social'
import CopyIcon from '../../assets/images/logos/sidebar/copy.svg'
import WhiteCopyIcon from '../../assets/images/logos/sidebar/white-copy.svg'
import WhiteOnOff from '../../assets/images/logos/sidebar/white-on-off.svg'
import OnOff from '../../assets/images/logos/sidebar/on-off.svg'
import {
  Address,
  ConnectAvatar,
  ConnectButtonStyle,
  Container,
  FlexDiv,
  Layout,
  Link,
  LinkContainer,
  LinksContainer,
  MobileFollow,
  MiddleActionsContainer,
  MobileActionsContainer,
  MobileWalletTop,
  MobileWalletTopNet,
  MobileWalletBody,
  MobileAmount,
  MobileAmountDiv,
  MobileWalletBtn,
  MobileWalletButton,
  MobileConnectBtn,
  MobileLinkContainer,
  MobileToggle,
  MobileView,
  OffcanvasDiv,
  SideIcons,
  ThemeMode,
  UserDropDown,
  UserDropDownItem,
  UserDropDownMenu,
  BottomPart,
  Logo,
  Desktop,
  NewTag,
  LinkMobile,
  MobileMenuContainer,
  Mobile,
  ConnectSection,
  MoreBtn,
  CurrencyDiv,
  LinkName,
  MobileMoreTop,
  CategoryRow,
} from './style'
import {
  HeaderButton,
  CurrencyDropDown,
  CurrencySelect,
  CurrencyDropDownMenu,
  CurrencyDropDownItem,
} from '../../pages/Portfolio/style'

const sideLinksTop = [
  {
    path: ROUTES.PORTFOLIO,
    name: 'Portfolio',
    imgPath: Home,
  },
  {
    category: true,
    name: 'Products',
  },
  {
    path: ROUTES.AUTOPILOT,
    name: 'Autopilot',
    imgPath: Diamond,
    new: true,
  },
  {
    path: ROUTES.ADVANCED,
    name: 'All Vaults',
    imgPath: Advanced,
  },
  {
    category: true,
    name: 'User',
  },
  {
    path: ROUTES.Activity,
    name: 'Activity',
    imgPath: Activity,
    // enabled: false,
  },
  {
    path: ROUTES.Settings,
    name: 'Settings',
    imgPath: Settings,
  },
]

const sideLinksBottom = [
  {
    category: true,
    name: 'Tools',
  },
  {
    path: ROUTES.MIGRATE,
    name: 'Migrate',
    imgPath: BlackMigrate,
    external: false,
  },
  {
    path: ROUTES.ANALYTIC,
    name: 'Analytics',
    imgPath: Analytics,
    external: false,
  },
  {
    path: ROUTES.LEADERBOARD,
    name: 'Leaderboard',
    imgPath: BlackLeader,
    external: false,
  },
  {
    category: true,
    name: 'Support',
  },
  // {
  //   path: ROUTES.TUTORIAL,
  //   name: 'Tutorial',
  //   imgPath: FAQ,
  //   external: false,
  //   newTab: true,
  // },
  {
    path: ROUTES.DOC,
    name: 'Docs',
    imgPath: Docs,
    external: false,
    newTab: true,
  },
  {
    path: ROUTES.LiveSupport,
    name: 'Open Ticket',
    imgPath: Support,
    external: true,
    newTab: true,
  },
]

const sideLinksMobile = [
  {
    path: ROUTES.PORTFOLIO,
    name: 'Portfolio',
    imgPath: ActiveWhiteMobileBottomHome,
    linkName: 'Portfolio',
  },
  {
    path: ROUTES.ADVANCED,
    name: 'All Vaults',
    imgPath: ActiveWhiteMobileBottomAdvanced,
    isFarms: true,
    linkName: 'Farms',
  },
]

const sideLinksMobileBottom = [
  {
    path: ROUTES.PORTFOLIO,
    name: 'Portfolio',
    imgPath: Home,
  },
  {
    path: ROUTES.ADVANCED,
    name: 'All Vaults',
    imgPath: Advanced,
  },
  {
    path: ROUTES.MIGRATE,
    name: 'Migrate',
    imgPath: BlackMigrate,
    external: false,
  },
  {
    path: ROUTES.LEADERBOARD,
    name: 'Leaderboard',
    imgPath: BlackLeader,
    external: false,
  },
  {
    path: ROUTES.ANALYTIC,
    name: 'Analytics',
    imgPath: Analytics,
  },
  {
    path: ROUTES.TUTORIAL,
    name: 'Tutorial',
    imgPath: FAQ,
    newTab: true,
  },
  {
    path: ROUTES.LiveSupport,
    name: 'Support',
    imgPath: Support,
    external: true,
    newTab: true,
  },
  // {
  //   path: ROUTES.DOC,
  //   name: 'Docs',
  //   imgPath: DocsMobile,
  //   newTab: true,
  // },
]

const SideLink = ({
  item,
  subItem,
  isDropdownLink,
  fontColor1,
  activeIconColor,
  darkMode,
  hoverColorSide,
}) => {
  const { pathname } = useLocation()
  const pageName =
    pathname === '/'
      ? 'all vaults'
      : pathname === ROUTES.PORTFOLIO
      ? 'portfolio'
      : pathname === ROUTES.TUTORIAL
      ? 'tutorial'
      : pathname === ROUTES.MIGRATE
      ? 'migrate'
      : pathname
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <Link
      fontColor1={fontColor1}
      active={pageName.includes(item.name.toLowerCase().trim())}
      subItem={subItem}
      isDropdownLink={isDropdownLink}
      activeIconColor={activeIconColor}
      darkMode={darkMode}
      enabled={item.enabled === false ? 'false' : 'true'}
      hoverColorSide={hoverColorSide}
    >
      <div className="item">
        <SideIcons
          className="sideIcon"
          src={item.imgPath}
          alt="Harvest"
          width="25px"
          height="25px"
        />
      </div>
      <div className="item-name">{item.name}</div>
      {item.new ? <NewTag>New</NewTag> : <></>}
    </Link>
  )
}

const MobileMenu = ({
  item,
  subItem,
  isDropdownLink,
  fontColor,
  filterColor,
  activeIconColor,
  darkMode,
  isWallet,
  isMobile,
}) => {
  const { pathname } = useLocation()
  const pageName =
    pathname === '/' ? 'all vaults' : pathname === ROUTES.PORTFOLIO ? 'portfolio' : pathname
  const active = !isWallet && pageName.includes(item.name.toLowerCase())
  const farmsFilter = active
    ? 'invert(75%) sepia(89%) saturate(343%) hue-rotate(52deg) brightness(89%) contrast(86%)'
    : filterColor
  return (
    <LinkMobile
      fontColor={fontColor}
      active={!isWallet && pageName.includes(item.name.toLowerCase())}
      subItem={subItem}
      isDropdownLink={isDropdownLink}
      activeIconColor={activeIconColor}
      darkMode={darkMode}
      enabled={item.enabled === false ? 'false' : 'true'}
      isMobile={isMobile}
      farmsFilter={farmsFilter}
    >
      <SideIcons
        className="sideIcon"
        src={item.imgPath}
        alt="Harvest"
        width={item.name === 'Portfolio' ? '18px' : '22px'}
        height={item.name === 'Portfolio' ? '18px' : '22px'}
        marginTop={item.name === 'All Vaults' ? '-1px' : ''}
      />
      <LinkName
        color={active ? '#6ED459' : darkMode ? '#fff' : '#7A7A7A'}
        marginTop={item.name === 'Portfolio' ? '5px' : ' 2px'}
      >
        {item.linkName}
      </LinkName>
      {item.new ? <NewTag>New</NewTag> : <></>}
    </LinkMobile>
  )
}

const Sidebar = ({ width }) => {
  const {
    darkMode,
    setDarkMode,
    backColor,
    bgColorNew,
    fontColor,
    fontColor1,
    fontColor2,
    filterColor,
    filterColorBottom,
    fontColor5,
    fontColor7,
    inputBorderColor,
    hoverImgColor,
    toggleColor,
    borderColor,
    borderColorBox,
    hoverColor,
    hoverColorButton,
    hoverColorSide,
    toggleBackColor,
    sidebarFontColor,
    sidebarActiveFontColor,
    sidebarActiveIconColor,
    hoverColorNew,
  } = useThemeContext()

  const {
    account,
    connectAction,
    disconnectAction,
    chainId,
    connected,
    setSelChain,
    balances,
    getWalletBalances,
  } = useWallet()

  const { disableWallet } = usePools()

  const switchTheme = () => setDarkMode(prev => !prev)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('darkMode', '')
    } else {
      document.documentElement.removeAttribute('darkMode', '')
    }
  }, [darkMode])

  const { pathname } = useLocation()
  const { push } = useHistory()

  // Show sidebar for mobile
  const [mobileShow, setMobileShow] = useState(false)
  const [mobileWalletShow, setMobileWalletShow] = useState(false)
  const [mobileConnectShow, setMobileConnectShow] = useState(false)
  const [copyAddress, setCopyAddress] = useState('Copy Address')
  const [balanceETH, setBalanceETH] = useState('')
  const [balanceUSDC, setBalanceUSDC] = useState('')
  const { rates, updateCurrency } = useRate()
  const [curCurrency, setCurCurrency] = useState(supportedCurrencies[0])

  const handleMobileClose = () => setMobileShow(false)
  const handleMobileShow = () => setMobileShow(true)
  const handleMobileWalletClose = () => setMobileWalletShow(false)
  const handleMobileWalletShow = () => setMobileWalletShow(true)
  const handleMobileConnectClose = () => setMobileConnectShow(false)
  const handleMobileConnectShow = () => setMobileConnectShow(true)
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(account).then(() => {
      setCopyAddress('Copied Address')

      setTimeout(() => {
        setCopyAddress('Copy Address')
      }, 1500)
    })
  }

  const beforeAccount = localStorage.getItem('address')

  useEffect(() => {
    if (!connected) {
      localStorage.setItem(totalNetProfitKey, '0')
      localStorage.setItem(vaultProfitDataKey, JSON.stringify([]))
      localStorage.setItem(totalHistoryDataKey, JSON.stringify([]))
    }

    if (beforeAccount === null && account !== null) {
      localStorage.setItem('address', account)
    }

    if (beforeAccount !== null && account !== null && beforeAccount !== account) {
      localStorage.setItem('address', account)
      localStorage.setItem(totalNetProfitKey, '0')
      localStorage.setItem(vaultProfitDataKey, JSON.stringify([]))
      localStorage.setItem(totalHistoryDataKey, JSON.stringify([]))
      window.location.reload()
    }
  }, [connected, account, beforeAccount])

  useEffect(() => {
    setCurCurrency(supportedCurrencies[rates.currency.id])
  }, [rates])

  const handleMobileWalletDetailShow = async () => {
    const showBalanceTokens =
      chainId === CHAIN_IDS.BASE
        ? ['WETH_base', 'USDC_base']
        : chainId === CHAIN_IDS.POLYGON_MAINNET
        ? ['WETH_polygon', 'USDC_polygon']
        : chainId === CHAIN_IDS.ARBITRUM_ONE
        ? ['WETH_arbitrum', 'USDC_arbitrum']
        : chainId === CHAIN_IDS.ZKSYNC
        ? ['WETH_zksync', 'USDC_zksync']
        : ['WETH', 'USDC']
    handleMobileWalletShow()
    await getWalletBalances(showBalanceTokens, false, true)
  }

  useEffect(() => {
    const ethBalance = fromWei(
      chainId === CHAIN_IDS.BASE
        ? balances.WETH_base
        : chainId === CHAIN_IDS.POLYGON_MAINNET
        ? balances.WETH_polygon
        : chainId === CHAIN_IDS.ARBITRUM_ONE
        ? balances.WETH_arbitrum
        : chainId === CHAIN_IDS.ZKSYNC
        ? balances.WETH_zksync
        : balances.WETH,
      18,
    )
    const usdcBalance = fromWei(
      chainId === CHAIN_IDS.BASE
        ? balances.USDC_base
        : chainId === CHAIN_IDS.POLYGON_MAINNET
        ? balances.USDC_polygon
        : chainId === CHAIN_IDS.ARBITRUM_ONE
        ? balances.USDC_arbitrum
        : chainId === CHAIN_IDS.ZKSYNC
        ? balances.USDC_zksync
        : balances.USDC,
      6,
    )
    setBalanceETH(ethBalance)
    setBalanceUSDC(usdcBalance)
  }, [balances, chainId])

  const directAction = path => {
    if (path === ROUTES.PORTFOLIO || path === ROUTES.ANALYTIC) {
      setSelChain([
        CHAIN_IDS.ETH_MAINNET,
        CHAIN_IDS.POLYGON_MAINNET,
        CHAIN_IDS.ARBITRUM_ONE,
        CHAIN_IDS.BASE,
        CHAIN_IDS.ZKSYNC,
      ])
    }
    push(path)
  }

  return (
    <Container
      width={width}
      darkMode={darkMode}
      backColor={bgColorNew}
      borderColor={borderColorBox}
      fontColor={fontColor}
    >
      <Desktop>
        <Layout>
          <MiddleActionsContainer>
            <LinksContainer fontColor={fontColor2}>
              <Logo
                className="logo"
                onClick={() => {
                  push('/')
                }}
              >
                <img src={darkMode ? logoNewDark : logoNew} width={36} height={36} alt="Harvest" />
              </Logo>

              {(() => {
                if (!connected) {
                  return (
                    <ConnectButtonStyle
                      color="connectwallet"
                      onClick={() => {
                        connectAction()
                      }}
                      minWidth="190px"
                      inputBorderColor={inputBorderColor}
                      bordercolor={fontColor}
                      disabled={disableWallet}
                      hoverColor={hoverColorButton}
                    >
                      Connect
                    </ConnectButtonStyle>
                  )
                }

                if (!chainId) {
                  return (
                    <button onClick={disconnectAction} type="button">
                      Wrong network
                    </button>
                  )
                }
                return (
                  <Dropdown>
                    <UserDropDown
                      id="dropdown-basic"
                      backColor={toggleBackColor}
                      fontcolor2={fontColor2}
                      hovercolor={hoverColor}
                    >
                      <FlexDiv>
                        <ConnectAvatar avatar>
                          <img src={connectAvatar} alt="" />
                        </ConnectAvatar>
                        <div className="detail-info">
                          <img
                            alt="chain icon"
                            src={getChainIcon(chainId)}
                            className="chain-icon"
                          />
                          <Address>{formatAddress(account)}</Address>
                        </div>
                      </FlexDiv>
                      <div>
                        <SlArrowDown />
                      </div>
                    </UserDropDown>
                    {!isSpecialApp ? (
                      <UserDropDownMenu backcolor={bgColorNew} bordercolor={borderColorBox}>
                        <UserDropDownItem
                          onClick={() => {
                            disconnectAction()
                          }}
                          fontcolor={fontColor}
                          filtercolor={filterColor}
                        >
                          <img src={LogoutIcon} width="18px" height="18px" alt="" />
                          <div>Log Out</div>
                        </UserDropDownItem>
                      </UserDropDownMenu>
                    ) : (
                      <></>
                    )}
                  </Dropdown>
                )
              })()}

              {sideLinksTop.map(item =>
                !isLedgerLive() ||
                (isLedgerLive() && (chainId === CHAIN_IDS.BASE || chainId !== CHAIN_IDS.BASE)) ? (
                  item.category === true ? (
                    <CategoryRow color={fontColor7}>{item.name}</CategoryRow>
                  ) : (
                    <Fragment key={item.name}>
                      <LinkContainer
                        active={pathname.includes(item.path)}
                        activeColor={item.activeColor}
                        hoverImgColor={hoverImgColor}
                        onClick={() => {
                          if (item.newTab) {
                            window.open(item.path, '_blank')
                          } else if (item.enabled !== false) {
                            directAction(item.path)
                          }
                        }}
                        darkMode={darkMode}
                      >
                        <SideLink
                          item={item}
                          isDropdownLink={item.path === '#'}
                          fontColor1={fontColor1}
                          activeIconColor={sidebarActiveIconColor}
                          darkMode={darkMode}
                          hoverColorSide={hoverColorSide}
                        />
                      </LinkContainer>
                    </Fragment>
                  )
                ) : (
                  <></>
                ),
              )}
            </LinksContainer>
          </MiddleActionsContainer>
        </Layout>

        <BottomPart>
          <LinksContainer>
            {sideLinksBottom.map(item =>
              item.category === true ? (
                <CategoryRow color={fontColor7}>{item.name}</CategoryRow>
              ) : (
                <Fragment key={item.name}>
                  <LinkContainer
                    active={pathname.includes(item.path)}
                    hoverImgColor={hoverImgColor}
                    onClick={() => {
                      if (item.newTab) {
                        window.open(item.path, '_blank')
                      } else {
                        directAction(item.path)
                      }
                    }}
                  >
                    <SideLink
                      item={item}
                      isDropdownLink={item.path === '#'}
                      fontColor1={fontColor1}
                      activeFontColor={sidebarActiveFontColor}
                      activeIconColor={sidebarActiveIconColor}
                      darkMode={darkMode}
                      hoverColorSide={hoverColorSide}
                    />
                  </LinkContainer>
                </Fragment>
              ),
            )}
          </LinksContainer>
          <CurrencyDiv>
            <MobileFollow>
              <Social />
            </MobileFollow>
            <ThemeMode
              mode={darkMode ? 'dark' : 'light'}
              backColor={toggleBackColor}
              borderColor={borderColor}
              color={fontColor5}
            >
              <div id="theme-switch">
                <div className="switch-track">
                  <div className="switch-thumb">{darkMode ? <PiMoonBold /> : <PiSunDimFill />}</div>
                  <div className="switch-icon">{darkMode ? <PiSunDimFill /> : <PiMoonBold />}</div>
                </div>

                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={switchTheme}
                  aria-label="Switch between dark and light mode"
                />
              </div>
            </ThemeMode>
          </CurrencyDiv>
        </BottomPart>
      </Desktop>
      <Mobile>
        <MobileView borderColor={borderColorBox}>
          {/* Full Menu */}
          <OffcanvasDiv
            show={mobileShow}
            onHide={handleMobileClose}
            placement="bottom"
            fontcolor={fontColor}
            filtercolor={filterColor}
          >
            <Offcanvas.Body>
              <MobileActionsContainer
                className="full-menu-container"
                bgColor={bgColorNew}
                borderColor={borderColorBox}
              >
                <Logo
                  color={fontColor5}
                  className="logo"
                  onClick={() => {
                    handleMobileClose()
                  }}
                >
                  <MobileMoreTop>
                    {connected ? (
                      <>
                        <img
                          className="chainIcon"
                          alt="chain icon"
                          src={getChainIcon(chainId)}
                          style={{ width: 21, height: 21 }}
                        />
                        <img
                          className="chainStatus"
                          alt="Chain icon"
                          src={ConnectSuccessIcon}
                          style={{ width: 6, height: 6, marginLeft: '10px' }}
                        />
                        <Address color={darkMode ? '#ffffff' : '#000000'}>
                          {formatAddress(account)}
                        </Address>
                        <MobileWalletButton
                          fontColor5={fontColor5}
                          backColor={bgColorNew}
                          borderColor={borderColorBox}
                          onClick={handleCopyAddress}
                          marginLeft="10px"
                        >
                          <img
                            className="chainIcon"
                            alt="chain icon"
                            src={darkMode ? WhiteCopyIcon : CopyIcon}
                            style={{ width: 18, height: 18 }}
                          />
                        </MobileWalletButton>
                        <MobileWalletButton
                          fontColor5={fontColor5}
                          backColor={bgColorNew}
                          borderColor={borderColorBox}
                          onClick={() => {
                            disconnectAction()
                            handleMobileWalletClose()
                          }}
                          marginLeft="15px"
                        >
                          <img
                            className="chainIcon"
                            alt="chain icon"
                            src={darkMode ? WhiteOnOff : OnOff}
                            style={{ width: 18, height: 18 }}
                          />
                        </MobileWalletButton>
                      </>
                    ) : (
                      <>
                        <img
                          className="chainStatus"
                          alt="Chain icon"
                          src={ConnectFailureIcon}
                          style={{ width: 6, height: 6 }}
                        />
                        <ConnectButtonStyle
                          color="connectwallet"
                          onClick={() => {
                            connectAction()
                          }}
                          minWidth="190px"
                          inputBorderColor={inputBorderColor}
                          bordercolor={fontColor}
                          disabled={disableWallet}
                          hoverColor={hoverColorButton}
                        >
                          Connect Wallet
                        </ConnectButtonStyle>
                      </>
                    )}
                  </MobileMoreTop>
                  <IoCloseCircleOutline className="close" />
                </Logo>
                {sideLinksMobileBottom.map(item => (
                  <Fragment key={item.name}>
                    <MobileLinkContainer
                      active={pathname.includes(item.path)}
                      activeColor={item.activeColor}
                      hoverImgColor={hoverImgColor}
                      onClick={() => {
                        if (item.newTab) {
                          window.open(item.path, '_blank')
                        } else if (item.enabled !== false) {
                          directAction(item.path)
                          handleMobileClose()
                        }
                      }}
                    >
                      <SideLink
                        item={item}
                        isDropdownLink={item.path === '#'}
                        fontColor1={fontColor1}
                        activeFontColor={sidebarActiveFontColor}
                        activeIconColor={sidebarActiveIconColor}
                        darkMode={darkMode}
                        hoverColorSide={hoverColorSide}
                      />
                    </MobileLinkContainer>
                    {item.subItems ? (
                      <LinkContainer hideOnDesktop>
                        {item.subItems.map(subItem => (
                          <SideLink
                            key={subItem.name}
                            item={subItem}
                            fontColor1={fontColor1}
                            activeFontColor={sidebarActiveFontColor}
                            activeIconColor={sidebarActiveIconColor}
                            darkMode={darkMode}
                            hoverColorSide={hoverColorSide}
                          />
                        ))}
                      </LinkContainer>
                    ) : null}
                  </Fragment>
                ))}
                <MobileFollow>
                  <Social />
                  <ThemeMode
                    mode={darkMode ? 'dark' : 'light'}
                    backColor={toggleBackColor}
                    borderColor={borderColorBox}
                  >
                    <div id="theme-switch">
                      <div className="switch-track">
                        <div className="switch-thumb">
                          {darkMode ? <PiMoonBold /> : <PiSunDimFill />}
                        </div>
                        <div className="switch-icon">
                          {darkMode ? <PiSunDimFill /> : <PiMoonBold />}
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={switchTheme}
                        aria-label="Switch between dark and light mode"
                      />
                    </div>
                  </ThemeMode>
                  <HeaderButton>
                    <Dropdown>
                      <CurrencyDropDown
                        id="dropdown-basic"
                        bgcolor={bgColorNew}
                        fontcolor2={fontColor2}
                        hovercolor={hoverColorNew}
                        style={{ padding: 0 }}
                      >
                        {curCurrency ? (
                          <CurrencySelect
                            backColor={backColor}
                            fontcolor2={fontColor2}
                            hovercolor={hoverColor}
                          >
                            <img
                              className={darkMode ? 'logo-dark' : 'logo'}
                              src={curCurrency.imgPath}
                              width={16}
                              height={16}
                              alt=""
                            />
                            <span>{curCurrency.symbol}</span>
                            <img className="dropdown-icon" src={DropDownIcon} alt="" />
                          </CurrencySelect>
                        ) : (
                          <></>
                        )}
                      </CurrencyDropDown>
                      {!isSpecialApp ? (
                        <CurrencyDropDownMenu backcolor={bgColorNew}>
                          {supportedCurrencies.map(elem => {
                            return (
                              <CurrencyDropDownItem
                                onClick={() => {
                                  updateCurrency(elem.id)
                                }}
                                fontcolor={fontColor}
                                filtercolor={filterColor}
                                hovercolor={hoverColorNew}
                                key={elem.id}
                              >
                                <img
                                  className={darkMode ? 'logo-dark' : 'logo'}
                                  src={elem.imgPath}
                                  width={14}
                                  height={14}
                                  alt=""
                                />
                                <span>{elem.symbol}</span>
                                {curCurrency.id === elem.id ? (
                                  <IoCheckmark className="check-icon" />
                                ) : (
                                  <></>
                                )}
                              </CurrencyDropDownItem>
                            )
                          })}
                        </CurrencyDropDownMenu>
                      ) : (
                        <></>
                      )}
                    </Dropdown>
                  </HeaderButton>
                </MobileFollow>
              </MobileActionsContainer>
            </Offcanvas.Body>
          </OffcanvasDiv>
          {/* Wallet Connect */}
          <OffcanvasDiv
            show={mobileConnectShow}
            onHide={handleMobileConnectClose}
            placement="bottom"
            fontcolor={fontColor}
            filtercolor={filterColor}
          >
            <Offcanvas.Body>
              <MobileActionsContainer bgColor={bgColorNew} borderColor={borderColorBox}>
                <MobileWalletTop>
                  <MobileWalletTopNet>
                    <img
                      className="chainIcon"
                      alt="chain icon"
                      src={getChainIcon(chainId)}
                      style={{ width: 21, height: 21 }}
                    />
                    <img
                      className="chainStatus"
                      alt="Chain icon"
                      src={ConnectFailureIcon}
                      style={{ width: 6, height: 6 }}
                    />
                  </MobileWalletTopNet>
                  <Logo
                    color={fontColor5}
                    className="logo"
                    onClick={() => {
                      handleMobileConnectClose()
                    }}
                  >
                    <IoCloseCircleOutline className="close" />
                  </Logo>
                </MobileWalletTop>
                <MobileWalletBody className="connect-body">
                  <MobileWalletBtn>
                    <MobileWalletButton
                      className="connect-button"
                      borderColor={borderColorBox}
                      onClick={() => {
                        connectAction()
                        handleMobileConnectClose()
                      }}
                    >
                      Connect
                    </MobileWalletButton>
                  </MobileWalletBtn>
                </MobileWalletBody>
                <MobileView borderColor={borderColorBox} className="connect-modal">
                  {sideLinksMobile.map(item => (
                    <Fragment key={item.name}>
                      <MobileMenuContainer
                        active={pathname.includes(item.path)}
                        activeColor={item.activeColor}
                        hoverImgColor={hoverImgColor}
                        onClick={() => {
                          if (item.newTab) {
                            window.open(item.path, '_blank')
                          } else {
                            directAction(item.path)
                          }
                          handleMobileConnectClose()
                        }}
                      >
                        <MobileMenu
                          item={item}
                          isDropdownLink={item.path === '#'}
                          fontColor={sidebarFontColor}
                          activeFontColor={sidebarActiveFontColor}
                          activeIconColor={sidebarActiveIconColor}
                          darkMode={darkMode}
                          isWallet
                          isMobile
                        />
                      </MobileMenuContainer>
                    </Fragment>
                  ))}

                  <ConnectSection>
                    <MobileConnectBtn color="connectwallet">
                      <MobileToggle
                        className="wallet-btn"
                        toggleColor={toggleColor}
                        width={27}
                        height={21}
                        src={WalletInactive}
                        alt=""
                      />
                    </MobileConnectBtn>
                  </ConnectSection>
                  <MoreBtn
                    type="button"
                    onClick={() => {
                      handleMobileConnectClose()
                      handleMobileShow()
                    }}
                  >
                    <MobileToggle
                      toggleColor={toggleColor}
                      width={21}
                      height={21}
                      src={Toggle}
                      alt=""
                    />
                  </MoreBtn>
                </MobileView>
              </MobileActionsContainer>
            </Offcanvas.Body>
          </OffcanvasDiv>
          {/* Wallet Connection Detail */}
          <OffcanvasDiv
            show={mobileWalletShow}
            onHide={handleMobileWalletClose}
            placement="bottom"
            fontcolor={fontColor}
            filtercolor={filterColor}
          >
            <Offcanvas.Body>
              <MobileActionsContainer bgColor={bgColorNew} borderColor={borderColorBox}>
                <MobileWalletTop>
                  <MobileWalletTopNet>
                    <img
                      className="chainIcon"
                      alt="chain icon"
                      src={getChainIcon(chainId)}
                      style={{ width: 21, height: 21 }}
                    />
                    <img
                      className="chainStatus"
                      alt="Chain icon"
                      src={ConnectSuccessIcon}
                      style={{ width: 6, height: 6 }}
                    />
                  </MobileWalletTopNet>
                  <Logo
                    color={fontColor5}
                    className="logo"
                    onClick={() => {
                      handleMobileWalletClose()
                    }}
                  >
                    <IoCloseCircleOutline className="close" />
                  </Logo>
                </MobileWalletTop>
                <MobileWalletBody>
                  <ConnectAvatar avatar>
                    <img src={connectAvatarMobile} alt="" />
                  </ConnectAvatar>
                  <Address>{formatAddress(account)}</Address>
                  <MobileAmount fontColor2={fontColor2}>
                    <MobileAmountDiv className="eth-letter">
                      {Number(balanceETH).toFixed(5)} ETH
                    </MobileAmountDiv>
                    <MobileAmountDiv className="middle-letter">|</MobileAmountDiv>
                    <MobileAmountDiv className="usdc-letter">
                      {Number(balanceUSDC).toFixed(2)} USDC
                    </MobileAmountDiv>
                  </MobileAmount>
                  <MobileWalletBtn>
                    <MobileWalletButton
                      fontColor5={fontColor5}
                      backColor={bgColorNew}
                      borderColor={borderColorBox}
                      onClick={handleCopyAddress}
                    >
                      {copyAddress}
                    </MobileWalletButton>
                    <MobileWalletButton
                      fontColor5={fontColor5}
                      backColor={bgColorNew}
                      borderColor={borderColorBox}
                      onClick={() => {
                        disconnectAction()
                        handleMobileWalletClose()
                      }}
                    >
                      Disconnect
                    </MobileWalletButton>
                  </MobileWalletBtn>
                </MobileWalletBody>
                <MobileView borderColor={borderColorBox} className="connect-modal">
                  {sideLinksMobile.map(item => (
                    <Fragment key={item.name}>
                      <MobileMenuContainer
                        active={pathname.includes(item.path)}
                        activeColor={item.activeColor}
                        hoverImgColor={hoverImgColor}
                        onClick={() => {
                          if (item.newTab) {
                            window.open(item.path, '_blank')
                          } else {
                            directAction(item.path)
                          }
                          handleMobileWalletClose()
                        }}
                      >
                        <MobileMenu
                          item={item}
                          isDropdownLink={item.path === '#'}
                          fontColor={sidebarFontColor}
                          activeFontColor={sidebarActiveFontColor}
                          activeIconColor={sidebarActiveIconColor}
                          darkMode={darkMode}
                          isWallet
                          isMobile
                        />
                      </MobileMenuContainer>
                    </Fragment>
                  ))}

                  <ConnectSection>
                    <MobileConnectBtn color="connectwallet">
                      <MobileToggle
                        className={connected ? 'connected-wallet-btn' : 'wallet-btn'}
                        toggleColor={toggleColor}
                        width={27}
                        height={21}
                        src={WalletActive}
                        alt=""
                      />
                    </MobileConnectBtn>
                  </ConnectSection>
                  <MoreBtn
                    type="button"
                    onClick={() => {
                      handleMobileWalletClose()
                      handleMobileShow()
                    }}
                  >
                    <MobileToggle
                      toggleColor={toggleColor}
                      width={21}
                      height={21}
                      src={Toggle}
                      alt=""
                    />
                  </MoreBtn>
                </MobileView>
              </MobileActionsContainer>
            </Offcanvas.Body>
          </OffcanvasDiv>
          {/* Bottom Menu */}
          {sideLinksMobile.map(item => (
            <Fragment key={item.name}>
              <MobileMenuContainer
                active={pathname.includes(item.path)}
                activeColor={item.activeColor}
                hoverImgColor={hoverImgColor}
                onClick={() => {
                  if (item.newTab) {
                    window.open(item.path, '_blank')
                  } else {
                    directAction(item.path)
                  }
                  handleMobileClose()
                }}
              >
                <MobileMenu
                  item={item}
                  isDropdownLink={item.path === '#'}
                  fontColor={sidebarFontColor}
                  filterColor={filterColorBottom}
                  activeFontColor={sidebarActiveFontColor}
                  activeIconColor={sidebarActiveIconColor}
                  darkMode={darkMode}
                  isWallet={false}
                  isMobile
                />
              </MobileMenuContainer>
            </Fragment>
          ))}

          <ConnectSection display="none">
            <MobileConnectBtn
              color="connectwallet"
              connected={connected}
              onClick={
                connected
                  ? () => {
                      handleMobileWalletDetailShow()
                    }
                  : () => {
                      handleMobileConnectShow()
                    }
              }
            >
              <MobileToggle
                className={connected ? 'connected-wallet-btn' : 'wallet-btn'}
                toggleColor={toggleColor}
                width={27}
                height={21}
                src={connected ? Wallet : WalletOff}
                alt=""
              />
            </MobileConnectBtn>
          </ConnectSection>
          <>
            <MobileMenuContainer display="flex" justifyContent="center" alignItems="center">
              <LinkMobile type="button" onClick={handleMobileShow}>
                <SideIcons
                  toggleColor={toggleColor}
                  filterColor={filterColorBottom}
                  width="18px"
                  height="18px"
                  src={Toggle}
                  alt=""
                />
                <LinkName marginTop="5px" color={darkMode ? '#fff' : '#7A7A7A'}>
                  More
                </LinkName>
              </LinkMobile>
            </MobileMenuContainer>
          </>
        </MobileView>
      </Mobile>
    </Container>
  )
}

export default Sidebar
