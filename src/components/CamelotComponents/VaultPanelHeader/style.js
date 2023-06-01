import styled from 'styled-components'
import { Modal } from 'react-bootstrap'

const PanelContainer = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 20px 40px 20px 18px;
  border-top: 1px solid ${props => props.borderColor};
  cursor: pointer;
  color: ${props => props.fontColor};

  @media screen and (max-width: 1510px) {
    flex-direction: row;
    align-items: baseline;
    position: relative;
    padding: 10px 18px;
  }
`

const TokenLogo = styled.img`
  max-width: 30px;
  float: left;

  @media screen and (max-width: 1510px) {
    margin-left: 0;
  }
`

const TokenNameContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 16px;

  @media screen and (max-width: 1510px) {
    font-size: 12px;
    line-height: 16px;
    font-weight: 700;
    margin-bottom: 10px;
  }
`

const TokenDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;

  small {
    font-size: 10px;
  }

  @media screen and (max-width: 1510px) {
    font-weight: 400;
    font-size: 10px;
    line-height: 13px;
  }
`

const RewardsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 600;

  span {
    font-size: 20px;
  }

  b {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const ValueContainer = styled.div`
  font-weight: 400;
  width: ${props => props.width || 'auto'};
  min-width: ${props => props.minWidth || 'auto'};
  text-align: ${props => props.textAlign || 'center'};
  display: flex;
  justify-content: end;
  ${props => (props.textAlign === 'left' ? `justify-content: start;` : '')}
  padding-right: ${props => props.paddingRight || '0px'};
  padding-left: ${props => props.paddingLeft || '0px'};
  ${props =>
    props.position
      ? `
    position: ${props.position};
  `
      : ''}
`

const LogoImg = styled.img`
  z-index: 10;
  &:not(:first-child) {
    margin-left: -7px;
    ${props =>
      props.zIndex
        ? `
      z-index: ${props.zIndex};
    `
        : ``};
  }
`

const BadgeIcon = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: ${props => props.badgeBack};
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  width: 23px;
  height: 23px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 1510px) {
    left: 5px;
    top: 5px;
    border-radius: 2px;
    width: 12px;
    height: 15px;
  }
`

const TokenLogoContainer = styled.div`
  width: ${props => (props.width ? props.width : 'auto')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-right: 5px;
  text-align: left;
  position: relative;

  @media screen and (max-width: 1510px) {
    margin-top: 10px;
  }
`

const TooltipText = styled.div`
  font-weight: normal;
  width: ${props => props.width || 'auto'};
  text-align: ${props => props.textAlign || 'unset'};
`

const NewBadge = styled.img`
  position: absolute;
  top: -4px;
  left: -4px;
  width: 35px;
  height: 35px;
`

const AdditionalBadge = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;
`

const ArrowContainer = styled.div`
  padding: 0px 5.4px;
  background: ${props => (props.open ? '#f2b435' : '#FFFCE6')};
  border-radius: 4px;
  margin-right: 5px;

  svg {
    width: 9px;
    height: 9px;
    transition: 0.25s;
    transform: ${props => (props.open ? 'rotate(-180deg)' : 'unset')};

    path {
      fill: ${props => (props.open ? '#4C351B' : '#F2B435')};
    }
  }
`

const MobileVaultInfoContainer = styled.div`
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
`

const MobileVaultValueContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: baseline;
  line-height: 2;
  font-size: 12px;

  * {
    font-size: 12px !important;
  }

  div {
    font-weight: bold;
  }

  img {
    width: 12px;
    height: 12px;
  }

  .title {
    img {
      margin-left: 7px;
    }
  }
`
const ApyInfo = styled.img`
  margin-top: 4px;
  width: 15px;
  height: 15px;
`

const FlexDiv = styled.div`
  ${props =>
    props.alignSelf
      ? `
    align-self: ${props.alignSelf};
  `
      : ''}
  ${props =>
    props.width
      ? `
    width: ${props.width};
  `
      : 'width: auto;'}
  ${props =>
    props.marginRight
      ? `
    margin-right: ${props.marginRight};
  `
      : ''}
`

const DetailModal = styled(Modal)`
  display: none;
  position: relative;

  @media screen and (max-width: 1510px) {
    .modal-dialog {
      width: -webkit-fill-available;
      position: absolute;
      bottom: 0;
      margin: 0;
      .modal-content {
        border-radius: 20px 20px 0 0;
      }
    }
  }

  @media (min-width: 576px) {
    .modal-dialog {
      max-width: unset;
    }
  }
`
const Value = styled.div`
  font-weight: 600;
`

export {
  PanelContainer,
  TokenLogo,
  RewardsContainer,
  TokenLogoContainer,
  ValueContainer,
  NewBadge,
  AdditionalBadge,
  TooltipText,
  ArrowContainer,
  TokenNameContainer,
  MobileVaultInfoContainer,
  MobileVaultValueContainer,
  TokenDescriptionContainer,
  ApyInfo,
  BadgeIcon,
  FlexDiv,
  DetailModal,
  Value,
  LogoImg,
}
