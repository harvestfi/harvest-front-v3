import styled from 'styled-components'

const TransactionDetails = styled.div`
  width: 100%;
  border-radius: 15px;
  transition: 0.25s;
  margin-top: 20px;

  @media screen and (max-width: 992px) {
    height: ${props => props.hasData};
    margin-top: 24px;
  }
`

const TableContent = styled.div`
  @media screen and (max-width: 992px) {
    // overflow-x: scroll;
    /* border: 1px solid ${props => props.borderColor}; */
    ${props =>
      props.count === 0
        ? `
        border-radius: unset;
        border: none;
    `
        : ``}
  }
`

const Header = styled.div`
  width: 100%;
  padding: 12px 24px;
  background: ${props => props.backColor};
  display: flex;
  justify-content: space-between;
  border: 1px solid ${props => props.borderColor};
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;

  @media screen and (max-width: 992px) {
    padding: 12px 24px;
    border-radius: 0px;
    border: unset;
    border-top: 1px solid ${props => props.borderColor};
    border-bottom: 1px solid ${props => props.borderColor};
  }
`

const ContentBox = styled.div`
  border: 1px solid ${props => props.borderColor};
  border-top: none;
  border-bottom: none;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;

  div.latest-yield-row:last-child {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  @media screen and (max-width: 992px) {
    border: unset;
    border-bottom: 1px solid ${props => props.borderColor};
  }
`

const Column = styled.div`
  width: ${props => props.width};
  color: ${props => props.color};
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  display: flex;
  justify-content: start;
  ${props => (props.display ? `display: ${props.display}` : '')};
  ${props => (props.justifyContent ? `justify-content: ${props.justifyContent}` : '')};
`

const Col = styled.div`
  display: flex;
  cursor: pointer;
  width: fit-content;
  @media screen and (max-width: 1200px) {
    flex-flow: column;
  }

  img.sortIcon {
    width: 8.8px;
    height: 10.5px;
    margin: auto 0px auto 5px;
    @media screen and (max-width: 1200px) {
      margin: auto;
    }
  }

  img.info {
    margin-right: 3px;
    margin-left: 0px;
  }

  #tooltip-balance {
    max-width: 300px;
  }
`

const EmptyPanel = styled.div`
  height: 400px;
  border: 1px solid ${props => props.borderColor};
  border-top: none;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;

  @media screen and (max-width: 992px) {
    padding: 0px;
    border: none;
    min-height: 100px;
  }
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
    props.lineHeight
      ? `
    line-height: ${props.lineHeight}px;
  `
      : ''}
  ${props =>
    props.height
      ? `
    height: ${props.height};
  `
      : ''}
  ${props =>
    props.color
      ? `
    color: ${props.color};
  `
      : ''}
  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}
  
  ${props =>
    props.gap
      ? `
    gap: ${props.gap};
  `
      : 'gap: 23px;'}

  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;

  .desc-text {
    padding: 0px 25px;
  }

  @media screen and (max-width: 992px) {
    display: flex;
    justify-content: center;
    flex-flow: column;
    font-size: 10px;
    line-height: 18px;
    padding-top: 35px;
  }
`

export { TransactionDetails, TableContent, ContentBox, Header, Column, Col, EmptyPanel, EmptyInfo }
