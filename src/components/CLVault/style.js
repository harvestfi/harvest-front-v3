import styled from 'styled-components'

export const TokenIcon = styled.img`
  width: ${props => props.$size || '20px'};
  height: ${props => props.$size || '20px'};
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: contain;
`

export const TokenMonogram = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.$size || '26px'};
  height: ${props => props.$size || '26px'};
  border-radius: 50%;
  background: ${props => props.$color || '#888'};
  color: #fff;
  font-size: ${props => props.$fontsize || '10px'};
  font-weight: 700;
  border: 2px solid ${props => props.$cardbg || '#fff'};
  text-transform: uppercase;
  flex-shrink: 0;
`

/* ---- Panel (mirrors HalfContent) ---- */
export const Panel = styled.div`
  background: ${props => props.$cardbg};
  border: 2px solid ${props => props.$border};
  border-radius: 12px;
  overflow: hidden;
`

export const PanelSection = styled.div`
  padding: ${props => props.$pad || '14px 15px'};
  border-top: ${props => (props.$divider ? `1px solid ${props.$border}` : 'none')};
`

export const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 15px;
  border-bottom: 1px solid ${props => props.$border};
`

export const PanelTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$fontcolor};
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${props => (props.$ok ? 'rgba(93, 207, 70, 0.14)' : 'rgba(240, 68, 56, 0.14)')};
  color: ${props => (props.$ok ? '#2f9e2f' : '#e0382b')};

  &::before {
    content: '';
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${props => (props.$ok ? '#5dcf46' : '#f04438')};
  }
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  padding: ${props => props.$pad || '10px 0'};
  border-top: ${props => (props.$divider ? `1px solid ${props.$border}` : 'none')};
  color: ${props => props.$muted};

  b {
    color: ${props => props.$fontcolor};
    font-weight: 600;
  }
`

/* ---- Active range ---- */
export const RangeDesc = styled.p`
  margin: 0 0 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: ${props => props.$muted};
`

export const BandWrap = styled.div`
  position: relative;
  margin: 8px 0 6px;
  overflow: visible;
`

export const BandTrack = styled.div`
  position: relative;
  height: 16px;
  border-radius: 999px;
  background: ${props =>
    props.$inrange ? 'linear-gradient(90deg, #7ee06a 0%, #5dcf46 55%, #2f9e2f 100%)' : '#d1d5db'};
  opacity: ${props => (props.$inrange ? 1 : 0.55)};
`

export const BandMarker = styled.div`
  position: absolute;
  top: 50%;
  left: ${props => props.$pos}%;
  width: 3px;
  height: 28px;
  border-radius: 2px;
  background: ${props => props.$fontcolor};
  transform: translate(-50%, -50%);
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.$fontcolor};
    border: 2px solid ${props => props.$cardbg || '#fff'};
  }
`

export const BandEdges = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$muted};
  margin-bottom: 16px;
`

export const RangeSummary = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  color: ${props => props.$muted};
  margin-bottom: 12px;

  b {
    color: ${props => props.$fontcolor};
    font-weight: 600;
  }
`

export const RangeFooter = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$muted};
`

/* ---- Weights ---- */
export const WeightBar = styled.div`
  display: flex;
  height: 12px;
  border-radius: 999px;
  overflow: hidden;
  margin: 4px 0 12px;
`

export const WeightSeg = styled.div`
  width: ${props => props.$pct}%;
  background: ${props => props.$color};
`

/* ---- Lists / notes ---- */
export const BulletList = styled.ul`
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 9px;

  li {
    font-size: 14px;
    line-height: 1.5;
    color: ${props => props.$muted};
  }

  li b {
    color: ${props => props.$fontcolor};
    font-weight: 600;
  }
`

/* ---- Deposit / Withdraw (mirrors DepositBase) ---- */
export const SwitchWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 4px;
  margin-bottom: 16px;
  border: 1.3px solid ${props => props.$border};
  border-radius: 8px;
`

export const SwitchTab = styled.div`
  width: 50%;
  transition: 0.25s;
  color: ${props => props.$fontcolor};
  background: ${props => props.$backcolor};
  box-shadow: ${props => props.$boxshadow};
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  svg {
    font-size: 16px;
  }

  p {
    margin: 0;
    padding-left: 5px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
  }
`

export const DepoTitle = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  margin: 0 0 18px;
  color: ${props => props.$fontcolor};
`

export const TokenInfo = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`

export const AmountSection = styled.div`
  width: -webkit-fill-available;
  min-width: 50%;
`

export const FieldTitle = styled.div`
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: ${props => props.$fontcolor};
  margin-bottom: 6px;
`

export const TokenInput = styled.div`
  position: relative;
`

export const TokenAmount = styled.input`
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background: ${props => props.$bgcolor};
  border: 1px solid ${props => props.$bordercolor};
  outline: 0;
  padding: 8px 14px;
  border-radius: 8px;
  color: ${props => props.$fontcolor};
  transition: 0.25s;

  &::placeholder {
    color: ${props => props.$muted};
    opacity: 0.7;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
  }
`

export const DepositTokenSection = styled.div`
  max-width: 50%;
  position: relative;
`

export const TokenSelect = styled.button`
  width: 100%;
  background: ${props => props.$bg};
  border: 1px solid ${props => props.$border};
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
  transition: 0.25s;
  border-radius: 8px;
  padding: 9px 14px;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: ${props => props.$fontcolor};
  display: flex;
  align-items: center;
  cursor: ${props => (props.$static ? 'default' : 'pointer')};

  span.sym {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 4px 0 7px;
  }

  svg {
    margin-left: auto;
  }

  &:hover {
    background: ${props => (props.$static ? props.$bg : props.$hover)};
  }
`

export const BalanceInfo = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: ${props => props.$fontcolor};
  margin-top: 6px;
  cursor: pointer;
  width: fit-content;

  span {
    margin-left: 6px;
    font-weight: 600;
  }
`

export const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$muted};
`

export const SettingLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  .question {
    font-size: 16px;
    cursor: help;
    opacity: 0.65;
  }
`

export const SlipPills = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`

export const SlipOption = styled.button`
  border: 1px solid ${props => (props.$active ? props.$accent : props.$border)};
  background: ${props =>
    props.$active ? 'rgba(93,207,70,0.12)' : props.$inactivebg || 'rgba(239, 246, 255, 0.9)'};
  color: ${props => (props.$active ? props.$accent : props.$fontcolor)};
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`

export const PreviewBox = styled.div`
  background: ${props => props.$bg};
  border-radius: 12px;
  padding: 12px 14px;
  margin: 8px 0 4px;
`

export const RoutingHint = styled.div`
  font-size: 13px;
  font-style: italic;
  font-weight: 500;
  color: ${props => props.$muted};
  margin: 8px 0 12px;
`

export const InputUsd = styled.span`
  flex-shrink: 0;
  margin-left: auto;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$muted};
  white-space: nowrap;
`

export const ApprovalRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$muted};
  margin-top: 14px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => (props.$done ? '#5dcf46' : '#f5a623')};
    flex-shrink: 0;
  }
`

export const OutputSelect = styled.div`
  display: flex;
  gap: 8px;
`

export const OutputOption = styled.button`
  flex: 1;
  border: 1px solid ${props => (props.$active ? props.$accent : props.$border)};
  background: ${props => (props.$active ? 'rgba(93,207,70,0.10)' : props.$bg)};
  border-radius: 8px;
  padding: 10px 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${props => (props.$active ? props.$accent : props.$fontcolor)};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
`

export const CTAWrap = styled.div`
  margin-top: 18px;

  button {
    cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  }
`

export const ResultsBlock = styled.div`
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid ${props => props.$border};
`

export const PillRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
`

export const TokenPill = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1.5px solid ${props => (props.$active ? '#5dcf46' : props.$border)};
  background: ${props => (props.$active ? props.$activebg : props.$bg)};
  border-radius: 8px;
  padding: 9px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: ${props => props.$fontcolor};
  box-shadow: ${props => (props.$active ? '0px 1px 2px rgba(16,24,40,0.06)' : 'none')};
  transition: 0.2s;
`

export const InputWithChip = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid ${props => props.$border};
  border-radius: 12px;
  padding: 14px 14px 14px 16px;
  background: ${props => props.$bg};

  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 20px;
    font-weight: 600;
    color: ${props => props.$fontcolor};

    &::placeholder {
      color: ${props => props.$muted};
      opacity: 0.7;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
      -webkit-appearance: none;
      margin: 0;
    }
  }
`

export const TokenChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: ${props => props.$bg};
  border: 1px solid ${props => props.$border};
  border-radius: 999px;
  padding: 5px 12px 5px 6px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$fontcolor};
  white-space: nowrap;
`

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  background: ${props => (props.$dark ? '#1F2937' : '#F0F4FA')};
  border: 1px solid ${props => (props.$dark ? '#374151' : '#E5E7EB')};
  border-radius: 12px;
  margin-top: 16px;
`

export const CheckboxInput = styled.input`
  margin-top: 2px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
  accent-color: #5dcf46;
`

export const CheckboxLabel = styled.label`
  font-size: 13px;
  line-height: 1.5;
  color: ${props => (props.$dark ? '#D1D5DB' : '#374151')};
  font-weight: 400;
  flex: 1;
  cursor: pointer;

  a {
    color: #5dcf46;
    text-decoration: underline;
  }
`
