import React, { useEffect } from 'react'
import { useThemeContext } from '../../providers/useThemeContext'
import {
  Container, FarmType, Text, ContentResult, ContentImg,
  ContentMiddle, Percent, Img, ChartDiv
} from './style'
import { displayAPY, getTotalApy, getDataQuery } from '../../utils'
import {
  DECIMAL_PRECISION,
  directDetailUrl,
} from '../../constants'
import SmallApexChart from '../SmallApexChart'
import ConnectSuccessIcon from '../../assets/images/logos/sidebar/connect-success.svg'

const HomeComponentInfo = ({
  token,
  vaultPool,
  tokenVault,
  text,
  url,
}) => {
  const isSpecialVault = token.liquidityPoolVault || token.poolVault

  const totalApy = isSpecialVault
    ? getTotalApy(null, token, true)
    : getTotalApy(vaultPool, tokenVault)

  const { fontColor, backColor, borderColor } = useThemeContext()

  const chainId = token.chain || token.data.chain
  let address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const [apiData, setApiData] = React.useState({})
  
  useEffect(()=>{
    const initData = async () => {
      let data = await getDataQuery(365, address, chainId, null)
      
      setApiData(data)
    }

    initData()
  }, [address, chainId])

  return (
    <Container href={directDetailUrl + url} backColor={backColor} borderColor={borderColor} >
      <ContentMiddle>
        <Img>
          {token.logoUrl
            ? token.logoUrl.map((symbol, symbolIdx) => (
                <ContentImg
                  key={symbol}
                  id={symbolIdx}
                  width={'32px'}
                  height={'32px'}
                  margin="0px 5px 0px 0px"
                  src={symbol}
                />
              ))
            : null}
        </Img>

        <FarmType>
          <img src={ConnectSuccessIcon} width="6px" height="6px" alt="" />
          <Text>{text}</Text>
        </FarmType>
      </ContentMiddle>
      <ContentResult>
        <Percent fontColor={fontColor}>
          {displayAPY(totalApy, DECIMAL_PRECISION, 10)}
          &nbsp;APY
        </Percent>
        <ChartDiv>
          <SmallApexChart data={apiData} lastAPY={Number(totalApy)} specVault={"false"} />
        </ChartDiv>
      </ContentResult>
    </Container>
  )
}

export default HomeComponentInfo
