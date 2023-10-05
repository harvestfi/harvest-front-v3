import styled from 'styled-components'

const Container = styled.div`
  width: 24%;
  font-weight: 700;
  background: ${props => props.backColor};
  padding: 20px;

  border: 1px solid #eaecf0;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06);
  border-radius: 10px;

  @media screen and (max-width: 992px) {
    width: 100%;
    margin-bottom: 15px;
  }
`

const Div = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: ${props => props.fontColor};
  margin-top: 20px;
  margin-bottom: 7px;
  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 16px;
  }

  #tt-total-balance,
  #tt-monthly-yield,
  #tt-daily-yield,
  #tt-rewards {
    max-width: 300px;
  }
`

const Price = styled.div`
  font-weight: 600;
  font-size: 36px;
  line-height: 44px;
  margin-top: 8px;
  color: #101828;
  @media screen and (max-width: 992px) {
    font-size: 14px;
    line-height: 18px;
    margin-top: 10px;
  }
`

const InfoIcon = styled.img`
  transition: 0.25s;
  cursor: pointer;
  margin-left: 5px;
  margin-top: -3px;
`

const NewLabel = styled.div`
  font-weight: ${props => props.weight || '400'};
  font-size: ${props => props.size || '20px'};
  line-height: ${props => props.height || '0px'};
  ${props =>
    props.borderBottom
      ? `
    border-bottom: ${props.borderBottom};
  `
      : ''}

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
    props.padding
      ? `
    padding: ${props.padding};
  `
      : ''}
  ${props =>
    props.width
      ? `
    width: ${props.width};
  `
      : ''}
  ${props =>
    props.borderRadius
      ? `
    border-radius: ${props.borderRadius};
    `
      : ``}
  img.icon {
    margin-right: 10px;
  }

  img.thumbs-up {
    margin-right: 10px;
  }

  img.info-icon {
    margin-left: 15px;
  }

  #info .tooltip-inner {
    background: black;
  }

  @media screen and (max-width: 992px) {
    img.icon {
      margin-right: 5px;
    }

    img.info {
      margin-left: 5px;
    }

    img.thumbs-up {
      margin-right: 5px;
      width: 11px;
    }
  }
`

export { Container, Div, Price, InfoIcon, NewLabel }
