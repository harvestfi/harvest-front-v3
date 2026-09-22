import styled from 'styled-components'

const Promoted = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 13px;
  justify-content: left;
  align-items: center;
  background: #ecfdf3;
  color: #5dcf46;
  padding: 3px 10px;
  margin-left: 8px;
  gap: 5px;
  width: fit-content;
  flex-shrink: 0;

  @media screen and (max-width: 1600px) {
    margin-left: 6px;
  }

  @media screen and (max-width: 992px) {
    padding: 2px 6px;
    margin-left: 5px;
  }
`

const PromotedLabel = styled.div`
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;

  @media screen and (max-width: 1600px) {
    font-size: 9px;
    line-height: 13px;
  }

  @media screen and (max-width: 992px) {
    font-size: 8px;
    line-height: 12px;
  }
`

export { Promoted, PromotedLabel }
