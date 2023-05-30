import styled from 'styled-components'
import UsdIcon from '../../../assets/images/ui/usd.svg'
import TokensIcon from '../../../assets/images/ui/tokens.svg'

const Container = styled.div`
  overflow: hidden;

  margin-bottom: 20px;
  padding: 70px 76px 56px;

  width: 100%;

  position: relative;

  @media screen and (max-width: 1510px) {
    padding: 20px 0px;
    width: 93%;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 27px 40px 27px 20px;
  color: ${props => props.fontColor};

  img.sort-icon {
    filter: ${props => props.filterColor};
  }

  transition: 0.25s;
  @media screen and (max-width: 1510px) {
    display: none;
  }
`

const HeaderCol = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent || 'end'};
  align-items: center;
  width: ${props => props.width || 'auto'};
  text-align: ${props => props.textAlign || 'center'};
  margin: ${props => props.margin || 'unset'};
  font-weight: 700;
  font-size: 16px;
  line-height: 14px;

  img.sort-icon {
    margin-left: 10px;
  }

  .hoverable {
    &:hover {
      cursor: pointer;
      color: #ff9400;
    }
  }
`

const FlexDiv = styled.div`
  display: flex;
`

const EmptyPanel = styled.div`
  color: ${props => props.fontColor};
  padding-top: 10%;
  padding-bottom: 30%;
  @media screen and (max-width: 1510px) {
    padding-top: 70px;
  }
`

const EmptyImg = styled.img`
  margin: auto;
`

const EmptyInfo = styled.div`
  ${props =>
    props.weight
      ? `
    font-weight: ${props.weight};
  `
      : ''}
  ${props =>
    props.size
      ? `
    font-size: ${props.size}px;
  `
      : ''}
  ${props =>
    props.height
      ? `
    line-height: ${props.height}px;
  `
      : ''}
  color: ${props => props.fontColor};
  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}

  text-align: center;
`

const VaultsListBody = styled.div`
  border: 1px solid ${props => props.borderColor};
  background: ${props => props.backColor};
  transition: 0.25s;
  border-radius: 10px;
`

const MobileListFilter = styled.div`
  .filter-sort {
    display: none;
  }

  @media screen and (max-width: 1510px) {
    width: 100%;
    height: 7.8rem;
    display: flex;
    justify-content: end;
    flex-direction: column;

    .filter-sort {
      display: block;
      margin: 10px 20px 15px 20px;
      background: ${props => props.mobileBackColor} !important;
      border: ${props => props.borderColor};
      border-radius: 5px;
      position: relative;
      color: #888e8f;

      .menu {
        width: 100%;
        background: ${props => props.backColor} !important;

        .item {
          div {
            color: ${props => props.fontColor} !important;
          }
        }
      }

      &.show {
        .toggle {
          background: ${props => props.mobileBackColor};
          color: #888e8f;
          border: none;
        }
      }
      .toggle {
        background: ${props => props.mobileBackColor};
        color: #888e8f;
        display: flex;
        border: none;
        width: 100%;
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        padding: 12px 11px 11px 11px;

        &:after {
          display: none;
        }

        input {
          background: #f5f5f5;
          width: 100%;
          border: 0px;
        }

        img.sort {
          margin-right: 6px;
          filter: ${props => props.filterColor};
        }

        img.narrow {
          position: absolute;
          right: 10px;
          top: 12px;
        }
      }
    }
  }
`

const Filtersinput = styled.input`
  background: #ffffff;
  border: 0px;
  outline: 0;
  border-radius: 5px;
  color: #888e8f;
  padding: 12px 20px 12px 32px;
  width: 80%;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;

  &:active {
    border: 0px;
  }
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
      background: url(${props => (props.mode === 'usd' ? UsdIcon : TokensIcon)});
      background-size: cover;
      height: 22px;
      left: 1px;
      position: absolute;
      top: 1px;
      width: 22px;
      border-radius: 50%;
      transition: all 0.25s ease 0s;
    }

    &:hover .switch-thumb {
      box-shadow: 0 0 2px 3px #ff9400;
    }
  }

  ${props =>
    props.mode === 'token'
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

export {
  Container,
  Header,
  HeaderCol,
  EmptyPanel,
  EmptyImg,
  EmptyInfo,
  FlexDiv,
  VaultsListBody,
  MobileListFilter,
  Filtersinput,
  ThemeMode,
}
