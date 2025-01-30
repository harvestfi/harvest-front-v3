import React, { useState, useEffect } from 'react'
import { BiLeftArrowAlt } from 'react-icons/bi'
import 'react-loading-skeleton/dist/skeleton.css'
import BankNote from '../../assets/images/logos/dashboard/bank-note.svg'
import { useThemeContext } from '../../providers/useThemeContext'
import { initBalanceAndDetailData } from '../../utilities/apiCalls'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import AutopilotPanel from '../../components/AutopilotComponents/AutopilotPanel'
import EarningsHistory from '../../components/EarningsHistory/HistoryData'
import {
  Container,
  Inner,
  SubPart,
  SwitchView,
  HeaderWrap,
  HeaderTitle,
  HeaderButton,
  BackArrow,
} from './style'
import { handleToggle } from '../../utilities/parsers'

const Autopilot = () => {
  const {
    darkMode,
    bgColorNew,
    backColorButton,
    hoverColorNew,
    fontColor,
    fontColor1,
    fontColor2,
  } = useThemeContext()

  const { account } = useWallet()
  const { allVaultsData, loadingVaults } = useVaults()
  const [vaultsData, setVaultsData] = useState([])
  const [totalHistoryData, setTotalHistoryData] = useState([])

  const [viewPositions, setViewPositions] = useState(true)

  useEffect(() => {
    const initData = async () => {
      let combinedEnrichedData = []
      const filteredVaults = Object.values(allVaultsData).filter((vaultData, index) => {
        vaultData.id = Object.keys(allVaultsData)[index]
        if (Object.prototype.hasOwnProperty.call(vaultData, 'isIPORVault')) return true
        return false
      })
      const promises = filteredVaults.map(async token => {
        if (account && token) {
          const address = token.vaultAddress
          const chainId = token.chain
          const iporVFlag = token.isIPORVault ?? false
          const { bFlag, vHFlag, enrichedData } = await initBalanceAndDetailData(
            address,
            chainId,
            account,
            token.decimals,
            iporVFlag,
          )

          if (bFlag && vHFlag) {
            const enrichedDataWithSymbol = enrichedData.map(data => ({
              ...data,
              tokenSymbol: token.id,
            }))

            combinedEnrichedData = combinedEnrichedData.concat(enrichedDataWithSymbol)
          }
        }
      })

      await Promise.all(promises)
      combinedEnrichedData.sort((a, b) => b.timestamp - a.timestamp)
      setTotalHistoryData(combinedEnrichedData)
      setVaultsData(filteredVaults)
    }

    initData()
  }, [allVaultsData, account])

  return (
    <Container bgColor={bgColorNew} fontColor={fontColor}>
      <Inner bgColor={darkMode ? '#171b25' : '#fff'}>
        <HeaderWrap
          backImg=""
          padding={viewPositions ? '25px 25px 40px 25px' : '25px 15px 20px'}
          height={viewPositions ? '234px' : ''}
        >
          <HeaderTitle fontColor={fontColor} fontColor1={fontColor1}>
            {!viewPositions && (
              <BackArrow onClick={handleToggle(setViewPositions)}>
                <BiLeftArrowAlt fontSize={20} />
                Back
              </BackArrow>
            )}
            <div className="title">Autopilot</div>
            <div className="desc">
              Maximized yield efficiency with our 1-click autopilot vaults.
            </div>
          </HeaderTitle>
          {viewPositions && (
            <HeaderButton>
              <SwitchView
                color={fontColor2}
                backColor={backColorButton}
                hovercolor={hoverColorNew}
                onClick={handleToggle(setViewPositions)}
                darkMode={darkMode}
              >
                <img src={BankNote} alt="money" />
                Full History
              </SwitchView>
            </HeaderButton>
          )}
        </HeaderWrap>
        <SubPart>
          {viewPositions ? (
            !loadingVaults && vaultsData.length > 0 ? (
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
            )
          ) : (
            !loadingVaults &&
            vaultsData.length > 0 && (
              <EarningsHistory
                historyData={totalHistoryData}
                isDashboard="true"
                noData={!(vaultsData.length > 0)}
              />
            )
          )}
        </SubPart>
      </Inner>
    </Container>
  )
}

export default Autopilot
