import styled from 'styled-components'
import { Link } from 'react-router-dom'

const SuggestionBox = styled.div`
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 5px 0 15px;
`

const Caption = styled.div`
  color: ${props => props.$fontcolor};
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
`

// Drawn like the Output Token select above it, which keeps its white face in dark mode too.
const SuggestionCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 11px;
  height: 54px;
  padding: 0 8px 0 14px;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  background: #ffffff;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  text-decoration: none;
  transition: 0.25s;

  &:hover {
    border-color: #98a2be;
    background: #f9fafb;
    text-decoration: none;
  }

  &:focus-visible {
    outline: 2px solid ${props => props.$focuscolor};
    outline-offset: 2px;
  }
`

const Logos = styled.div`
  display: flex;
  flex-shrink: 0;

  .suggestion-logo {
    border-radius: 50%;
  }

  .suggestion-logo + .suggestion-logo {
    margin-left: -10px;
  }
`

const Info = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
`

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  max-width: 100%;
`

const Name = styled.div`
  color: #101828;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ApyPill = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  height: 18px;
  padding: 0 7px;
  border-radius: 13px;
  background: #ecfdf3;
  color: #38a169;
  font-size: 10px;
  font-weight: 600;
  line-height: 10px;
  white-space: nowrap;
`

const StrategyLabel = styled.div`
  max-width: 100%;
  color: #475467;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const OpenTag = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 3px;
  height: 36px;
  padding: 0 10px 0 12px;
  border-radius: 6px;
  background: #f2f5ff;
  color: #344054;
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;

  svg {
    display: block;
    flex-shrink: 0;
  }

  @container (max-width: 279px) {
    padding: 0 11px;

    .open-label {
      display: none;
    }
  }
`

export {
  SuggestionBox,
  Caption,
  SuggestionCard,
  Logos,
  Info,
  NameRow,
  Name,
  ApyPill,
  StrategyLabel,
  OpenTag,
}
