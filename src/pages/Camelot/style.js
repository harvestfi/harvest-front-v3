import styled from 'styled-components'

const FarmContainer = styled.div`
  text-align: left;
  width: 100%;
  margin-left: 280px;
  background: ${props => props.pageBackColor};
  transition: 0.25s;
  justify-content: center;
  position: relative;

  img.camelot-bg {
    position: absolute;
  }

  img.camelot-mobile {
    display: none;
  }

  @media screen and (max-width: 992px) {
    width: 100%;
    min-height: 100vh;
    margin-left: 0;
    padding-bottom: 100px;

    img.camelot-bg {
      display: none;
    }

    img.camelot-mobile {
      display: block;
    }

    .camelot-main {
      display: flex;
      justify-content: center;
    }
  }
`

const NotificationCenter = styled.div`
  display: none;

  @media screen and (max-width: 992px) {
    display: block;
    margin: 15px 7px;
  }
`

export { FarmContainer, NotificationCenter }
