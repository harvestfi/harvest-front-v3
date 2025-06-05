import { init } from '@web3-onboard/react'
import injectedModule, { ProviderLabel } from '@web3-onboard/injected-wallets'
import gnosisModule from '@web3-onboard/gnosis'
import binanceModule from '@binance/w3w-blocknative-connector'
import walletConnectModule from '@web3-onboard/walletconnect'
import ledgerModule from '@web3-onboard/ledger'
import HavestLogo from '../assets/images/logos/Harvest_Standard.svg'

const injected = injectedModule({
  displayUnavailable: [ProviderLabel.Zerion, ProviderLabel.Coinbase],
  sort: wallets => {
    const rabby = wallets.find(({ label }) => label === ProviderLabel.Rabby)
    const zerion = wallets.find(({ label }) => label === ProviderLabel.Zerion)

    return [
      rabby,
      zerion,
      ...wallets.filter(
        ({ label }) => label !== ProviderLabel.Rabby && label !== ProviderLabel.Zerion,
      ),
    ]
  },
})
const gnosis = gnosisModule()
const binance = binanceModule()
const ledger = ledgerModule({
  projectId: '6931eace1272646ed84e46c55fac0311',
})
const walletConnect = walletConnectModule({
  projectId: '6931eace1272646ed84e46c55fac0311',
  dappUrl: 'https://app.harvest.finance',
  qrModalOptions: {
    mobileWallets: [
      {
        id: 'rainbow',
        name: 'Rainbow',
        links: {
          universal: 'https://rainbow.me',
          native: 'rainbow://',
        },
      },
      {
        id: 'metamask',
        name: 'MetaMask',
        links: {
          universal: 'https://metamask.io',
          native: 'metamask://',
        },
      },
      {
        id: 'argent',
        name: 'Argent',
        links: {
          universal: 'https://argent.xyz',
          native: 'argent://',
        },
      },
      {
        id: 'trust',
        name: 'Trust Wallet',
        links: {
          universal: 'https://trustwallet.com',
          native: 'trust://',
        },
      },
      {
        id: 'imtoken',
        name: 'imToken',
        links: {
          universal: 'https://token.im',
          native: 'imtokenv2://',
        },
      },
      {
        id: 'pillar',
        name: 'Pillar',
        links: {
          universal: 'https://pillar.fi',
          native: 'pillar://',
        },
      },
    ],
  },
})

export const web3Onboard = init({
  // head to https://explorer.blocknative.com/account to sign up for free
  apiKey: process.env.REACT_APP_BLOCKNATIVE_KEY,
  wallets: [injected, binance, walletConnect, gnosis, ledger],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: `https://rpc.ankr.com/eth`,
    },
    {
      id: '0x89',
      token: 'MATIC',
      label: 'Polygon Mainnet',
      rpcUrl: 'https://rpc.ankr.com/polygon',
    },
    {
      id: 8453,
      token: 'BETH',
      label: 'Base Mainnet',
      rpcUrl: 'https://developer-access-mainnet.base.org',
    },
    {
      id: 42161,
      token: 'AETH',
      label: 'Arbitrum One',
      rpcUrl: 'https://rpc.ankr.com/arbitrum',
    },
    {
      id: 324,
      token: 'ZETH',
      label: 'Zksync',
      rpcUrl: 'https://rpc.ankr.com/zksync_era',
    },
  ],
  appMetadata: {
    name: 'Harvest',
    icon: 'https://app.harvest.finance/static/media/ifarm.ffb37908.svg',
    logo: HavestLogo, // svg string logo
    description: 'Home to Yield Farming',
    gettingStartedGuide: 'https://docs.harvest.finance',
    explore: 'https://app.harvest.finance',
    recommendedInjectedWallets: [
      { name: 'MetaMask', url: 'https://metamask.io' },
      { name: 'Coinbase', url: 'https://wallet.coinbase.com/' },
    ],
    agreement: {
      version: '3.0.1',
      termsUrl: 'https://docs.harvest.finance/legal/terms-and-conditions',
      privacyUrl: 'https://docs.harvest.finance/legal/privacy-policy',
    },
  },
  notify: {
    enabled: false,
  },
  accountCenter: {
    desktop: {
      position: 'topRight',
      enabled: false,
      minimal: true,
    },
    mobile: {
      position: 'topRight',
      enabled: false,
      minimal: true,
    },
  },
  connect: {
    autoConnectLastWallet: true,
  },
})
