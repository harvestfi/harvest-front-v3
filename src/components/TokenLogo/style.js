import styled from 'styled-components'

const LogoFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background: ${props => props.$bgcolor};
  color: ${props => props.$fontcolor};
  font-size: ${props => Math.round(props.$size * 0.42)}px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  user-select: none;
  ${props =>
    props.$marginright
      ? `
        margin-right: ${props.$marginright};
      `
      : ``}
`

export { LogoFallback }
