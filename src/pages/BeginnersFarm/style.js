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

  @media screen and (max-width: 992px) {
    padding: 20px 10px 10px;
    height: 100%;
  }
`

const TopPart = styled.div`
  padding: 70px 100px 70px 50px;
  display: flex;
  justify-content: space-between;

  ${props =>
    props.num === 0
      ? `
    background: #fceabb;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #f8b500, #fceabb);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #f8b500, #fceabb); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `
      : props.num === 1
      ? `
    background: #a8c0ff;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #3f2b96, #a8c0ff);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #3f2b96, #a8c0ff); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `
      : props.num === 2
      ? `
    background: #134E5E;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #71B280, #134E5E);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #71B280, #134E5E); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `
      : `
    background: #2193b0;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #6dd5ed, #2193b0);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #6dd5ed, #2193b0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `}

  @media screen and (max-width: 992px) {
    display: none;
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

const FlexTopDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-self: center;

  img {
    align-self: center;
  }
`

const HalfContent = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  height: fit-content;
  margin-right: 50px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08);
  height: ${props =>
    props.partHeight
      ? `
    ${props.partHeight}px`
      : `
      unset
    `};

  @media screen and (max-width: 992px) {
    width: 100%;
    margin-right: 0px;
    ${props =>
      props.show
        ? `
      display: block;
    `
        : `display: none;`}
  }
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

  margin-bottom: 47px;
  cursor: pointer;
  display: flex;
  align-self: center;

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
    ${props =>
      props.show
        ? `
      display: block;
    `
        : `display: none;`}
  }
`

const BigDiv = styled(FlexDiv)`
  width: 70%;

  @media screen and (min-width: 1921px) {
    width: unset;
  }

  @media screen and (max-width: 1368px) {
    width: 80%;
  }

  @media screen and (max-width: 1256px) {
    width: 85%;
  }

  @media screen and (max-width: 1112px) {
    width: 100%;
  }
`

const LogoImg = styled.img`
  margin-right: -5px;
  width: 357px;

  @media screen and (max-width: 1368px) {
    width: 200px;
  }

  @media screen and (max-width: 1136px) {
    width: 150px;
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
`

const GuideSection = styled.div`
  display: flex;
  margin-bottom: 10px;
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
  font-weight: 500;

  &:last-child {
    margin-right: 0;
  }

  img {
    margin-right: 7px;
  }
`

const APRShow = styled.div`
  background: #f2f4f7;
  padding: 2px 10px 2px 8px;
  border-radius: 16px;
  display: flex;

  img {
    margin-right: 6px;
  }
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
  APRShow,
}
