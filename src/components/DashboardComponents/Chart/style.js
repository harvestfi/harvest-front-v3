import styled from 'styled-components'

const PortoArea = styled.div`
  width: 53%;
  height: auto;
  position: relative;
  border: 1px solid ${props=>props.borderColor};
  
  border-radius: 20px;

  @media screen and (max-width: 1280px) {
    width: 100%;
    margin-top: 15px;
    border-radius: 10px;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 20px 26px 0 26px;
  background: ${props=>props.backColor};
  color: ${props=>props.fontColor};
  transition: 0.25s;
  border-radius: 20px;
  
  ${props => props.blur ? `
    filter: blur(2px);
    pointer-events: none;
  ` : ``}
  

  @media screen and (max-width: 992px) {
    width: 100%;
    height: 300px;
    // margin-bottom: 15px;
    padding: 6px 11px;
    border-radius: 10px;
  }
`

const Header = styled.div`
  font-size: 14px;
  // padding: 20px 26px;
  display: flex;
  justify-content: space-between;
`

const Title = styled.h5`
  font-size: 16px;
  line-height: 21px;
  font-weight: 700;
  // width: 100%;
  margin-bottom: 1rem;

  img {
    margin-right: 5px;
  }
`

const Total = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media screen and (max-width: 1250px) {
    display: block;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 1em 0em .25em auto;
  color: #FFF;

  button {
    // border: none;
    padding: .1em .3em;
    border-radius: .4em;
    // background: #F6F6F6;
    margin-left: .25em;
    font-weight: 400;
  }
`

const ChartDiv = styled.div`
  min-height: 70%;
  margin-bottom: 10px;
`

const ConnectButton = styled.button`
  position: absolute;
  top: calc(50% - 30px);
  left: calc(50% - 106px);
  font-size: 16px;
  line-height: 21px;
  font-weight: 700;
  width: 200px;
  background: #FF9400;
  border-radius: 10px;
  border: 0;
  color: white;

  &:hover {
    background: #FF9400D0;
  }

  &:active {
    background: #ef900c;
  }

  ${props => (props.connected ?
    `
      padding: 7px 45px 7px 11px;
      background: none;
      color: #1F2937;
      border: 1px solid #1F2937;
      filter: drop-shadow(0px 4px 52px rgba(0, 0, 0, 0.25));

      &:hover {
        background: #E6F8EB;
      }
    `
    : 
    `
      padding: 15px 0px 15px 0px;
    `
  )}

  img.connect-wallet {
    margin-right: 25px;
  }

  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: space-between;
    ${props => (props.connected ?
      `` : 
    `padding: 15px 19px;`
    )}

    img.connect-wallet {
      // margin-right: 27px;
    }
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

  input[type='checkbox'] {
    accent-color: #188E54;
    width: 20px;
    height: 20px;
    padding: 4px;
    border-radius: 6px;
}`

const Address = styled.span`
  font-size: 14px;
  font-weight: bold;
  line-height: 16px;

`

export { PortoArea, Container, Title, Header, Total, ButtonGroup, ChartDiv, ConnectButton, FlexDiv, Address }
