import styled from 'styled-components'

const Autopilot = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 13px;
  justify-content: left;
  align-items: center;
  background: #ecfdf3;
  color: #5dcf46;
  padding: 3px 10px;
  gap: 5px;

  @media screen and (max-width: 992px) {
    width: 'auto';
    padding: '2px 6px';
  }
`

const NewLabel = styled.div`
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;

  @media screen and (max-width: 1600px) {
    gap: 3px;
    font-size: 9px;
    line-height: 13px;
  }

  @media screen and (max-width: 992px) {
    font-size: ${props => (props.$isPortfolio ? '10px' : '8px')};
    line-height: ${props => (props.$isPortfolio ? '15px' : '12px')};
  }
`

const BadgeRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  @media screen and (max-width: 1600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  @media screen and (max-width: 992px) {
    flex-direction: ${props => (props.$mobileLayout === 'row' ? 'row' : 'column')};
    align-items: ${props => (props.$mobileLayout === 'row' ? 'center' : 'flex-start')};
    gap: ${props => (props.$mobileLayout === 'row' ? '6px' : '4px')};
  }

  @media screen and (max-width: 350px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  &.center-aligned {
    justify-content: center;
    align-items: center;

    @media screen and (max-width: 1600px) {
      align-items: center;
    }

    @media screen and (max-width: 992px) {
      align-items: center;
    }
  }
`

const MorphoBadge = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 13px;
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;
  justify-content: space-between;
  align-items: center;
  background: #f0f4ff;
  color: #3b82f6;
  padding: 4px 10px;
  gap: 4px;
  height: 20px;

  .question {
    font-size: 12px;
    cursor: pointer;
    color: #475467;
  }

  @media screen and (max-width: 1600px) {
    padding: 3px 8px;
    gap: 3px;
    height: 18px;
    font-size: 9px;
    line-height: 13px;

    .question {
      font-size: 11px;
    }
  }

  @media screen and (max-width: 992px) {
    padding: 2px 6px;
    gap: 3px;
    height: auto;
    font-size: ${props => (props.$isPortfolio ? '10px' : '8px')};
    line-height: ${props => (props.$isPortfolio ? '15px' : '12px')};

    .question {
      font-size: ${props => (props.$isPortfolio ? '12px' : '10px')};
    }
  }
`

const FusionBadge = styled.div`
  display: flex;
  flex-flow: row;
  border-radius: 13px;
  font-size: 10px;
  font-weight: 500;
  line-height: 15px;
  justify-content: space-between;
  align-items: center;
  background: #ecddf5;
  color: #6c00ff;
  padding: 4px 10px;
  gap: 4px;
  height: 20px;

  .question {
    font-size: 12px;
    cursor: pointer;
    color: #475467;
  }

  @media screen and (max-width: 1600px) {
    padding: 3px 8px;
    gap: 3px;
    height: 18px;
    font-size: 9px;
    line-height: 13px;

    .question {
      font-size: 11px;
    }
  }

  @media screen and (max-width: 992px) {
    padding: 2px 6px;
    gap: 3px;
    height: auto;
    font-size: ${props => (props.$isPortfolio ? '10px' : '8px')};
    line-height: ${props => (props.$isPortfolio ? '15px' : '12px')};

    .question {
      font-size: ${props => (props.$isPortfolio ? '12px' : '10px')};
    }
  }
`

export { Autopilot, NewLabel, MorphoBadge, FusionBadge, BadgeRow }
