import styled from 'styled-components'

const HalfInfo = styled.div`
  border-radius: 12px;
  background: ${props => props.$backcolor};
  transition: 0.25s;
  margin-bottom: ${props => props.$marginbottom};
  font-family: 'Inter', sans-serif;
  border: 2px solid ${props => props.$bordercolor};
`

const CardTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  color: ${props => props.$fontcolor};
  padding: 10px 15px;
  border-bottom: 1px solid ${props => props.$bordercolor};

  @media screen and (max-width: 992px) {
    font-size: 12px;
    line-height: 20px;
  }
`

const Body = styled.div`
  padding: 15px;
`

const Intro = styled.p`
  font-size: 13.5px;
  font-weight: 400;
  line-height: 22px;
  color: ${props => props.$fontcolor};
  margin: 0 0 15px 0;

  @media screen and (max-width: 992px) {
    font-size: 12.5px;
    line-height: 20px;
  }
`

const RouteBox = styled.div`
  border-radius: 10px;
  border: 1px solid ${props => props.$bordercolor};
  background: ${props => props.$backcolor};
  padding: 14px 15px;

  & + & {
    margin-top: 12px;
  }
`

const RouteHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;

  @media screen and (max-width: 500px) {
    flex-flow: row wrap;
  }
`

const RouteHeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`

const Badge = styled.span`
  display: inline-block;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  line-height: 18px;
  white-space: nowrap;
  background: ${props => props.$backcolor};
  color: ${props => props.$fontcolor};
`

const RouteTitle = styled.span`
  font-size: 13.5px;
  font-weight: 600;
  line-height: 20px;
  color: ${props => props.$fontcolor};
`

const RouteText = styled.p`
  font-size: 13px;
  font-weight: 400;
  line-height: 21px;
  color: ${props => props.$fontcolor};
  margin: 0;

  b {
    font-weight: 600;
  }

  @media screen and (max-width: 992px) {
    font-size: 12.5px;
    line-height: 20px;
  }
`

const BulletList = styled.ul`
  margin: 10px 0 0 0;
  padding-left: 18px;

  li {
    font-size: 12.5px;
    font-weight: 400;
    line-height: 20px;
    color: ${props => props.$fontcolor};
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  li::marker {
    color: ${props => props.$markercolor};
  }
`

export {
  HalfInfo,
  CardTitle,
  Body,
  Intro,
  RouteBox,
  RouteHead,
  RouteHeadLeft,
  Badge,
  RouteTitle,
  RouteText,
  BulletList,
}
