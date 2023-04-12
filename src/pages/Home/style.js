import styled from 'styled-components'
import WelcomeBack from '../../assets/images/logos/gradient.svg'

const FarmContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  margin-left: 320px;
  position: relative;
  min-height: 100vh;
  transition: 0.25s;
  color: ${props => props.fontColor};
  background: ${props => props.pageBackColor};

  display: flex;
  justify-content: center;
  flex-direction: column;

  @media screen and (max-width: 992px) {
    margin-left: 0;
  }
`
const FarmContent = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 70px 76px 94px 76px;
  margin: auto;

  @media screen and (min-width: 1920px) {
    width: 1400px;
    height: fit-content;
  }

  @media screen and (max-width: 992px) {
    padding: 0px 10px;
    display: block;
  }
`

const FarmCompInner = styled.div`
  &:hover {
    box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
  }

  cursor: pointer;
  margin: 16px 0px;
  border-radius: 12px;
  width: 48%;

  @media screen and (max-width: 992px) {
    width: 100%;
    margin: 15px 10px;
    margin-bottom: 21px !important;
  }
`
const BottomPart = styled.div`
  width: 69%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

const FarmHeader = styled.div`
  background: url(${WelcomeBack});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  padding: 93px 0 70px 75px;
  color: white;

  @media screen and (max-width: 992px) {
    padding: 93px 0 70px 0;
  }
`

const Title = styled.div`
  font-size: 28px;
  line-height: 42px;
  font-weight: 600;

  @media screen and (max-width: 992px) {
    font-size: 20px;
    text-align: center;
  }
`

const Desc = styled.div`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;

  @media screen and (max-width: 992px) {
    text-align: center;
  }
`

const ProfitShare = styled.div`
  width: 28%;
  margin: 16px 0;
  text-align: left;
  text-decoration: none;

  @media screen and (max-width: 992px) {
    width: 100%;
  }
`

export {
  FarmContainer,
  FarmContent,
  FarmCompInner,
  BottomPart,
  FarmHeader,
  Title,
  Desc,
  ProfitShare,
}
