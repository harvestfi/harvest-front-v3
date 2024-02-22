import styled from 'styled-components'

const DetailView = styled.div`
  width: 100%;
  padding: 16px 24px;
  cursor: pointer;
  background: ${props => props.background};
  border: 1px solid ${props => props.borderColor};
  border-top: 0px;
  ${props =>
    props.mode === 'dark'
      ? `
    ${
      props.lastElement === 'yes'
        ? 'border-radius: 0 0 10px 10px;'
        : 'border-bottom: 1px solid rgba(255, 255, 255, 0.5);'
    }
  `
      : `
    ${
      props.lastElement === 'yes'
        ? ``
        : `
      border-bottom: 1px solid ${props.borderColor};
    `
    }
  `}
  transition: 0.25s;

  &:hover {
    background: #e9f0f7;
  }

  @media screen and (max-width: 992px) {
    padding: 0px;
    border: unset;
    border-bottom: 1px solid #f2f5ff;
  }
`

const FlexDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  width: ${props => (props.width ? props.width : 'auto')};
  padding: ${props => (props.padding ? props.padding : 'unset')};

  @media screen and (max-width: 992px) {
    ${props =>
      props.display
        ? `
      display: ${props.display};
    `
        : ``};
  }
`
const Content = styled.div`
  width: ${props => props.width};
  ${props =>
    props.display
      ? `
    display: ${props.display};
  `
      : ``}
  ${props =>
    props.cursor
      ? `
      cursor: ${props.cursor};
  `
      : ''}
  ${props =>
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft};
  `
      : ''}
  ${props =>
    props.marginTop
      ? `
    margin-top: ${props.marginTop};
  `
      : ''}
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  align-self: center;

  &.mobile-extender {
    width: unset;
    position: absolute;
    top: 2.5%;
    right: 3%;

    img.file-icon {
      padding: 6px;
    }

    img.active-file-icon {
      padding: 6px;
    }
  }

  img.file-icon {
    padding: 4px;
    background: #f3f7ff;
    border-radius: 4.7px;
    border: 1px solid #fff;
  }

  img.active-file-icon {
    background: #eaf1ff;
    padding: 4px;
    border-radius: 4.7px;
    border: 1px solid #fff;
  }

  img.active-file-icon:hover {
    background: #eaf1ff;
  }

  img.file-icon:hover {
    background: #eaf1ff;
  }
`

const BadgeIcon = styled.div`
  margin: auto 17px auto 0px;
  width: 23px;
  height: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  border: 2px solid ${props => props.borderColor};
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.15);

  &.network-badge {
    @media screen and (max-width: 992px) {
      margin-bottom: 15px;
    }
  }
`
const LogoImg = styled.img`
  z-index: 10;
  width: 37px;
  height: 37px;

  ${props =>
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft}
  `
      : ``};
`

const Img = styled.img`
  width: 37px;
  height: 37px;
  margin: auto 6px auto 0px;
  @media screen and (max-width: 992px) {
    width: 26px;
    height: 26px;
  }
`

const ContentInner = styled.div`
  ${props =>
    props.width
      ? `
    width: ${props.width}
  `
      : ``};
  ${props =>
    props.display
      ? `
    display: ${props.display};
  `
      : ''}
  ${props =>
    props.marginLeft
      ? `
    margin-left: ${props.marginLeft};
  `
      : ''}
  font-weight: 400;
  font-size: 20px;
  line-height: 23px;
  align-self: center;
`

export { DetailView, FlexDiv, BadgeIcon, Content, LogoImg, Img, ContentInner }
