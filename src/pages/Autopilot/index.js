import React, { useState, useEffect } from 'react'
import { Dropdown } from 'react-bootstrap'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { IoCheckmark } from 'react-icons/io5'
import 'react-loading-skeleton/dist/skeleton.css'
import { useThemeContext } from '../../providers/useThemeContext'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import { someChainsList } from '../../constants'
import { isSpecialApp } from '../../utilities/formats'
import AutopilotPanel from '../../components/AutopilotComponents/AutopilotPanel'
import {
  Container,
  Inner,
  SubPart,
  CurrencyDropDown,
  CurrencySelect,
  CurrencyDropDownMenu,
  CurrencyDropDownItem,
  HeaderWrap,
  HeaderButton,
  HeaderTitle,
} from './style'

const Autopilot = () => {
  const {
    darkMode,
    bgColorNew,
    hoverColorNew,
    fontColor,
    fontColor1,
    fontColor2,
    borderColorBox,
  } = useThemeContext()

  const { account, chainId } = useWallet()
  const { allVaultsData, loadingVaults } = useVaults()
  const [curChain, setCurChain] = useState(someChainsList[0])
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

  useEffect(() => {
    const matchedChain = someChainsList.find(item => item.chainId === chainId)
    if (matchedChain) {
      setCurChain(matchedChain)
    }
  }, [chainId])

  return (
    <Container bgColor={bgColorNew} fontColor={fontColor}>
      <Inner bgColor={darkMode ? '#171b25' : '#fff'}>
        <HeaderWrap padding="21px 11px 15px 23px" borderColor={borderColorBox}>
          <HeaderTitle fontColor={fontColor} fontColor1={fontColor1}>
            <div className="title">Autopilot</div>
            <div className="desc">
              Maximized yield efficiency with our 1-click autopilot vaults.
            </div>
          </HeaderTitle>
          <HeaderButton>
            <Dropdown>
              <CurrencyDropDown
                id="dropdown-basic"
                bgcolor={bgColorNew}
                fontcolor2={fontColor2}
                hovercolor={hoverColorNew}
                style={{ padding: 0 }}
              >
                {curChain ? (
                  <CurrencySelect>
                    <img
                      className={darkMode ? 'logo-dark' : 'logo'}
                      src={curChain.img}
                      width={16}
                      height={16}
                      alt=""
                    />
                    <span>Autopilots</span>
                    <MdKeyboardArrowDown color="6988ff" fontSize={20} />
                  </CurrencySelect>
                ) : (
                  <></>
                )}
              </CurrencyDropDown>
              {!isSpecialApp ? (
                <CurrencyDropDownMenu>
                  {someChainsList.map(elem => {
                    return (
                      <CurrencyDropDownItem
                        onClick={() => {
                          console.log('')
                        }}
                        hovercolor={hoverColorNew}
                        backColor={bgColorNew}
                        key={elem.id}
                      >
                        <img
                          className={darkMode ? 'logo-dark' : 'logo'}
                          src={elem.img}
                          width={14}
                          height={14}
                          alt=""
                        />
                        <span>Autopilots</span>
                        {curChain.id === elem.id ? <IoCheckmark className="check-icon" /> : <></>}
                      </CurrencyDropDownItem>
                    )
                  })}
                </CurrencyDropDownMenu>
              ) : (
                <></>
              )}
            </Dropdown>
          </HeaderButton>
        </HeaderWrap>
        <SubPart>
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
        </SubPart>
      </Inner>
    </Container>
  )
}

export default Autopilot
