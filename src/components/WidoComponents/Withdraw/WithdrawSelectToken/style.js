import styled from 'styled-components'

const SelectTokenWido = styled.div`
  background: ${props => props.backColor};
  border: 1px solid ${props => props.borderColor};
  transition: 0.25s;
  border-radius: 12px;
  padding: 12px 17px;
  height: 100%;

  ${props =>
    props.show
      ? `
    display: block;
  `
      : 'display: none;'}
`

const CloseBtn = styled.img`
  filter: ${props => props.filterColor};
  transition: 0.25s;
  cursor: pointer;
`

const FilterInput = styled.input`
  background: #ffffff;
  border-radius: 8px;
  height: 40px;
  width: 100%;
  border: 1px solid ${props => props.borderColor};
  box-shadow: ${props => props.shadow};
  padding: 8px 9px 8px 40px;
  outline: none;
  font-weight: 400;
  font-size: 13px;
  line-height: 21px;
  color: #101828;
`

const NewLabel = styled.div`
  font-weight: ${props => props.weight || '400'};
  font-size: ${props => props.size || '20px'};
  line-height: ${props => props.height || '0px'};
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
    props.justifyContent
      ? `
    justify-content: ${props.justifyContent};
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
    props.heightDiv
      ? `
    height: ${props.heightDiv};
  `
      : ''}

  ${props =>
    props.scroll
      ? `
    overflow: ${props.scroll};
    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track {
      background: none;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #caf1d5;
      border-radius: 6px;
      border: none;
    }
  `
      : ''}
`

const Search = styled.img`
  position: absolute;
  left: 9px;
  top: 13px;
`

export { SelectTokenWido, CloseBtn, FilterInput, NewLabel, Search }
