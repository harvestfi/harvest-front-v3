import styled from 'styled-components'

const Stocks = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 13px;
  justify-content: left;
  align-items: center;
  background: #ecfdf3;
  color: #5dcf46;
  padding: 3px 10px;
  gap: 5px;
  width: fit-content;

  @media screen and (max-width: 992px) {
    padding: 2px 6px;
  }
`

const StocksLabel = styled.div`
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;

  @media screen and (max-width: 1600px) {
    font-size: 9px;
    line-height: 13px;
  }

  @media screen and (max-width: 992px) {
    font-size: ${props => (props.$isportfolio ? '10px' : '8px')};
    line-height: ${props => (props.$isportfolio ? '15px' : '12px')};
  }
`

export { Stocks, StocksLabel }
