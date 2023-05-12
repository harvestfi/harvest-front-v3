import styled from 'styled-components'

const SelectTokenWido = styled.div`
  background: ${props => props.backColor};
  border: 1px solid ${props => props.borderColor};
  transition: 0.25s;
  border-radius: 12px;
  padding: 12px 17px;

  ${props =>
    props.show
      ? `
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 90%;
  `
      : 'display: none;'}
`

const CloseBtn = styled.img`
  cursor: pointer;
  filter: ${props => props.filterColor};
  transition: 0.25s;
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
    props.background
      ? `
    background: ${props.background};
  `
      : ''}
  ${props =>
    props.position
      ? `
    position: ${props.position};
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
  display: flex;
  justify-content: space-between;

  background: ${props =>
    props.show === 2
      ? `
    #027948
  `
      : `
    #FFAA34
  `};
  color: white;
  font-weight: 700;
  border-radius: 8px;
  padding: 15px 25px;
  border: none;
  outline: none;
  width: 100%;
  margin-bottom: 15px;
  align-items: center;

  &:hover {
    background: ${props =>
      props.show === 2
        ? `
    `
        : `
      #FFAA34D0
    `};
  }
`

const ExecuteButton = styled.button`
  display: flex;
  justify-content: space-between;

  background: ${props =>
    props.approve === 2
      ? props.execute === 2
        ? `
      #027948
    `
        : `
      #FFAA34
    `
      : `
    #A19D98
  `};
  color: white;
  font-weight: 700;
  border-radius: 8px;
  padding: 15px 25px;
  border: none;
  outline: none;
  width: 100%;
  align-items: center;

  &:hover {
    background: ${props =>
      props.approve === 2
        ? props.execute === 2
          ? `
        #027948D0
      `
          : `
        #FFAA34D0
      `
        : `
      #A19D98D0
    `};
  }
`

const CloseButton = styled.button`
  ${props =>
    props.show === 2
      ? `
    display: flex;
  `
      : 'display: none;'}
  background: none;
  color: #344054;
  text-decoration: underline;
  font-weight: 700;

  border-radius: 12px;
  border: none;
  outline: none;
  width: fit-content;
  text-align: center;
  margin: 15px auto 20px auto;
`

const IconArrowDown = styled.img`
  filter: ${props => props.filterColor};
`

export {
  SelectTokenWido,
  CloseBtn,
  FilterInput,
  NewLabel,
  Search,
  Buttons,
  ExecuteButton,
  CloseButton,
  IconArrowDown,
}
