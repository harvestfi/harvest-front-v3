import React, { useState, useEffect } from 'react'
import 'react-loading-skeleton/dist/skeleton.css'
import { useThemeContext } from '../../providers/useThemeContext'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import AutopilotPanel from '../../components/AutopilotComponents/AutopilotPanel'
import { Container, Inner, SubPart, HeaderWrap, HeaderTitle } from './style'

const Autopilot = () => {
  const { darkMode, bgColorNew, fontColor, fontColor1 } = useThemeContext()

  const { account } = useWallet()
  const { allVaultsData, loadingVaults } = useVaults()
  const [vaultsData, setVaultsData] = useState([])

  useEffect(() => {
    const initData = async () => {
      const filteredVaults = Object.values(allVaultsData).filter((vaultData, index) => {
        vaultData.id = Object.keys(allVaultsData)[index]
        if (Object.prototype.hasOwnProperty.call(vaultData, 'isIPORVault')) return true
        return false
      })
      setVaultsData(filteredVaults)
    }

    initData()
  }, [allVaultsData, account])

  return (
    <Container bgColor={bgColorNew} fontColor={fontColor}>
      <Inner bgColor={darkMode ? '#171b25' : '#fff'}>
        <HeaderWrap backImg="" padding="25px 25px 40px 25px" height="234px">
          <HeaderTitle fontColor={fontColor} fontColor1={fontColor1}>
            <div className="title">Autopilot</div>
            <div className="desc">
              Maximized yield efficiency with our 1-click autopilot vaults.
            </div>
          </HeaderTitle>
        </HeaderWrap>
        <SubPart>
          {!loadingVaults && vaultsData.length > 0 ? (
            Array(3)
              .fill(0)
              .map((_, repeatIndex) =>
                vaultsData?.map((vault, index) => (
                  <AutopilotPanel
                    allVaultsData={allVaultsData}
                    vaultData={vault}
                    key={`${repeatIndex}-${index}`}
                    index={index}
                  />
                )),
              )
          ) : (
            <></>
          )}
        </SubPart>
        {/* <SubPart>
          {!loadingVaults && vaultsData.length > 0 ? (
            vaultsData?.map((vault, index) => {
              return (
                <AutopilotPanel
                  allVaultsData={allVaultsData}
                  vaultData={vault}
                  key={index}
                  index={index}
                />
              )
            })
          ) : (
            <></>
          )}
        </SubPart> */}
      </Inner>
    </Container>
  )
}

export default Autopilot
