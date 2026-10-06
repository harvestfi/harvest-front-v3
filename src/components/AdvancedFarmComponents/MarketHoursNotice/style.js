import styled from 'styled-components'

const NoticeBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-radius: 12px;
  border: 1px solid ${props => props.$bordercolor};
  background: ${props => props.$backcolor};
  padding: 16px;
  margin: ${props => props.$margin || '0'};
  font-family: 'Inter', sans-serif;

  .notice-icon {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: ${props => props.$iconcolor};
  }
`

const NoticeText = styled.div`
  color: ${props => props.$fontcolor};
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;

  @media screen and (max-width: 992px) {
    font-size: 12.5px;
  }
`

export { NoticeBox, NoticeText }
