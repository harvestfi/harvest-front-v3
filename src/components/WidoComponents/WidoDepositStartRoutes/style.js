import styled from 'styled-components'

const SelectTokenWido = styled.div`
  background: ${props => props.backColor};
  border: 1px solid ${props => props.borderColor};

  border-radius: 12px;
  padding: 12px 17px 32px 17px;
  transition: 0.25s;

  ${props =>
    props.show
      ? `
    display: block;
  `
      : 'display: none;'}
`

const CloseBtn = styled.img`
  cursor: pointer;
  transition: 0.25s;
  filter: ${props => props.filterColor};
`

const FilterInput = styled.input`
  background: #f5f5f5;
  border-radius: 10px;
  height: 40px;
  width: 100%;
  border: none;
  padding: 8px 9px 8px 40px;
  outline: none;
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  color: #888e8f;
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
  background: #e1e3fd;
  border-radius: 12px;
  padding: 15px 25px;
  border: none;
  outline: none;
  display: flex;

  &:hover {
    background: #ffd984;
  }

  img {
    margin-left: 7px;
  }
`

const PreviewComponent = styled.div`
  background: ${props => props.backColor};
  border: 1px solid #1abc9c;
  transition: 0.25s;
  border-radius: 12px;
  width: fit-content;
  display: flex;
  margin: auto;

  img {
    margin: 30px 45px;
  }
`

const Components = styled.div`
  height: 350px;
  overflow-y: auto;

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

export {
  SelectTokenWido,
  CloseBtn,
  FilterInput,
  NewLabel,
  Search,
  Buttons,
  PreviewComponent,
  Components,
}
