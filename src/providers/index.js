import React from 'react'
// eslint-disable-next-line import/no-unresolved
import { ThirdwebProvider } from 'thirdweb/react'

import { ActionsProvider } from './Actions'
import { ContractsProvider } from './Contracts'
import { PoolsProvider } from './Pools'
import { StatsProvider } from './Stats'
import { RateProvider } from './Rate'
import { ThemeProvider } from './useThemeContext'
import { VaultsProvider } from './Vault'
import { WalletProvider } from './Wallet'
import { PortalsProvider } from './Portals'

const Providers = ({ children }) => (
  <ContractsProvider>
    <ThirdwebProvider>
      <PortalsProvider>
        <WalletProvider>
          <PoolsProvider>
            <VaultsProvider>
              <ActionsProvider>
                <StatsProvider>
                  <RateProvider>
                    <ThemeProvider>{children}</ThemeProvider>
                  </RateProvider>
                </StatsProvider>
              </ActionsProvider>
            </VaultsProvider>
          </PoolsProvider>
        </WalletProvider>
      </PortalsProvider>
    </ThirdwebProvider>
  </ContractsProvider>
)

export default Providers
