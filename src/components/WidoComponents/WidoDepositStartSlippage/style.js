import styled from 'styled-components'

const SelectTokenWido = styled.div`
  background: ${props => props.backColor};
  transition: 0.25s;
  border-radius: 12px;
  padding: 12px 17px;

  ${props =>
    props.show
      ? `
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  `
      : 'display: none;'}
`

const CloseBtn = styled.img`
  filter: ${props => props.filterColor};
  transition: 0.25s;
  cursor: pointer;
  margin-bottom: 9px;
  margin-left: 5px;
`

const CustomInput = styled.input`
  border-radius: 10px;
  height: 40px;
  width: 100%;
  border: none;
  padding: 8px 9px;
  outline: none;
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  text-align: center;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const NewLabel = styled.div`
  ${props =>
    props.height
      ? `
    line-height: ${props.height};
  `
      : ''}
  ${props =>
    props.borderColor
      ? `
    border: 1px solid ${props.borderColor};
  `
      : ''}
  ${props =>
    props.size
      ? `
    font-size: ${props.size};
  `
      : ''}
  ${props =>
    props.padding
      ? `
    padding: ${props.padding};
  `
      : ''}
  ${props =>
    props.background
      ? `
    background: ${props.background};
  `
      : ''}
  ${props =>
    props.weight
      ? `
    font-weight: ${props.weight};
  `
      : ''}
  ${props =>
    props.color
      ? `
    color: ${props.color};
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
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft};
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
    props.borderRadius
      ? `
    border-radius: ${props.borderRadius} !important;
  `
      : ''}
  ${props =>
    props.items
      ? `
    align-items: ${props.items};
  `
      : ''}
  ${props =>
    props.self
      ? `
    align-self: ${props.self};
  `
      : ''}

  ${props =>
    props.width
      ? `
    width: ${props.width};
  `
      : ''}

  cursor: pointer;
  &.active {
    background: #caf1d5;
  }

  &.item {
    border-top: 0px;
    border-left: 0px;
    border-bottom: 0px;
  }

  @media screen and (max-width: 992px) {
  }
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
  background: #ffffff;
  border: 1px solid #1abc9c;
  border-radius: 12px;
  width: fit-content;
  display: flex;
  margin: auto;

  img {
    margin: 30px 45px;
  }
`

const SaveSetting = styled.span`
  background: none;
  border-radius: 10px;
  width: 100%;
  border: none;
  padding: 8px 9px;
  outline: none;
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
`

export {
  SelectTokenWido,
  CloseBtn,
  CustomInput,
  NewLabel,
  Search,
  Buttons,
  PreviewComponent,
  SaveSetting,
}
