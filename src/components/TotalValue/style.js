import styled from 'styled-components'

const Container = styled.div`
  width: 24%;
  font-weight: 700;
  background: ${props => props.backColor};
  padding: 24px;
  border: 2px solid ${props => props.borderColor};
  border-radius: 12px;

  @media screen and (max-width: 992px) {
    width: 50%;
    border: unset;
    border-radius: unset;
    background: unset;
    padding: 8px 13px;
  }
`

const Div = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #6f78aa;
  margin-bottom: 8px;

  @media screen and (max-width: 992px) {
    font-size: 12px;
    margin-bottom: 0px;
  }

  #tt-total-balance,
  #tt-monthly-yield,
  #tt-daily-yield,
  #tt-rewards {
    max-width: 300px;

    @media screen and (max-width: 668px) {
      max-width: unset;
      left: 0px !important;
    }
  }
`

const Price = styled.div`
  font-weight: 600;
  font-size: 30px;
  line-height: 44px;
  color: #101828;
  @media screen and (max-width: 992px) {
    font-size: 17px;
    line-height: 36px;
  }
`

const InfoIcon = styled.img`
  transition: 0.25s;
  cursor: pointer;
  margin-left: 8px;
  margin-top: -3px;
  width: 16px;
  height: 16px;
`

const BoxIcon = styled.div`
  margin: auto 24px auto 0px;
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

export { Container, Div, Price, InfoIcon, BoxIcon, NewLabel }
