import styled from 'styled-components'
import GradientBack from '../../assets/images/logos/gradient.svg'

const ProfitSharing = styled.div`
  background: url(${GradientBack});
  text-decoration: none;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  position: relative;
  padding: 15px 18px;
  border-radius: 13px;
  height: ${props => (props.height ? props.height : 'unset')};
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const ProfitBack = styled.img`
  border-radius: 13px;
`

const TopDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 23px;
`

const BottomDiv = styled.div`
  font-size: 30px;
  color: white;
  line-height: 38px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  position: relative;

  .apy {
    align-self: center;
  }

  .chart {
    position: absolute;
    bottom: -50px;
    right: 0;
  }
`

export { ProfitSharing, ProfitBack, TopDiv, BottomDiv }
