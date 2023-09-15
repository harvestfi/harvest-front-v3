import React, { Fragment, useEffect, useState } from 'react'
import { Dropdown, Offcanvas } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import Analytics from '../../assets/images/logos/sidebar/analytics.svg'
import ConnectDisableIcon from '../../assets/images/logos/sidebar/connect-disable.svg'
import ConnectSuccessIcon from '../../assets/images/logos/sidebar/connect-success.svg'
import connectAvatar from '../../assets/images/logos/sidebar/connectavatar.svg'
import Portfolio from '../../assets/images/logos/sidebar/portfolio.svg'
import Docs from '../../assets/images/logos/sidebar/docs.svg'
import ExternalLink from '../../assets/images/logos/sidebar/external_link.svg'
import FAQ from '../../assets/images/logos/sidebar/faq.svg'
import Home from '../../assets/images/logos/sidebar/home.svg'
import Beginners from '../../assets/images/logos/sidebar/beginners.svg'
import Collaborations from '../../assets/images/logos/sidebar/collaborations.svg'
import Advanced from '../../assets/images/logos/sidebar/advanced.svg'
import logoNew from '../../assets/images/logos/sidebar/ifarm.svg'
import LogoutIcon from '../../assets/images/logos/sidebar/logout.svg'
import Toggle from '../../assets/images/logos/sidebar/more-mobile.svg'
import Arbitrum from '../../assets/images/chains/arbitrum.svg'
import Base from '../../assets/images/chains/base.svg'
import Ethereum from '../../assets/images/chains/ethereum.svg'
import Polygon from '../../assets/images/chains/polygon.svg'
import HomeMobile from '../../assets/images/logos/sidebar/home-mobile.svg'
import PortfolioMobile from '../../assets/images/logos/sidebar/portfolio-mobile.svg'
import BeginnersMobile from '../../assets/images/logos/sidebar/beginners-mobile.svg'
import AdvancedMobile from '../../assets/images/logos/sidebar/advanced-mobile.svg'
import CollaborationsMobile from '../../assets/images/logos/sidebar/collaborations-mobile.svg'
import AnalyticsMobile from '../../assets/images/logos/sidebar/analytics-mobile.svg'
import FAQMobile from '../../assets/images/logos/sidebar/faq-mobile.svg'
import DocsMobile from '../../assets/images/logos/sidebar/docs-mobile.svg'
import { ROUTES } from '../../constants'
import { CHAIN_IDS } from '../../data/constants'
import { usePools } from '../../providers/Pools'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { formatAddress, isSpecialApp } from '../../utils'
// import Social from '../Social'
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
  MobileConnectBtn,
  // MobileFollow,
  MobileLinkContainer,
  // MobileLinksContainer,
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
    path: ROUTES.HOME,
    name: 'Home',
    imgPath: Home,
  },
  {
    path: ROUTES.BEGINNERS,
    name: 'Beginners',
    imgPath: Beginners,
  },
  {
    path: ROUTES.COLLABORATIONS,
    name: 'Collaborations',
    imgPath: Collaborations,
    new: true,
    enabled: false,
  },
  {
    path: ROUTES.ADVANCED,
    name: 'Advanced',
    imgPath: Advanced,
  },
  {
    path: ROUTES.PORTFOLIO,
    name: 'Portfolio',
    imgPath: Portfolio,
  },
]

const sideLinks1 = [
  {
    path: ROUTES.ANALYTIC,
    name: 'Analytics',
    imgPath: Analytics,
    external: false,
  },
  {
    path: ROUTES.FAQ,
    name: 'FAQ',
    imgPath: FAQ,
    external: false,
  },
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
    path: ROUTES.HOME,
    name: 'Home',
    imgPath: HomeMobile,
  },
  {
    path: ROUTES.BEGINNERS,
    name: 'Beginners',
    imgPath: BeginnersMobile,
  },
  {
    path: ROUTES.PORTFOLIO,
    name: 'Portfolio',
    imgPath: PortfolioMobile,
  },
  {
    path: ROUTES.ADVANCED,
    name: 'Advanced',
    imgPath: AdvancedMobile,
  },
]

const sideLinksMobile1 = [
  {
    path: ROUTES.COLLABORATIONS,
    name: 'Collaborations',
    imgPath: CollaborationsMobile,
    new: true,
    enabled: false,
  },
  {
    path: ROUTES.ANALYTIC,
    name: 'Analytics',
    imgPath: AnalyticsMobile,
    external: false,
  },
  {
    path: ROUTES.FAQ,
    name: 'FAQ',
    imgPath: FAQMobile,
    external: false,
  },
  {
    path: 'https://docs.harvest.finance',
    name: 'Docs',
    imgPath: DocsMobile,
    external: false,
    newTab: true,
  },
]

const SideLink = ({ item, subItem, isDropdownLink, fontColor, activeIconColor, darkMode }) => {
  const { pathname } = useLocation()
  const pageName = pathname === '/' ? 'home' : pathname
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <Link
      fontColor={fontColor}
      active={pageName.includes(item.name.toLowerCase())}
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
      {item.name}
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
  isMobile,
}) => {
  const { pathname } = useLocation()
  const pageName = pathname === '/' ? 'home' : pathname
  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <LinkMobile
      fontColor={fontColor}
      active={pageName.includes(item.name.toLowerCase())}
      subItem={subItem}
      isDropdownLink={isDropdownLink}
      activeIconColor={activeIconColor}
      darkMode={darkMode}
      enabled={item.enabled === false ? 'false' : 'true'}
      isMobile={isMobile}
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
      {item.name}
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
  const { account, connectAction, disconnectAction, chainId, connected, setSelChain } = useWallet()
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

  const handleMobileClose = () => setMobileShow(false)
  const handleMobileShow = () => setMobileShow(true)

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

              {sideLinks.map(item => (
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
              ))}
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
        </BottomPart>
      </Desktop>
      <Mobile>
        <MobileView>
          <OffcanvasDiv
            show={mobileShow}
            onHide={handleMobileClose}
            placement="end"
            backcolor={backColor}
            fontcolor={fontColor}
            filtercolor={filterColor}
          >
            <Offcanvas.Body>
              <MobileActionsContainer>
                <Logo
                  className="logo"
                  onClick={() => {
                    push('/')
                  }}
                >
                  <img src={logoNew} width={52} height={52} alt="Harvest" />
                  Harvest
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
                        } else if (item.enabled) {
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
                      {item.external ? (
                        <div className="item">
                          <SideIcons
                            className="external-link"
                            src={ExternalLink}
                            alt="external-link"
                            filterColor={filterColor}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
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
              </MobileActionsContainer>
            </Offcanvas.Body>
          </OffcanvasDiv>
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
                  isMobile
                />
              </MobileMenuContainer>
            </Fragment>
          ))}

          <MoreBtn type="button" onClick={handleMobileShow}>
            <MobileToggle toggleColor={toggleColor} width={27} height={27} src={Toggle} alt="" />
            More
          </MoreBtn>
        </MobileView>
        <ConnectSection connected={connected}>
          <MobileConnectBtn
            color="connectwallet"
            connected={connected}
            onClick={() => {
              connectAction()
            }}
          >
            Connect Wallet
          </MobileConnectBtn>
        </ConnectSection>
      </Mobile>
    </Container>
  )
}

export default Sidebar
