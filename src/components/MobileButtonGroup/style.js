import styled from 'styled-components'

const ButtonsGroup = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-radius: 10px;
  background: ${props => props.backColor};
  border: 1px solid ${props => props.borderColor};
  border-radius: 5px;
`

const ButtonStyle = styled.button`
  display: flex;
  background: transparent;
  color: ${props => props.fontColor};
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  align-items: center;

  &:last-child {
    margin-right: 0px;
  }
  padding: 10px 16px;

  &.active {
    background: none;
    color: #ff9400;
    border: none;
    border-radius: 5px;

    img {
      filter: invert(57%) sepia(61%) saturate(2063%) hue-rotate(1deg) brightness(103%)
        contrast(105%);
    }
  }

  img {
    margin-right: 5px;

    filter: ${props => props.filterColor};
  }

  div {
    width: max-content;
  }
`

export { ButtonsGroup, ButtonStyle }
