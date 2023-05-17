import injectedModule from '@web3-onboard/injected-wallets'
import ledgerModule from '@web3-onboard/ledger'
import { init, Web3OnboardProvider } from '@web3-onboard/react'
import walletConnectModule from '@web3-onboard/walletconnect'
import React from 'react'
import { ActionsProvider } from './Actions'
import { ContractsProvider } from './Contracts'
import { PoolsProvider } from './Pools'
import { StatsProvider } from './Stats'
import { ThemeProvider } from './useThemeContext'
import { VaultsProvider } from './Vault'
import { WalletProvider } from './Wallet'

const injected = injectedModule()
const ledger = ledgerModule()
const walletConnect = walletConnectModule({
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModalOptions: {
    mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar'],
  },
})

const web3Onboard = init({
  // head to https://explorer.blocknative.com/account to sign up for free
  apiKey: process.env.REACT_APP_ALCHEMY_KEY,
  wallets: [injected, ledger, walletConnect],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
    },
    {
      id: 11155111,
      token: 'ETH',
      label: 'Sepolia',
      rpcUrl: 'https://rpc.sepolia.org/',
    },
    {
      id: '0x38',
      token: 'BNB',
      label: 'Binance Smart Chain',
      rpcUrl: 'https://bsc-dataseed.binance.org/',
    },
    {
      id: '0x89',
      token: 'MATIC',
      label: 'Matic Mainnet',
      rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
    },
    {
      id: 10,
      token: 'OETH',
      label: 'Optimism',
      rpcUrl: 'https://mainnet.optimism.io',
    },
    {
      id: 42161,
      token: 'ARB-ETH',
      label: 'Arbitrum',
      rpcUrl: 'https://rpc.ankr.com/arbitrum',
    },
    {
      id: 84531,
      token: 'ETH',
      label: 'Base Goerli',
      rpcUrl: 'https://goerli.base.org',
    },
  ],
  appMetadata: {
    name: 'Harvest',
    icon: 'https://harvest-finance-v3.netlify.app/static/media/ifarm.ffb37908.svg',
    // logo: myLogo, // svg string logo
    description: 'Home to Yield Farming',
    gettingStartedGuide: 'https://docs.harvest.finance',
    explore: 'https://docs.harvest.finance/how-it-works/contract-addresses-1',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
    ],
  },
  notify: {
    desktop: {
      enabled: true,
      // eslint-disable-next-line consistent-return
      transactionHandler: transaction => {
        console.log({ transaction })
        if (transaction.eventCode === 'txPool') {
          return {
            type: 'success',
            message: 'Your transaction from #1 DApp is in the mempool',
          }
        }
      },
      position: 'bottomLeft',
    },
    mobile: {
      enabled: true,
      // eslint-disable-next-line consistent-return
      transactionHandler: transaction => {
        console.log({ transaction })
        if (transaction.eventCode === 'txPool') {
          return {
            type: 'success',
            message: 'Your transaction from #1 DApp is in the mempool',
          }
        }
      },
      position: 'topRight',
    },
  },
  accountCenter: {
    desktop: {
      position: 'topRight',
      enabled: true,
      minimal: true,
    },
    mobile: {
      position: 'topLeft',
      enabled: true,
      minimal: true,
    },
  },
  i18n: {
    en: {
      connect: {
        selectingWallet: {
          header: 'custom text header',
        },
      },
      notify: {
        transaction: {
          txStuck: 'custom text for this notification event',
        },
        watched: {
          // Any words in brackets can be re-ordered or removed to fit your dapps desired verbiage
          txPool:
            'Your account is {verb} {formattedValue} {asset} {preposition} {counterpartyShortened}',
        },
      },
    },
    es: {
      transaction: {
        txRequest: 'Su transacción está esperando que confirme',
      },
    },
  },
})

const Providers = ({ children }) => (
  <ContractsProvider>
    <Web3OnboardProvider web3Onboard={web3Onboard}>
      <WalletProvider>
        <PoolsProvider>
          <VaultsProvider>
            <ActionsProvider>
              <StatsProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </StatsProvider>
            </ActionsProvider>
          </VaultsProvider>
        </PoolsProvider>
      </WalletProvider>
    </Web3OnboardProvider>
  </ContractsProvider>
)

export default Providers
