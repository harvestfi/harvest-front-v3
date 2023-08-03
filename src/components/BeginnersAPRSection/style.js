import styled from 'styled-components'

const Container = styled.a`
  transition: 0.25s;
  width: 100%;
  min-height: 320px;
  padding: 20px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  border-radius: 13px;
  box-shadow: 0px 4px 4px -2px rgba(16, 24, 40, 0.03), 0px 10px 12px -2px rgba(16, 24, 40, 0.08);

  ${props =>
    props.num === 0
      ? `
    background: #fceabb;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #f8b500, #fceabb);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #f8b500, #fceabb); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `
      : props.num === 1
      ? `
    background: #a8c0ff;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #3f2b96, #a8c0ff);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #3f2b96, #a8c0ff); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `
      : props.num === 2
      ? `
    background: #134E5E;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #71B280, #134E5E);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #71B280, #134E5E); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `
      : `
    background: #2193b0;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #6dd5ed, #2193b0);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #6dd5ed, #2193b0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `}
`

const Percent = styled.div`
  border-radius: 18px;
  background: white;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
  color: #344054;
  transition: 0.25s;
  margin-top: 15px;
  padding: 2px 11px 2px 8px;
  display: flex;
  justify-content: center;
  img {
    margin-right: 5px;
  }
`

const Section = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

export { Container, Percent, Section }
