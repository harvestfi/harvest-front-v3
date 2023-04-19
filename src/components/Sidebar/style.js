import styled from 'styled-components'
import { Dropdown, Offcanvas } from 'react-bootstrap'
import GradientBack from '../../assets/images/logos/gradient.svg'

const Container = styled.div`
  ${props => props.sidebarEffect};

  a.logo {
    color: ${props => props.fontColor};
  }
  transition: 0.25s;
  background: ${props => props.backColor};
  color: ${props => props.fontColor};

  min-height: 100%;
  min-width: ${props => props.width};
  max-width: 100%;
  position: fixed;
  z-index: 10;
  padding: 45px 25px 0px;

  @media screen and (max-width: 992px) {
    display: flex;
    grid-auto-columns: unset;
    flex-direction: column;
    align-items: baseline;
    width: 100%;
    padding: 11px 24px 0 24px;
    position: unset;
    min-height: auto;
  }
`

const Layout = styled.div`
  align-items: center;
  max-width: 1790px;
  margin: auto;

  margin-bottom: 50px;

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

  a.logo {
    display: flex;
    align-items: inherit;
    text-decoration: none;
    font-weight: 700;
    font-size: 24px;
    padding-left: 1rem;

    &:after {
      margin-left: 22px;
      display: block;
      content: 'Harvest';
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
  margin-left: 20px;
  margin-bottom: 24px;
  border-radius: 10px;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }

  @media screen and (min-width: 992px) {
    display: flex;
  }

  @media screen and (max-height: 650px) {
    margin-bottom: 14px;
  }
`

const Link = styled.button`
  color: ${props => props.fontColor};
  transition: 0.25s;
  font-size: 16px;
  font-weight: 500;
  line-height: 21px;
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

  ${props =>
    props.active
      ? `
    color: ${props.activeColor};
    font-weight: bold;
  `
      : ``}

  .sideIcon {
    margin-right: 17px;
  }

  .external-link {
    margin-left: 5px;
    margin-bottom: 14px;
    margin-top: 0;
  }

  @media screen and (max-width: 992px) {
    padding: 30px 0 20px 30px;
    ${props =>
      props.active
        ? `
        font-weight: bold;
        border-width: 0 0 0 4px;
    `
        : `
        font-weight: 500;
    `}
    color: white;
    display: ${props => (props.isDropdownLink ? 'none' : 'flex')};
  }

  &:hover {
    color: ${props => props.activeColor};
    font-weight: bold;
  }

  @media screen and (max-height: 650px) {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
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

const Follow = styled.div`
  padding-top: 16px;
  display: flex;
  justify-content: space-between;

  @media screen and (max-width: 992px) {
    display: none;
  }
`

const ConnectButtonStyle = styled.button`
  font-size: 16px;
  line-height: 21px;
  font-weight: 700;
  margin: 20px 5px;
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

    // width: 85%;
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
    margin-bottom: 15px;
    margin-top: 10px;
  }
`

const MobileConnectBtn = styled.div`
  margin-top: 6px;
  display: flex;
  padding: 7px 12px;
  background: white;

  border: 0.5px solid #d0d5dd;
  box-shadow: 0px 0.5px 1px rgba(16, 24, 40, 0.05);
  border-radius: 4.5px;

  ${props =>
    props.connected
      ? `
      box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05), 0px 0px 0px 4px #f2f4f7;
      img.connect-wallet {
        filter: brightness(0) saturate(100%) invert(69%) sepia(55%) saturate(4720%) hue-rotate(110deg)
          brightness(91%) contrast(86%);
      }
      `
      : `
      `}

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
    padding: 0 36px 15px 11px;
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
  padding-left: 30px;
  margin-bottom: 24px;
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
  filter: ${props => props.filterColor};
  &:hover {
    filter: ${props => props.hoverImgColor};
  }
  transition: 0.25s;
`

const UserDropDown = styled(Dropdown.Toggle)`
  background: white !important;
  border: none !important;
  border-radius: 10px !important;
  color: #15202b !important;
  align-items: center;
  padding: 8px 18px 8px 9px !important;
  width: 100%;
  display: flex !important;
  justify-content: space-between;
  text-align: left;
  position: relative;
  margin: 20px 5px;

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

const ProfitSharing = styled.div`
  background: url(${GradientBack});
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  position: relative;
  padding: 15px 18px;
  border-radius: 13px;
  margin-top: 50px;

  @media screen and (max-width: 992px) {
    display: none;
  }

  @media screen and (max-height: 900px) {
    display: none;
  }
`

const Divider = styled.div`
  height: ${props => (props.height ? props.height : '20px')};
  background: ${props => (props.backColor ? props.backColor : 'unset')};
  margin-top: ${props => (props.marginTop ? props.marginTop : 'unset')};

  @media screen and (max-width: 992px) {
    display: none;
  }
`

const ProfitBack = styled.img`
  border-radius: 13px;
`

const TopDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 23px;
`

const BottomDiv = styled.div`
  font-size: 25px;
  color: white;
  line-height: 42px;
  font-weight: 600;
`

const TopTitle = styled.div`
  display: flex;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #ffffff;
  align-items: center;
  padding: 4px 12px;
  border: 2px solid #eaecf0;
  border-radius: 14px;
  img {
    margin-right: 7px;
    filter: brightness(0) saturate(100%) invert(100%) sepia(17%) saturate(0%) hue-rotate(338deg)
      brightness(101%) contrast(101%);
  }
`

const ChartDiv = styled.div`
  position: absolute;
  bottom: -15px;
  right: 0;
`

const BottomPart = styled.div`
  position: absolute;
  bottom: 20px;
  width: 270px;
`

const MobileProfitSharing = styled.div`
  background: url(${GradientBack});
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  position: relative;
  padding: 15px 18px;
  border-radius: 13px;
  margin: 50px 15px 0;

  @media screen and (min-width: 992px) {
    display: none;
  }
`

const ProfitPart = styled.div`
  position: absolute;
  bottom: 60px;
  width: 100%;

  @media screen and (max-height: 670px) {
    display: none;
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
  Follow,
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
  ProfitSharing,
  ProfitBack,
  TopDiv,
  BottomDiv,
  TopTitle,
  ChartDiv,
  BottomPart,
  MobileProfitSharing,
  ProfitPart,
  Divider,
}
