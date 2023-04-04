import styled from 'styled-components'

const SocialsContainer = styled.div`
  display: flex;
  flex-direction: row;
  transition: 0.25s;
  a {
    background: ${props => props.backColor};
    img {
      filter: ${props => props.iconColor};
    }
  }

  // @media screen and (max-width: 1200px) {
  //   flex-direction: row;
  //   position: unset;
  //   margin-bottom: 40px;
  // }

  z-index: 99999;
`

const Social = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  margin-right: 8px;
  height: 30px;
  text-decoration: none;
  border-radius: 5px;

  img {
    margin: auto;
  }
`

export { SocialsContainer, Social }
