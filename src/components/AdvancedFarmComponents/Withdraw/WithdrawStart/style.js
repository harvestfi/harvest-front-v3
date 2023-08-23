import styled from 'styled-components'

const SelectTokenWido = styled.div`
  transition: 0.25s;
  padding: 24px;

  ${props =>
    props.show
      ? `
    display: block;
  `
      : 'display: none;'}
`

const ImgBtn = styled.img`
  cursor: pointer;
  transition: 0.25s;
  margin-right: 8px;

  @media screen and (max-width: 992px) {
    width: 24px;
    height: 24px;
  }
`

const NewLabel = styled.div`
  ${props =>
    props.width
      ? `
    width: ${props.width};
  `
      : ''}
  ${props =>
    props.cursorType
      ? `
    cursor: ${props.cursorType};
  `
      : ''}
  ${props =>
    props.padding
      ? `
    padding: ${props.padding};
  `
      : ''}
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
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft};
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
  ${props =>
    props.color
      ? `
    color: ${props.color};
  `
      : ''}
  img.help-icon {
    margin-left: 5px;
  }
`

const Buttons = styled.button`
  border: 1px solid #000;
  background: #000;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  color: white;
  border-radius: 8px;
  padding: 10px 18px;
  align-items: center;
  width: 100%;

  &:hover {
    background: #000000d0;
  }

  @media screen and (max-width: 992px) {
    padding: 9px 13px;
  }
`

const IconArrowDown = styled.img`
  filter: ${props => props.filterColor};
`

const FTokenWrong = styled.div`
  border-radius: 12px;
  border: 1px solid #fec84b;
  background: #fffcf5;
  padding: 16px;
  display: ${props => (props.isShow === 'true' ? `flex` : 'none')};
  gap: 12px 0;
  margin-top: 15px;
  justify-content: space-between;
`

export { SelectTokenWido, ImgBtn, NewLabel, Buttons, IconArrowDown, FTokenWrong }
