import styled from 'styled-components'
import { Dropdown, Offcanvas } from 'react-bootstrap'

const Container = styled.div`
  ${props => props.sidebarEffect};

  a.logo {
    color: ${props => props.fontColor};
  }
  transition: 0.25s;
  background: ${props => props.backColor};
  color: ${props => props.fontColor};

  min-height: 652px;
  height: 100%;
  min-width: ${props => props.width};
  max-width: 100%;
  position: fixed;
  z-index: 10;
  padding: 25px 25px;

  @media screen and (max-width: 992px) {
    display: flex;
    grid-auto-columns: unset;
    flex-direction: column;
    align-items: baseline;
    width: 100%;
    padding: 11px 35px 0 35px;
    min-height: auto;
    box-shadow: 0px -5px 5px 0px rgba(215, 215, 215, 0.28);
    border: none;
    bottom: 0;
    height: fit-content;
    z-index: 1048;
  }
`

const Layout = styled.div`
  align-items: center;
  max-width: 1790px;

  @media screen and (max-width: 992px) {
    display: none;
    padding: 10px 30px;
    flex-wrap: wrap;
    margin: 0;
    background-color: transparent;
    align-items: unset;
    overflow: hidden;
    transform: translateX(-300px);
    transition: transform 0.3s ease-in-out 0s;
  }

  @media screen and (max-width: 400px) {
    padding: 10px;
  }
`

const LinksContainer = styled.div`
  justify-content: space-between;
  align-items: center;
  margin: 0 0px auto;
  transition: 0.25s;

  div.logo {
    display: flex;
    align-items: inherit;
    text-decoration: none;
    font-weight: 700;
    font-size: 24px;

    &:after {
      margin-left: 22px;
      display: block;
      content: 'Harvest';
      color: #475467;
    }
  }

  @media screen and (max-width: 992px) {
    display: none;
    margin: 100px 0 80px 0;
    grid-auto-columns: unset;
    flex-direction: column;
    align-items: baseline;
  }
`

const LinkContainer = styled.div`
  position: relative;
  margin-bottom: 10px;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }

  @media screen and (min-width: 992px) {
    display: flex;
  }
`

const Link = styled.button`
  color: #344054;
  transition: 0.25s;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  transition: 0.25s;
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  background-color: transparent;
  cursor: pointer;
  padding: 8px 12px;
  border-width: 0;
  border-radius: 5px;
  padding: 5px;

  .sideIcon {
    width: 24px;
    height: 24px;
    margin-right: 13px;
    filter: invert(48%) sepia(4%) saturate(2341%) hue-rotate(183deg) brightness(87%) contrast(80%);
  }

  ${props =>
    props.enabled === 'false'
      ? `
      pointer-events: none;
      color: #a4a4a4;

      img.sideIcon {
        filter: invert(81%) sepia(0%) saturate(1%) hue-rotate(315deg) brightness(82%) contrast(85%);
      }
    `
      : ``}

  ${props =>
    props.active
      ? `
    color: #036666;
    background: rgba(3, 102, 102, 0.07);
    ${
      props.darkMode
        ? `
      img {
        filter: invert(32%) sepia(12%) saturate(4979%) hue-rotate(141deg) brightness(88%) contrast(98%);
      }
    `
        : `
        img {
          filter: invert(32%) sepia(12%) saturate(4979%) hue-rotate(141deg) brightness(88%) contrast(98%) !important;
        }
      `
    }
  `
      : `
      `}

  .external-link {
    margin-left: 5px;
    margin-bottom: 14px;
    margin-top: 0;
  }

  @media screen and (max-width: 992px) {
    color: #000;
    text-align: center;
    font-size: 16.494px;
    font-weight: 400;
    line-height: 21.649px; /* 131.25% */
    ${props =>
      props.enabled === 'false'
        ? `
        pointer-events: none;
        color: #a4a4a4;
  
        img.sideIcon {
          filter: invert(81%) sepia(0%) saturate(1%) hue-rotate(315deg) brightness(82%) contrast(85%);
        }
      `
        : ``}
    ${props =>
      props.active
        ? `
        font-weight: bold;
    `
        : `
    `}
    display: ${props => (props.isDropdownLink ? 'none' : 'flex')};

    img {
      width: 20px;
      height: 20px;
    }
  }

  &:hover {
    color: #036666;
    img {
      filter: invert(32%) sepia(12%) saturate(4979%) hue-rotate(141deg) brightness(88%)
        contrast(98%);
    }
  }
`

const MiddleActionsContainer = styled.div`
  flex-basis: 520px;

  @media screen and (max-width: 992px) {
    display: none;
  }
`

const FlexDiv = styled.div`
  display: flex;
  text-align: center;
  label {
    padding: 0.4rem;
    display: flex;
    justify-content: center;
  }

  .detail-info {
    align-self: center;
  }

  input[type='checkbox'] {
    accent-color: #188e54;
    width: 20px;
    height: 20px;
    padding: 4px;
    border-radius: 6px;
  }
`

const ConnectButtonStyle = styled.button`
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  margin: 25px 0px;
  width: 100%;
  background: white;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  color: #344054;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
  cursor: pointer;

  ${props =>
    props.connected
      ? `
      padding: 7px 45px 7px 11px;
      filter: drop-shadow(0px 4px 52px rgba(0, 0, 0, 0.25));

      &:hover {
        background: #E6F8EB;
      }
    `
      : `
      padding: 15px 0px 15px 0px;
    `}

  &:hover {
    box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #f2f4f7;
    img.connect-wallet {
      filter: brightness(0) saturate(100%) invert(69%) sepia(55%) saturate(4720%) hue-rotate(110deg)
        brightness(91%) contrast(86%);
    }
  }

  img.connect-wallet {
    margin-right: 25px;
  }

  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0 20px 13px;

    ${props =>
      props.connected
        ? `
      background: none;
      color: ${props.fontcolor};
      font-size: 11px;
      padding: 2px 16px 2px 7px;
      border: 1px solid ${props.bordercolor};
      `
        : `
      padding: 10px 11px;
      font-size: 13px;
      `}

    img.connect-wallet {
      margin-right: 15px;
      width: 14px;
      height: 14px;
    }
  }
`

const AboutHarvest = styled.div`
  font-size: 16px;
  font-weight: 700;

  margin-top: 30px;
  margin-bottom: 30px;
  padding-left: 13px;

  height: 30px;

  @media screen and (max-width: 992px) {
    margin-bottom: 24px;
    margin-top: 0;
    height: 0;
  }
`

const Mobile = styled.div`
  display: none;
  position: relative;
  width: 100%;

  button {
    background: none;
    border: 0px;
  }

  @media screen and (max-width: 992px) {
    display: block;
  }
`

const MobileView = styled.div`
  display: none;
  position: relative;
  width: 100%;

  button {
    background: none;
    border: 0px;
  }

  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    margin-top: 10px;
  }
`

const MobileConnectBtn = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
  padding: 7px 13px;
  border-radius: 6.15px;
  border: 0.769px solid #000;
  background: #000;
  box-shadow: 0px 0.76875px 1.5375px 0px rgba(16, 24, 40, 0.05);
  color: #fff;
  font-size: 12.3px;
  font-style: normal;
  font-weight: 600;
  line-height: 18.45px; /* 150% */

  .connect-wallet {
    margin-right: 8px;
  }
`

const MobileActionsContainer = styled.div`
  height: 100%;
  width: 100%;
  background-size: cover;
  z-index: 10;
  overflow: scroll;
  padding: 15px 36px 15px 11px;
  flex-direction: column;
  animation: fadeIn;
  animation-duration: 0.45s;

  @media screen and (max-width: 992px) {
    padding: 25px;
  }
`

const MobileLinksContainer = styled.div`
  justify-content: space-between;
  align-items: center;
  margin: 0 0px auto;

  a.logo {
    display: flex;
    align-items: inherit;
    text-decoration: none;
    font-weight: 700;
    font-size: 16px;

    &:after {
      margin-left: 22px;
      display: block;
      content: 'Harvest';
      color: ${props => props.color};
    }
  }
`

const MobileLinkContainer = styled.div`
  display: flex;
  position: relative;
  padding: 4px;
  margin-bottom: 15px;
  border-radius: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`

const MobileLink = styled.button`
  font-size: 16px;
  font-weight: 700;
  line-height: 19px;
  align-items: end;
  justify-content: start;
  color: ${props => props.fontColor};
  background-color: transparent;
  cursor: pointer;
  margin-left: 1rem;
  border-width: 0;
  ${props =>
    props.active
      ? `
    opacity: 1;
    font-weight: 800;
    color: ${props.activeFontColor} !important;
    transition: 0.25s;
  `
      : `
    opacity: 0.85;
  `}

  display: flex;

  &:hover {
    opacity: 1;
  }
`

const MobileFollow = styled.div`
  left: 12px;
  display: flex;
  justify-content: space-between;
  width: 90%;
  position: absolute;
  bottom: 5px;
`

const ConnectAvatar = styled.div`
  display: flex;
  align-items: center;
  margin-right: ${props => (props.avatar ? '13px' : '-13px')};
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  transition: 0.25s;
  img {
    margin-right: 5px;
  }
`

const Address = styled.span`
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
`

const ThemeMode = styled.div`
  display: flex;

  #theme-switch {
    position: relative;
    width: fit-content;
    height: fit-content;
    touch-action: pan-x;
    user-select: none;

    input {
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      opacity: 0;
    }

    .switch-track {
      background: ${props => props.backColor};
      border: 1px solid ${props => props.borderColor};
      height: 24px;
      width: 50px;
      border-radius: 30px;
      transition: all 0.2s ease 0s;
    }
    .switch-thumb {
      background: white;
      background-size: cover;
      height: 20px;
      left: 2px;
      position: absolute;
      top: 2px;
      width: 20px;
      border-radius: 50%;
      transition: all 0.25s ease 0s;
    }

    &:hover .switch-thumb {
      box-shadow: 0 0 2px 3px #ff9400;
    }
  }

  ${props =>
    props.mode === 'light'
      ? `
      #theme-switch {
        .switch-check {
          opacity: 1;
        }
        .switch-x {
          opacity: 0;
        }
        .switch-thumb {
          left: 27px;
        }
      }
    `
      : `
      
    `}
`

const SideIcons = styled.img`
  transition: 0.25s;
`

const UserDropDown = styled(Dropdown.Toggle)`
  background: white !important;
  border: none !important;
  border-radius: 10px !important;
  color: #15202b !important;
  align-items: center;
  padding: 8px 18px 8px 0px !important;
  width: 100%;
  display: flex !important;
  justify-content: space-between;
  text-align: left;
  position: relative;
  margin: 20px 0px;

  &:after {
    display: none !important;
  }

  &:hover {
    background: ${props => props.hoverbackcolor} !important;
    color: black;
    font-weight: 500;
  }

  &:active {
    background: green;
    color: black;
  }

  .chain-name {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    margin-left: 5px;
  }

  img.narrow {
    position: absolute;
    right: 15px;
    top: 15px;
  }

  @media screen and (max-width: 992px) {
    margin-left: 13px;
  }
`

const UserDropDownMenu = styled(Dropdown.Menu)`
  background-color: ${props => props.backcolor} !important;
  border: 1px solid ${props => props.bordercolor} !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
  border-radius: 12px !important;
  padding: 0;
  min-width: 8rem;
  width: 100% !important;
  margin-top: 6px;

  &:focus {
    box-shadow: none;
  }
`

const UserDropDownItem = styled(Dropdown.Item)`
  padding: 12px 0px !important;
  margin: 0 23px !important;
  text-align: left;
  display: flex !important;
  justify-content: start;
  ${props =>
    props.bordercolor
      ? `
    border-bottom: 0.5px solid ${props.bordercolor} !important;
  `
      : `
  `}
  width: auto !important;
  color: ${props => props.fontcolor} !important;

  img {
    filter: ${props => props.filtercolor};
  }

  &:hover {
    background: none !important;

    img {
      filter: invert(63%) sepia(58%) saturate(3702%) hue-rotate(0deg) brightness(107%)
        contrast(105%);
    }
    div {
      color: #ff9400;
    }
  }

  img {
    margin-right: 15px;
    margin-left: 10px;
  }

  div {
    align-self: center;
    font-weight: 700;
    font-size: 14px;
    line-height: 18px;
  }

  img.change-icon {
    transform: scale(1.5);
  }
`

const MobileToggle = styled.img`
  filter: ${props => props.toggleColor};
`

const OffcanvasDiv = styled(Offcanvas)`
  background-color: ${props => props.backcolor} !important;
  color: ${props => props.fontcolor};
  transition: 0.25s;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-top: 1px solid #e9e9e9;
  border-right: 1px solid #e9e9e9;
  border-left: 1px solid #e9e9e9 !important;
  a.logo {
    color: ${props => props.fontcolor};
  }

  .offcanvas-header {
    justify-content: end;

    .btn-close {
      filter: ${props => props.filtercolor};
    }
  }
`

const ProfitBack = styled.img`
  border-radius: 13px;
`

const BottomPart = styled.div``

const Logo = styled.div`
  cursor: pointer;
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  line-height: 36px; /* 150% */

  @media screen and (max-width: 992px) {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 25px;
    margin-bottom: 9px;
    img {
      margin-right: 22px;
    }
  }
`

const Desktop = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media screen and (max-width: 992px) {
    display: none;
  }
`

const NewTag = styled.div`
  border-radius: 16px;
  background: #036666;
  padding: 2px 8px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: white !important;
  margin-left: 10px;
`

const LinkMobile = styled.button`
  font-size: 10px;
  line-height: 13px;
  color: #484c52;
  transition: 0.25s;
  display: flex;
  align-items: center;
  justify-content: start;
  width: 100%;
  background-color: transparent;
  cursor: pointer;
  padding-left: 0;
  padding-right: 0;
  border-width: 0;
  border-radius: 5px;
  padding: 5px;
  flex-direction: column;
  ${props =>
    props.enabled === 'false'
      ? `
      pointer-events: none;
      color: #a4a4a4;

      img.sideIcon {
        filter: invert(81%) sepia(0%) saturate(1%) hue-rotate(315deg) brightness(82%) contrast(85%);
      }
    `
      : ``}

  .sideIcon {
    margin-right: 0;
    margin-bottom: 5px;
  }

  ${props =>
    props.active
      ? `
      font-weight: 500;
      color: #ff9400;
      img {
        filter: invert(52%) sepia(76%) saturate(706%) hue-rotate(358deg) brightness(101%) contrast(108%);
      }
  `
      : `
      font-weight: 400;
  `}
  display: ${props => (props.isDropdownLink ? 'none' : 'flex')};
`

const MobileMenuContainer = styled.div`
  display: flex;

  &:last-child {
    margin-bottom: 0;
  }
`

const ConnectSection = styled.div`
  display: flex;
  justify-content: center;
  padding: 7px 15px 20px;

  ${props =>
    props.connected
      ? `
       display: none;
      `
      : `
        display: flex;
      `}
`

const MoreBtn = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #484c52;
  font-size: 10.229px;
  font-style: normal;
  font-weight: 400;
  line-height: 13.639px; /* 133.333% */

  img {
    margin-bottom: 5px;
  }
`

export {
  Container,
  Layout,
  LinksContainer,
  LinkContainer,
  Link,
  MiddleActionsContainer,
  FlexDiv,
  Address,
  ConnectButtonStyle,
  AboutHarvest,
  MobileView,
  MobileConnectBtn,
  MobileToggle,
  OffcanvasDiv,
  MobileActionsContainer,
  MobileLinksContainer,
  MobileLinkContainer,
  MobileLink,
  MobileFollow,
  ConnectAvatar,
  ThemeMode,
  SideIcons,
  UserDropDown,
  UserDropDownItem,
  UserDropDownMenu,
  ProfitBack,
  BottomPart,
  Logo,
  Desktop,
  NewTag,
  LinkMobile,
  MobileMenuContainer,
  Mobile,
  ConnectSection,
  MoreBtn,
}
