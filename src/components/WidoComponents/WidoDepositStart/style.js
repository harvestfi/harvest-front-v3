import styled from 'styled-components'

const SelectTokenWido = styled.div`
  background: ${props => props.backColor};
  border: 1px solid ${props => props.borderColor};
  transition: 0.25s;
  border-radius: 12px;
  padding: 12px 17px 0px 17px;

  ${props =>
    props.show
      ? `
    display: block;
    height: 100%;
  `
      : 'display: none;'}
`

const CloseBtn = styled.img`
  cursor: pointer;
  transition: 0.25s;
  filter: ${props => props.filterColor};
`

const NewLabel = styled.div`
  ${props =>
    props.height
      ? `
    line-height: ${props.height};
  `
      : ''}
  ${props =>
    props.size
      ? `
    font-size: ${props.size};
  `
      : ''}
  ${props =>
    props.weight
      ? `
    font-weight: ${props.weight};
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
    props.marginBottom
      ? `
    margin-bottom: ${props.marginBottom};
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
`

const Search = styled.img`
  position: absolute;
  left: 9px;
  top: 13px;
`

const Buttons = styled.button`
  background: #ffaa34;
  color: white;
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  border-radius: 8px;
  padding: 16px 28px;
  margin-bottom: 15px;
  border: none;
  outline: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  &:hover {
    background: #ffaa34d0;
  }

  img {
    margin-left: 7px;
    filter: ${props => props.filterColor};
  }
`

export { SelectTokenWido, CloseBtn, NewLabel, Search, Buttons }
