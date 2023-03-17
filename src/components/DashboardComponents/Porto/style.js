import styled from 'styled-components'

const Container = styled.a`
  background: none;
  display: flex;
  cursor: pointer;

  color: none;

  position: relative;

  .dash-back {
    border-radius: 10px;

    &:hover {
      filter: drop-shadow(0px 4px 4px ${props => props.boxShadowColor});
    }
  }

  .title {
    position: absolute;
    top: 20px;
    left: 30px;
    font-weight: 700;
    font-size: 25px;
    line-height: 33px;
    color: #ffffff;
  }

  .feature {
    position: absolute;
    left: 20px;
    bottom: 24px;
    background: #ffffff;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 15px;
    display: flex;
    padding: 6px 13px;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #ab6ac2;

    img {
      margin-right: 6px;
    }
  }

  @media screen and (max-width: 992px) {
    .title {
      font-size: 14px;
      line-height: 18px;
    }
  }
`

export default Container
