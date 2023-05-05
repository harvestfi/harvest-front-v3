import React, { createContext, useContext, useState } from 'react'
import usePersistedState from './usePersistedState'

// register the context
const ThemeContext = createContext({})

/**
 * export custom provider
 * @param {boolean} darkMode
 * @returns
 */
export function ThemeProvider({ children }) {
  /** usePersistedState for storing state in local store */
  // const [darkMode, setDarkMode] = useState(false);
  const [darkMode, setDarkMode] = usePersistedState('darkmode', false)

  const switchMode = darkMode ? 'dark' : 'light'

  const pageBackColor = darkMode ? '#15202B' : '#FAFAFA'
  const fontColor = darkMode ? 'white' : '#15202B'
  const backColor = darkMode ? '#15202B' : 'white'
  const borderColor = darkMode ? 'rgba(217, 217, 217, 0.5)' : '#EAECF0'
  const filterColor = darkMode
    ? 'invert(100%) sepia(20%) saturate(0%) hue-rotate(40deg) brightness(104%) contrast(101%)'
    : ''
  const boxShadowColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
  const hoverImgColor =
    'invert(57%) sepia(61%) saturate(2063%) hue-rotate(1deg) brightness(103%) contrast(105%)'

  const switchDarkIconFilter = darkMode
    ? 'invert(49%) sepia(95%) saturate(814%) hue-rotate(2deg) brightness(106%) contrast(103%)'
    : ''
  const switchLightIconFilter = darkMode
    ? ''
    : 'invert(49%) sepia(95%) saturate(814%) hue-rotate(2deg) brightness(106%) contrast(103%)'
  const switchLightBorder = darkMode ? '#FFFFFF' : '#FF9400'
  const switchDarkBorder = darkMode ? '#FFFFFF' : '#15202B'
  const switchDarkBack = darkMode ? '#FFFFFF' : '#15202B'
  const switchLightBack = darkMode ? '#15202B' : '#FFFFFF'

  const sidebarEffect = darkMode
    ? 'box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5)'
    : 'border: 1px solid #E9E9E9'

  const dashboardListItemPercentBack = darkMode ? 'rgba(39, 174, 96, 0.1)' : '#E6F8EB'
  const dashboardListItemPercentColor = darkMode ? '#27AE60' : '#1ABC9C'

  const filterChainHoverColor = darkMode ? '#242f3a' : '#e9f0f7'

  const badgeIconBackColor = darkMode ? 'white' : 'rgba(255, 255, 255, 0.6)'

  const narrowIconColor = darkMode
    ? 'invert(100%) sepia(1%) saturate(0%) hue-rotate(213deg) brightness(104%) contrast(100%)'
    : ''

  const toggleColor = darkMode
    ? 'invert(100%) sepia(100%) saturate(0%) hue-rotate(288deg) brightness(102%) contrast(102%)'
    : ''

  const mobileFilterBackColor = darkMode ? 'none' : '#F5F5F5'
  const mobileFilterBorderColor = darkMode ? '1px solid rgba(217, 217, 217, 0.5)' : 'none'

  const mobileFilterDisableColor = darkMode ? '#94949f' : 'rgba(21, 32, 43, 0.5)'

  const toggleBackColor = darkMode ? '' : '#EAECF0'

  const [switchBalance, setSwitchBalance] = useState(false) // true : USD, false: Token

  const connectWalletBtnBackColor = darkMode ? '#E5E5E5' : 'rgba(21, 32, 43, 0.05)'
  const connectWalletBtnHoverBackColor = darkMode ? '#E5E5E5' : 'rgba(255, 148, 0, 0.2)'

  const chartBtnGroupBackColor = darkMode ? '#FFFFFF' : '#FCDC67'

  const widoDetailDividerColor = darkMode ? 'rgba(255, 255, 255, 0.27)' : 'rgba(31, 41, 55, 0.27)'

  const widoBackBtnBackColor = darkMode ? '#FF9400' : 'rgba(255, 148, 0, 0.35)'
  const widoBackBtnBackHoverColor = darkMode ? 'rgba(255, 148, 0, 0.8)' : 'rgba(255, 148, 0, 0.25)'
  const widoBackIconColor = darkMode
    ? ''
    : 'invert(59%) sepia(42%) saturate(2316%) hue-rotate(359deg) brightness(101%) contrast(107%)'

  const vaultPanelHoverColor = darkMode ? '#222f3c' : '#f8f8f9'
  const socialBackColor = darkMode ? 'white' : '#15202B'
  const socialIconColor = darkMode
    ? ''
    : 'invert(92%) sepia(6%) saturate(22%) hue-rotate(195deg) brightness(107%) contrast(107%)'

  const searchBackColor = darkMode ? '#15202B' : '#F5F5F5'
  const searchBorderColor = darkMode ? 'rgba(217, 217, 217, 0.5)' : 'none'
  const searchIconColor = darkMode
    ? 'invert(100%) sepia(20%) saturate(0%) hue-rotate(40deg) brightness(104%) contrast(101%)'
    : ''

  const widoDepoTokenListActiveColor = darkMode ? '#ECFDF3' : '#ECFDF3'
  const widoDepoTokenListHoverColor = darkMode ? '#7b8b81' : '#ECFDF3'

  const widoSwitchTagBorderColor = darkMode ? '#F2F4F7' : '#F2F4F7'
  const widoSwitchTagBackColor = darkMode ? '#243648' : '#F9FAFB'
  const widoTagBackColor = darkMode ? '#15202B' : '#FFFFFF'
  const widoTagBoxShadow = darkMode
    ? '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)'
    : '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)'
  const widoTagFontColor = darkMode ? '#b9bcc3' : '#667085'
  const widoTagActiveFontColor = darkMode ? 'white' : '#344054'
  const widoInputPanelBorderColor = darkMode ? '#D0D5DD' : '#D0D5DD'
  const widoInputBoxShadow = darkMode
    ? '0px 1px 2px rgba(16, 24, 40, 0.05)'
    : '0px 1px 2px rgba(16, 24, 40, 0.05)'
  const widoSelTokenSubTitleColor = darkMode ? '#475467' : '#475467'

  const toggleInactiveBackColor = darkMode ? '' : '#F2F4F7'
  const toggleActiveBackColor = darkMode ? '' : '#7F56D9'

  const sidebarFontColor = darkMode ? 'white' : '#344054'
  const sidebarActiveFontColor = darkMode ? '#D0D5DD' : '#101828'
  const sidebarActiveIconColor = darkMode
    ? 'invert(95%) sepia(4%) saturate(441%) hue-rotate(183deg) brightness(89%) contrast(94%)'
    : 'invert(46%) sepia(10%) saturate(767%) hue-rotate(183deg) brightness(92%) contrast(90%)'

  const totalValueFontColor = darkMode ? '#c7c3c3' : '#475467'

  const faqQueHoverColor = darkMode ? '#293744' : '#e9e9e9'

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        setDarkMode,
        switchMode,
        pageBackColor,
        fontColor,
        backColor,
        borderColor,
        filterColor,
        boxShadowColor,
        hoverImgColor,
        switchDarkIconFilter,
        switchLightIconFilter,
        switchLightBorder,
        switchDarkBorder,
        switchDarkBack,
        switchLightBack,
        sidebarEffect,
        dashboardListItemPercentBack,
        dashboardListItemPercentColor,
        filterChainHoverColor,
        badgeIconBackColor,
        narrowIconColor,
        toggleColor,
        mobileFilterBackColor,
        mobileFilterBorderColor,
        mobileFilterDisableColor,
        toggleBackColor,
        switchBalance,
        setSwitchBalance,
        connectWalletBtnBackColor,
        connectWalletBtnHoverBackColor,
        chartBtnGroupBackColor,
        widoDetailDividerColor,
        widoBackBtnBackColor,
        widoBackBtnBackHoverColor,
        widoBackIconColor,
        vaultPanelHoverColor,
        socialBackColor,
        socialIconColor,
        searchBackColor,
        searchBorderColor,
        searchIconColor,
        widoDepoTokenListActiveColor,
        widoDepoTokenListHoverColor,
        widoSwitchTagBorderColor,
        widoSwitchTagBackColor,
        widoTagBackColor,
        widoTagBoxShadow,
        widoTagFontColor,
        widoTagActiveFontColor,
        widoInputPanelBorderColor,
        widoInputBoxShadow,
        widoSelTokenSubTitleColor,
        toggleInactiveBackColor,
        toggleActiveBackColor,
        sidebarFontColor,
        sidebarActiveFontColor,
        sidebarActiveIconColor,
        totalValueFontColor,
        faqQueHoverColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// export a custom hook to use this specific context
export function useThemeContext() {
  return useContext(ThemeContext)
}
