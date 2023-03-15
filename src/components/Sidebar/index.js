import React, { useState, Fragment, useEffect, useMemo } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Offcanvas, Dropdown } from 'react-bootstrap'
import { Container, Layout, LinksContainer, LinkContainer, Link, AboutHarvest, MiddleActionsContainer, 
  FlexDiv, Follow, ConnectButtonStyle, MobileToggle, OffcanvasDiv,
  MobileView, MobileConnectBtn, MobileActionsContainer, MobileLinksContainer, MobileLinkContainer, 
  MobileLink, MobileFollow, ConnectAvatar, Address, ThemeMode, SideIcons, UserDropDown, UserDropDownItem, UserDropDownMenu,
  ProfitSharing, TopDiv, BottomDiv
} from './style'
import Social from '../Social'
import { useThemeContext } from '../../providers/useThemeContext'
import { ROUTES, FARM_TOKEN_SYMBOL, SPECIAL_VAULTS, DECIMAL_PRECISION } from '../../constants'
import { useWallet } from '../../providers/Wallet'
import { usePools } from '../../providers/Pools'
import { useStats } from '../../providers/Stats'
import { formatAddress, displayAPY, getTotalApy } from '../../utils'
import { CHAINS_ID } from '../../data/constants'
import { Divider } from '../GlobalStyle'
import Home from '../../assets/images/logos/sidebar/home.svg'
import Farms from '../../assets/images/logos/sidebar/farms.svg'
import Dashboard from '../../assets/images/logos/sidebar/dashboard.svg'
import Analytics from '../../assets/images/logos/sidebar/analytics.svg'
import Docs from '../../assets/images/logos/sidebar/docs.svg'
import FAQ from '../../assets/images/logos/sidebar/faq.svg'
import logoNew from '../../assets/images/logos/sidebar/ifarm.svg'
import MobileConnect from '../../assets/images/logos/sidebar/mobileconnect.svg'
import Toggle from '../../assets/images/logos/sidebar/toggle.svg'
import connectAvatar from '../../assets/images/logos/sidebar/connectavatar.svg'
import Sun from '../../assets/images/logos/sidebar/sun.svg'
import Moon from '../../assets/images/logos/sidebar/moon.svg'
import ConnectButtonIcon from '../../assets/images/logos/sidebar/link_white_connect_button.svg'
import ExternalLink from '../../assets/images/logos/sidebar/external_link.svg'
import polygon from '../../assets/images/logos/sidebar/polygon.svg'
import ethereum from '../../assets/images/logos/sidebar/ethereum.svg'
import binance from '../../assets/images/logos/sidebar/binance.svg'
import ChangeWalletIcon from '../../assets/images/logos/sidebar/change_wallet.svg'
import LogoutIcon from '../../assets/images/logos/sidebar/logout.svg'
import ConnectSuccessIcon from '../../assets/images/logos/sidebar/connect-success.svg'
// import GradientBack from '../../assets/images/logos/gradient.svg'
import ProfitSharingIcon from '../../assets/images/logos/sidebar/profit-sharing.svg'
import ProfitSharingTitle from '../../assets/images/logos/sidebar/profit-sharing-title.svg'
import Line from '../../assets/images/logos/sidebar/line.svg'
import ConnectDisableIcon from '../../assets/images/logos/sidebar/connect-disable.svg'

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
    <Link
      fontColor={fontColor}
      active={pathname.includes(item.path)}
      subItem={subItem}
      isDropdownLink={isDropdownLink}
      activeColor={activeFontColor}
    >
      <div className="item">
        <SideIcons className="sideIcon" src={item.imgPath} alt="Harvest" filterColor={filterColor} />
      </div>
      {item.name}
      {
        item.external ? 
        <div className="item">
          <SideIcons className="external-link" src={ExternalLink} alt="external-link" filterColor={filterColor} />
        </div>
        : <></>
      }
    </Link>
  )
}

const Sidebar = ( {width} ) => {
  const { account, connect, chainId, connected, openAccountModal, openChainModal, chainObject } = useWallet()
  const { pools, disableWallet } = usePools()
  const { profitShareAPY } = useStats()

  const selectedChain = (chain) => {
    let chainName = ""
    chain = chain.toString()
    switch(chain) {
      case CHAINS_ID.ETH_MAINNET:
        chainName = ethereum
        break
      case CHAINS_ID.BSC_MAINNET:
        chainName = binance
        break
      case CHAINS_ID.MATIC_MAINNET:
        chainName = polygon
        break
      
      default:
        chainName = ethereum
        break
    }
    return chainName
  }

  const { darkMode, setDarkMode, backColor, fontColor, filterColor, hoverImgColor, sidebarEffect,
    switchDarkIconFilter, switchLightIconFilter, switchLightBorder, switchDarkBorder, switchDarkBack, 
    switchLightBack, toggleColor, borderColor, connectWalletBtnBackColor, toggleBackColor,
    sidebarFontColor, sidebarActiveFontColor } = useThemeContext()

  const switchTheme = () => setDarkMode((prev) => !prev)
  useEffect(() => {
    darkMode
      ? document.documentElement.setAttribute("darkMode", "")
      : document.documentElement.removeAttribute("darkMode", "")
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
    [
      profitShareAPY,
      farmProfitSharingPool,
    ],
  )  
  const token = poolVaults["FARM"]

  const totalApy = getTotalApy(null, token, true)

  return (
    <Container width={width} sidebarEffect={sidebarEffect} backColor={backColor} fontColor={fontColor}>
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
                    color={'connectwallet'}
                    onClick={()=>{ connect() }}
                    minWidth="190px"
                    bordercolor={fontColor}
                    disabled={disableWallet}
                  >
                    <img src={ConnectDisableIcon} className="connect-wallet" alt="" />Connect Wallet
                  </ConnectButtonStyle>
                );
              }

              if (!chainId) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <Dropdown>
                  <UserDropDown id="dropdown-basic" fontcolor={fontColor} hoverbackcolor={connectWalletBtnBackColor}>
                    <FlexDiv>
                      <ConnectAvatar avatar>
                        <img src={connectAvatar} alt=""/>
                      </ConnectAvatar>
                      <div className="detail-info">
                        <Address>{formatAddress(account)}</Address>
                        <br/>
                        <ConnectAvatar>
                          {chainObject && chainObject.iconUrl && (
                            <img
                              alt={chainObject.name ?? 'Chain icon'}
                              src={ConnectSuccessIcon}
                              style={{ width: 8, height: 8 }}
                            />
                          )}Connected
                        </ConnectAvatar>
                      </div>
                    </FlexDiv>
                    <img
                      alt={chainObject.name ?? 'Chain icon'}
                      src={chainObject.iconUrl}
                      style={{ width: 17, height: 17 }}
                    />
                    {/* <img className="narrow" src={DropDownNarrow} alt="" /> */}
                  </UserDropDown>

                  <UserDropDownMenu backcolor={backColor} bordercolor={borderColor}>
                    <UserDropDownItem onClick={()=>{ openChainModal() }} fontcolor={fontColor} filtercolor={filterColor} bordercolor={borderColor}>
                      <img className="change-icon" src={ChangeWalletIcon} width={"18px"} height={"18px"} alt="" />
                      <div>Change Network</div>
                    </UserDropDownItem>

                    <UserDropDownItem onClick={()=>{ openAccountModal() }} fontcolor={fontColor} filtercolor={filterColor}>
                      <img src={LogoutIcon} width={"18px"} height={"18px"} alt="" />
                      <div>Log Out</div>
                    </UserDropDownItem>
                  </UserDropDownMenu>
                </Dropdown>
              );
            })()}

            {sideLinks.map(item => (
              <Fragment key={item.name}>
                <LinkContainer
                  active={pathname.includes(item.path)}
                  activeColor={item.activeColor}
                  hoverImgColor={hoverImgColor}
                  onClick={()=>{
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
          <AboutHarvest>
            {/* About */}  
          </AboutHarvest>
          <LinksContainer totalItems={sideLinks1.length + 2}>
            {sideLinks1.map(item => (
              <Fragment key={item.name}>
                <LinkContainer
                  active={pathname.includes(item.path)}
                  hoverImgColor={hoverImgColor}
                  onClick={()=>{
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
        </MiddleActionsContainer>
      </Layout>
      <ProfitSharing>
        <TopDiv>
          <img src={ProfitSharingIcon} alt="profit-sharing" />
          <img src={ProfitSharingTitle} alt="profit-sharing" />
        </TopDiv>
        <BottomDiv>
          <div>
            {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
            <div>APR</div>
          </div>
          <img src={Line} alt="chart" />
        </BottomDiv>
      </ProfitSharing>

      <Divider height="1px" marginTop="20px" backColor="#EAECF0" />

      <Follow>
        <Social/>
        <ThemeMode mode={darkMode ? "dark" : "light"} backColor={toggleBackColor} borderColor={borderColor}>
          <div id="theme-switch">
            <div className="switch-track">
              <div className="switch-thumb"></div>
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
      
      <MobileView>
        <button onClick={handleMobileShow}>
          <MobileToggle toggleColor={toggleColor} src={Toggle} alt="" />
        </button>

        <OffcanvasDiv show={mobileShow} onHide={handleMobileClose} backcolor={backColor} fontcolor={fontColor}>
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
                        color={'connectwallet'}
                        onClick={()=>{ connect() }}
                        minWidth="190px"
                        bordercolor={fontColor}
                        disabled={disableWallet}
                      >
                        <img src={ConnectButtonIcon} className="connect-wallet" alt="" />Connect Wallet
                      </ConnectButtonStyle>
                    );
                  }

                  if (!chainId) {
                    return (
                      <button onClick={openChainModal} type="button">
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <Dropdown>
                    <UserDropDown id="dropdown-basic" fontcolor={fontColor} hoverbackcolor={connectWalletBtnBackColor}>
                      <FlexDiv>
                        <ConnectAvatar avatar>
                          <img src={connectAvatar} alt=""/>
                        </ConnectAvatar>
                        <div className="detail-info">
                          <Address>{formatAddress(account)}</Address>
                          <br/>
                          <ConnectAvatar>
                            {chainObject && chainObject.iconUrl && (
                              <img
                                alt={chainObject.name ?? 'Chain icon'}
                                src={ConnectSuccessIcon}
                                style={{ width: 8, height: 8 }}
                              />
                            )}Connected
                          </ConnectAvatar>
                        </div>
                      </FlexDiv>
                      <img
                        alt={chainObject.name ?? 'Chain icon'}
                        src={chainObject.iconUrl}
                        style={{ width: 17, height: 17 }}
                      />
                      {/* <img className="narrow" src={DropDownNarrow} alt="" /> */}
                    </UserDropDown>

                      <UserDropDownMenu backcolor={backColor} bordercolor={borderColor}>
                        <UserDropDownItem onClick={()=>{ openChainModal() }} fontcolor={fontColor} filtercolor={filterColor} bordercolor={borderColor}>
                          <img className="change-icon" src={ChangeWalletIcon} width={"18px"} height={"18px"} alt="" />
                          <div>Change Network</div>
                        </UserDropDownItem>

                        <UserDropDownItem onClick={()=>{ openAccountModal() }} fontcolor={fontColor} filtercolor={filterColor}>
                          <img src={LogoutIcon} width={"18px"} height={"18px"} alt="" />
                          <div>Log Out</div>
                        </UserDropDownItem>
                      </UserDropDownMenu>
                    </Dropdown>
                  );
                })()}

                {sideLinks.map(item => (
                  <Fragment key={item.name}>
                    <MobileLinkContainer
                      active={pathname.includes(item.path)}
                      activeColor={item.activeColor}
                      hoverImgColor={hoverImgColor}
                    >
                      <div className="item">
                        <SideIcons src={item.imgPath} width={15} height={15} alt="Harvest" />
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
              <AboutHarvest>
                About
              </AboutHarvest>
              {sideLinks1.map(item => (
                  <Fragment key={item.name}>
                    <MobileLinkContainer
                      active={pathname.includes(item.path)}
                      activeColor={item.activeColor}
                      hoverImgColor={hoverImgColor}
                    >
                      <div className="item">
                        <SideIcons src={item.imgPath} width={15} height={15} alt="Harvest" filterColor={filterColor} />
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
                      {
                        item.external ? 
                        <div className='item'>
                          <SideIcons className="external-link" src={ExternalLink} alt="external-link" filterColor={filterColor} />
                        </div>
                        : <></>
                      }
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
            <MobileFollow>
              <Social/>
              <ThemeMode switchDarkIconFilter={switchDarkIconFilter} switchLightIconFilter={switchLightIconFilter} 
                switchLightBorder={switchLightBorder} switchDarkBorder={switchDarkBorder} switchDarkBack={switchDarkBack} switchLightBack={switchLightBack}>
                <div id="switch-theme" className="ms-3">
                  <div className="track-switch">
                    <div className="switch-light">
                      <span className="switch-icon"><img src={Sun} alt="" /></span>
                    </div>
                    <div className="switch-dark">
                    <span className="switch-icon"><img src={Moon} alt="" /></span>
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
            </MobileFollow>
          </Offcanvas.Body>
        </OffcanvasDiv>

        <a className="logo" href="/">
          <img src={logoNew} width={52} height={52} alt="Harvest" />
        </a>

        {account ? 
          <MobileConnectBtn
            color={'connected'}
            connected
            onClick={()=>{ openAccountModal() }}
          >
            <FlexDiv>
              <ConnectAvatar>
                <img src={connectAvatar} width={37} height={37} alt=""/>
              </ConnectAvatar>
              <div>
                <ConnectAvatar>
                  <img src={selectedChain(chainId)} height="15" width="15" alt=""/>
                </ConnectAvatar>
              </div>
            </FlexDiv>
          </MobileConnectBtn> :
          <MobileConnectBtn
            color={'connectwallet'}
            // openHambuger={openedHambuger}
            onClick={()=>{ connect() }}
            // minWidth="auto"
          >
            <img src={MobileConnect} alt="" />
          </MobileConnectBtn>}
      </MobileView>
    </Container>
  )
}

export default Sidebar
