import React, { useEffect, useState } from 'react'
import { useWallet } from '../../../providers/Wallet'
import { getTotalTVLData } from '../../../utils'
import ApexChart from '../ApexChart'
import ChartRangeSelect from '../../ChartRangeSelect'
import {
  ButtonGroup,
  ChartDiv,
  Container,
  Header,
  Total,
  TokenSymbol,
  TooltipInfo,
  FlexDiv,
  CurContent,
} from './style'

const recommendLinks = [
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: '1Y', type: 3, state: '1Y' },
]

const DetailChart = ({ token, vaultPool, tokenSymbol }) => {
  const [selectedState, setSelectedState] = useState('1M')

  const { account } = useWallet()
  const address = token.vaultAddress || vaultPool.autoStakePoolAddress || vaultPool.contractAddress
  const chainId = token.chain || token.data.chain

  const [apiData, setApiData] = useState({})
  const [curDate, setCurDate] = useState('')
  const [curContent, setCurContent] = useState('')

  useEffect(() => {
    const initData = async () => {
      const data = await getTotalTVLData()
      setApiData(data)
    }

    initData()
  }, [address, chainId, account])

  return (
    <Container>
      <Header>
        <Total>
          <FlexDiv>
            <TooltipInfo>
              <TokenSymbol>{`f${tokenSymbol} Price`}</TokenSymbol>
              <FlexDiv>
                <CurContent color="#1b1b1b">{curDate}&nbsp;:&nbsp;</CurContent>
                <CurContent color="#ff9400">{curContent}</CurContent>
              </FlexDiv>
            </TooltipInfo>
          </FlexDiv>
          <ButtonGroup>
            {recommendLinks.map((item, i) => (
              <ChartRangeSelect
                key={i}
                onClick={() => {
                  setSelectedState(item.state)
                }}
                state={selectedState}
                type={item.type}
                text={item.name}
              />
            ))}
          </ButtonGroup>
        </Total>
      </Header>
      <ChartDiv>
        <ApexChart
          data={apiData}
          range={selectedState}
          setCurDate={setCurDate}
          setCurContent={setCurContent}
        />
      </ChartDiv>
    </Container>
  )
}
export default DetailChart
