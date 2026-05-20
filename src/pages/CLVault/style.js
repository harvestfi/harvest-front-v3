import styled from 'styled-components'

/*
 * CL Vault — local styled-components
 *
 * This file holds ONLY components that have no equivalent on the classic
 * AdvancedFarm vault page. Everything else (cards, panels, rows, info boxes,
 * tip boxes, top detail boxes) is reused 1:1 from ../AdvancedFarm/style.js
 * and ../../components/AdvancedFarmComponents/SourceOfYield/style.js.
 *
 * What lives here (CL-specific visuals):
 *   - Badge                     in-range / out-of-range pill
 *   - RangeBarOuter / Inner / Marker / Labels / Numbers / Footnote
 *                               concentrated-liquidity range strip
 *   - CompositionRow / Bar / Fill
 *                               token weight bar (62% / 38%)
 *   - Caret                     ▼ rotation for collapsible card
 *   - FieldLabel / FieldBox / Input / TokenPill
 *                               two-input deposit form fields
 *   - Hint / Preview / RouteNote
 *                               smart-routing UI under the inputs
 *   - OutputGroup / OutputOpt   withdraw output selector (token0/token1/both)
 *   - Cta                       sticky CTA button
 *   - Slippage                  slippage tolerance selector
 *   - ChartFrame / AxisYLeft / AxisYRight / AxisX / ChartCenterText
 *   - RangeBtnRow / RangeBtn    mock chart placeholder (classic uses
 *                               FarmDetailChart which requires API data)
 */

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  white-space: nowrap;
  background: ${p => (p.$ok ? '#e7f8ec' : '#fdecec')};
  color: ${p => (p.$ok ? '#137a3a' : '#a8201f')};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${p => (p.$ok ? '#1da64a' : '#d6342f')};
  }
`

export const RangeBarOuter = styled.div`
  position: relative;
  height: 18px;
  background: ${p => p.$bg};
  border-radius: 6px;
  overflow: visible;
  margin: 0 15px 12px;
`

export const RangeBarInner = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${p => p.$leftPct}%;
  right: ${p => 100 - p.$rightPct}%;
  background: linear-gradient(90deg, #5dcf46 0%, #51e932 50%, #5dcf46 100%);
  border-radius: 5px;
  opacity: 0.85;
`

export const RangeMarker = styled.div`
  position: absolute;
  top: -8px;
  bottom: -8px;
  left: ${p => p.$pct}%;
  width: 3px;
  background: ${p => p.$color};
  border-radius: 2px;
  transform: translateX(-50%);

  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${p => p.$color};
    border: 2px solid ${p => p.$bg};
  }
`

export const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: ${p => p.$muted};
  font-weight: 600;
  margin: 0 15px;
`

export const RangeNumbers = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
  padding: 12px 15px 0;
  font-size: 14px;

  strong {
    color: ${p => p.$fc};
    font-weight: 700;
  }
  span.muted {
    color: ${p => p.$muted};
  }
`

export const Footnote = styled.div`
  padding: 8px 15px 14px;
  font-size: 12px;
  color: ${p => p.$muted};
`

export const CompositionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px 6px;
  font-size: 14px;
  color: ${p => p.$fc};
  font-weight: 600;
`

export const CompositionBar = styled.div`
  display: flex;
  height: 14px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${p => p.$border};
  margin: 0 15px 14px;
`

export const CompositionFill = styled.div`
  width: ${p => p.$pct}%;
  background: ${p => p.$color};
`

export const Caret = styled.span`
  font-size: 12px;
  color: ${p => p.$muted};
  transition: transform 0.15s ease;
  transform: rotate(${p => (p.$open ? '180deg' : '0deg')});
`

export const FieldLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: 600;
  color: ${p => p.$muted};
  margin-bottom: 6px;

  span:first-child {
    min-width: 0;
  }

  span.bal {
    color: ${p => p.$fc};
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
    white-space: nowrap;
    transition: opacity 0.15s;
  }
  span.bal:hover {
    opacity: 0.7;
    text-decoration: underline;
  }
`

export const FieldBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${p => p.$border};
  border-radius: 10px;
  padding: 10px 12px;
  background: ${p => p.$bg};
  margin-bottom: 12px;

  &:focus-within {
    border-color: #5dcf46;
  }
`

export const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 18px;
  font-weight: 600;
  color: ${p => p.$fc};
  min-width: 0;

  &::placeholder {
    color: ${p => p.$muted};
  }
`

export const TokenPill = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: ${p => p.$bg};
  border: 1px solid ${p => p.$border};
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  color: ${p => p.$fc};
`

export const Hint = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: ${p => p.$muted};
  margin: 0 0 10px;
  gap: 8px;

  > button {
    background: none;
    border: 1px solid ${p => p.$border};
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 600;
    color: ${p => p.$fc};
    cursor: pointer;

    &:hover {
      background: ${p => p.$hover};
    }
  }
`

export const Preview = styled.div`
  background: ${p => p.$bg};
  border: 1px dashed ${p => p.$border};
  border-radius: 10px;
  padding: 12px;
  font-size: 12.5px;
  color: ${p => p.$fc};
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;

  > div {
    display: flex;
    justify-content: space-between;
  }
  span.muted {
    color: ${p => p.$muted};
    font-weight: 500;
  }
  span.val {
    font-weight: 700;
  }
`

export const RouteNote = styled.div`
  font-size: 11.5px;
  color: ${p => p.$muted};
  font-style: italic;
  margin-bottom: 10px;
`

export const OutputGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
`

export const OutputOpt = styled.button`
  flex: 1;
  padding: 10px 8px;
  border: 1px solid ${p => (p.$active ? '#5dcf46' : p.$border)};
  background: ${p => (p.$active ? '#eafbe6' : p.$bg)};
  color: ${p => (p.$active ? '#137a3a' : p.$fc)};
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: #5dcf46;
  }
`

export const Cta = styled.button`
  width: 100%;
  padding: 14px;
  background: #5dcf46;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #51e932;
  }

  &:disabled {
    background: #b6d8ad;
    cursor: not-allowed;
  }
`

export const Slippage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: ${p => p.$muted};
  margin-bottom: 12px;

  > div {
    display: flex;
    gap: 6px;

    button {
      padding: 3px 8px;
      border: 1px solid ${p => p.$border};
      background: ${p => p.$bg};
      color: ${p => p.$fc};
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }
    button.active {
      border-color: #5dcf46;
      background: #eafbe6;
      color: #137a3a;
    }
  }
`

export const ChartFrame = styled.div`
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 10px;
  background: ${p => p.$bg};
  overflow: hidden;
  padding: 14px 8px;
  box-sizing: border-box;

  @media screen and (max-width: 992px) {
    height: 240px;
    padding: 10px 4px;
  }
`

export const AxisYLeft = styled.div`
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10.5px;
  color: ${p => p.$muted};
  font-weight: 500;
  pointer-events: none;
`

export const AxisYRight = styled(AxisYLeft)`
  left: auto;
  right: 6px;
  align-items: flex-end;
`

export const AxisX = styled.div`
  position: absolute;
  left: 56px;
  right: 56px;
  bottom: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 10.5px;
  color: ${p => p.$muted};
  font-weight: 500;
`

export const ChartCenterText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 500;
  color: ${p => p.$muted};
  pointer-events: none;
`

export const RangeBtnRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 10px;
`

export const RangeBtn = styled.button`
  background: none;
  border: none;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${p => (p.$active ? '#5dcf46' : p.$muted)};
  cursor: pointer;

  &:hover {
    color: ${p => p.$fc};
  }
`

/* Local replacement for ManageBoxWrapper. Same row layout on desktop, but
   keeps a vertical gap when the 3 panels stack on mobile (the inherited
   wrapper sets gap: 0px below 992px which makes panels visually merge). */
export const ManagePanelsRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 25px;
  margin-bottom: 25px;

  @media screen and (max-width: 992px) {
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }
`

/* Headline tweaks for the CL-page TopDesc. The classic TopDesc has
   line-height 82px which makes sense for desktop where the icons are 60px
   tall, but on mobile that produces a giant blank line. Override here.
   Also center-align on mobile so the title sits under the centered icons. */
export const TopDescOverride = styled.div`
  & > * {
    @media screen and (max-width: 992px) {
      font-size: 18px;
      line-height: 26px;
      text-align: center;
      width: 100%;
      margin: 5px auto !important;
    }
  }
`
