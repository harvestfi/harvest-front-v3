import React from 'react'
import { fromWEI } from '../../../constants'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Text, Vault, Content } from './style'

const WidoSelectTokenList = ( { list, clickId, setClickedId, setPickedToken, setBalance, setSelectTokenWido, setWidoPartHeight } ) => {
  const handleClick = (id) => {
    setClickedId(id)
    setPickedToken(list[id])
    setBalance(fromWEI(list[id].balance, list[id].decimals))
    setSelectTokenWido(false)
    setWidoPartHeight(null)
  }

  const { widoDepoTokenListActiveColor, widoDepoTokenListHoverColor } = useThemeContext()

  return (
    <Content>
      {
        list.map((data, i)=> (
          <Container key={i}
            className={ i === clickId ? "active" : "" }
            onClick={()=>{ 
              handleClick(i)
            }} 
            hoverColor={widoDepoTokenListHoverColor}
            activeColor={widoDepoTokenListActiveColor}>
            <img src={data.logoURI} width={25} height={25} alt="" />
            <Vault>
              <Text size={"14px"} height={"18px"} weight={700}>{data.symbol}</Text>
              <Text size={"12px"} height={"16px"} weight={400}>{fromWEI(data.balance, data.decimals).toFixed(4)}</Text>
            </Vault>
          </Container>
        ))
      }
    </Content>
  )
}
export default WidoSelectTokenList
