import styled from 'styled-components'

const SelectTokenWido = styled.div`
  transition: 0.25s;
  padding: 24px;

  ${props =>
    props.show
      ? `
    display: block;
    height: 100%;
  `
      : 'display: none;'}

  @media screen and (max-width: 992px) {
    padding: 16px;
  }
`

const ImgBtn = styled.img`
  cursor: pointer;
  transition: 0.25s;
  margin-right: 8px;

  @media screen and (max-width: 992px) {
    width: 17px;
    height: 16px;
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

const FTokenInfo = styled.div`
  border-radius: 12px;
  border: 1px solid #d0d5dd;
  background: #fff;
  padding: 16px;
  display: ${props => (props.isShow === 'true' ? `flex` : 'none')};
  gap: 12px 0;
  margin-top: 15px;
`

const IconCard = styled.div`
  border-radius: 8px;
  border: 1px solid #eaecf0;
  background: #fff;

  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  padding: 8px 8.5px 8px 7.5px;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 992px) {
    padding: 4px;
  }
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

  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 17px;
  }
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

export { SelectTokenWido, ImgBtn, NewLabel, Buttons, FTokenInfo, IconCard, GotItBtn, FTokenWrong }
