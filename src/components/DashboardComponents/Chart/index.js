import React, { useState, useEffect } from 'react'
import { useWallet } from '../../../providers/Wallet'
import { usePools } from '../../../providers/Pools'
import { useThemeContext } from '../../../providers/useThemeContext'
import { Container, Title, Header, ButtonGroup, ChartDiv, ConnectButton, PortoArea } from './style'
import { SPECIAL_VAULTS } from '../../../constants'
import ApexChart from '../../ApexChart'
import { getDataQuery } from '../../../utils'
import ChartRangeSelect from '../../ChartRangeSelect'
import ConnectButtonIcon from '../../../assets/images/logos/sidebar/link_white_connect_button.svg'

const recommendLinks = [
  { name: '1D', type: 0, state: '1D' },
  { name: '1W', type: 1, state: '1W' },
  { name: '1M', type: 2, state: '1M' },
  { name: '1Y', type: 3, state: '1Y' },
]

const Chart = () => {
  const { pools, disableWallet } = usePools()
  const { account, connected, connect } = useWallet()

  const farmProfitSharingPool = pools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )

  const chainId = farmProfitSharingPool.chain

  const [clickedId] = useState(1)

  const [selectedState, setSelectedState] = React.useState('1W')

  const address =
    farmProfitSharingPool.autoStakePoolAddress || farmProfitSharingPool.contractAddress

  const [apiData, setApiData] = React.useState([])

  useEffect(() => {
    const initData = async () => {
      const data = await getDataQuery(365, address, chainId) // GraphQL
      setApiData(data)
    }

    initData()
  }, [address, chainId])

  const { borderColor, backColor, fontColor } = useThemeContext()

  return (
    <PortoArea borderColor={borderColor}>
      <Container blur={!connected} backColor={backColor} fontColor={fontColor}>
        <Header>
          <Title>Total Balance</Title>
          <Title>$&nbsp;0</Title>
        </Header>
        <ChartDiv>
          <ApexChart data={apiData} range={selectedState} filter={clickedId} />
        </ChartDiv>
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
      </Container>
      {!connected ? (
        <>
          {account ? (
            <></>
          ) : (
            <ConnectButton
              color="connectwallet"
              onClick={() => {
                connect()
              }}
              minWidth="190px"
              bordercolor={fontColor}
              disabled={disableWallet}
            >
              <img src={ConnectButtonIcon} className="connect-wallet" alt="" />
              Connect Wallet
            </ConnectButton>
          )}
        </>
      ) : (
        <></>
      )}
    </PortoArea>
  )
}
export default Chart
