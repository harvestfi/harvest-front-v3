import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { Dropdown, Offcanvas } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'
import Analytics from '../../assets/images/logos/sidebar/analytics.svg'
import ChangeWalletIcon from '../../assets/images/logos/sidebar/change_wallet.svg'
import ConnectDisableIcon from '../../assets/images/logos/sidebar/connect-disable.svg'
import ConnectSuccessIcon from '../../assets/images/logos/sidebar/connect-success.svg'
import connectAvatar from '../../assets/images/logos/sidebar/connectavatar.svg'
import Dashboard from '../../assets/images/logos/sidebar/dashboard.svg'
import Docs from '../../assets/images/logos/sidebar/docs.svg'
import ExternalLink from '../../assets/images/logos/sidebar/external_link.svg'
import FAQ from '../../assets/images/logos/sidebar/faq.svg'
import Farms from '../../assets/images/logos/sidebar/farms.svg'
import Home from '../../assets/images/logos/sidebar/home.svg'
import logoNew from '../../assets/images/logos/sidebar/ifarm.svg'
import LogoutIcon from '../../assets/images/logos/sidebar/logout.svg'
import MobileConnect from '../../assets/images/logos/sidebar/mobileconnect.svg'
import ProfitSharingIcon from '../../assets/images/logos/sidebar/profit-sharing.svg'
import Toggle from '../../assets/images/logos/sidebar/toggle.svg'
import Arbitrum from '../../assets/images/chains/arbitrum.svg'
import Ethereum from '../../assets/images/chains/ethereum.svg'
import Polygon from '../../assets/images/chains/polygon.svg'
import {
  DECIMAL_PRECISION,
  FARM_TOKEN_SYMBOL,
  ROUTES,
  SPECIAL_VAULTS,
  directDetailUrl,
} from '../../constants'
import { CHAINS_ID } from '../../data/constants'
import { addresses } from '../../data/index'
import { usePools } from '../../providers/Pools'
import { useStats } from '../../providers/Stats'
import { useThemeContext } from '../../providers/useThemeContext'
import { useWallet } from '../../providers/Wallet'
import { displayAPY, formatAddress, getDataQuery, getTotalApy, isLedgerLive } from '../../utils'
import { Divider } from '../GlobalStyle'
import SmallApexChart from '../SmallApexChart'
import Social from '../Social'
import {
  AboutHarvest,
  Address,
  BottomDiv,
  ChartDiv,
  ConnectAvatar,
  ConnectButtonStyle,
  Container,
  FlexDiv,
  Follow,
  Layout,
  Link,
  LinkContainer,
  LinksContainer,
  MiddleActionsContainer,
  MobileActionsContainer,
  MobileConnectBtn,
  MobileFollow,
  MobileLink,
  MobileLinkContainer,
  MobileLinksContainer,
  MobileToggle,
  MobileView,
  OffcanvasDiv,
  ProfitSharing,
  SideIcons,
  ThemeMode,
  TopDiv,
  TopTitle,
  UserDropDown,
  UserDropDownItem,
  UserDropDownMenu,
  BottomPart,
  MobileProfitSharing,
  ProfitPart,
} from './style'

const sideLinks = [
  {
    path: ROUTES.HOME,
    name: 'Home',
    imgPath: Home,
  },
  {
    path: ROUTES.FARM,
    name: 'Farms',
    imgPath: Farms,
  },
  {
    path: ROUTES.DASHBOARD,
    name: 'Dashboard',
    imgPath: Dashboard,
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
    path: ROUTES.DOC,
    name: 'Docs',
    imgPath: Docs,
    external: false,
  },
]

const SideLink = ({ item, subItem, isDropdownLink, fontColor, activeFontColor, filterColor }) => {
  const { pathname } = useLocation()

  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <Link
      fontColor={fontColor}
      active={pathname.includes(item.path)}
      subItem={subItem}
      isDropdownLink={isDropdownLink}
      activeColor={activeFontColor}
    >
      <div className="item">
        <SideIcons
          className="sideIcon"
          src={item.imgPath}
          alt="Harvest"
          filterColor={filterColor}
        />
      </div>
      {item.name}
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
    </Link>
  )
}

const getChainIcon = chainNum => {
  let icon = null
  if (chainNum) {
    switch (chainNum) {
      case CHAINS_ID.ETH_MAINNET:
        icon = Ethereum
        break
      case CHAINS_ID.MATIC_MAINNET:
        icon = Polygon
        break
      case CHAINS_ID.ARBITRUM_ONE:
        icon = Arbitrum
        break
      default:
        icon = Ethereum
        break
    }
  }
  return icon
}

const Sidebar = ({ width }) => {
  const { account, connect, disconnect, chainId, connected } = useWallet()
  const { pools, disableWallet } = usePools()
  const { profitShareAPY } = useStats()

  const {
    darkMode,
    setDarkMode,
    backColor,
    fontColor,
    filterColor,
    hoverImgColor,
    sidebarEffect,
    toggleColor,
    borderColor,
    connectWalletBtnBackColor,
    toggleBackColor,
    sidebarFontColor,
    sidebarActiveFontColor,
  } = useThemeContext()

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

  const handleMobileClose = () => setMobileShow(false)
  const handleMobileShow = () => setMobileShow(true)

  const farmProfitSharingPool = pools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )

  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: ['./icons/ifarm.svg'],
      },
    }),
    [profitShareAPY, farmProfitSharingPool],
  )
  const token = poolVaults.FARM

  const totalApy = getTotalApy(null, token, true)

  const [apiData, setApiData] = useState({})
  useEffect(() => {
    const initData = async () => {
      const data = await getDataQuery(365, addresses.iFARM, chainId.toString(), null)
      setApiData(data)
    }
    initData()
  }, [chainId])

  return (
    <Container
      width={width}
      sidebarEffect={sidebarEffect}
      backColor={backColor}
      fontColor={fontColor}
    >
      <Layout>
        <MiddleActionsContainer>
          <LinksContainer totalItems={sideLinks.length + 2}>
            <a className="logo" href="/">
              <img src={logoNew} width={52} height={52} alt="Harvest" />
            </a>

            <Divider height="1px" marginTop="36px" backColor="#EAECF0" />

            {(() => {
              if (!connected) {
                return (
                  <ConnectButtonStyle
                    color="connectwallet"
                    onClick={() => {
                      connect()
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
                  <button onClick={disconnect} type="button">
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
                          {/* )} */}
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
                  {!isLedgerLive() ? (
                    <UserDropDownMenu backcolor={backColor} bordercolor={borderColor}>
                      <UserDropDownItem
                        onClick={() => {
                          disconnect()
                        }}
                        fontcolor={fontColor}
                        filtercolor={filterColor}
                        bordercolor={borderColor}
                      >
                        <img
                          className="change-icon"
                          src={ChangeWalletIcon}
                          width="18px"
                          height="18px"
                          alt=""
                        />
                        <div>Change Network</div>
                      </UserDropDownItem>

                      <UserDropDownItem
                        onClick={() => {
                          disconnect()
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
                    } else {
                      push(item.path)
                    }
                  }}
                >
                  <SideLink
                    item={item}
                    isDropdownLink={item.path === '#'}
                    filterColor={filterColor}
                    fontColor={sidebarFontColor}
                    activeFontColor={sidebarActiveFontColor}
                  />
                </LinkContainer>
              </Fragment>
            ))}
          </LinksContainer>
          <AboutHarvest>{/* About */}</AboutHarvest>
          {/* <LinksContainer totalItems={sideLinks1.length + 2}>
            {sideLinks1.map(item => (
              <Fragment key={item.name}>
                <LinkContainer
                  active={pathname.includes(item.path)}
                  hoverImgColor={hoverImgColor}
                  onClick={() => {
                    if (item.newTab) {
                      window.open(item.path, '_blank')
                    } else {
                      push(item.path)
                    }
                  }}
                >
                  <SideLink
                    item={item}
                    isDropdownLink={item.path === '#'}
                    filterColor={filterColor}
                    fontColor={sidebarFontColor}
                    activeFontColor={sidebarActiveFontColor}
                  />
                </LinkContainer>
              </Fragment>
            ))}
          </LinksContainer> */}
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
                    push(item.path)
                  }
                }}
              >
                <SideLink
                  item={item}
                  isDropdownLink={item.path === '#'}
                  filterColor={filterColor}
                  fontColor={sidebarFontColor}
                  activeFontColor={sidebarActiveFontColor}
                />
              </LinkContainer>
            </Fragment>
          ))}
        </LinksContainer>
        <ProfitSharing
          onClick={() => {
            push(directDetailUrl + FARM_TOKEN_SYMBOL)
          }}
        >
          <TopDiv>
            <img src={ProfitSharingIcon} alt="profit-sharing" />
            <TopTitle>
              <img src={ConnectDisableIcon} width="7px" height="7px" alt="" />
              Profit-Sharing
            </TopTitle>
          </TopDiv>
          <BottomDiv>
            {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
            <div>APR</div>
          </BottomDiv>
          <ChartDiv>
            <SmallApexChart data={apiData} lastAPY={Number(totalApy)} />
          </ChartDiv>
        </ProfitSharing>

        <Divider height="1px" marginTop="20px" backColor="#EAECF0" />
        <Follow>
          <Social />
          <ThemeMode
            mode={darkMode ? 'dark' : 'light'}
            backColor={toggleBackColor}
            borderColor={borderColor}
          >
            <div id="theme-switch">
              <div className="switch-track">
                <div className="switch-thumb" />
              </div>

              <input
                type="checkbox"
                checked={darkMode}
                onChange={switchTheme}
                aria-label="Switch between dark and light mode"
              />
            </div>
          </ThemeMode>
        </Follow>
      </BottomPart>

      <MobileView>
        <OffcanvasDiv
          show={mobileShow}
          onHide={handleMobileClose}
          placement="end"
          backdrop={false}
          backcolor={backColor}
          fontcolor={fontColor}
        >
          <Offcanvas.Body>
            <MobileActionsContainer>
              <MobileLinksContainer totalItems={sideLinks.length + 2} fontColor={fontColor}>
                <a className="logo" href="/">
                  <img src={logoNew} width={38} height={38} alt="Harvest" />
                </a>
                {(() => {
                  if (!connected) {
                    return (
                      <ConnectButtonStyle
                        color="connectwallet"
                        onClick={() => {
                          connect()
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
                      <button onClick={disconnect} type="button">
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

                      {!isLedgerLive() ? (
                        <UserDropDownMenu backcolor={backColor} bordercolor={borderColor}>
                          <UserDropDownItem
                            onClick={() => {
                              disconnect()
                            }}
                            fontcolor={fontColor}
                            filtercolor={filterColor}
                            bordercolor={borderColor}
                          >
                            <img
                              className="change-icon"
                              src={ChangeWalletIcon}
                              width="18px"
                              height="18px"
                              alt=""
                            />
                            <div>Change Network</div>
                          </UserDropDownItem>

                          <UserDropDownItem
                            onClick={() => {
                              disconnect()
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
                    <MobileLinkContainer
                      active={pathname.includes(item.path)}
                      activeColor={item.activeColor}
                      hoverImgColor={hoverImgColor}
                    >
                      <div className="item">
                        <SideIcons src={item.imgPath} width={20} height={20} alt="Harvest" />
                      </div>
                      <MobileLink
                        onClick={() => {
                          if (item.newTab) {
                            window.open(item.path, '_blank')
                          } else {
                            push(item.path)
                          }
                          handleMobileClose()
                        }}
                        active={pathname.includes(item.path)}
                        fontColor={fontColor}
                        activeFontColor={sidebarActiveFontColor}
                      >
                        {item.name}
                      </MobileLink>
                    </MobileLinkContainer>
                  </Fragment>
                ))}
              </MobileLinksContainer>
              <AboutHarvest />
              {sideLinks1.map(item => (
                <Fragment key={item.name}>
                  <MobileLinkContainer
                    active={pathname.includes(item.path)}
                    activeColor={item.activeColor}
                    hoverImgColor={hoverImgColor}
                  >
                    <div className="item">
                      <SideIcons
                        src={item.imgPath}
                        width={20}
                        height={20}
                        alt="Harvest"
                        filterColor={filterColor}
                      />
                    </div>
                    <MobileLink
                      onClick={() => {
                        if (item.newTab) {
                          window.open(item.path, '_blank')
                        } else {
                          push(item.path)
                        }
                      }}
                      active={pathname.includes(item.path)}
                      fontColor={fontColor}
                    >
                      {item.name}
                    </MobileLink>
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
                          filterColor={filterColor}
                          activeFontColor={sidebarActiveFontColor}
                        />
                      ))}
                    </LinkContainer>
                  ) : null}
                </Fragment>
              ))}
            </MobileActionsContainer>
            <ProfitPart>
              <MobileProfitSharing
                onClick={() => {
                  push(directDetailUrl + FARM_TOKEN_SYMBOL)
                }}
              >
                <TopDiv>
                  <img src={ProfitSharingIcon} alt="profit-sharing" />
                  <TopTitle>
                    <img src={ConnectDisableIcon} width="7px" height="7px" alt="" />
                    Profit-Sharing
                  </TopTitle>
                </TopDiv>
                <BottomDiv>
                  {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
                  <div>APR</div>
                </BottomDiv>
                <ChartDiv>
                  <SmallApexChart data={apiData} lastAPY={Number(totalApy)} />
                </ChartDiv>
              </MobileProfitSharing>
            </ProfitPart>
            <MobileFollow>
              <Social />
              <ThemeMode
                mode={darkMode ? 'dark' : 'light'}
                backColor={toggleBackColor}
                borderColor={borderColor}
              >
                <div id="theme-switch">
                  <div className="switch-track">
                    <div className="switch-thumb" />
                  </div>

                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={switchTheme}
                    aria-label="Switch between dark and light mode"
                  />
                </div>
              </ThemeMode>
            </MobileFollow>
          </Offcanvas.Body>
        </OffcanvasDiv>
        <MobileConnectBtn
          color="connectwallet"
          connected={connected}
          onClick={() => {
            connect()
          }}
        >
          <img src={ConnectDisableIcon} className="connect-wallet" alt="" />
          <img src={MobileConnect} alt="" />
        </MobileConnectBtn>
        <a className="logo" href="/">
          <img src={logoNew} width={52} height={52} alt="Harvest" />
        </a>
        <button type="button" onClick={handleMobileShow}>
          <MobileToggle toggleColor={toggleColor} src={Toggle} alt="" />
        </button>
      </MobileView>
    </Container>
  )
}

export default Sidebar
