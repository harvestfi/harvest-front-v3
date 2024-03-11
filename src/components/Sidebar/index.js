import React, { Fragment, useEffect, useState } from 'react'
import { Dropdown, Offcanvas } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import Analytics from '../../assets/images/logos/sidebar/analytics.svg'
import ConnectDisableIcon from '../../assets/images/logos/sidebar/connect-disable.svg'
import ConnectSuccessIcon from '../../assets/images/logos/sidebar/connect-success.svg'
import ConnectFailureIcon from '../../assets/images/logos/sidebar/connect-failure.svg'
import connectAvatar from '../../assets/images/logos/sidebar/connectavatar.png'
import connectAvatarMobile from '../../assets/images/logos/sidebar/connectavatarmobile.svg'
// import Portfolio from '../../assets/images/logos/sidebar/portfolio.svg'
import Docs from '../../assets/images/logos/sidebar/docs.svg'
// import FAQ from '../../assets/images/logos/sidebar/faq.svg'
import Home from '../../assets/images/logos/sidebar/home-line.svg'
import Beginners from '../../assets/images/logos/sidebar/beginners.svg'
// import Collaborations from '../../assets/images/logos/sidebar/collaborations.svg'
import Advanced from '../../assets/images/logos/sidebar/advanced.svg'
import logoNew from '../../assets/images/logos/sidebar/ifarm.svg'
import xCircle from '../../assets/images/logos/sidebar/x-circle.svg'
import LogoutIcon from '../../assets/images/logos/sidebar/logout.svg'
import Wallet from '../../assets/images/logos/sidebar/wallet.svg'
import WalletOff from '../../assets/images/logos/sidebar/wallet_off.svg'
import WalletActive from '../../assets/images/logos/sidebar/wallet_active.svg'
import WalletInactive from '../../assets/images/logos/sidebar/wallet_inactive.svg'
import Toggle from '../../assets/images/logos/sidebar/more-mobile.svg'
import Arbitrum from '../../assets/images/chains/arbitrum.svg'
import Base from '../../assets/images/chains/base.svg'
import Ethereum from '../../assets/images/chains/ethereum.svg'
import Polygon from '../../assets/images/chains/polygon.svg'
import HomeMobile from '../../assets/images/logos/sidebar/home-mobile.svg'
import BeginnersMobile from '../../assets/images/logos/sidebar/beginners-mobile.svg'
import AdvancedMobile from '../../assets/images/logos/sidebar/advanced-mobile.svg'
import HomeMobileSM from '../../assets/images/logos/sidebar/home-mobile_sm.svg'
import BeginnersMobileSM from '../../assets/images/logos/sidebar/beginners-mobile_sm.svg'
import AdvancedMobileSM from '../../assets/images/logos/sidebar/advanced-mobile_sm.svg'
import AnalyticsMobile from '../../assets/images/logos/sidebar/analytics-mobile.svg'
// import FAQMobile from '../../assets/images/logos/sidebar/faq-mobile.svg'
import DocsMobile from '../../assets/images/logos/sidebar/docs-mobile.svg'
import { ROUTES } from '../../constants'
import { CHAIN_IDS } from '../../data/constants'
import { usePools } from '../../providers/Pools'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { fromWei } from '../../services/web3'
import { formatAddress, isLedgerLive, isSpecialApp } from '../../utils'
import Social from '../Social'
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
  MiddleActionsContainer,
  MobileActionsContainer,
  MobileWalletTop,
  MobileWalletTopNet,
  MobileWalletBody,
  MobileAmount,
  MobileAmountDiv,
  MobileWalletBtn,
  MobileWalletButton,
  SocialMobileWrapper,
  MobileConnectBtn,
  MobileLinkContainer,
  MobileToggle,
  MobileView,
  OffcanvasDiv,
  SideIcons,
  // ThemeMode,
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
} from './style'

const sideLinks = [
  {
    path: ROUTES.PORTFOLIO,
    name: 'Dashboard',
    imgPath: Home,
  },
  {
    path: ROUTES.BEGINNERSFARM,
    name: 'Beginners',
    imgPath: Beginners,
  },
  {
    path: ROUTES.ADVANCED,
    name: 'All Farms',
    imgPath: Advanced,
  },
  // {
  //   path: ROUTES.COLLABORATIONS,
  //   name: 'Collaborations',
  //   imgPath: Collaborations,
  //   new: true,
  //   enabled: false,
  // },
  // {
  //   path: ROUTES.PORTFOLIO,
  //   name: 'My Earnings',
  //   imgPath: Portfolio,
  // },
]

const sideLinks1 = [
  {
    path: ROUTES.ANALYTIC,
    name: 'Analytics',
    imgPath: Analytics,
    external: false,
  },
  // {
  //   path: ROUTES.TUTORIAL,
  //   name: 'Tutorial',
  //   imgPath: FAQ,
  //   external: false,
  // },
  {
    path: 'https://docs.harvest.finance',
    name: 'Docs',
    imgPath: Docs,
    external: false,
    newTab: true,
  },
]

const sideLinksMobile = [
  {
    path: ROUTES.PORTFOLIO,
    name: 'Dashboard',
    imgPath: HomeMobileSM,
  },
  {
    path: ROUTES.BEGINNERSFARM,
    name: 'Beginners',
    imgPath: BeginnersMobileSM,
  },
  {
    path: ROUTES.ADVANCED,
    name: 'Farm',
    imgPath: AdvancedMobileSM,
  },
]

const sideLinksMobile1 = [
  {
    path: ROUTES.PORTFOLIO,
    name: 'Dashboard',
    imgPath: HomeMobile,
  },
  {
    path: ROUTES.BEGINNERSFARM,
    name: 'Beginners',
    imgPath: BeginnersMobile,
  },
  {
    path: ROUTES.ADVANCED,
    name: 'Advanced',
    imgPath: AdvancedMobile,
  },
  {
    path: ROUTES.ANALYTIC,
    name: 'Analytics',
    imgPath: AnalyticsMobile,
  },
  // {
  //   path: ROUTES.TUTORIAL,
  //   name: 'Tutorial',
  //   imgPath: FAQMobile,
  // },
  {
    path: 'https://docs.harvest.finance',
    name: 'Docs',
    imgPath: DocsMobile,
    newTab: true,
  },
]

const SideLink = ({ item, subItem, isDropdownLink, fontColor, activeIconColor, darkMode }) => {
  const { pathname } = useLocation()
  const pageName =
    pathname === '/'
      ? 'home'
      : pathname === ROUTES.ADVANCED
      ? 'advanced'
      : pathname === ROUTES.PORTFOLIO
      ? 'dashboard'
      : pathname
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <Link
      fontColor={fontColor}
      active={pageName.includes(item.name.toLowerCase().trim())}
      subItem={subItem}
      isDropdownLink={isDropdownLink}
      activeIconColor={activeIconColor}
      darkMode={darkMode}
      enabled={item.enabled === false ? 'false' : 'true'}
    >
      <div className="item">
        <SideIcons
          className="sideIcon"
          src={item.imgPath}
          alt="Harvest"
          width="27px"
          height="27px"
        />
      </div>
      <div className="item-name">{item.name}</div>
      {item.new ? <NewTag>Soon</NewTag> : <></>}
    </Link>
  )
}

const MobileMenu = ({
  item,
  subItem,
  isDropdownLink,
  fontColor,
  activeIconColor,
  darkMode,
  isWallet,
  isMobile,
}) => {
  const { pathname } = useLocation()
  const pageName = pathname === '/' ? 'home' : pathname
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <LinkMobile
      fontColor={fontColor}
      active={!isWallet && pageName.includes(item.name.toLowerCase())}
      subItem={subItem}
      isDropdownLink={isDropdownLink}
      activeIconColor={activeIconColor}
      darkMode={darkMode}
      enabled={item.enabled === false ? 'false' : 'true'}
      isMobile={isMobile}
    >
      {/* <div className="item">
        <SideIcons
          className="sideIcon"
          src={item.imgPath}
          alt="Harvest"
          width="21px"
          height="21px"
        />
      </div> */}
      <SideIcons className="sideIcon" src={item.imgPath} alt="Harvest" width="21px" height="21px" />
      {item.new ? <NewTag>Soon</NewTag> : <></>}
    </LinkMobile>
  )
}

const getChainIcon = chainNum => {
  let icon = null
  if (chainNum) {
    switch (chainNum) {
      case CHAIN_IDS.ETH_MAINNET:
        icon = Ethereum
        break
      case CHAIN_IDS.POLYGON_MAINNET:
        icon = Polygon
        break
      case CHAIN_IDS.ARBITRUM_ONE:
        icon = Arbitrum
        break
      case CHAIN_IDS.BASE:
        icon = Base
        break
      default:
        icon = Ethereum
        break
    }
  }
  return icon
}

const Sidebar = ({ width }) => {
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

  const {
    darkMode,
    backColor,
    fontColor,
    filterColor,
    hoverImgColor,
    sidebarEffect,
    toggleColor,
    borderColor,
    connectWalletBtnBackColor,
    sidebarFontColor,
    sidebarActiveFontColor,
    sidebarActiveIconColor,
  } = useThemeContext()

  // const switchTheme = () => setDarkMode(prev => !prev)
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

  const handleMobileWalletDetailShow = async () => {
    const showBalanceTokens =
      chainId === CHAIN_IDS.BASE
        ? ['WETH_base', 'USDC_base']
        : chainId === CHAIN_IDS.POLYGON_MAINNET
        ? ['WETH_polygon', 'USDC_polygon']
        : chainId === CHAIN_IDS.ARBITRUM_ONE
        ? ['WETH_arbitrum', 'USDC_arbitrum']
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
        : balances.USDC,
      6,
    )
    setBalanceETH(ethBalance)
    setBalanceUSDC(usdcBalance)
  }, [balances, chainId])

  const directAction = path => {
    if (path === ROUTES.PORTFOLIO || path === ROUTES.ANALYTIC || path === ROUTES.BEGINNERS) {
      setSelChain([
        CHAIN_IDS.ETH_MAINNET,
        CHAIN_IDS.POLYGON_MAINNET,
        CHAIN_IDS.ARBITRUM_ONE,
        CHAIN_IDS.BASE,
      ])
    }
    push(path)
  }

  return (
    <Container
      width={width}
      sidebarEffect={sidebarEffect}
      backColor={backColor}
      borderColor={borderColor}
      fontColor={fontColor}
    >
      <Desktop>
        <Layout>
          <MiddleActionsContainer>
            <LinksContainer totalItems={sideLinks.length + 2}>
              <Logo
                className="logo"
                onClick={() => {
                  push('/')
                }}
              >
                <img src={logoNew} width={52} height={52} alt="Harvest" />
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
                      bordercolor={fontColor}
                      disabled={disableWallet}
                    >
                      <img src={ConnectDisableIcon} className="connect-wallet" alt="" />
                      Connect Wallet
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
                      fontcolor={fontColor}
                      hoverbackcolor={connectWalletBtnBackColor}
                    >
                      <FlexDiv>
                        <ConnectAvatar avatar>
                          <img src={connectAvatar} alt="" />
                        </ConnectAvatar>
                        <div className="detail-info">
                          <Address>{formatAddress(account)}</Address>
                          <br />
                          <ConnectAvatar>
                            <img
                              alt="Chain icon"
                              src={ConnectSuccessIcon}
                              style={{ width: 8, height: 8 }}
                            />
                            Connected
                          </ConnectAvatar>
                        </div>
                      </FlexDiv>
                      <img
                        alt="chain icon"
                        src={getChainIcon(chainId)}
                        style={{ width: 17, height: 17 }}
                      />
                    </UserDropDown>
                    {!isSpecialApp ? (
                      <UserDropDownMenu backcolor={backColor} bordercolor={borderColor}>
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

              {sideLinks.map(item =>
                !isLedgerLive() ||
                (isLedgerLive() &&
                  (chainId === CHAIN_IDS.BASE ||
                    (chainId !== CHAIN_IDS.BASE && item.name !== 'Beginners'))) ? (
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
                    >
                      <SideLink
                        item={item}
                        isDropdownLink={item.path === '#'}
                        fontColor={sidebarFontColor}
                        activeIconColor={sidebarActiveIconColor}
                        darkMode={darkMode}
                      />
                    </LinkContainer>
                  </Fragment>
                ) : (
                  <></>
                ),
              )}
            </LinksContainer>
          </MiddleActionsContainer>
        </Layout>

        <BottomPart>
          <LinksContainer totalItems={sideLinks1.length + 2}>
            {sideLinks1.map(item => (
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
                    fontColor={sidebarFontColor}
                    activeFontColor={sidebarActiveFontColor}
                    activeIconColor={sidebarActiveIconColor}
                    darkMode={darkMode}
                  />
                </LinkContainer>
              </Fragment>
            ))}
          </LinksContainer>
          <Social />
        </BottomPart>
      </Desktop>
      <Mobile>
        <MobileView borderColor={borderColor}>
          {/* Full Menu */}
          <OffcanvasDiv
            show={mobileShow}
            onHide={handleMobileClose}
            placement="bottom"
            fontcolor={fontColor}
            filtercolor={filterColor}
          >
            <Offcanvas.Body>
              <MobileActionsContainer className="full-menu-container">
                <Logo
                  className="logo"
                  onClick={() => {
                    handleMobileClose()
                  }}
                >
                  <img src={xCircle} width={24} height={24} alt="Harvest" />
                </Logo>
                {sideLinksMobile1.map(item => (
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
                        fontColor={sidebarFontColor}
                        activeFontColor={sidebarActiveFontColor}
                        activeIconColor={sidebarActiveIconColor}
                        darkMode={darkMode}
                      />
                    </MobileLinkContainer>
                    {item.subItems ? (
                      <LinkContainer hideOnDesktop>
                        {item.subItems.map(subItem => (
                          <SideLink
                            key={subItem.name}
                            item={subItem}
                            fontColor={fontColor}
                            activeFontColor={sidebarActiveFontColor}
                            activeIconColor={sidebarActiveIconColor}
                            darkMode={darkMode}
                          />
                        ))}
                      </LinkContainer>
                    ) : null}
                  </Fragment>
                ))}
                <SocialMobileWrapper>
                  <Social />
                </SocialMobileWrapper>
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
              <MobileActionsContainer>
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
                    className="logo"
                    onClick={() => {
                      handleMobileConnectClose()
                    }}
                  >
                    <img src={xCircle} width={24} height={24} alt="Harvest" />
                  </Logo>
                </MobileWalletTop>
                <MobileWalletBody className="connect-body">
                  <MobileWalletBtn>
                    <MobileWalletButton
                      className="connect-button"
                      borderColor={borderColor}
                      onClick={() => {
                        connectAction()
                        handleMobileConnectClose()
                      }}
                    >
                      Connect
                    </MobileWalletButton>
                  </MobileWalletBtn>
                </MobileWalletBody>
                <MobileView borderColor={borderColor} className="connect-modal">
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
              <MobileActionsContainer>
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
                    className="logo"
                    onClick={() => {
                      handleMobileWalletClose()
                    }}
                  >
                    <img src={xCircle} width={24} height={24} alt="Harvest" />
                  </Logo>
                </MobileWalletTop>
                <MobileWalletBody>
                  <ConnectAvatar avatar>
                    <img src={connectAvatarMobile} alt="" />
                  </ConnectAvatar>
                  <Address>{formatAddress(account)}</Address>
                  <MobileAmount>
                    <MobileAmountDiv className="eth-letter">
                      {Number(balanceETH).toFixed(5)} ETH
                    </MobileAmountDiv>
                    <MobileAmountDiv className="middle-letter">|</MobileAmountDiv>
                    <MobileAmountDiv className="usdc-letter">
                      {Number(balanceUSDC).toFixed(2)} USDC
                    </MobileAmountDiv>
                  </MobileAmount>
                  <MobileWalletBtn>
                    <MobileWalletButton borderColor={borderColor} onClick={handleCopyAddress}>
                      {copyAddress}
                    </MobileWalletButton>
                    <MobileWalletButton
                      borderColor={borderColor}
                      onClick={() => {
                        disconnectAction()
                        handleMobileWalletClose()
                      }}
                    >
                      Disconnect
                    </MobileWalletButton>
                  </MobileWalletBtn>
                </MobileWalletBody>
                <MobileView borderColor={borderColor} className="connect-modal">
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
                        className="wallet-btn"
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
                  activeFontColor={sidebarActiveFontColor}
                  activeIconColor={sidebarActiveIconColor}
                  darkMode={darkMode}
                  isWallet={false}
                  isMobile
                />
              </MobileMenuContainer>
            </Fragment>
          ))}

          <ConnectSection>
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
                className="wallet-btn"
                toggleColor={toggleColor}
                width={27}
                height={21}
                src={connected ? Wallet : WalletOff}
                alt=""
              />
            </MobileConnectBtn>
          </ConnectSection>
          <MoreBtn type="button" onClick={handleMobileShow}>
            <MobileToggle toggleColor={toggleColor} width={21} height={21} src={Toggle} alt="" />
          </MoreBtn>
        </MobileView>
      </Mobile>
    </Container>
  )
}

export default Sidebar
