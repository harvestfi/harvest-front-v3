import styled from 'styled-components'

const Container = styled.a`
  transition: 0.25s;
  width: 100%;
  min-height: 565px;
  // padding: 30px 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  text-decoration: none;
  border-radius: 13px;
  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);
  &:hover {
    box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.23), 0px 10px 12px -2px rgba(16, 24, 40, 0.28);
  }
  position: relative;
  overflow: hidden;
  background: #0052ff;
  background-size: cover;
  background-repeat: no-repeat;

  // img.bottom {
  //   position: absolute;
  //   width: 100%;
  //   bottom: 0;
  // }

  @media screen and (max-width: 992px) {
    min-height: 200px;
  }
`

const Percent = styled.div`
  border-radius: 18px;
  background: white;
  font-weight: 500;
  font-size: 16px;
  line-height: 31px;
  color: #344054;
  transition: 0.25s;
  padding: 3px 15px 3px 12px;
  display: flex;
  justify-content: center;
  width: fit-content;
  img {
    margin-right: 5px;
  }

  @media screen and (max-width: 992px) {
    font-size: 8px;
    line-height: 12px;
    font-weight: 500;
  }
`

const Section = styled.div`
  display: flex;
  justify-content: center;

  @media screen and (max-width: 992px) {
    img.token-icon {
      width: 73px;
      height: 73px;
    }
  }
`

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px 35px;
`

const Network = styled.div`
  border-radius: 25.23px;
  border: 1.805px solid #fff;
  color: #fff;
  padding: 6.016px 16.845px;
  text-align: center;
  font-size: 16.845px;
  font-style: normal;
  font-weight: 500;
  line-height: 24.064px;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`

export { Container, Percent, Section, TopSection, Network }
