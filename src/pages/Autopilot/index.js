import React, { useState, useEffect } from 'react'
import { Dropdown } from 'react-bootstrap'
import { BiLeftArrowAlt } from 'react-icons/bi'
import { IoCheckmark } from 'react-icons/io5'
import 'react-loading-skeleton/dist/skeleton.css'
import BankNote from '../../assets/images/logos/dashboard/bank-note.svg'
import DropDownIcon from '../../assets/images/logos/advancedfarm/drop-down.svg'
import { supportedCurrencies } from '../../constants'
import { useThemeContext } from '../../providers/useThemeContext'
import { useRate } from '../../providers/Rate'
import { isSpecialApp } from '../../utilities/formats'
import { useVaults } from '../../providers/Vault'
import AutopilotPanel from '../../components/AutopilotComponents/AutopilotPanel'
import {
  Container,
  Inner,
  SubPart,
  SwitchView,
  CurrencyDropDown,
  CurrencySelect,
  CurrencyDropDownMenu,
  CurrencyDropDownItem,
  HeaderWrap,
  HeaderTitle,
  HeaderButton,
  BackArrow,
} from './style'

const Autopilot = () => {
  const {
    darkMode,
    bgColor,
    backColorButton,
    hoverColor,
    hoverColorNew,
    filterColor,
    backColor,
    fontColor,
    fontColor1,
    fontColor2,
  } = useThemeContext()

  const { rates, updateCurrency } = useRate()
  const [curCurrency, setCurCurrency] = useState(supportedCurrencies[0])
  const { allVaultsData, loadingVaults } = useVaults()
  const [vaultsData, setVaultsData] = useState([])

  const [viewPositions, setViewPositions] = useState(true)
  useEffect(() => {
    const filteredVaults = Object.values(allVaultsData).filter((vaultData, index) => {
      vaultData.id = Object.keys(allVaultsData)[index]
      if (Object.prototype.hasOwnProperty.call(vaultData, 'isIPORVault')) return true
      return false
    })
    setVaultsData(filteredVaults)
  }, [allVaultsData])

  useEffect(() => {
    if (rates.rateData) {
      setCurCurrency(supportedCurrencies[rates.currency.id])
    }
  }, [rates])

  return (
    <Container bgColor={bgColor} fontColor={fontColor}>
      <Inner bgColor={darkMode ? '#171b25' : '#fff'}>
        <HeaderWrap
          backImg=""
          padding={viewPositions ? '25px 25px 40px 25px' : '25px 15px 20px'}
          height={viewPositions ? '234px' : ''}
        >
          <HeaderTitle fontColor={fontColor} fontColor1={fontColor1}>
            {!viewPositions && (
              <BackArrow onClick={() => setViewPositions(prev => !prev)}>
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
              <Dropdown>
                <CurrencyDropDown
                  id="dropdown-basic"
                  bgcolor={backColorButton}
                  fontcolor2={fontColor2}
                  hovercolor={hoverColorNew}
                  style={{ padding: 0 }}
                >
                  {curCurrency ? (
                    <CurrencySelect
                      backColor={backColor}
                      fontcolor2={fontColor2}
                      hovercolor={hoverColor}
                    >
                      <img
                        className={darkMode ? 'logo-dark' : 'logo'}
                        src={curCurrency.imgPath}
                        width={16}
                        height={16}
                        alt=""
                      />
                      <span>{curCurrency.symbol}</span>
                      <img className="dropdown-icon" src={DropDownIcon} alt="" />
                    </CurrencySelect>
                  ) : (
                    <></>
                  )}
                </CurrencyDropDown>
                {!isSpecialApp ? (
                  <CurrencyDropDownMenu backcolor={backColorButton}>
                    {supportedCurrencies.map(elem => {
                      return (
                        <CurrencyDropDownItem
                          onClick={() => {
                            updateCurrency(elem.id)
                          }}
                          fontcolor={fontColor}
                          filtercolor={filterColor}
                          hovercolor={hoverColorNew}
                          key={elem.id}
                        >
                          <img
                            className={darkMode ? 'logo-dark' : 'logo'}
                            src={elem.imgPath}
                            width={14}
                            height={14}
                            alt=""
                          />
                          <span>{elem.symbol}</span>
                          {curCurrency.id === elem.id ? (
                            <IoCheckmark className="check-icon" />
                          ) : (
                            <></>
                          )}
                        </CurrencyDropDownItem>
                      )
                    })}
                  </CurrencyDropDownMenu>
                ) : (
                  <></>
                )}
              </Dropdown>
              <SwitchView
                color={fontColor2}
                backColor={backColorButton}
                hovercolor={hoverColorNew}
                onClick={() => setViewPositions(prev => !prev)}
                darkMode={darkMode}
              >
                <img src={BankNote} alt="money" />
                Full History
              </SwitchView>
            </HeaderButton>
          )}
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
