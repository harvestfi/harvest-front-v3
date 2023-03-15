import styled from 'styled-components'

const CountdownContainer = styled.div`
  display: ${props => (props.display ? props.display : 'flex')};
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  width: 100%;
  color: ${props=>props.fontColor};
`

const DaysLabel = styled.label`
  margin-left: 5px;
  margin-right: 5px;
`

export { CountdownContainer, DaysLabel }
