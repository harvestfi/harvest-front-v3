import styled from 'styled-components'

const SelectTokenWido = styled.div`
  transition: 0.25s;
`

const ImgBtn = styled.img`
  cursor: pointer;
  transition: 0.25s;
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
    align-items: ${props.align};
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
    props.margin
      ? `
    margin: ${props.margin};
  `
      : ''}
  ${props =>
    props.marginRight
      ? `
    margin-right: ${props.marginRight};
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
    props.flexFlow
      ? `
    flex-flow: ${props.flexFlow};
  `
      : ''}
  ${props =>
    props.items
      ? `
    align-items: ${props.items};
  `
      : ''}
  ${props =>
    props.padding
      ? `
    padding: ${props.padding};
  `
      : ''}
  ${props =>
    props.color
      ? `
    color: ${props.color};
  `
      : ''}
  ${props =>
    props.cursorType
      ? `
    cursor: ${props.cursorType};
  `
      : ''}
  ${props =>
    props.width
      ? `
    width: ${props.width};
  `
      : ''}
  ${props =>
    props.textAlign
      ? `
    text-align: ${props.textAlign};
  `
      : ''}
  img.help-icon {
    margin-left: 5px;
    cursor: pointer;
  }
  img.progressbar-img {
    width: 100%;
  }

  span {
    font-size: 10px;
    font-weight: 400;
    line-height: 12px;
  }
`

const Buttons = styled.button`
  background: #15b088;
  border: none;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  color: white;
  border-radius: 8px;
  padding: 15px 18px;
  align-items: center;
  width: 100%;

  &:hover {
    background: #2ccda4;
  }

  &:active {
    background: #4fdfbb;
  }
`

const AnimateDotDiv = styled.div`
  display: block;
`

const FTokenInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const FTokenDiv = styled.div`
  display: flex;
  gap: 16px;
`

const IconCard = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  padding: 8px;
  background: #15b088;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  justify-content: center;
`

const GotItBtn = styled.button`
  color: #edae50;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px; /* 142.857% */
  text-decoration-line: underline;
  border: none;
  background: none;
  padding: 0;
`

const FTokenWrong = styled.div`
  border-radius: 12px;
  border: 1px solid #fec84b;
  background: #fffcf5;
  padding: 24px;
  display: ${props => (props.isShow === 'true' ? `flex` : 'none')};
  gap: 12px 0;
  margin: 0px 24px 24px 24px;
  justify-content: space-between;
`

export {
  SelectTokenWido,
  ImgBtn,
  NewLabel,
  Buttons,
  FTokenInfo,
  FTokenDiv,
  IconCard,
  GotItBtn,
  FTokenWrong,
  AnimateDotDiv,
}
