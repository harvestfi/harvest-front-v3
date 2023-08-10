import styled from 'styled-components'

const SelectToken = styled.div`
  ${props =>
    props.show
      ? `
    display: block;
    height: 100%;
  `
      : 'display: none;'}
`

const SelectTokenWido = styled.div`
  border-radius: 12px;
  transition: 0.25s;
  height: 100%;
`

const CloseBtn = styled.img`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 8px;

  @media screen and (max-width: 992px) {
    width: 17px;
    height: 16px;
    top: 12px;
  }
`

const FilterInput = styled.input`
  background: #ffffff;
  height: 40px;
  width: 100%;
  border-radius: 8px 8px 0 0;
  border: none;
  border-bottom: 1px solid #eaecf0;
  padding: 15px 40px;
  outline: none;
  font-weight: 400;
  font-size: 15px;
  line-height: 23px;
  color: #667085;

  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 18px;
  }
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
    props.marginRight
      ? `
    margin-right: ${props.marginRight};
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
    props.self
      ? `
    align-self: ${props.self};
  `
      : ''}
  ${props =>
    props.heightDiv
      ? `
    height: ${props.heightDiv};
  `
      : ''}
  
  ${props =>
    props.padding
      ? `
    padding: ${props.padding};
  `
      : ''}

  ${props =>
    props.divScroll
      ? `
    overflow: ${props.divScroll};
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
  img.icon {
    margin-right: 10px;
  }

  img.info {
    margin-left: 10px;
  }

  img.info-icon {
    margin-left: 15px;
  }

  @media screen and (max-width: 992px) {
    img.icon {
      margin-right: 5px;
    }

    img.info {
      margin-left: 5px;
    }
  }
`

const Search = styled.img`
  position: absolute;
  left: 9px;
  top: 10px;

  @media screen and (max-width: 992px) {
    width: 15px;
    height: 15px;
    top: 12px;
  }
`

const NotConnectedWallet = styled.div`
  border-radius: 12px;
  border: 1px solid #d0d5dd;
  background: #fcfcfd;
  padding: 16px;
  ${props =>
    props.isShow === 'true'
      ? `
    display: flex;
    justify-content: space-between;
    `
      : 'display: none;'};
`

const ImgBtn = styled.img`
  cursor: pointer;

  @media screen and (max-width: 992px) {
    width: 17px;
    height: 16px;
  }
`

export {
  SelectToken,
  SelectTokenWido,
  CloseBtn,
  FilterInput,
  NewLabel,
  Search,
  NotConnectedWallet,
  ImgBtn,
}
