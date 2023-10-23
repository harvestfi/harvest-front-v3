import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
html {
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: contain;
  background-position: bottom left;
  height: 100%;

  body {
    // font-family: 'DM Sans';
    // font-family: 'Work Sans';
    // font-family: 'Montserrat', 'Helvetica', sans-serif;
    font-family: 'Inter', sans-serif;
    background-repeat: no-repeat;
    margin: 0px;
    // min-height: 100%;
    height: 100%;
    &::-webkit-scrollbar {
      display: none;
    }
    background-size: 100vw auto;
    background-position: bottom left;
    // padding-bottom: 1%;

    .offcanvas {
      width: 65%;
      display: none;
    }

    input[type="number"] {
      -moz-appearance: textfield;
    }

    .offcanvas-backdrop {
      background: none;
    }

    @media screen and (max-width: 992px) {
      .offcanvas {
        display: block;
        width: 70% !important;

        .offcanvas-body {
          padding: 0;
        }
      }
    }
  }

  #root {
    position: relative;
    height: 100%;

    @media screen and (max-width: 1200px) {
      position: unset;
    }
  }


  @media screen and (max-width: 1200px) {
    background-position: top left;
  }
}

.Collapsible, .Collapsible__contentInner {
  @media screen and (max-width: 860px) {
    overflow: initial;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

  a {
    color: black;
    font-weight: bold;
  }

  .fixed-tooltip {
    top: 0px !important;
    left: -250px !important;
    position: absolute !important;

    &::after, &::before {
      top: 20% !important;
    }
  }

  .Toastify__close-button {
    color: black !important;
  }

  .Toastify__progress-bar {
    background-color: hsl(0deg 0% 0% / 18%) !important;
  }
  
  .Toastify__toast--error, .Toastify__toast--success {
    box-shadow: 3px 3px black !important;
    color: white !important;
    // font-family: Work Sans;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    padding: 20px;
    text-align: left;
    font-size: 14px;
    line-height: 17px;
    border-radius: 10px;
  }

  .Toastify__toast--error {
    background: #FF5733 !important;
  }

  .Toastify__toast--success {
    background: #1BC27C !important;
  }

  .react-toggle {
    touch-action: pan-x;
    display: inline-block;
    position: relative;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    padding: 0;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
  }

  .w-190 {
    min-width: 190px;
    max-width: 190px;
    word-break: break-all;
  }

  .react-toggle-screenreader-only {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  
  .react-toggle--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transition: opacity 0.25s;
  }
  
  .react-toggle-track {
    width: 30px;
    height: 16px;
    border: 1px solid #DADFE6;
    padding: 0;
    border-radius: 30px;
    background-color: #F2F8FF;
    transition: all 0.2s ease;
  }
  
  .react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track {
    background-color: unset;
  }
  
  .react-toggle--checked .react-toggle-track {
    background-color: #FFE3BD;
    border: 1px solid #FFC87C;
  }
  
  .react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {
    background-color: unset;
  }
  
  .react-toggle--checked .react-toggle-track-check {
    opacity: 1;
    transition: opacity 0.25s ease;
  }
  
  .react-toggle-track-x, .react-toggle-track-check  {
    display: none;
  }
  
  .react-toggle--checked .react-toggle-track-x {
    opacity: 0;
  }
  
  .react-toggle-thumb {
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    position: absolute;
    top: 1px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #A9AEB3;
    box-sizing: border-box;
    transition: all 0.25s ease;
  }
  
  .react-toggle--checked .react-toggle-thumb {
    left: 16px;
    background-color: #F2B435;
    border-color: unset;
  }
  
  .react-toggle--focus .react-toggle-thumb {
    box-shadow: unset;
  }
  
  .react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
    box-shadow: unset;
  }

  .__react_component_tooltip {
  //   border: 2px solid black !important;
    border-radius: 8px !important;
  //   background-color: black !important;
    padding: 8px !important;
    padding-left: 12px !important;
    padding-right: 12px !important;

    @media screen and (max-width: 450px) {
      left: 0 !important;

      ul, div {
        font-size: 13px !important;
      }

      &:before, &:after {
        display: none;
      }
    }
  }

  .priceshare .__react_component_tooltip {
    opacity: 1 !important;
    width: 500px;
    padding: 12px;
    
    box-shadow: 0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08);
  }

  .beginners .__react_component_tooltip {
    border-radius: 8px !important;
    box-shadow: 0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08);
    opacity: 1 !important;
  }

  .web3modal-modal-lightbox {
    z-index: 20;
  }

  .web3modal-modal-card {
    border-radius: 8px;
    background: linear-gradient(rgb(218,239,240) 0%,rgb(218 239 240 / 90%) 100%);
  }

  .web3modal-provider-container, .web3modal-chain-container  {
    background: transparent;
  }

  .web3modal-provider-wrapper, .web3modal-chain-wrapper {
    border: unset;
    padding: 0;
  }

  .active {
    background-color: rgb(128, 180, 209);
    border-radius: 0px;
  }

  .web3modal-provider-description {
    color: black;
  }

  .web3modal-provider-container, .web3modal-chain-wrapper {
    border-radius: 0px;

    &:hover {
      background-color: rgb(128, 180, 209) !important;
      border-radius: 0px;
    }
  }

  .is-disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  .numeric-list {
    padding-left: 20px;
    margin: 5px 0;
    
    li {
      // line-height: 1.22rem;
      margin-top: 3px;
    }
  }

  .help-message {
    text-align: left;
    margin-top: 10px;
  }

  .ReactModal__Overlay {
    background-color: rgb(121 121 121 / 75%) !important;
    z-index: 199999;
  }

  .ReactModal__Content {
    max-width: 500px !important;
    min-height: 100px;
    height: fit-content;
    border: 1px solid rgb(204, 204, 204);
    background: linear-gradient(rgb(218,239,240) 0%,rgb(255 255 255 / 70%) 100%) !important;
    border-radius: 20px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;

    h2 {
      margin-top: 0;
    }
  }

  :root {
    --onboard-primary-500: #ff9400;
    --account-center-maximized-network-selector-color: #ff9400;
  }

  .detail-box {
    display: flex; 
    justify-content: space-between;
    align-items: center; 
    width: 100%;
    border-radius: 12px; 
    padding-top: 15px;
    margin-bottom: 7px;

    @media screen and (max-width: 992px) {
      padding: 7px 11px;
      margin-bottom: 0;
    }
  }

  .detail-box-main {
    display: flex;
  }

  .detail-icon {
    margin-right: 5px;

    img {
      margin: 0 -15px 0 0;

      &:last-child {
        margin: 0;
      }

      @media screen and (max-width: 992px) {
        width: 18px;
        height: 18px;
      }
    }
  }

  .detail-apy {
    font-size: 14px; 
    line-height: 24px;
    font-weight: 500;
    color: #000;

    @media screen and (max-width: 992px) {
      font-size: 10px;
      line-height: 18px;
      color: #15202B;
    }
  }

  .detail-desc {
    font-size: 14px; 
    line-height: 24px;
    font-weight: 500;
    color: #344054;

    @media screen and (max-width: 992px) {
      font-size: 10px;
      line-height: 18px;
    }
  }

  .detail-desc-auto {
    font-size: 14px; 
    line-height: 24px;
    font-weight: 500;
    color: #344054;

    @media screen and (max-width: 992px) {
      font-size: 10px;
      line-height: 18px;
    }
  }

  .detail-desc-no-width {
    font-size: 14px; 
    line-height: 24px;
    font-weight: 500;
    color: #344054;

    @media screen and (max-width: 992px) {
      font-size: 10px;
      line-height: 18px;
    }
  }

  .detail-token {
    text-decoration: underline;

    @media screen and (max-width: 992px) {
      font-size: 10px;
      line-height: 18px;
    }
  }

  .detail-token-no-width {
    font-size: 14px; 
    line-height: 24px;
    font-weight: 500;
    color: #344054;

    @media screen and (max-width: 992px) {
      font-size: 10px;
      line-height: 18px;
    }
  }

  .farm-detail-reward {
    .detail-box {
      display: flex; 
      justify-content: start;
      align-items: center; 
      width: 100%;
      border-radius: 12px; 
      padding-top: 15px;
      margin-bottom: 7px;
    }

    .detail-icon {
      width: 60px;
    }

    .detail-apy {
      width: 80px; 
      font-size: 16px; 
      font-weight: 500;
    }

    .detail-desc {
      width: 36%; 
      font-size: 16px; 
      font-weight: 400;

      @media screen and (max-width: 992px) {
        font-size: 13px;
      }
    }

    .detail-desc-auto {
      font-size: 16px; 
      font-weight: 400;

      @media screen and (max-width: 992px) {
        font-size: 13px;
      }
    }

    .detail-desc-no-width {
      font-size: 16px; 
      font-weight: 400;

      @media screen and (max-width: 992px) {
        font-size: 13px;
      }
    }

    .detail-token {
      width: 34%; 
      font-size: 16px; 
      font-weight: 500; 
      text-decoration: underline;

      @media screen and (max-width: 992px) {
        font-size: 13px;
      }
    }

    .detail-token-no-width {
      font-size: 16px; 
      font-weight: 400; 
      // text-decoration: underline;

      @media screen and (max-width: 992px) {
        font-size: 13px;
      }
    }
  }

  .fade.modal.show {
    background: rgba(240, 240, 240, 0.3);
  }

  .modal-notification {
    .modal-content {
      border: none;
      border-radius: 12px;
      .modal-header {
        background: #FFB54F;
        font-weight: 600;
        font-size: 18px;
        line-height: 28px;
        text-align: center;
        color: #FFFFFF;
        justify-content: center;
        padding: 24px;
      }
      .modal-body {
        padding: 24px;
        font-weight: 400;
        font-size: 13px;
        line-height: 20px;
        color: #475467;
      }
      .deposit-modal-header {
        background: #F2F5FF;
        padding: 24px 24px 20px;
      }
      .deposit-modal-body {
        padding: unset;
      }
      .modal-footer {
        justify-content: center;
        padding: 24px;
  
        .confirm {
          background: #FFAE3E;
          box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
          border: none;
          color: white;
          border-radius: 8px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 10px 18px;
          width: 100%;
          margin: 0;
        }
      }
    }
  }

  .apexcharts-tooltip {
    display: none !important;
  }

  .apexcharts-xcrosshairs.apexcharts-active {
    stroke: #FF9400;
  }

  .apexcharts-svg.apexcharts-zoomable.hovering-pan {
    cursor: default !important;
  }

  .recharts-cartesian-axis-tick {
    font-family: 'Roboto', sans-serif;
    font-size: 12px;
    font-weight: 400;
  }

  .advanced-price .recharts-cartesian-axis-tick {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    @media screen and (max-width: 992px) {
      font-size: 6px;
      font-weight: 400;
      line-height: 8px;
    }
  }

  .advanced-farm .recharts-cartesian-axis-tick {
    font-size: 11px;
    font-weight: 500;
    line-height: 16px;

    @media screen and (max-width: 992px) {
      font-size: 6px;
      font-weight: 400;
      line-height: 8px;
    }
  }

  .recharts-cartesian-axis-line {
    stroke: none;
  }
`

const Divider = styled.div`
  height: ${props => (props.height ? props.height : '20px')};
  background: ${props => (props.backColor ? props.backColor : 'unset')};
  margin-top: ${props => (props.marginTop ? props.marginTop : 'unset')};
`

const ClickGate = styled.div`
  cursor: ${props => (props.disabled ? 'not-allowed' : 'auto')};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  a {
    pointer-events: ${props => (props.disabled ? 'none' : 'all')};
  }
`

const TableContainer = styled.div`
  display: table;
  width: 100%;
  table-layout: fixed;
`

const TableHead = styled.div`
  margin-bottom: ${props => (props.invisible ? '-20px' : 'unset')};
  display: table-header-group;
`

const TableBody = styled.div`
  display: table-row-group;
`

const TableRow = styled.div`
  display: table-row;
`

const TableCell = styled.div`
  position: relative;
  width: ${props => (props.width ? props.width : 'auto')};
  display: table-cell;
  vertical-align: middle;
  text-align: ${props => (props.textAlign ? props.textAlign : 'center')};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 'normal')};
  padding: 10px 0px;
  margin-right: 20px;
`

const Monospace = styled.span`
  // font-family: Work Sans;
  font-family: 'Inter', sans-serif;
  border-bottom: ${props => props.borderBottom || 'unset'};
  color: #101828;
  font-size: 14px !important;
  font-weight: 500;
  line-height: 20px;
`

const Box = styled.div`
  width: ${props => (props.width ? props.width : 'auto')};
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  background-color: #fffce6;

  padding: 10px;

  b {
    margin-right: 5px;
  }

  a {
    margin-right: 5px;
    margin-left: 5px;
    color: black;
    font-weight: bold;
  }
`

const TextContainer = styled.div`
  text-align: ${props => props.textAlign || 'center'};
  margin: ${props => props.margin || '20px 0px'};
`

const SmallLogo = styled.img`
  width: ${props => props.width || '20px'};
  height: ${props => props.height || '20px'};
  margin: ${props => props.margin || '0px'};
`

const Body = styled.div`
  position: relative;
  // margin-bottom: 420px;
  display: flex;
  // background: #F0F0F0;
  min-height: 100vh;

  @media screen and (max-width: 992px) {
    flex-direction: column-reverse;
    justify-content: space-between;
  }
`

const ScrollArrow = styled.div`
  position: absolute;
  right: -8.5px;
  top: 40%;
  display: ${props => (props.hide ? 'none' : 'block')};

  @media screen and (min-width: 730px) {
    display: none !important;
  }
`

const NewBadgeLabel = styled.div`
  padding: 4px 6px;
  background-color: #ff5235;
  color: white;
  border-radius: 4px;
  margin-left: 5px;
  // font-family: Work Sans;
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: 11px;
  line-height: 13px;

  &:before {
    content: 'NEW';
    display: block;
  }
`

const NewBadgeRibbon = styled.img`
  position: absolute;
  right: -4px;
  top: -4px;
  width: 34px;
`

const WorkPageLink = styled.a`
  position: absolute;
  left: 6%;
  bottom: 1%;
  width: 30%;
  height: 18vw;
  z-index: 1;

  @media screen and (max-width: 1200px) {
    display: none;
  }
`

export {
  Divider,
  ClickGate,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Monospace,
  GlobalStyle,
  SmallLogo,
  TextContainer,
  Box,
  Body,
  ScrollArrow,
  NewBadgeLabel,
  NewBadgeRibbon,
  WorkPageLink,
}
