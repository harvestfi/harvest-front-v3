import styled from 'styled-components'

const DetailView = styled.div`
  width: 100%;
  margin-left: 280px;
  background: ${props => props.pageBackColor};
  color: ${props => props.fontColor};
  transition: 0.25s;

  @media screen and (max-width: 992px) {
    margin-left: 0;
  }
`

const Inner = styled.div`
  padding: 80px 72px 200px 76px;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 1480px) {
    padding: 70px 30px 40px;
  }

  @media screen and (max-width: 1024px) {
    padding: 50px 20px 20px;
  }

  @media screen and (max-width: 992px) {
    padding: 20px 29px 0px 31px;
    height: 100%;
  }
`

const TopPart = styled.div`
  padding: 70px 0 104px 100px;
  display: flex;
  justify-content: space-between;

  background: #5b5181;
  background-size: cover;
  background-repeat: no-repeat;

  position: relative;

  img.bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 0;
  }

  @media screen and (max-width: 992px) {
    padding: 41px 30px 90px 30px;
  }
`

const NewLabel = styled.div`
  font-weight: ${props => props.weight || '400'};
  font-size: ${props => props.size || '20px'};
  line-height: ${props => props.height || '0px'};
  ${props =>
    props.borderBottom
      ? `
    border-bottom: ${props.borderBottom};
  `
      : ''}

  ${props =>
    props.color
      ? `
    color: ${props.color};
  `
      : ''}
  ${props =>
    props.position
      ? `
    position: ${props.position};
  `
      : ''}
  ${props =>
    props.align
      ? `
    text-align: ${props.align};
  `
      : ''}
  ${props =>
    props.justifyContent
      ? `
    justify-content: ${props.justifyContent};
  `
      : ''}
  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}
  ${props =>
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft};
  `
      : ''}
  ${props =>
    props.marginBottom
      ? `
    margin-bottom: ${props.marginBottom};
  `
      : ''}
  ${props =>
    props.marginRight
      ? `
    margin-right: ${props.marginRight};
  `
      : ''}
  ${props =>
    props.display
      ? `
    display: ${props.display};
  `
      : ''}
  ${props =>
    props.items
      ? `
    align-items: ${props.items};
  `
      : ''}
  ${props =>
    props.self
      ? `
    align-self: ${props.self};
  `
      : ''}
  ${props =>
    props.padding
      ? `
    padding: ${props.padding};
  `
      : ''}
  ${props =>
    props.width
      ? `
    width: ${props.width};
  `
      : ''}
  img.icon {
    margin-right: 10px;
  }

  img.thumbs-up {
    margin-right: 10px;
  }

  img.info-icon {
    margin-left: 15px;
  }

  #info .tooltip-inner {
    background: black;
  }

  @media screen and (max-width: 992px) {
    img.icon {
      margin-right: 5px;
    }

    img.info {
      margin-left: 5px;
    }

    img.thumbs-up {
      margin-right: 5px;
      width: 11px;
    }
  }
`

const TopDesc = styled(NewLabel)`
  color: white;
`

const Button = styled.button`
  background: #ffffff;
  padding: 10px 20px;
  border: 1px solid #e9e9e9;
  border-radius: 12px;
`

const FlexDiv = styled.div`
  display: flex;

  ${props =>
    props.padding
      ? `
      padding: ${props.padding};
    `
      : ''}

  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}

  ${props =>
    props.marginBottom
      ? `
    margin-bottom: ${props.marginBottom};
  `
      : ''}

  ${props =>
    props.justifyContent
      ? `
    justify-content: ${props.justifyContent};
  `
      : ''}

  @media screen and (max-width: 992px) {
    &.address {
      display: block;
    }
  }
`

const InternalSection = styled.div`
  display: flex;

  @media screen and (max-width: 992px) {
    display: block;
  }
`

const FlexTopDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-self: center;
  z-index: 1;

  img {
    align-self: center;
  }

  img.mobile-logo {
    display: none;
  }

  @media screen and (max-width: 992px) {
    &.desktop-logo {
      display: none;
    }

    img.mobile-logo {
      display: block;
    }

    .back-btn {
      display: none;
    }
  }
`

const HalfContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: fit-content;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08);
  height: ${props =>
    props.partHeight
      ? `
    ${props.partHeight}px`
      : `
      fit-content
    `};
`

const TotalValueFarm = styled.div`
  font-weight: 600;
  font-size: ${props => props.size} px;
  line-height: 35px;
  color: #000000;
  margin-right: 15px;
`

const BackBtnRect = styled.a`
  position: relative;
  border-radius: 12px;
  width: 35px;
  height: 35px;
  border: 1px solid #fff;
  background: rgba(236, 236, 236, 0.35);
  &:hover {
    background: rgba(236, 236, 236, 0.7);
  }

  margin-bottom: 35px;
  cursor: pointer;
  display: flex;

  @media screen and (max-width: 992px) {
    border-radius: 8px;
    width: 24px;
    height: 24px;
    margin-right: 15px;
  }
`

const BackArrow = styled.img`
  margin: auto;
`

const RestContent = styled.div`
  width: 40%;

  @media screen and (min-width: 1921px) {
    width: 500px;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
  }
`

const BigDiv = styled(FlexDiv)`
  width: 80%;
  display: block;

  @media screen and (min-width: 1921px) {
    width: 1200px;
  }

  @media screen and (max-width: 1624px) {
    width: 85%;
  }

  @media screen and (max-width: 1368px) {
    width: 90%;
  }

  @media screen and (max-width: 1156px) {
    width: 100%;
  }

  @media screen and (max-width: 992px) {
    display: block;
  }
`

const LogoImg = styled.img`
  margin-right: -5px;
  width: 64px;

  @media screen and (max-width: 1368px) {
    width: 200px;
  }

  @media screen and (max-width: 1136px) {
    width: 150px;
  }

  @media screen and (max-width: 1024px) {
    width: 100px;
  }

  ${props =>
    props.zIndex
      ? `
    z-index: ${props.zIndex};
  `
      : ``}
`

const InfoIcon = styled.img`
  filter: ${props => props.filterColor};
  transition: 0.25s;
  cursor: pointer;
  margin-left: 5px;
`

const Monospace = styled.span`
  font-family: 'Inter', sans-serif;
  border-bottom: ${props => props.borderBottom || 'unset'};
`

const MyBalance = styled.div`
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08);

  @media screen and (max-width: 992px) {
    ${props =>
      props.marginBottom
        ? `
        margin-bottom: ${props.marginBottom};
      `
        : ``}
  }
`

const GuideSection = styled.div`
  display: flex;
  margin-bottom: 24px;

  @media screen and (max-width: 992px) {
    margin-top: 19px;
  }
`

const GuidePart = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  border-radius: 18px;
  padding: 3px 11px 3px 9px;
  background: #f2f4f7;
  margin-right: 10px;
  color: #344054;
  font-size: 16px;
  line-height: 22px;
  font-weight: ${props => props.fontWeight};

  &:last-child {
    margin-right: 0;
  }

  img {
    margin-right: 7px;
  }

  @media screen and (max-width: 992px) {
    font-size: 8px;
    line-height: 12px;

    img {
      margin-right: 3px;
    }

    img.icon {
      width: 11px;
    }
  }
`

const DepositSection = styled.div`
  ${props =>
    props.isShow
      ? `
    display: block;
    height: 100%;
  `
      : `
    display: none;
  `}
`

const WithdrawSection = styled.div`
  ${props =>
    props.isShow
      ? `
    display: block;
  `
      : `
    display: none;
  `}
`

const MainSection = styled.div`
  width: 58%;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  height: fit-content;
  border-radius: 12px;
  height: ${props =>
    props.partHeight
      ? `
    ${props.partHeight}px`
      : `
      fit-content
    `};

  @media screen and (max-width: 992px) {
    width: 100%;
    margin-right: 0px;
    margin-bottom: 23px;
  }
`

const ChainBack = styled.div`
  background: #fff;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  width: 21px;
  height: 21px;
  display: flex;
  justify-content: center;
  align-self: center;
  padding: 4px;

  margin-left: 15px;
`

const MainTag = styled.div`
  display: flex;
  padding: 8px 12px;
  align-items: center;
  border-radius: 6px;

  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  margin-right: 4px;

  ${props =>
    props.active === 'true'
      ? `
      color: white;
      background: #1f1f1f;
    `
      : `
      color: #1f1f1f;
      background: unset;
    `}

  cursor: pointer;
`

export {
  DetailView,
  TopPart,
  TopDesc,
  Button,
  HalfContent,
  FlexDiv,
  TotalValueFarm,
  BackBtnRect,
  BackArrow,
  RestContent,
  NewLabel,
  FlexTopDiv,
  Inner,
  BigDiv,
  LogoImg,
  InfoIcon,
  Monospace,
  MyBalance,
  GuideSection,
  GuidePart,
  DepositSection,
  WithdrawSection,
  MainSection,
  ChainBack,
  MainTag,
  InternalSection,
}
