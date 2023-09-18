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
  border: 1px solid ${props => props.borderColor};
  border-radius: 12px;
  padding: 12px 17px;
  transition: 0.25s;
  height: 95%;
`

const CloseBtn = styled.img`
  cursor: pointer;

  filter: ${props => props.filterColor};
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
  top: 13px;
`

const DepoTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 3px;
  color: ${props => props.fontColor};
`

export { SelectToken, SelectTokenWido, CloseBtn, FilterInput, NewLabel, Search, DepoTitle }
