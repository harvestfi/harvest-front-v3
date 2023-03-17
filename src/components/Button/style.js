import styled from 'styled-components'

const ButtonStyle = styled.button`
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.width || 'auto'};
  min-width: ${props => props.minWidth || 'unset'};
  max-width: ${props => props.maxWidth || 'unset'};
  height: ${props => props.height || 'unset'};
  margin: ${props => props.margin || 'unset'};
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  outline: 0;
  transition: 0.25s;
  padding: ${props => props.padding || '10px'};

  ${props =>
    props.size === 'lg'
      ? `
  // font-weight: 800;
  font-size: 20px;
  line-height: 24px;`
      : ''}

  ${props =>
    props.fontWeight
      ? `
  font-weight: ${props.fontWeight};`
      : ''}
    
${props =>
  props.size === 'md'
    ? `
  font-size: 16px;
  line-height: 20px;`
    : ''}

${props =>
  props.size === 'sm'
    ? `
  font-size: 14px;
  line-height: 17px;`
    : ''}


  ${props =>
    props.color === 'primary'
      ? `
      background: radial-gradient(81.9% 81.9% at 50% 18.1%, #2D2D2D 0%, #000000 100%);
      color: #FFF;

  ${
    !props.disabled
      ? `
  &:hover {
    background: #FFC87C;
  }`
      : ''
  }

  &:active {
    background-color: #cc9549;
  }
  `
      : ''}

  ${props =>
    props.color === 'secondary'
      ? `
      background-color: #FFF1DE;
      border: 2px solid #F2B435;
      color: #4C351B;
    
      ${
        !props.disabled
          ? `
      &:hover {
        border: 2px solid #FFD69D;
        color: #CC9549;
        background: white;
      }`
          : ''
      }
    
      &:active {
        border: 2px solid #997037;
        color: #4C351B;
        background: white;
      }
      `
      : ''}

    ${props =>
      props.color === 'max'
        ? `
        background: #FF9940;
        // border: 2px solid #F2B435;
        color: #FFFFFF;
        border-radius: 6px;
      
        ${
          !props.disabled
            ? `
        &:hover {
          // border: 2px solid #FFD69D;
          background: #FF9400D0;
        }`
            : ''
        }
      
        &:active {
          // border: 2px solid #997037;
          // color: #4C351B;
          // background: white;
        }
        `
        : ''}

  ${props =>
    props.color === 'reward'
      ? `
      background: none;
      font-weight: 700;
      font-size: 16px;
      line-height: 21px;
      display: flex;
      align-items: center;
      text-align: center;
      color: #27AE60;
      padding: 15px 28px;
      border: 1px solid #27AE60;

      ${
        !props.disabled
          ? `
      &:hover {
        background: #27AE60;
        color: white;
      }`
          : ''
      }

      &:active {
        background: #27AE60;
        color: white;
      }
      `
      : ''}
    
    ${props =>
      props.color === 'earn'
        ? `
        background: #FF9400;
        font-weight: 700;
        font-size: 16px;
        line-height: 21px;
        display: flex;
        align-items: center;
        text-align: center;
        color: white;
        padding: 15px 28px;
        border-radius: 12px;
        ${
          !props.disabled
            ? `
        &:hover {
          background: #FF9400D0;
          // box-shadow: 0px 14px 24px rgba(237, 174, 80, 0.2);
        }`
            : ''
        }
  
        &:active {
          background: #FF9400A0;
        }
        `
        : ''}
        
    ${props =>
      props.color === 'wido-deposit'
        ? `
        background: #FFAA34;
        font-weight: 600;
        font-size: 16px;
        line-height: 28px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        color: white;
        padding: 16px 28px;
        box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
        border-radius: 8px;
        ${
          !props.disabled
            ? `
        &:hover {
          background: #FFAA34D0;
          // box-shadow: 0px 14px 24px rgba(237, 174, 80, 0.2);
        }`
            : ''
        }
  
        &:active {
          background: #FFAA34A0;
        }
        `
        : ''}
        
    ${props =>
      props.color === 'wido-stake'
        ? `
        background: #1F2937;
        font-weight: 600;
        font-family: 'Inter',sans-serif;
        font-size: 18px;
        line-height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: white;
        padding: 16px 28px;
        box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
        border-radius: 8px;
        ${
          !props.disabled
            ? `
        &:hover {
          background: #1F2937D0;
          // box-shadow: 0px 14px 24px rgba(237, 174, 80, 0.2);
        }`
            : ''
        }
  
        &:active {
          background: #1F2937A0;
        }
        `
        : ''}

    ${props =>
      props.color === 'wido-save'
        ? `
        background: #027948;
        font-weight: 600;
        font-family: 'Inter',sans-serif;
        font-size: 18px;
        line-height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: white;
        padding: 16px 28px;
        box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.05);
        border-radius: 8px;
        ${
          !props.disabled
            ? `
        &:hover {
          background: #027948D0;
          // box-shadow: 0px 14px 24px rgba(237, 174, 80, 0.2);
        }`
            : ''
        }
  
        &:active {
          background: #027948A0;
        }
        `
        : ''}

  ${props =>
    props.color === 'connectwallet'
      ? `
      background: #188E54;
      color: white;

      ${
        !props.disabled
          ? `
      &:hover {
        background: #188E54D0;
        box-shadow: 0px 14px 24px rgba(2, 2, 2, 0.2);
      }`
          : ''
      }

      &:active {
        background: #188E54;
      }
      `
      : ''}
  
  ${props =>
    props.color === 'connected'
      ? `
      background: #E6F8EB;

      border: 0px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
      border-radius: 10px;

      ${
        !props.disabled
          ? `
      &:hover {
        border: 0;
        border-color: #C4C9CA;
      }`
          : ''
      }

      &:active {
        box-shadow: none;
        border: 1px solid #C4C9CA;
      }
      `
      : ''}


      ${props =>
        props.color === 'info'
          ? `
          background-color: white;
          border: 2px solid #DADFE6;
          color: #DADFE6;

          img {
            opacity: 0.1;
          }
          `
          : ''}
      

    &:disabled {
      cursor: not-allowed;
      color: #a9aeb3;
      background-color: #dadfe6;
      border-color: #dadfe6;
    }

    @media screen and (max-width: 992px) {
      font-size: 14px;
    }
  }
`

export default ButtonStyle
