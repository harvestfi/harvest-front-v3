import styled from 'styled-components'

const Container = styled.a`
  transition: 0.25s;
  width: 100%;
  min-height: 565px;
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
  background: #eaf1ff;
  background-size: cover;
  background-repeat: no-repeat;

  img.bottom {
    width: 100%;
  }

  @media screen and (max-width: 992px) {
    min-height: 200px;
    border-radius: 5px;
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
  align-items: center;
  img {
    margin-right: 5px;
  }

  @media screen and (max-width: 992px) {
    font-size: 9px;
    line-height: 17px;
    font-weight: 500;
    display: flex;
    padding: 1.783px 8.915px 1.783px 7.132px;
  }
`

const Section = styled.div`
  display: flex;
  justify-content: center;

  @media screen and (max-width: 992px) {
    img.token-icon {
      width: 100px;
      height: 100px;
    }
  }
`

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px 35px;

  @media screen and (max-width: 992px) {
    padding: 12px 15px;
  }
`

const Network = styled.div`
  border-radius: 25.23px;
  border: 1.805px solid #036666;
  color: #036666;
  padding: 6.016px 16.845px;
  text-align: center;
  font-size: 16.845px;
  font-style: normal;
  font-weight: 500;
  line-height: 24.064px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;

  @media screen and (max-width: 992px) {
    padding: 3.401px 9.521px;
    border-radius: 14.261px;
    border: 1.02px solid #fff;
    font-size: 9.521px;
    font-weight: 500;
    line-height: 13.602px;
    gap: 4px;

    img {
      width: 12px;
      height: 12px;
    }
  }
`

export { Container, Percent, Section, TopSection, Network }
