import React, { useState, useEffect } from 'react'
import { IoIosCloseCircleOutline } from 'react-icons/io'
import 'react-loading-skeleton/dist/skeleton.css'
import { useThemeContext } from '../../../providers/useThemeContext'
import { useRate } from '../../../providers/Rate'
import { fromWei } from '../../../services/web3'
import { useContracts } from '../../../providers/Contracts'
import { getIPORVaultHistories, getIPORLastHarvestInfo } from '../../../utilities/apiCalls'
import { abbreaviteNumber, formatFrequency } from '../../../utilities/formats'
import {
  PanelHeader,
  PanelTitle,
  RowDiv,
  ColumnDiv,
  GeneralDiv,
  PanelTags,
  MainTag,
  BasePanelBox,
  NewLabel,
  PilotInfoClose,
  SwitchMode,
} from './style'

const AutopilotInfo = ({ allVaultsData, vaultData, setPilotInfoShow }) => {
  const { pilotBorderColor1, pilotButtonColor1, backColor, fontColor2 } = useThemeContext()
  const { rates } = useRate()

  const [activeMainTag, setActiveMainTag] = useState(0)

  const { contracts } = useContracts()

  const [currencySym, setCurrencySym] = useState('$')
  const [currencyRate, setCurrencyRate] = useState(1)
  const [lastHarvest, setLastHarvest] = useState('-')
  const [harvestFrequency, setHarvestFrequency] = useState('-')
  const [operatingSince, setOperatingSince] = useState('-')
  const [periodInday, setPeriodInDay] = useState('-')
  const [totalValueLocked, setTotalValueLocked] = useState('-')
  const [vaultToken, setVaultToken] = useState('-')
  const mainTags = ['General', 'Allocation', 'Historical Rates']
  const [showApyHistory, setShowApyHistory] = useState(true)

  const [lifetimeApy, setLifetimeApy] = useState('')
  const [sevenDApy, set7DApy] = useState('')
  const [thirtyDApy, set30DApy] = useState('')
  const [oneEightyDApy, set180DApy] = useState('')
  const [threeSixtyDApy, set360DApy] = useState('')
  const [sevenDHarvest, set7DHarvest] = useState('')
  const [thirtyDHarvest, set30DHarvest] = useState('')
  const [oneEightyDHarvest, set180DHarvest] = useState('')
  const [threeSixtyDHarvest, set360DHarvest] = useState('')

  useEffect(() => {
    if (rates.rateData) {
      setCurrencySym(rates.currency.icon)
      setCurrencyRate(rates.rateData[rates.currency.symbol])
    }
  }, [rates])

  const switchHistory = () => setShowApyHistory(prev => !prev)

  useEffect(() => {
    const initData = async () => {
      const lHarvestDate = await getIPORLastHarvestInfo()
      setLastHarvest(lHarvestDate)
      const { vaultHIPORData, vaultHIPORFlag } = await getIPORVaultHistories()
      if (vaultHIPORFlag) {
        const totalPeriod =
          Number(vaultHIPORData[0].timestamp) -
          Number(vaultHIPORData[vaultHIPORData.length - 1].timestamp)

        const totalPeriodInDay = Math.round(totalPeriod / (24 * 3600))
        setPeriodInDay(totalPeriodInDay)
        let duration = totalPeriod / vaultHIPORData.length,
          day = 0,
          hour = 0,
          min = 0,
          [sevenDaysApy, thirtyDaysApy, oneEightyDaysApy, threeSixtyFiveDaysApy] = Array(4).fill(
            '-',
          ),
          [
            sevenDaysHarvest,
            thirtyDaysHarvest,
            oneEightyDaysHarvest,
            threeSixtyFiveDaysHarvest,
          ] = Array(4).fill('-'),
          latestSharePriceValue = '-',
          lifetimeApyValue = 0

        // calculate (and subtract) whole days
        day = Math.floor(duration / 86400)
        duration -= day * 86400

        // calculate (and subtract) whole hours
        hour = Math.floor(duration / 3600) % 24
        duration -= hour * 3600

        // calculate (and subtract) whole minutes
        min = Math.floor(duration / 60) % 60

        const dayString = `${day > 0 ? `${day}d` : ''}`
        const hourString = `${hour > 0 ? `${hour}h` : ''}`
        const minString = `${min > 0 ? `${min}m` : ''}`
        const result = `${`${dayString !== '' ? `${dayString} ` : ''}${
          hourString !== '' ? `${hourString} ` : ''
        }`}${minString}`

        setHarvestFrequency(result)

        // calculate operating since
        const date = new Date(Number(vaultHIPORData[vaultHIPORData.length - 1].timestamp) * 1000) // Convert to milliseconds
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
        setOperatingSince(formattedDate)

        // calculate TVL
        const tvl = abbreaviteNumber(Number(vaultData.totalValueLocked) * Number(currencyRate), 2)
        setTotalValueLocked(tvl)

        const vaultContract = contracts.iporVault
        const symbol = await vaultContract.methods.symbol(vaultContract.instance)
        setVaultToken(symbol)

        latestSharePriceValue = fromWei(
          vaultHIPORData[0].sharePrice,
          vaultData.decimals,
          vaultData.decimals,
          false,
        )

        const totalPeriodBasedOnApy =
          (Number(vaultHIPORData[0].timestamp) -
            Number(vaultHIPORData[vaultHIPORData.length - 1].timestamp)) /
          (24 * 3600)

        const sharePriceVal = latestSharePriceValue === '-' ? 1 : Number(latestSharePriceValue)
        lifetimeApyValue = `${(((sharePriceVal - 1) / (totalPeriodBasedOnApy / 365)) * 100).toFixed(
          2,
        )}%`

        if (totalPeriodBasedOnApy >= 7) {
          const lastSevenDaysData = vaultHIPORData.filter(
            entry => Number(entry.timestamp) >= Number(vaultHIPORData[0].timestamp) - 7 * 24 * 3600,
          )
          sevenDaysHarvest = lastSevenDaysData.length / 7

          const sumApy = lastSevenDaysData.reduce(
            (accumulator, currentValue) => accumulator + parseFloat(currentValue.apy),
            0,
          )
          sevenDaysApy = `${(sumApy / lastSevenDaysData.length).toFixed(2)}%`
        }

        if (totalPeriodBasedOnApy >= 30) {
          const lastThirtyDaysData = vaultHIPORData.filter(
            entry =>
              Number(entry.timestamp) >= Number(vaultHIPORData[0].timestamp) - 30 * 24 * 3600,
          )
          thirtyDaysHarvest = lastThirtyDaysData.length / 30

          const sumApy = lastThirtyDaysData.reduce(
            (accumulator, currentValue) => accumulator + parseFloat(currentValue.apy),
            0,
          )
          thirtyDaysApy = `${(sumApy / lastThirtyDaysData.length).toFixed(2)}%`
        }

        if (totalPeriodBasedOnApy >= 180) {
          const lastOneEightyDaysData = vaultHIPORData.filter(
            entry =>
              Number(entry.timestamp) >= Number(vaultHIPORData[0].timestamp) - 180 * 24 * 3600,
          )
          oneEightyDaysHarvest = lastOneEightyDaysData.length / 180

          const sumApy = lastOneEightyDaysData.reduce(
            (accumulator, currentValue) => accumulator + parseFloat(currentValue.apy),
            0,
          )
          oneEightyDaysApy = `${(sumApy / lastOneEightyDaysData.length).toFixed(2)}%`
        }

        if (totalPeriodBasedOnApy >= 365) {
          const lastThreeSixtyFiveDaysData = vaultHIPORData.filter(
            entry =>
              Number(entry.timestamp) >= Number(vaultHIPORData[0].timestamp) - 365 * 24 * 3600,
          )
          threeSixtyFiveDaysHarvest = lastThreeSixtyFiveDaysData.length / 365

          const sumApy = lastThreeSixtyFiveDaysData.reduce(
            (accumulator, currentValue) => accumulator + parseFloat(currentValue.apy),
            0,
          )
          threeSixtyFiveDaysApy = `${(sumApy / lastThreeSixtyFiveDaysData.length).toFixed(2)}%`
        }
        set7DApy(sevenDaysApy)
        set30DApy(thirtyDaysApy)
        set180DApy(oneEightyDaysApy)
        set360DApy(threeSixtyFiveDaysApy)
        setLifetimeApy(lifetimeApyValue === 0 ? '-' : lifetimeApyValue)
        set7DHarvest(formatFrequency(sevenDaysHarvest))
        set30DHarvest(formatFrequency(thirtyDaysHarvest))
        set180DHarvest(formatFrequency(oneEightyDaysHarvest))
        set360DHarvest(formatFrequency(threeSixtyFiveDaysHarvest))
      }
    }

    initData()
  }, [contracts, currencyRate, vaultData])

  const onClickCloseInfo = () => {
    setPilotInfoShow(false)
  }

  return (
    <>
      <BasePanelBox backColor={backColor} borderColor={pilotBorderColor1} borderRadius="15px">
        <PanelHeader>
          <PanelTitle>
            <NewLabel
              size="13.4px"
              height="20px"
              weight="700"
              marginTop="25px"
              marginLeft="20px"
              color={fontColor2}
            >
              USDC Autopilot Info
            </NewLabel>
            <PilotInfoClose>
              <IoIosCloseCircleOutline
                className="pilot-info"
                onClick={() => {
                  onClickCloseInfo()
                }}
              />
            </PilotInfoClose>
          </PanelTitle>
          <PanelTags>
            {mainTags.map((tag, i) => (
              <MainTag
                fontColor2={fontColor2}
                bgColor={pilotButtonColor1}
                key={i}
                active={activeMainTag === i ? 'true' : 'false'}
                onClick={() => {
                  setActiveMainTag(i)
                }}
              >
                <NewLabel size="11px" weight="600px">
                  {tag}
                </NewLabel>
              </MainTag>
            ))}
          </PanelTags>
        </PanelHeader>
        {activeMainTag === 0 && (
          <GeneralDiv key={activeMainTag}>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                Last Harvest
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                {lastHarvest}&nbsp;ago
              </NewLabel>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                Harvest Frequency
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                ~{harvestFrequency}
              </NewLabel>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                Lifetime avg. APY
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                {vaultData.estimatedApy}%
              </NewLabel>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                Operating Since
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                {`${operatingSince} (${periodInday} days)`}
              </NewLabel>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                TVL
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                {currencySym}
                {totalValueLocked}
              </NewLabel>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                Underlying
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                {vaultData.tokenNames[0]}
              </NewLabel>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                Vault Token
              </NewLabel>
              <u>
                <NewLabel
                  size="13.4px"
                  height="20px"
                  weight="500"
                  cursor="pointer"
                  onClick={() => {
                    window.open(`https://arbiscan.io/address/${vaultData.vaultAddress}`, '_blank')
                  }}
                >
                  {vaultToken}
                </NewLabel>
              </u>
            </RowDiv>
            <ColumnDiv>
              <NewLabel size="13.4px" height="20px" weight="700">
                Technology
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="400">
                Autopilot is powered by audited IPOR Fusion Vault technology.
              </NewLabel>
            </ColumnDiv>
          </GeneralDiv>
        )}
        {activeMainTag === 1 && (
          <GeneralDiv key={activeMainTag}>
            {vaultData.allocPointData && vaultData.allocPointData.length > 0 ? (
              vaultData.allocPointData.map((data, index) => {
                let vaultName = data.hVaultId.split('_')[0]
                vaultName = `${vaultName.charAt(0).toUpperCase() + vaultName.slice(1)} USDC`
                return (
                  <RowDiv key={index}>
                    <NewLabel
                      size="13.4px"
                      height="20px"
                      weight="500"
                      cursor="pointer"
                      borderBottom="0.5px dotted white"
                      onClick={() => {
                        window.open(
                          `https://app.harvest.finance/arbitrum/${
                            allVaultsData[data.hVaultId]?.vaultAddress
                          }`,
                          '_blank',
                        )
                      }}
                    >
                      {vaultName}
                    </NewLabel>
                    <NewLabel size="13.4px" height="20px" weight="500">
                      {Number(data.allocPoint).toFixed(2)}%
                    </NewLabel>
                  </RowDiv>
                )
              })
            ) : (
              <></>
            )}
          </GeneralDiv>
        )}
        {activeMainTag === 2 && (
          <GeneralDiv key={activeMainTag}>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                {showApyHistory ? 'APY' : 'Harvest Frequency'}
              </NewLabel>
              <SwitchMode mode={showApyHistory ? 'apy' : 'harvest'}>
                <div id="theme-switch">
                  <div className="switch-track">
                    <div className="switch-thumb" />
                  </div>
                  <input
                    type="checkbox"
                    checked={showApyHistory}
                    onChange={switchHistory}
                    aria-label="Switch between APY and Harvest frequency"
                  />
                </div>
              </SwitchMode>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                {showApyHistory ? 'Live' : 'Latest'}
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                {showApyHistory ? `${vaultData.estimatedApy}%` : `${lastHarvest} ago`}
              </NewLabel>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                7d
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                {showApyHistory ? sevenDApy : sevenDHarvest}
              </NewLabel>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                30d
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                {showApyHistory ? thirtyDApy : thirtyDHarvest}
              </NewLabel>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                180d
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                {showApyHistory ? oneEightyDApy : oneEightyDHarvest}
              </NewLabel>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                360d
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                {showApyHistory ? threeSixtyDApy : threeSixtyDHarvest}
              </NewLabel>
            </RowDiv>
            <RowDiv>
              <NewLabel size="13.4px" height="20px" weight="500">
                Lifetime
              </NewLabel>
              <NewLabel size="13.4px" height="20px" weight="500">
                {showApyHistory ? lifetimeApy : harvestFrequency}
              </NewLabel>
            </RowDiv>
          </GeneralDiv>
        )}
      </BasePanelBox>
    </>
  )
}

export default AutopilotInfo
