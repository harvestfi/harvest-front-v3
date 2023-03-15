const { CHAINS_ID, TRADING_APY_TYPES, POOL_TYPES } = require('../constants')
const addresses = require('./addresses.json')

const strat30PercentFactor = '0.7'

module.exports = [
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_JRTNOV22_USDC.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JRTNOV22_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JRTNOV22_USDC.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JRTNOV22_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x68fd822a2bda3db31fffa68089696ea4e55a9d36" style="color: #15202B;">
      KyberDMM-LP(JRT-NOV22, USDC)</a> to Jarvis earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards are reinvested into more 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x68fd822a2bda3db31fffa68089696ea4e55a9d36" style="color: #15202B;">
      KyberDMM-LP(JRT-NOV22, USDC)</a> to compound your earnings. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_JRTMIMONOV22_2EURPAR.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JRTMIMONOV22_2EURPAR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JRTMIMONOV22_2EURPAR.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JRTMIMONOV22_2EURPAR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x946be3ecaebaa3fe2ebb73864ab555a8cfdf49fd" style="color: #15202B;">
      KyberDMM-LP(JRT-MIMO-NOV22, 2EUR-PAR)</a> to Jarvis earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x4Fd52587194a0bfd3AC5b8096D15e1a7230bA2eb" style="color: #15202B;">
      JRT-MIMO-NOV22</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x4Fd52587194a0bfd3AC5b8096D15e1a7230bA2eb" style="color: #15202B;">
      JRT-MIMO-NOV22</a> rewards are reinvested into more 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x946be3ecaebaa3fe2ebb73864ab555a8cfdf49fd" style="color: #15202B;">
      KyberDMM-LP(JRT-MIMO-NOV22, 2EUR-PAR)</a> to compound your earnings. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_JRTANGLENOV22_2EURagEUR.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JRTANGLENOV22_2EURagEUR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JRTANGLENOV22_2EURagEUR.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JRTANGLENOV22_2EURagEUR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x4d44f653b885fbddf486a71508afd63071ca1a6e" style="color: #15202B;">
      KyberDMM-LP(JRT-ANGLE-NOV22, 2EUR-agEUR)</a> to Jarvis earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x63B87304fc9889Ce7356396ea959aA64850a52E7" style="color: #15202B;">
      JRT-ANGLE-NOV22</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x63B87304fc9889Ce7356396ea959aA64850a52E7" style="color: #15202B;">
      JRT-ANGLE-NOV22</a> rewards are reinvested into more 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x4d44f653b885fbddf486a71508afd63071ca1a6e" style="color: #15202B;">
      KyberDMM-LP(JRT-ANGLE-NOV22, 2EUR-agEUR)</a> to compound your earnings. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_2EUR_EURe_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_2EUR_EURe_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_2EUR_EURe_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fJRTNOV22_USDC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x2f3e9ca3bff85b91d9fe6a9f3e8f9b1a6a4c3cf4" style="color: #15202B;">
      2EUR(EURe)</a> to Jarvis earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards are reinvested into the JRT(NOV22)-USDC farm which pays the highest yield. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'notional_DAI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.notional_DAI.NewPool,
    collateralAddress: addresses.V2.notional_DAI.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x6ebce2453398af200c688c7c4ebd479171231818" style="color: #15202B;">
        nDAI</a> to Notional earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5" style="color: #15202B;">
        NOTE</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5" style="color: #15202B;">
        NOTE</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x6ebce2453398af200c688c7c4ebd479171231818" style="color: #15202B;">
        nDAI</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'notional_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.notional_ETH.NewPool,
    collateralAddress: addresses.V2.notional_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xabc07bf91469c5450d6941dd0770e6e6761b90d6" style="color: #15202B;">
        nETH</a> to Notional earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5" style="color: #15202B;">
        NOTE</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5" style="color: #15202B;">
        NOTE</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xabc07bf91469c5450d6941dd0770e6e6761b90d6" style="color: #15202B;">
        nETH</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'notional_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.notional_USDC.NewPool,
    collateralAddress: addresses.V2.notional_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x18b0fc5a233acf1586da7c199ca9e3f486305a29" style="color: #15202B;">
        nUSDC</a> to Notional earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5" style="color: #15202B;">
        NOTE</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5" style="color: #15202B;">
        NOTE</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x18b0fc5a233acf1586da7c199ca9e3f486305a29" style="color: #15202B;">
        nUSDC</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'notional_WBTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.notional_WBTC.NewPool,
    collateralAddress: addresses.V2.notional_WBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x0ace2dc3995acd739ae5e0599e71a5524b93b886" style="color: #15202B;">
      nWBTC</a> to Notional earning 
      <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5" style="color: #15202B;">
      NOTE</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5" style="color: #15202B;">
      NOTE</a> rewards are reinvested into more 
      <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x0ace2dc3995acd739ae5e0599e71a5524b93b886" style="color: #15202B;">
      nWBTC</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_2EUR_EURT_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_2EUR_EURT_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_2EUR_EURT_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fJRTSEP22_USDC', 'fJRTNOV22_USDC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x2c3cc8e698890271c8141be9f6fd6243d56b39f1" style="color: #15202B;">
      2EUR(EURT)</a> to Jarvis earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards are reinvested into the JRT(NOV22)-USDC farm which pays the highest yield. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_2EUR_PAR_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_2EUR_PAR_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_2EUR_PAR_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fJRTMIMO_2EURPAR', 'fJRTMIMONOV22_2EURPAR'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x0f110c55efe62c16d553a3d3464b77e1853d0e97" style="color: #15202B;">
      2EUR(PAR)</a> to Jarvis earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x4Fd52587194a0bfd3AC5b8096D15e1a7230bA2eb" style="color: #15202B;">
      JRT-MIMO-NOV22</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x4Fd52587194a0bfd3AC5b8096D15e1a7230bA2eb" style="color: #15202B;">
      JRT-MIMO-NOV22</a> rewards are reinvested into the JRT-MIMO-NOV22 - 2EUR-PAR farm which pays the highest yield. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_JRTSEP22_USDC.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JRTSEP22_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JRTSEP22_USDC.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JRTSEP22_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0xcE0248f30d565555B793f42e46E58879F2cDCCa4/0x2623d9a6cceb732f9e86125e107a18e7832b27e5">
            KyberDMM
          </a>
          and add liquidity for JRT(SEP22)-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_JRTMIMO_2EURPAR.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JRTMIMO_2EURPAR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JRTMIMO_2EURPAR.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JRTMIMO_2EURPAR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/add/0x0f110c55EfE62c16D553A3d3464B77e1853d0e97/0xAFC780bb79E308990c7387AB8338160bA8071B67/0x181650dde0a3a457f9e82b00052184ac3feaadf3">
            KyberDMM
          </a>
          and add liquidity for JRT_MIMO_SEP22-2EUR_PAR
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'convex_cvxCRV',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.convex_cvxCRV.NewPool,
    collateralAddress: addresses.V2.convex_cvxCRV.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7" style="color: #15202B;">
        cvxCRV</a> to Curve earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xd533a949740bb3306d119cc777fa900ba034cd52" style="color: #15202B;">
        CRV</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b" style="color: #15202B;">
        CVX</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x6c3f90f043a72fa612cbac8115ee7e52bde6e490" style="color: #15202B;">
        3CRV</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xd533a949740bb3306d119cc777fa900ba034cd52" style="color: #15202B;">
        CRV</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b" style="color: #15202B;">
        CVX</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x6c3f90f043a72fa612cbac8115ee7e52bde6e490" style="color: #15202B;">
        3CRV</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7" style="color: #15202B;">
        cvxCRV</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately.
    </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_jEUR_WETH_HODL.Underlying, 'quickswap_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_jEUR_WETH_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_jEUR_WETH_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_jEUR_WETH_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fAURJUL22_WETH'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://quickswap.exchange/#/add/0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619">
            QuickSwap
          </a>
          and add liquidity for jEUR-WETH
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_jCHF_WETH_HODL.Underlying, 'quickswap_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_jCHF_WETH_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_jCHF_WETH_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_jCHF_WETH_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fAURJUL22_WETH'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://quickswap.exchange/#/add/0xbD1463F02f61676d53fd183C2B19282BFF93D099/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619">
            QuickSwap
          </a>
          and add liquidity for jCHF-WETH
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_AURJUL22_WETH.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_AURJUL22_2EUR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_AURJUL22_WETH.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_AURJUL22_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/add/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619/0x8C56600D7D8f9239f124c7C52D3fa018fC801A76/0xf9ce68a9e41f1e7cee5fdcbef99669653aa61390">
            KyberDMM
          </a>
          and add liquidity for AUR(JUL22)-WETH
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'bal_MaticX',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.bal_MaticX.Underlying, 'balancerv2_matic'],
    },
    contractAddress: addresses.MATIC.V2.bal_MaticX.NewPool,
    collateralAddress: addresses.MATIC.V2.bal_MaticX.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.bal_MaticX.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.balancer.fi/#/pool/${addresses.MATIC.V2.bal_MaticX.PoolId}">
            balancer
          </a>
          and invest <b style="text-decoration: underline;">WMATIC</b> or <b style="text-decoration: underline;">MaticX</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'bal_stMatic',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.bal_stMatic.Underlying, 'balancerv2_matic'],
    },
    contractAddress: addresses.MATIC.V2.bal_stMatic.NewPool,
    collateralAddress: addresses.MATIC.V2.bal_stMatic.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.bal_stMatic.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.balancer.fi/#/pool/${addresses.MATIC.V2.bal_stMatic.PoolId}">
            balancer
          </a>
          and invest <b style="text-decoration: underline;">WMATIC</b> or <b style="text-decoration: underline;">stMatic</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_2NZD_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_2NZD_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_2NZD_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fJRTJUL22_USDC', 'fJRTSEP22_USDC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.curve.fi/factory/228/deposit">
            Curve
          </a>
          and add liquidity for 2NZD
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_JRTJUL22_USDC.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JRTJUL22_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JRTJUL22_USDC.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JRTJUL22_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0xD7f13BeE20D6848D9Ca2F26d9A244AB7bd6CDDc0/0x707c7f22d5e3c0234bcc53aee51420d6cdd988f9">
            KyberDMM
          </a>
          and add liquidity for JRT(JUL22)-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_2EUR_agEUR_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_2EUR_agEUR_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_2EUR_agEUR_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: [
      'miFARM',
      'WMATIC',
      'fagDENJUL22_2EUR',
      'fJRTANGLE_2EURagEUR',
      'fJRTANGLENOV22_2EURagEUR',
    ],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x2ffbce9099cbed86984286a54e5932414af4b717" style="color: #15202B;">
      2EUR(agEUR)</a> to Jarvis earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x63B87304fc9889Ce7356396ea959aA64850a52E7" style="color: #15202B;">
      JRT-ANGLE-NOV22</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x63B87304fc9889Ce7356396ea959aA64850a52E7" style="color: #15202B;">
      JRT-ANGLE-NOV22</a> rewards are reinvested into the JRT-ANGLE-NOV22 - 2EUR-agEUR farm which pays the highest yield. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_JRTANGLE_2EURagEUR.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JRTANGLE_2EURagEUR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JRTANGLE_2EURagEUR.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JRTANGLE_2EURagEUR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/add/0x2fFbCE9099cBed86984286A54e5932414aF4B717/0x6966D20E33A15baFde7E856147E4E5EaF418E145/0x8c2fe36e51657385d3091e92fbacb79263867f16">
            KyberDMM
          </a>
          and add liquidity for JRT_ANGLE_SEP22-2EUR_agEUR
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_agDENJUL22_2EUR.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_agDENJUL22_2EUR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_agDENJUL22_2EUR.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_agDENJUL22_2EUR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/#/add/0x2fFbCE9099cBed86984286A54e5932414aF4B717/0xEEfF5d27e40A5239f6F28d4b0fbE20acf6432717/0x7d85ccf1b7cbaab68c580e14fa8c92e32704404f">
            KyberDMM
          </a>
          and add liquidity for agDEN(JUL22)-2EUR
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_DENJUL22_4EUR.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_DENJUL22_4EUR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_DENJUL22_4EUR.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_DENJUL22_4EUR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/#/add/0x53d00635aeC4a6379523341AEBC325857f32FdE1/0xAd326c253A84e9805559b73A08724e11E49ca651/0xf84fa79a94afb742a98edf2c7a10ef7134b684bc">
            KyberDMM
          </a>
          and add liquidity for DEN(JUL22)-4EUR
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_JRTMAY22_USDC.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JRTMAY22_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JRTMAY22_USDC.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JRTMAY22_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0xF5f480Edc68589B51F4217E6aA82Ef7Df5cf789e/0xdaa2c66b06b62bad2e192be0a93f895c855484ee">
            KyberDMM
          </a>
          and add liquidity for JRT(MAY22)-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_2SGD_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_2SGD_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_2SGD_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: [
      'miFARM',
      'WMATIC',
      'fJRTMAY22_USDC',
      'fJRTJUL22_USDC',
      'fJRTSEP22_USDC',
      'fJRTNOV22_USDC',
    ],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xef75e9c7097842acc5d0869e1db4e5fddf4bfdda" style="color: #15202B;">
      2SGD</a> to Jarvis earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards are reinvested into the JRT(NOV22)-USDC farm which pays the highest yield. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_UNT_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_UNT_ETH.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_UNT_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_UNT_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM, addresses.UNT],
    rewardTokenSymbols: ['iFARM', 'UNT'],
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'crvTriCrypto3_polygon',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.crvTriCrypto3_polygon.NewPool,
    collateralAddress: addresses.MATIC.V2.crvTriCrypto3_polygon.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.curve.fi/atricrypto3/deposit">
            Curve
          </a>
          and add liquidity for aTriCrypto3
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'crvEurtUsd_polygon',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.crvEurtUsd_polygon.NewPool,
    collateralAddress: addresses.MATIC.V2.crvEurtUsd_polygon.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.curve.fi/eurtusd/deposit">
            Curve
          </a>
          and add liquidity for EURT-USD
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_SES_2JPY.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_SES_2JPY',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_SES_2JPY.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_SES_2JPY.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/#/add/0x9120ECada8dc70Dc62cBD49f58e861a09bf83788/0xE8dCeA7Fb2Baf7a9F4d9af608F06d78a687F8d9A/0x3b76F90A8ab3EA7f0EA717F34ec65d194E5e9737">
            KyberDMM
          </a>
          and add liquidity for SES-2JPY
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_2JPY_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_2JPY_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_2JPY_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: [
      'miFARM',
      'WMATIC',
      'fSES_2JPY',
      'fJRTMAY22_USDC',
      'fJRTJUL22_USDC',
      'fJRTSEP22_USDC',
      'fJRTNOV22_USDC',
    ],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xaa91cdd7abb47f821cf07a2d38cc8668deaf1bdc" style="color: #15202B;">
      2JPY</a> to Jarvis earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards are reinvested into the JRT(NOV22)-USDC farm which pays the highest yield. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_QUI_2CAD.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_QUI_2CAD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_QUI_2CAD.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_QUI_2CAD.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/#/add/0xA69b0D5c0C401BBA2d5162138613B5E38584F63F/0xF65fb31ad1ccb2E7A6Ec3B34BEA4c81b68af6695/0x32d8513eDDa5AEf930080F15270984A043933A95">
            KyberDMM
          </a>
          and add liquidity for QUI-2CAD
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_2CAD_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_2CAD_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_2CAD_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: [
      'miFARM',
      'WMATIC',
      'fQUI_2CAD',
      'fJRTMAY22_USDC',
      'fJRTJUL22_USDC',
      'fJRTSEP22_USDC',
      'fJRTNOV22_USDC',
    ],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xa69b0d5c0c401bba2d5162138613b5e38584f63f" style="color: #15202B;">
      2CAD</a> to Jarvis earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5eF12a086B8A61C0f11a72b36b5EF451FA17f1f1" style="color: #15202B;">
      JRT-NOV22</a> rewards are reinvested into the JRT(NOV22)-USDC farm which pays the highest yield. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crv_UST_WORMHOLE',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crv_UST_WORMHOLE.NewPool,
    collateralAddress: addresses.V2.crv_UST_WORMHOLE.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['ust-wormhole'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://curve.fi/factory/53/deposit">
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
    </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crv_CRV_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crv_CRV_ETH.NewPool,
    collateralAddress: addresses.V2.crv_CRV_ETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['crveth'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b style="text-decoration: underline;">Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://curve.fi/crveth/deposit">
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">CRV and/or cvxCRV</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
    </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_AUR3_USDC.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_AUR3_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_AUR3_USDC.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_AUR3_USDC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0xBF06D9b11126B140788D842a6ed8dC7885C722B3/0xF40E249737c510CCE832286e54cB30E60D4e4656">
            KyberDMM
          </a>
          and add liquidity for AUR(APR22)-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_ORC_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_ORC_ETH.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_ORC_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_ORC_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM, addresses.ORC],
    rewardTokenSymbols: ['iFARM', 'ORC'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x662b67d00a13faf93254714dd601f5ed49ef2f51" style="color: #15202B;">
        ORC</a> and 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?" style="color: #15202B;">
        WETH</a> to Uniswap. By participating to this vault, farmers are also entitled to 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x662b67d00a13faf93254714dd601f5ed49ef2f51" style="color: #15202B;">
        ORC</a> and iFARM rewards that can be claimed separately.
      </div>
  `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'bal_TUSD_STABLE',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.bal_TUSD_STABLE.Underlying, 'balancerv2_matic'],
    },
    contractAddress: addresses.MATIC.V2.bal_TUSD_STABLE.NewPool,
    collateralAddress: addresses.MATIC.V2.bal_TUSD_STABLE.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.balancer.fi/#/pool/${addresses.MATIC.V2.bal_TUSD_STABLE.PoolId}">
            balancer
          </a>
          and invest <b style="text-decoration: underline;">USDT</b>, <b style="text-decoration: underline;">TUSD</b>, <b style="text-decoration: underline;">USDC</b> or <b style="text-decoration: underline;">DAI</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'bal_USDC_WETH_polygon',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.bal_USDC_WETH_polygon.Underlying, 'balancerv2_matic'],
    },
    contractAddress: addresses.MATIC.V2.bal_USDC_WETH_polygon.NewPool,
    collateralAddress: addresses.MATIC.V2.bal_USDC_WETH_polygon.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.balancer.fi/#/pool/${addresses.MATIC.V2.bal_USDC_WETH_polygon.PoolId}">
            balancer
          </a>
          and invest <b style="text-decoration: underline;">USDC</b>, <b style="text-decoration: underline;">WETH</b> polygon
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'bal_WBTC_WETH_polygon',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.bal_WBTC_WETH_polygon.Underlying, 'balancerv2_matic'],
    },
    contractAddress: addresses.MATIC.V2.bal_WBTC_WETH_polygon.NewPool,
    collateralAddress: addresses.MATIC.V2.bal_WBTC_WETH_polygon.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.balancer.fi/#/pool/${addresses.MATIC.V2.bal_WBTC_WETH_polygon.PoolId}">
            balancer
          </a>
          and invest <b style="text-decoration: underline;">WBTC</b>, <b style="text-decoration: underline;">WETH</b> polygon
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LOOKS,
      params: [addresses.V2.looks_LOOKS.RewardPool],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'looks_LOOKS',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.looks_LOOKS.NewPool,
    collateralAddress: addresses.V2.looks_LOOKS.NewVault,
    rewardAPY: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xf4d2888d29d722226fafa5d9b24f9164c092421e" style="color: #15202B;">
        LOOKS</a> to LooksRare earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" style="color: #15202B;">
        WETH</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" style="color: #15202B;">
        WETH</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xf4d2888d29d722226fafa5d9b24f9164c092421e" style="color: #15202B;">
        LOOKS</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately.
      </div>
    `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.MSTABLE,
      params: ['imUSD', 'polygon'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'mUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.mUSD.NewPool,
    collateralAddress: addresses.MATIC.V2.mUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xe840b73e5287865eec17d250bfb1536704b43b21" style="color: #15202B;">
      mUSD</a> to mStable earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xf501dd45a1198c2e1b5aef5314a68b9006d842e0" style="color: #15202B;">
      MTA</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xf501dd45a1198c2e1b5aef5314a68b9006d842e0" style="color: #15202B;">
      MTA</a> rewards are reinvested into more 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xe840b73e5287865eec17d250bfb1536704b43b21" style="color: #15202B;">
      mUSD</a> to compound your earnings. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
      </div>
  `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.quickswap_PSP_MATIC.Underlying, 'quickswap_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'quickswap_PSP_MATIC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.quickswap_PSP_MATIC.NewPool,
    collateralAddress: addresses.MATIC.V2.quickswap_PSP_MATIC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://quickswap.exchange/#/add/${addresses.MATIC.pPSP}/${addresses.MATIC.WMATIC}"
            >
              Quickswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">PSP-MATIC</b> pair by depositing <b style="text-decoration: underline;">PSP</b> and
            <b style="text-decoration: underline;">MATIC</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.uni_LOOKS_ETH.Underlying, 'uniswap_eth'],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'uni_LOOKS_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.uni_LOOKS_ETH.NewPool,
    collateralAddress: addresses.V2.uni_LOOKS_ETH.NewVault,
    rewardAPY: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://app.uniswap.org/#/add/v2/ETH/0xf4d2888d29D722226FafA5d9B24F9164c092421E"
          >
          UniswapV2
          </a>
          and provide liquidity using <b style="text-decoration: underline;">LOOKS</b> and <b style="text-decoration: underline;">ETH</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.SUSHI_GENE_ETH.Underlying, 'sushiswap_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'SUSHI_GENE_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.SUSHI_GENE_ETH.NewPool,
    collateralAddress: addresses.MATIC.V2.SUSHI_GENE_ETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.pGNOME],
    rewardTokenSymbols: ['miFARM', 'GNOME', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x3d4219987fbb25c3dcf73fbd9aa85fbe3c7411d9" style="color: #15202B;"
      >SLP(GENE-ETH)</a> to Sushiswap earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x6e8a8726639d12935b3219892155520bdc57366b" style="color: #15202B;"
      >GNOME</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x6e8a8726639d12935b3219892155520bdc57366b" style="color: #15202B;"
      >GNOME</a> rewards are reinvested into more 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x3d4219987fbb25c3dcf73fbd9aa85fbe3c7411d9" style="color: #15202B;"
      >SLP(GENE-ETH)</a> to compound your earnings. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.SUSHI_GNOME_ETH.Underlying, 'sushiswap_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'SUSHI_GNOME_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.SUSHI_GNOME_ETH.NewPool,
    collateralAddress: addresses.MATIC.V2.SUSHI_GNOME_ETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM, addresses.MATIC.pGENE],
    rewardTokenSymbols: ['miFARM', 'GENE', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xc1214b61965594b3e08ea4950747d5a077cd1886" style="color: #15202B;"
      >SLP(GNOME-ETH)</a> to Sushiswap earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x34667ed7c36cbbbf2d5d5c5c8d6eb76a094edb9f" style="color: #15202B;"
      >GENE</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x34667ed7c36cbbbf2d5d5c5c8d6eb76a094edb9f" style="color: #15202B;"
      >GENE</a> rewards are reinvested into more 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xc1214b61965594b3e08ea4950747d5a077cd1886" style="color: #15202B;"
      >SLP(GNOME-ETH)</a> to compound your earnings. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_AUR_USDC_V2.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_AUR_USDC_V2',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_AUR_USDC_V2.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_AUR_USDC_V2.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0x6Fb2415463e949aF08ce50F83E94b7e008BABf07/0xA623aacf9eB4Fc0a29515F08bdABB0d8Ce385cF7">
            KyberDMM
          </a>
          and add liquidity for AURFEB22-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_BABL_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_BABL_ETH.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_BABL_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_BABL_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM, addresses.BABL],
    rewardTokenSymbols: ['iFARM', 'BABL'],
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_DENMAY22_4EUR.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_DENMAY22_4EUR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_DENMAY22_4EUR.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_DENMAY22_4EUR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://kyberswap.com/#/add/0x51e7B5A0e8E942A62562f85D91501fbfA43121fE/0xAd326c253A84e9805559b73A08724e11E49ca651/0x6e56300267a6dd07da0908557e02756747e1c90e">
            KyberDMM
          </a>
          and add liquidity for DEN(MAY22)-4EUR
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_DEN2_4EUR.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_DEN2_4EUR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_DEN2_4EUR.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_DEN2_4EUR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://dmm.exchange/#/add/0xAd326c253A84e9805559b73A08724e11E49ca651/0xa286eeDAa5aBbAE98F65b152B5057b8bE9893fbB/0xEb6f426963140471a7c1E4337877e6dBf834d2A8">
            KyberDMM
          </a>
          and add liquidity for DEN(MAR22)-4EUR
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_DEN_4EUR.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_DEN_4EUR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_DEN_4EUR.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_DEN_4EUR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://dmm.exchange/#/add/0xAd326c253A84e9805559b73A08724e11E49ca651/0xf379CB529aE58E1A03E62d3e31565f4f7c1F2020/0x4924B6E1207EFb244433294619a5ADD08ACB3dfF">
            KyberDMM
          </a>
          and add liquidity for DEN-4EUR
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_4EUR_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_4EUR_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_4EUR_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: [
      'miFARM',
      'WMATIC',
      'fDEN_4EUR',
      'fDEN2_4EUR',
      'fDENMAY22_4EUR',
      'fDENJUL22_4EUR',
    ],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.curve.fi/factory/37/deposit">
            Curve
          </a>
          and add liquidity for 4EUR
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.quick_YEL_MATIC.Underlying, 'quickswap_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'quick_YEL_MATIC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.quick_YEL_MATIC.NewPool,
    collateralAddress: addresses.MATIC.V2.quick_YEL_MATIC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x8bab87ecf28bf45507bd745bc70532e968b5c2de" style="color: #15202B;">
        UNI-V2(YEL-MATIC)</a> to Quickswap earning 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xd3b71117e6c1558c1553305b44988cd944e97300" style="color: #15202B;">
        YEL</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xd3b71117e6c1558c1553305b44988cd944e97300" style="color: #15202B;">
        YEL</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x8bab87ecf28bf45507bd745bc70532e968b5c2de" style="color: #15202B;">
        UNI-V2(YEL-MATIC)</a> to compound your earnings. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
      </div>
    `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.popsicle_ICE_WETH.Underlying, 'sushiswap_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'popsicle_ICE_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.popsicle_ICE_WETH.NewPool,
    collateralAddress: addresses.MATIC.V2.popsicle_ICE_WETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://app.sushi.com/add/${addresses.MATIC.pWETH}/${addresses.MATIC.pICE}"
              >
                Sushiswap
              </a>
              and supply liquidity to the <b style="text-decoration: underline;">ICE-ETH</b> pair by depositing <b style="text-decoration: underline;">ICE</b> and
              <b style="text-decoration: underline;">ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
    `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'polygon_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.polygon_WETH.NewPool,
    collateralAddress: addresses.MATIC.V2.polygon_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'polygon_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.polygon_USDC.NewPool,
    collateralAddress: addresses.MATIC.V2.polygon_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'polygon_DAI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.polygon_DAI.NewPool,
    collateralAddress: addresses.MATIC.V2.polygon_DAI.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDC_ETH_4200_5500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [
        addresses.V2.UniV3_USDC_ETH_4200_5500.NewVault,
        'uniswapv3_eth',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_USDC_ETH_4200_5500.NewPool,
    collateralAddress: addresses.V2.UniV3_USDC_ETH_4200_5500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DAI_ETH_4200_5500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [
        addresses.V2.UniV3_DAI_ETH_4200_5500.NewVault,
        'uniswapv3_eth',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DAI_ETH_4200_5500.NewPool,
    collateralAddress: addresses.V2.UniV3_DAI_ETH_4200_5500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_ETH_USDT_4200_5500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [
        addresses.V2.UniV3_ETH_USDT_4200_5500.NewVault,
        'uniswapv3_eth',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_ETH_USDT_4200_5500.NewPool,
    collateralAddress: addresses.V2.UniV3_ETH_USDT_4200_5500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_CNG_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_CNG_ETH.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_CNG_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_CNG_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM, addresses.ecoCNG],
    rewardTokenSymbols: ['iFARM', 'ecoCNG'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x5c1d9aa868a30795f92fae903edc9eff269044bf" style="color: #15202B;">
        CNG</a> and 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?" style="color: #15202B;">
        WETH</a> to Uniswap. By participating to this vault, farmers are also entitled to 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x327612aca8e619fe11bfa3dcb0a0c2c8b8688244" style="color: #15202B;">
        ecoCNG</a> and iFARM rewards that can be claimed separately.
      </div>
    `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDC_ETH_3000_4500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [
        addresses.V2.UniV3_USDC_ETH_3000_4500.NewVault,
        'uniswapv3_eth',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_USDC_ETH_3000_4500.NewPool,
    collateralAddress: addresses.V2.UniV3_USDC_ETH_3000_4500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DAI_ETH_3000_4500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [
        addresses.V2.UniV3_DAI_ETH_3000_4500.NewVault,
        'uniswapv3_eth',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DAI_ETH_3000_4500.NewPool,
    collateralAddress: addresses.V2.UniV3_DAI_ETH_3000_4500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDT_ETH_3000_4500',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [
        addresses.V2.UniV3_USDT_ETH_3000_4500.NewVault,
        'uniswapv3_eth',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_USDT_ETH_3000_4500.NewPool,
    collateralAddress: addresses.V2.UniV3_USDT_ETH_3000_4500.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'convex_ibEUR',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.convex_ibEUR.NewPool,
    collateralAddress: addresses.V2.convex_ibEUR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['fixedforex:eur'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://curve.fi/factory/3/deposit">
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">EUR stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
    </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DON_WETH_full_range',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [
        addresses.V2.UniV3_DON_WETH_full_range.NewVault,
        'uniswapv3_eth',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DON_WETH_full_range.NewPool,
    collateralAddress: addresses.V2.UniV3_DON_WETH_full_range.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM, addresses.DON],
    rewardTokenSymbols: ['iFARM', 'DON'],
    vestingDescriptionOverride: {
      DON: '',
    },
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'convex_MIM',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.convex_MIM.NewPool,
    collateralAddress: addresses.V2.convex_MIM.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['mim'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/mim/deposit">
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
    </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'convex_EURT',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.convex_EURT.NewPool,
    collateralAddress: addresses.V2.convex_EURT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['eurt'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/eurt/deposit">
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">EUR stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'liquity_LQTY',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.liquity_LQTY.NewPool,
    collateralAddress: addresses.V2.liquity_LQTY.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.quickswap_ETH_USDT.Underlying, 'quickswap_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'quickswap_ETH_USDT',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.quickswap_ETH_USDT.NewPool,
    collateralAddress: addresses.MATIC.V2.quickswap_ETH_USDT.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://quickswap.exchange/#/add/${addresses.MATIC.pWETH}/${addresses.MATIC.pUSDT}">
              quickswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-USDT</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and
            <b style="text-decoration: underline;">USDT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.quickswap_IFARM_QUICK.Underlying, 'quickswap_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'quickswap_IFARM_QUICK',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.quickswap_IFARM_QUICK.NewPool,
    collateralAddress: addresses.MATIC.V2.quickswap_IFARM_QUICK.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://quickswap.exchange/#/add/${addresses.MATIC.miFARM}/${addresses.MATIC.QUICK}">
            quickswap
          </a>
          and supply liquidity to the <b style="text-decoration: underline;">IFARM-QUICK</b> pair by depositing <b style="text-decoration: underline;">IFARM</b> and
            <b style="text-decoration: underline;">QUICK</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.sushiswap_USDC_ETH.Underlying, 'sushiswap_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'sushiswap_USDC_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.sushiswap_USDC_ETH.NewPool,
    collateralAddress: addresses.MATIC.V2.sushiswap_USDC_ETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.MATIC.pUSDC}/${addresses.MATIC.pWETH}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">USDC-ETH</b> pair by depositing <b style="text-decoration: underline;">USDC</b> and
            <b style="text-decoration: underline;">ETH</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'profit-sharing-farm',
    type: POOL_TYPES.PROFIT_SHARING,
    contractAddress: addresses.pools.ProfitSharingFARMUpstream,
    autoStakePoolAddress: addresses.pools.ProfitSharingFARMAutoStake,
    collateralAddress: addresses.FARM,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: null,
    hideNativeApy: true,
    watchAsset: {
      address: addresses.FARM,
      symbol: 'FARM',
      decimals: '18',
      icon: '/icons/farm.png',
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xa0246c9032bc3a600820415ae600c6388619a14d" style="color: #15202B;">
        FARM</a> to Harvest earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xa0246c9032bc3a600820415ae600c6388619a14d" style="color: #15202B;">
        FARM</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xa0246c9032bc3a600820415ae600c6388619a14d" style="color: #15202B;">
        FARM</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xa0246c9032bc3a600820415ae600c6388619a14d" style="color: #15202B;">
        FARM</a> to compound your earnings.
      </div>
  `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-weth',
    displayName: 'FARM/ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.FARM_WETH_LP, 'uniswap_eth'],
    },
    externalPoolURL: `https://v2.info.uniswap.org/pair/${addresses.FARM_WETH_LP}`,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.pools.FARM_WETHPool,
    collateralAddress: addresses.FARM_WETH_LP,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://app.uniswap.org/#/add/v2/${addresses.FARM}/${addresses.GRAIN}" style="color: #15202B;">
        UNI-V2 LP(FARM/ETH)</a> to Uniswap. By participating to this vault, farmers are also entitled to FARM rewards that can be claimed separately.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'farm-grain',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.FARM_GRAIN_LP, 'uniswap_eth'],
    },
    externalPoolURL: `https://v2.info.uniswap.org/pair/${addresses.FARM_GRAIN_LP}`,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.pools.GRAINPool,
    collateralAddress: addresses.FARM_GRAIN_LP,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xb9fa44b0911f6d777faab2fa9d8ef103f25ddf49?a=0xe58f0d2956628921cdEd2eA6B195Fc821c3a2b16" style="color: #15202B;">
        UNI-V2 LP(FARM/GRAIN)</a> to Uniswap.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'YCRV',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.YCRV.NewPool,
    collateralAddress: addresses.V2.YCRV.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['ypool'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/iearn/deposit">
              curve.fi
            </a>
            deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'ThreePool',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.ThreePool.NewPool,
    collateralAddress: addresses.V2.ThreePool.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['3pool'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/3pool/deposit">
              curve.fi
            </a>
            deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
    zapperFiTokens: ['USDC', 'DAI', 'USDT', 'WETH'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvHBTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvHBTC.NewPool,
    collateralAddress: addresses.V2.crvHBTC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['hbtc'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/hbtc/deposit">
              curve.fi
            </a>
            deposit <b style="text-decoration: underline;">BTC assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvHUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvHUSD.NewPool,
    collateralAddress: addresses.V2.crvHUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['husd'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/husd/deposit">
              curve.fi
            </a>
            deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvCOMPOUND',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvCOMPOUND.NewPool,
    collateralAddress: addresses.V2.crvCOMPOUND.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['compound'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.curve.fi/compound/deposit"
            >
              curve.fi
            </a>
            deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvBUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvBUSD.NewPool,
    collateralAddress: addresses.V2.crvBUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['busd'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/busd/deposit">
              curve.fi
            </a>
            deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvUSDN',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvUSDN.NewPool,
    collateralAddress: addresses.V2.crvUSDN.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['usdn'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x4f3e8f405cf5afc05d68142f3783bdfe13811522" style="color: #15202B;">
        usdn3CRV</a> to Curve earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xd533a949740bb3306d119cc777fa900ba034cd52" style="color: #15202B;">
        CRV</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b" style="color: #15202B;">
        CVX</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xd533a949740bb3306d119cc777fa900ba034cd52" style="color: #15202B;">
        CRV</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b" style="color: #15202B;">
        CVX</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x4f3e8f405cf5afc05d68142f3783bdfe13811522" style="color: #15202B;">
        usdn3CRV</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.USDC.NewPool,
    collateralAddress: addresses.V2.USDC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    zapperFiTokens: ['DAI', 'USDT'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" style="color: #15202B;">
        USDC</a> to Idle earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc00e94cb662c3520282e6f5717214004a7f26888" style="color: #15202B;">
        COMP</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x875773784af8135ea0ef43b5a374aad105c5d39e" style="color: #15202B;">
        IDLE</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc00e94cb662c3520282e6f5717214004a7f26888" style="color: #15202B;">
        COMP</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x875773784af8135ea0ef43b5a374aad105c5d39e" style="color: #15202B;">
        IDLE</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" style="color: #15202B;">
        USDC</a> to compound your earnings. By participating to this vault, farmers are also entitled to FARM rewards that can be claimed separately.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'USDT',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.USDT.NewPool,
    collateralAddress: addresses.V2.USDT.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    zapperFiTokens: ['USDC', 'DAI'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7" style="color: #15202B;">
        USDT</a> to Idle earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc00e94cb662c3520282e6f5717214004a7f26888" style="color: #15202B;">
        COMP</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x875773784af8135ea0ef43b5a374aad105c5d39e" style="color: #15202B;">
        IDLE</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc00e94cb662c3520282e6f5717214004a7f26888" style="color: #15202B;">
        COMP</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x875773784af8135ea0ef43b5a374aad105c5d39e" style="color: #15202B;">
        IDLE</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7" style="color: #15202B;">
        USDT</a> to compound your earnings.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'TUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.pools.TUSDPool,
    collateralAddress: addresses.ProxiedVaultTUSD,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'DAI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.DAI.NewPool,
    collateralAddress: addresses.V2.DAI.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    zapperFiTokens: ['USDC', 'USDT'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f" style="color: #15202B;">
        DAI</a> to Idle earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc00e94cb662c3520282e6f5717214004a7f26888" style="color: #15202B;">
        COMP</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x875773784af8135ea0ef43b5a374aad105c5d39e" style="color: #15202B;">
        IDLE</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc00e94cb662c3520282e6f5717214004a7f26888" style="color: #15202B;">
        COMP</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x875773784af8135ea0ef43b5a374aad105c5d39e" style="color: #15202B;">
        IDLE</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f" style="color: #15202B;">
        DAI</a> to compound your earnings. By participating to this vault, farmers are also entitled to FARM rewards that can be claimed separately.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvOBTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvOBTC.NewPool,
    collateralAddress: addresses.V2.crvOBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['obtc'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/obtc/deposit">
              curve.fi
            </a>
            deposit <b style="text-decoration: underline;">BTC assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'TBTCMixed',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.TBTCMixed.NewPool,
    collateralAddress: addresses.V2.TBTCMixed.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['tbtc'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/tbtc/deposit">
              curve.fi
            </a>
            deposit <b style="text-decoration: underline;">BTC assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvRenWBTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvRenWBTC.NewPool,
    collateralAddress: addresses.V2.crvRenWBTC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['ren'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ren/deposit">
              curve.fi
            </a>
            deposit <b style="text-decoration: underline;">BTC assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'WBTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.WBTC.NewPool,
    collateralAddress: addresses.V2.WBTC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'renBTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.renBTC.NewPool,
    collateralAddress: addresses.V2.renBTC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    uniPool: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.UNI_LP_WETH_DPI, 'uniswap_eth'],
    },
    id: 'uni_WETH_DPI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.pools.UNI_LP_WETH_DPIPool,
    collateralAddress: addresses.VaultUNI_LP_WETH_DPI,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b/ETH"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-DPI</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and <b style="text-decoration: underline;">DPI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.WETH.NewPool,
    collateralAddress: addresses.V2.WETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?"
          style="color: #1F2937; font-weight: 700;"
        >WETH</a>
        to Idle earning 
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://etherscan.io/token/0xc00e94cb662c3520282e6f5717214004a7f26888"
          style="color: #1F2937; font-weight: 700;"
        >COMP</a>, 
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://etherscan.io/token/0x875773784af8135ea0ef43b5a374aad105c5d39e"
          style="color: #1F2937; font-weight: 700;"
        >IDLE</a>
        rewards. At every harvest, the earned 
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://etherscan.io/token/0xc00e94cb662c3520282e6f5717214004a7f26888"
          style="color: #1F2937; font-weight: 700;"
        >COMP</a>, 
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://etherscan.io/token/0x875773784af8135ea0ef43b5a374aad105c5d39e"
          style="color: #1F2937; font-weight: 700;"
        >IDLE</a>
        rewards are reinvested into more 
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?"
          style="color: #1F2937; font-weight: 700;"
        >WETH</a>
        &nbsp;to compound your earnings.
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.UNI_BAC_DAI.Underlying, 'uniswap_eth'],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UNI_BAC_DAI',
    isDegen: true,
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.UNI_BAC_DAI.NewPool,
    collateralAddress: addresses.V2.UNI_BAC_DAI.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.BAC}/${addresses.DAI}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.BAC}/${addresses.DAI}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">BAC-DAI</b> pair by depositing <b style="text-decoration: underline;">BAC</b> and <b style="text-decoration: underline;">DAI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.UNI_DAI_BAS.Underlying, 'uniswap_eth'],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UNI_DAI_BAS',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.UNI_DAI_BAS.NewPool,
    collateralAddress: addresses.V2.UNI_DAI_BAS.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BAS}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BASV2}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">DAI-BASv2</b> pair by depositing <b style="text-decoration: underline;">DAI</b> and{' '}
            <b style="text-decoration: underline;">BASv2</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'lfBTC_LIFT',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.lfBTC_LIFT.NewPool,
    collateralAddress: addresses.V2.lfBTC_LIFT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.sushi.com/add/${addresses.lfBTC}/{addresses.LIFT}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.lfBTC}/${addresses.LIFT}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">LFBTC-LIFT</b> pair by depositing <b style="text-decoration: underline;">lfBTC</b> and{' '}
            <b style="text-decoration: underline;">LIFT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'wBTC_lfBTC',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.wBTC_lfBTC.NewPool,
    collateralAddress: addresses.V2.wBTC_lfBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.sushi.com/add/${addresses.lfBTC}/${addresses.WBTC}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.lfBTC}/${addresses.WBTC}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">WBTC-LFBTC</b> pair by depositing <b style="text-decoration: underline;">WBTC</b> and{' '}
            <b style="text-decoration: underline;">lfBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UNI_MIC_USDT',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.UNI_MIC_USDT.NewPool,
    collateralAddress: addresses.V2.UNI_MIC_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://sushiswap.fi/pair/${addresses.V2.UNI_MIC_USDT.Underlying}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://sushiswap.fi/pair/${addresses.V2.UNI_MIC_USDT.Underlying}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">MIC-USDT</b> pair by depositing <b style="text-decoration: underline;">MIC</b> and{' '}
            <b style="text-decoration: underline;">USDT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UNI_MIS_USDT',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.UNI_MIS_USDT.NewPool,
    collateralAddress: addresses.V2.UNI_MIS_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://sushiswap.fi/pair/${addresses.V2.UNI_MIS_USDT.Underlying}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://sushiswap.fi/pair/${addresses.V2.UNI_MIS_USDT.Underlying}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">MIS-USDT</b> pair by depositing <b style="text-decoration: underline;">MIS</b> and{' '}
            <b style="text-decoration: underline;">USDT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    id: 'sushi_PERP_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.sushi_PERP_ETH.Underlying, 'sushiswap_eth'],
    },
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.sushi_PERP_ETH.NewPool,
    collateralAddress: addresses.V2.sushi_PERP_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/${addresses.PERP}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/${addresses.PERP}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">PERP-ETH</b> pair by depositing <b style="text-decoration: underline;">PERP</b> and{' '}
            <b style="text-decoration: underline;">ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_SUSHI_WETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.sushi_SUSHI_WETH.Underlying, 'sushiswap_eth'],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_SUSHI_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_SUSHI_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-SUSHI</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and{' '}
            <b style="text-decoration: underline;">SUSHI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_DAI_WETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_DAI_WETH, 'sushiswap_eth'],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_DAI_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_DAI_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0x6B175474E89094C44Da98b954EedeAC495271d0F`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0x6B175474E89094C44Da98b954EedeAC495271d0F"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-DAI</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and <b style="text-decoration: underline;">DAI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_USDC_WETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_USDC_WETH, 'sushiswap_eth'],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_USDC_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_USDC_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-USDC</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and{' '}
            <b style="text-decoration: underline;">USDC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_USDT_WETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_USDT_WETH, 'sushiswap_eth'],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_USDT_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_USDT_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0xdAC17F958D2ee523a2206206994597C13D831ec7`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0xdAC17F958D2ee523a2206206994597C13D831ec7"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-USDT</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and{' '}
            <b style="text-decoration: underline;">USDT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_WBTC_WETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_WBTC_WETH, 'sushiswap_eth'],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_WBTC_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_WBTC_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-WBTC</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and{' '}
            <b style="text-decoration: underline;">WBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_UST_WETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_UST_WETH, 'sushiswap_eth'],
    },
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_UST_WETH.NewPool,
    collateralAddress: addresses.V2.sushi_UST_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">UST-ETH</b> pair by depositing <b style="text-decoration: underline;">UST</b> and <b style="text-decoration: underline;">ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_ETH_DAI.Underlying],
    },
    id: 'oneInch_ETH_DAI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_ETH_DAI.NewPool,
    collateralAddress: addresses.V2.oneInch_ETH_DAI.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        These vaults are migrated from <b style="text-decoration: underline;">1INCH</b> to <b style="text-decoration: underline;">Sushiswap</b> and now earning the same{' '}
        <b style="text-decoration: underline;">iFARM</b> and <b style="text-decoration: underline;">fSUSHI</b> yields as <b style="text-decoration: underline;">SUSHI HODL</b> vaults.
        <br />
        <br /> When you withdraw, you receive <b style="text-decoration: underline;">Sushiswap LP tokens</b> as well as proportional{' '}
        <b style="text-decoration: underline;">iFARM</b> and <b style="text-decoration: underline;">fSUSHI</b> accumulated in the <b style="text-decoration: underline;">HODL</b> vaults.
        <br />
        <br /> To deposit more assets, use the vaults in the <b style="text-decoration: underline;">SUSHI HODL</b> section directly.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_ETH_USDC.Underlying],
    },
    id: 'oneInch_ETH_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_ETH_USDC.NewPool,
    collateralAddress: addresses.V2.oneInch_ETH_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        These vaults are migrated from <b style="text-decoration: underline;">1INCH</b> to <b style="text-decoration: underline;">Sushiswap</b> and now earning the same{' '}
        <b style="text-decoration: underline;">iFARM</b> and <b style="text-decoration: underline;">fSUSHI</b> yields as <b style="text-decoration: underline;">SUSHI HODL</b> vaults.
        <br />
        <br /> When you withdraw, you receive <b style="text-decoration: underline;">Sushiswap LP tokens</b> as well as proportional{' '}
        <b style="text-decoration: underline;">iFARM</b> and <b style="text-decoration: underline;">fSUSHI</b> accumulated in the <b style="text-decoration: underline;">HODL</b> vaults.
        <br />
        <br /> To deposit more assets, use the vaults in the <b style="text-decoration: underline;">SUSHI HODL</b> section directly.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_ETH_USDT.Underlying],
    },
    id: 'oneInch_ETH_USDT',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_ETH_USDT.NewPool,
    collateralAddress: addresses.V2.oneInch_ETH_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        These vaults are migrated from <b style="text-decoration: underline;">1INCH</b> to <b style="text-decoration: underline;">Sushiswap</b> and now earning the same{' '}
        <b style="text-decoration: underline;">iFARM</b> and <b style="text-decoration: underline;">fSUSHI</b> yields as <b style="text-decoration: underline;">SUSHI HODL</b> vaults.
        <br />
        <br /> When you withdraw, you receive <b style="text-decoration: underline;">Sushiswap LP tokens</b> as well as proportional{' '}
        <b style="text-decoration: underline;">iFARM</b> and <b style="text-decoration: underline;">fSUSHI</b> accumulated in the <b style="text-decoration: underline;">HODL</b> vaults.
        <br />
        <br /> To deposit more assets, use the vaults in the <b style="text-decoration: underline;">SUSHI HODL</b> section directly.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_ETH_WBTC.Underlying],
    },
    id: 'oneInch_ETH_WBTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_ETH_WBTC.NewPool,
    collateralAddress: addresses.V2.oneInch_ETH_WBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        These vaults are migrated from <b style="text-decoration: underline;">1INCH</b> to <b style="text-decoration: underline;">Sushiswap</b> and now earning the same{' '}
        <b style="text-decoration: underline;">iFARM</b> and <b style="text-decoration: underline;">fSUSHI</b> yields as <b style="text-decoration: underline;">SUSHI HODL</b> vaults.
        <br />
        <br /> When you withdraw, you receive <b style="text-decoration: underline;">Sushiswap LP tokens</b> as well as proportional{' '}
        <b style="text-decoration: underline;">iFARM</b> and <b style="text-decoration: underline;">fSUSHI</b> accumulated in the <b style="text-decoration: underline;">HODL</b> vaults.
        <br />
        <br /> To deposit more assets, use the vaults in the <b style="text-decoration: underline;">SUSHI HODL</b> section directly.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_ETH_1INCH.Underlying],
    },
    id: 'oneInch_ETH_1INCH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_ETH_1INCH.NewPool,
    collateralAddress: addresses.V2.oneInch_ETH_1INCH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://1inch.exchange/#/dao/pools?token0=0x0000000000000000000000000000000000000000&token1=${addresses['1INCH']}"
            >
              1Inch
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">1INCH-ETH</b> pair by depositing <b style="text-decoration: underline;">1INCH</b> and{' '}
            <b style="text-decoration: underline;">ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_1INCH_USDC.Underlying],
    },
    id: 'oneInch_1INCH_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_1INCH_USDC.NewPool,
    collateralAddress: addresses.V2.oneInch_1INCH_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://1inch.exchange/#/dao/pools?token0=${addresses.USDC}&token1=${addresses['1INCH']}"
            >
              1Inch
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">USDC-1INCH</b> pair by depositing <b style="text-decoration: underline;">1INCH</b> and{' '}
            <b style="text-decoration: underline;">USDC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.oneInch_1INCH_WBTC.NewVault],
    },
    id: 'oneInch_1INCH_WBTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.oneInch_1INCH_WBTC.NewPool,
    collateralAddress: addresses.V2.oneInch_1INCH_WBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: 'https://1inch.exchange/#/dao/pools',
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://1inch.exchange/#/dao/pools?token0=${addresses.WBTC}&token1=${addresses['1INCH']}"
            >
              1Inch
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">1INCH-WBTC</b> pair by depositing <b style="text-decoration: underline;">1INCH</b> and{' '}
            <b style="text-decoration: underline;">WBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.basisGold_DAI_BSG.Underlying],
    },
    id: 'basisGold_DAI_BSG',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.basisGold_DAI_BSG.NewPool,
    collateralAddress: addresses.V2.basisGold_DAI_BSG.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BSG}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BSG}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">DAI-BSG</b> pair by depositing <b style="text-decoration: underline;">DAI</b> and <b style="text-decoration: underline;">BSG</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
    hideNativeApy: true,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'basisGold_DAI_BSGS',
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.basisGold_DAI_BSGS.Underlying],
    },
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.basisGold_DAI_BSGS.NewPool,
    collateralAddress: addresses.V2.basisGold_DAI_BSGS.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BSGS}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.DAI}/${addresses.BSGS}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">DAI-BSGS</b> pair by depositing <b style="text-decoration: underline;">DAI</b> and{' '}
            <b style="text-decoration: underline;">BSGS</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
    hideNativeApy: true,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'basisGold_BAC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.basisGold_BAC.NewPool,
    collateralAddress: addresses.V2.basisGold_BAC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'basisGold_ESD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.basisGold_ESD.NewPool,
    collateralAddress: addresses.V2.basisGold_ESD.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'basisGold_DSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.basisGold_DSD.NewPool,
    collateralAddress: addresses.V2.basisGold_DSD.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvEURS',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvEURS.NewPool,
    collateralAddress: addresses.V2.crvEURS.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['eurs'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/eurs/deposit">
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">EUR stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvGUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvGUSD.NewPool,
    collateralAddress: addresses.V2.crvGUSD.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['gusd'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/gusd/deposit">
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvUST',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvUST.NewPool,
    collateralAddress: addresses.V2.crvUST.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['ust'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust/deposit">
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorAAPL.Underlying],
    },
    id: 'mirrorAAPL',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorAAPL.NewPool,
    collateralAddress: addresses.V2.mirrorAAPL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mAAPL}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b style="text-decoration: underline;">UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mAAPL}"
            >
              buy mAAPL
            </a>
            with some <b style="text-decoration: underline;">UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mAAPL}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">MIRROR-AAPL</b> pair by depositing <b style="text-decoration: underline;">mAAPL</b> and{' '}
            <b style="text-decoration: underline;">UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorAMZN.Underlying],
    },
    id: 'mirrorAMZN',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorAMZN.NewPool,
    collateralAddress: addresses.V2.mirrorAMZN.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mAMZN}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b style="text-decoration: underline;">UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mAMZN}"
            >
              buy mAMZN
            </a>
            with some <b style="text-decoration: underline;">UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mAMZN}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">MIRROR-AMZN</b> pair by depositing <b style="text-decoration: underline;">mAMZN</b> and{' '}
            <b style="text-decoration: underline;">UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorGOOG.Underlying],
    },
    id: 'mirrorGOOG',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorGOOG.NewPool,
    collateralAddress: addresses.V2.mirrorGOOG.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mGOOGL}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b style="text-decoration: underline;">UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mGOOGL}"
            >
              buy mGOOGL
            </a>
            with some <b style="text-decoration: underline;">UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mGOOGL}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">MIRROR-GOOG</b> pair by depositing <b style="text-decoration: underline;">mGOOGL</b> and{' '}
            <b style="text-decoration: underline;">UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorTSLA.Underlying],
    },
    id: 'mirrorTSLA',
    isDegen: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorTSLA.NewPool,
    collateralAddress: addresses.V2.mirrorTSLA.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mTSLA}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b style="text-decoration: underline;">UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mTSLA}"
            >
              buy mTSLA
            </a>
            with some <b style="text-decoration: underline;">UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mTSLA}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">MIRROR-TSLA</b> pair by depositing <b style="text-decoration: underline;">mTSLA</b> and{' '}
            <b style="text-decoration: underline;">UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorNFLX.Underlying],
    },
    id: 'mirrorNFLX',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorNFLX.NewPool,
    collateralAddress: addresses.V2.mirrorNFLX.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mNFLX}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b style="text-decoration: underline;">UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mNFLX}"
            >
              buy mNFLX
            </a>
            with some <b style="text-decoration: underline;">UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mNFLX}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">MIRROR-NFLX</b> pair by depositing <b style="text-decoration: underline;">mNFLX</b> and{' '}
            <b style="text-decoration: underline;">UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    fullBuyback: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.mirrorTWTR.Underlying],
    },
    id: 'mirrorTWTR',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.mirrorTWTR.NewPool,
    collateralAddress: addresses.V2.mirrorTWTR.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.mTWTR}/${addresses.UST}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Got to
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/ust">
              curve.fi
            </a>
            and buy <b style="text-decoration: underline;">UST</b> using stablecoins and{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/swap?inputCurrency=${addresses.UST}&outputCurrency=${addresses.mTWTR}"
            >
              buy mTWTR
            </a>
            with some <b style="text-decoration: underline;">UST</b>. Visit{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.mTWTR}/${addresses.UST}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">MIRROR-TWTR</b> pair by depositing <b style="text-decoration: underline;">mTWTR</b> and{' '}
            <b style="text-decoration: underline;">UST</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvSTETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvSTETH.NewPool,
    collateralAddress: addresses.V2.crvSTETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['steth'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x06325440d014e39736583c165c2963ba99faf14e" style="color: #15202B;">
        steCRV</a> to Curve earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xd533a949740bb3306d119cc777fa900ba034cd52" style="color: #15202B;">
        CRV</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b" style="color: #15202B;">
        CVX</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x5a98fcbea516cf06857215779fd812ca3bef1b32" style="color: #15202B;">
        LDO</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xd533a949740bb3306d119cc777fa900ba034cd52" style="color: #15202B;">
        CRV</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b" style="color: #15202B;">
        CVX</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x5a98fcbea516cf06857215779fd812ca3bef1b32" style="color: #15202B;">
        LDO</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x06325440d014e39736583c165c2963ba99faf14e" style="color: #15202B;">
        steCRV</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately.  
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvAAVE',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvAAVE.NewPool,
    collateralAddress: addresses.V2.crvAAVE.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.FARM],
    rewardTokenSymbols: ['FARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/aave/deposit">
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.klondike_WBTC_KBTC.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'klondike_WBTC_KBTC',
    isDegen: true,
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.klondike_WBTC_KBTC.NewPool,
    collateralAddress: addresses.V2.klondike_WBTC_KBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.KBTC}/${addresses.WBTC}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.KBTC}/${addresses.WBTC}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">WBTC-KBTC</b> pair by depositing <b style="text-decoration: underline;">KBTC</b> and{' '}
            <b style="text-decoration: underline;">WBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.klondike_WBTC_KLON.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'klondike_WBTC_KLON',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.klondike_WBTC_KLON.NewPool,
    collateralAddress: addresses.V2.klondike_WBTC_KLON.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.KLON}/${addresses.WBTC}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.KLONX}/${addresses.WBTC}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">WBTC-KLONX</b> pair by depositing <b style="text-decoration: underline;">KLONX</b> and{' '}
            <b style="text-decoration: underline;">WBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvLink',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.crvLink.NewPool,
    collateralAddress: addresses.V2.crvLink.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['link'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/link/deposit">
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">LINK assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'SUSHI',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.SUSHI.NewPool,
    collateralAddress: addresses.V2.SUSHI.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://exchange.sushi.com/">
              Sushiswap
            </a>
            and convert assets to <b style="text-decoration: underline;">SUSHI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_DAI_WETH, 'sushiswap_eth'],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_DAI_WETH_HODL',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.sushi_DAI_WETH_HODL.NewPool,
    collateralAddress: addresses.V2.sushi_DAI_WETH_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM', 'fSUSHI'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0x6B175474E89094C44Da98b954EedeAC495271d0F`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0x6B175474E89094C44Da98b954EedeAC495271d0F"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-DAI</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and <b style="text-decoration: underline;">DAI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_USDC_WETH, 'sushiswap_eth'],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_USDC_WETH_HODL',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.sushi_USDC_WETH_HODL.NewPool,
    collateralAddress: addresses.V2.sushi_USDC_WETH_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM', 'fSUSHI'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-USDC</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and{' '}
            <b style="text-decoration: underline;">USDC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_USDT_WETH, 'sushiswap_eth'],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_USDT_WETH_HODL',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.sushi_USDT_WETH_HODL.NewPool,
    collateralAddress: addresses.V2.sushi_USDT_WETH_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM', 'fSUSHI'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0xdAC17F958D2ee523a2206206994597C13D831ec7`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0xdAC17F958D2ee523a2206206994597C13D831ec7"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-USDT</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and{' '}
            <b style="text-decoration: underline;">USDT</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.sushi_WBTC_WETH, 'sushiswap_eth'],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_WBTC_WETH_HODL',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.sushi_WBTC_WETH_HODL.NewPool,
    collateralAddress: addresses.V2.sushi_WBTC_WETH_HODL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM', 'fSUSHI'],
    externalPoolURL: `https://exchange.sushiswapclassic.org/#/add/ETH/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.sushiswapclassic.org/#/add/ETH/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-WBTC</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and{' '}
            <b style="text-decoration: underline;">WBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvUSDP',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.crvUSDP.NewPool,
    collateralAddress: addresses.V2.crvUSDP.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['usdp'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://www.curve.fi/usdp/deposit">
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Muse.Underlying, 'uniswap_eth'],
    },
    id: 'nft20_Muse',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Muse.NewPool,
    collateralAddress: addresses.V2.nft20_Muse.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x20d2c17d1928ef4290bf17f922a10eaa2770bf43" style="color: #15202B;">
        UNI-V2 LP(MUSE ETH)</a> to Uniswap earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xb6ca7399b4f9ca56fc27cbff44f4d2e4eef1fc81" style="color: #15202B;">
        MUSE</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xb6ca7399b4f9ca56fc27cbff44f4d2e4eef1fc81" style="color: #15202B;">
        MUSE</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x20d2c17d1928ef4290bf17f922a10eaa2770bf43" style="color: #15202B;">
        UNI-V2 LP(MUSE ETH)</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately.  
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Dudes.Underlying, 'uniswap_eth'],
    },
    id: 'nft20_Dudes',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Dudes.NewPool,
    collateralAddress: addresses.V2.nft20_Dudes.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.NUDES20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">DUDES20-ETH</b> pair by depositing <b style="text-decoration: underline;">DUDES20</b> and{' '}
            <b style="text-decoration: underline;">ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Mask.Underlying, 'uniswap_eth'],
    },
    id: 'nft20_Mask',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Mask.NewPool,
    collateralAddress: addresses.V2.nft20_Mask.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.MASK20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">MASK20-ETH</b> pair by depositing <b style="text-decoration: underline;">MASK20</b> and{' '}
            <b style="text-decoration: underline;">ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Rope.Underlying, 'uniswap_eth'],
    },
    id: 'nft20_Rope',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Rope.NewPool,
    collateralAddress: addresses.V2.nft20_Rope.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.ROPE20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ROPE20-ETH</b> pair by depositing <b style="text-decoration: underline;">ROPE20</b> and{' '}
            <b style="text-decoration: underline;">ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Mooncat.Underlying, 'uniswap_eth'],
    },
    id: 'nft20_Mooncat',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Mooncat.NewPool,
    collateralAddress: addresses.V2.nft20_Mooncat.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.MCAT20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">MCAT20-ETH</b> pair by depositing <b style="text-decoration: underline;">MCAT20</b> and{' '}
            <b style="text-decoration: underline;">ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venus_XVS',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.venus_XVS.NewPool,
    collateralAddress: addresses.BSC.V2.venus_XVS.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vXVS'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venus_DAI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.venus_DAI.NewPool,
    collateralAddress: addresses.BSC.V2.venus_DAI.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vDAI'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venus_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.venus_USDC.NewPool,
    collateralAddress: addresses.BSC.V2.venus_USDC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vUSDC'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venus_USDT',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.venus_USDT.NewPool,
    collateralAddress: addresses.BSC.V2.venus_USDT.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vUSDT'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venus_BUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.venus_BUSD.NewPool,
    collateralAddress: addresses.BSC.V2.venus_BUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vBUSD'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venus_VAI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.venus_VAI.NewPool,
    collateralAddress: addresses.BSC.V2.venus_VAI.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venus_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.venus_ETH.NewPool,
    collateralAddress: addresses.BSC.V2.venus_ETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vETH'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venus_BETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.venus_BETH.NewPool,
    collateralAddress: addresses.BSC.V2.venus_BETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vBETH'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venus_BTCB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.venus_BTCB.NewPool,
    collateralAddress: addresses.BSC.V2.venus_BTCB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vBTC'],
    },
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'venus_WBNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.venus_WBNB.NewPool,
    collateralAddress: addresses.BSC.V2.venus_WBNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.VENUS,
      params: ['vBNB'],
    },
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.V2.pancake_BUSD_BNB.Underlying, 'pancakeswap_bsc'],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancake_BUSD_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.pancake_BUSD_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.pancake_BUSD_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.bUSD}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">BUSD-BNB</b> pair by depositing <b style="text-decoration: underline;">BUSD</b> and{' '}
            <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancake_CAKE',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.pancake_CAKE.NewPool,
    collateralAddress: addresses.BSC.V2.pancake_CAKE.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/"
            >
              PancakeSwap
            </a>
            and convert assets to <b style="text-decoration: underline;">CAKE</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.V2.pancake_CAKE_BNB.Underlying, 'pancakeswap_bsc'],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancake_CAKE_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.pancake_CAKE_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.pancake_CAKE_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.CAKE}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">CAKE-BNB</b> pair by depositing <b style="text-decoration: underline;">CAKE</b> and{' '}
            <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.V2.pancake_ETH_BNB.Underlying, 'pancakeswap_bsc'],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancake_ETH_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.pancake_ETH_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.pancake_ETH_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.bETH}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-BNB</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.V2.pancake_USDT_BNB.Underlying, 'pancakeswap_bsc'],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancake_USDT_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.pancake_USDT_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.pancake_USDT_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.bUSDT}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">USDT-BNB</b> pair by depositing <b style="text-decoration: underline;">USDT</b> and{' '}
            <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.V2.pancake_XVS_BNB.Underlying, 'pancakeswap_bsc'],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'pancake_XVS_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.pancake_XVS_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.pancake_XVS_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.XVS}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">XVS-BNB</b> pair by depositing <b style="text-decoration: underline;">XVS</b> and <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'goose_EGG_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.goose_EGG_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.goose_EGG_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.goosedefi.com/#/add/${addresses.BSC.EGG}/${addresses.BSC.wBNB}"
            >
              Goose
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">EGG-BNB</b> pair by depositing <b style="text-decoration: underline;">EGG</b> and <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'goose_EGG_BUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.goose_EGG_BUSD.NewPool,
    collateralAddress: addresses.BSC.V2.goose_EGG_BUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.goosedefi.com/#/add/${addresses.BSC.EGG}/${addresses.BSC.bUSD}"
            >
              Goose
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">EGG-BUSD</b> pair by depositing <b style="text-decoration: underline;">EGG</b> and{' '}
            <b style="text-decoration: underline;">BUSD</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'goose_EGG',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.goose_EGG.NewPool,
    collateralAddress: addresses.BSC.V2.goose_EGG.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://exchange.goosedefi.com/">
              Goose
            </a>
            and convert assets to <b style="text-decoration: underline;">EGG</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'bdo_BDO_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.bdo_BDO_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.bdo_BDO_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://v1exchange.pancakeswap.finance/#/add/${addresses.BSC.BDO}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">BDO-BNB</b> pair by depositing <b style="text-decoration: underline;">BDO</b> and <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'bdo_BDO_BUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.bdo_BDO_BUSD.NewPool,
    collateralAddress: addresses.BSC.V2.bdo_BDO_BUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://v1exchange.pancakeswap.finance/#/add/${addresses.BSC.BDO}/${addresses.BSC.bUSD}"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">BDO-BUSD</b> pair by depositing <b style="text-decoration: underline;">BDO</b> and{' '}
            <b style="text-decoration: underline;">BUSD</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'bdo_SBDO_BUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.bdo_SBDO_BUSD.NewPool,
    collateralAddress: addresses.BSC.V2.bdo_SBDO_BUSD.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://v1exchange.pancakeswap.finance/#/add/${addresses.BSC.sBDO}/${addresses.BSC.bUSD}"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">SBDO-BUSD</b> pair by depositing <b style="text-decoration: underline;">SBDO</b> and{' '}
            <b style="text-decoration: underline;">BUSD</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'oneInch_1INCH_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.oneInch_1INCH_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.oneInch_1INCH_BNB.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://1inch.exchange/#/dao/pools?network=56&token0=${addresses.BSC.b1INCH}&token1=0x0000000000000000000000000000000000000000"
            >
              1INCH
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">1INCH-BNB</b> pair by depositing <b style="text-decoration: underline;">1INCH</b> and{' '}
            <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'oneInch_1INCH_renBTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.oneInch_1INCH_renBTC.NewPool,
    collateralAddress: addresses.BSC.V2.oneInch_1INCH_renBTC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://1inch.exchange/#/dao/pools?network=56&token0=${addresses.BSC.b1INCH}&token1=${addresses.BSC.bRENBTC}"
            >
              1INCH
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">1INCH-RENBTC</b> pair by depositing <b style="text-decoration: underline;">1INCH</b> and{' '}
            <b style="text-decoration: underline;">RENBTC</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Meme.Underlying, 'uniswap_eth'],
    },
    id: 'nft20_Meme',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Meme.NewPool,
    collateralAddress: addresses.V2.nft20_Meme.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.MEME20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">MEME20-ETH</b> pair by depositing <b style="text-decoration: underline;">MEME20</b> and{' '}
            <b style="text-decoration: underline;">ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    isDegen: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.nft20_Gpunks.Underlying, 'uniswap_eth'],
    },
    id: 'nft20_Gpunks',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.nft20_Gpunks.NewPool,
    collateralAddress: addresses.V2.nft20_Gpunks.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.GPUNKS20}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">GPUNKS20-ETH</b> pair by depositing <b style="text-decoration: underline;">GPUNKS20</b> and{' '}
            <b style="text-decoration: underline;">ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    uniPool: true,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.uni_ETH_MVI.Underlying, 'uniswap_eth'],
    },
    id: 'uni_ETH_MVI',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.uni_ETH_MVI.NewPool,
    collateralAddress: addresses.V2.uni_ETH_MVI.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.MVI}/ETH"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ETH-MVI</b> pair by depositing <b style="text-decoration: underline;">ETH</b> and <b style="text-decoration: underline;">MVI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.klondike_KXUSD_DAI.Underlying],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'klondike_KXUSD_DAI',
    fullBuyback: true,
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.klondike_KXUSD_DAI.NewPool,
    collateralAddress: addresses.V2.klondike_KXUSD_DAI.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    externalPoolURL: `https://app.uniswap.org/#/add/v2/${addresses.KXUSD}/${addresses.DAI}`,
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/${addresses.KXUSD}/${addresses.DAI}"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">KXUSD-DAI</b> pair by depositing <b style="text-decoration: underline;">KXUSD</b> and{' '}
            <b style="text-decoration: underline;">DAI</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'ellipsis_3pool',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.ellipsis_3pool.NewPool,
    collateralAddress: addresses.BSC.V2.ellipsis_3pool.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://ellipsis.finance/3pool/deposit"
            >
              ellipsis
            </a>
            and deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.V2.ellipsis_EPS_BNB.Underlying, 'pancakeswap_bsc'],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'ellipsis_EPS_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.ellipsis_EPS_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.ellipsis_EPS_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://pancake.ellipsis.finance/#/add/${addresses.BSC.EPS}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">EPS-BNB</b> pair by depositing <b style="text-decoration: underline;">EPS</b> and <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'swirl_SWIRL_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.swirl_SWIRL_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.swirl_SWIRL_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://v1exchange.pancakeswap.finance/#/add/${addresses.BSC.SWIRL}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">SWIRL-BNB</b> pair by depositing <b style="text-decoration: underline;">SWIRL</b> and{' '}
            <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.V2.space_SPACE_BNB.Underlying, 'pancakeswap_bsc'],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'space_SPACE_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.space_SPACE_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.space_SPACE_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://pancake.ellipsis.finance/#/add/${addresses.BSC.SPACE}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">SPACE-BNB</b> pair by depositing <b style="text-decoration: underline;">SPACE</b> and{' '}
            <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.V2.space_SPACE_BUSD.Underlying, 'pancakeswap_bsc'],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'space_SPACE_BUSD',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.space_SPACE_BUSD.NewPool,
    collateralAddress: addresses.BSC.V2.space_SPACE_BUSD.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://pancake.ellipsis.finance/#/add/${addresses.BSC.SPACE}/${addresses.BSC.bUSD}"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">SPACE-BUSD</b> pair by depositing <b style="text-decoration: underline;">SPACE</b> and{' '}
            <b style="text-decoration: underline;">BUSD</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.V2.belt_BELT_BNB.Underlying, 'pancakeswap_bsc'],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'belt_BELT_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.belt_BELT_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.belt_BELT_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/#/add/${addresses.BSC.BELT}/BNB"
            >
              PancakeSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">BELT-BNB</b> pair by depositing <b style="text-decoration: underline;">BELT</b> and{' '}
            <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'belt_Venus',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.belt_Venus.NewPool,
    collateralAddress: addresses.BSC.V2.belt_Venus.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://beta.belt.fi/">
              belt
            </a>
            , scroll down to the <b style="text-decoration: underline;">Belt LP Staking</b> section and deposit <b style="text-decoration: underline;">USD stablecoins</b>{' '}
            into the <b style="text-decoration: underline;">venus</b> pool
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'belt_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.belt_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.belt_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BELT,
      params: [addresses.BSC.V2.belt_BNB.PoolId],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://beta.belt.fi/">
              belt
            </a>
            , scroll down to the <b style="text-decoration: underline;">Belt Vaults</b> section and deposit <b style="text-decoration: underline;">BNB</b> into the{' '}
            <b style="text-decoration: underline;">BNB</b> vault
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'belt_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.belt_ETH.NewPool,
    collateralAddress: addresses.BSC.V2.belt_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BELT,
      params: [addresses.BSC.V2.belt_ETH.PoolId],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://beta.belt.fi/">
              belt
            </a>
            , scroll down to the <b style="text-decoration: underline;">Belt Vaults</b> section and deposit <b style="text-decoration: underline;">ETH</b> into the{' '}
            <b style="text-decoration: underline;">ETH</b> vault
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'belt_BTCB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.belt_BTCB.NewPool,
    collateralAddress: addresses.BSC.V2.belt_BTCB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BELT,
      params: [addresses.BSC.V2.belt_BTCB.PoolId],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a target="_blank" rel="noopener noreferrer" href="https://beta.belt.fi/">
              belt
            </a>
            , scroll down to the <b style="text-decoration: underline;">Belt Vaults</b> section and deposit <b style="text-decoration: underline;">BTCB</b> into the{' '}
            <b style="text-decoration: underline;">BTCB</b> vault
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.BSC.V2.popsicle_ICE_BNB.Underlying, 'pancakeswap_bsc'],
    },
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'popsicle_ICE_BNB',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.popsicle_ICE_BNB.NewPool,
    collateralAddress: addresses.BSC.V2.popsicle_ICE_BNB.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.BSC.ICE}/ETH"
            >
              SushiSwap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">ICE-BNB</b> pair by depositing <b style="text-decoration: underline;">ICE</b> and <b style="text-decoration: underline;">BNB</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'popsicle_ICE',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.popsicle_ICE.NewPool,
    collateralAddress: addresses.BSC.V2.popsicle_ICE.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://exchange.pancakeswap.finance/"
            >
              PancakeSwap
            </a>
            and convert assets to <b style="text-decoration: underline;">ICE</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'ellipsis_FUSDT',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.ellipsis_FUSDT.NewPool,
    collateralAddress: addresses.BSC.V2.ellipsis_FUSDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM],
    rewardTokenSymbols: ['bFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://ellipsis.finance/fusdt/deposit"
            >
              ellipsis
            </a>
            and deposit <b style="text-decoration: underline;">USD stablecoins</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.BSC_MAINNET,
    id: 'ellipsis_BTC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.BSC.V2.ellipsis_BTC.NewPool,
    collateralAddress: addresses.BSC.V2.ellipsis_BTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.BSC.bFARM, addresses.BSC.ampliFARM],
    rewardTokenSymbols: ['bFARM', 'ampliFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://ellipsis.finance/ren/deposit"
            >
              ellipsis
            </a>
            and deposit <b style="text-decoration: underline;">BTC assets</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'complifi_COMPFI_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.complifi_COMPFI_WETH.NewPool,
    collateralAddress: addresses.V2.complifi_COMPFI_WETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.uniswap.org/#/add/v2/v2/${addresses.COMFI}/eth"
            >
              Uniswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">COMFI-ETH</b> pair by depositing <b style="text-decoration: underline;">COMFI</b> and{' '}
            <b style="text-decoration: underline;">ETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_ZUSD_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.UniV3_ZUSD_ETH.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_ZUSD_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_ZUSD_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_zUSD_USDC_full_range',
    tradingApyFunction: {
      type: 'UNIV3_V2',
      params: [addresses.V2.UniV3_zUSD_USDC_full_range.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_zUSD_USDC_full_range.NewPool,
    collateralAddress: addresses.V2.UniV3_zUSD_USDC_full_range.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_ETH_sETH2',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_ETH_sETH2.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_ETH_sETH2.NewPool,
    collateralAddress: addresses.V2.UniV3_ETH_sETH2.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xFe2e637202056d30016725477c5da089Ab0A043A" style="color: #15202B;">
        sETH2</a> and 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?" style="color: #15202B;">
        WETH</a> to Uniswap earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x20bc832ca081b91433ff6c17f85701b6e92486c5" style="color: #15202B;">
        rETH2</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x48c3399719b582dd63eb5aadf12a40b4c3f52fa2" style="color: #15202B;">
        SWISE</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x20bc832ca081b91433ff6c17f85701b6e92486c5" style="color: #15202B;">
        rETH2</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x48c3399719b582dd63eb5aadf12a40b4c3f52fa2" style="color: #15202B;">
        SWISE</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xFe2e637202056d30016725477c5da089Ab0A043A" style="color: #15202B;">
        sETH2</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately. This vault is active when 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?" style="color: #15202B;">
        WETH</a> value is within 1.006 - 1.0121 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xFe2e637202056d30016725477c5da089Ab0A043A" style="color: #15202B;">
        sETH2</a>.
      </div>
    `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDC_ETH',
    type: POOL_TYPES.UNIV3,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_USDC_ETH.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    contractAddress: addresses.V2.UniV3_USDC_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_USDC_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDC_ETH_MANAGED',
    type: POOL_TYPES.UNIV3,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_USDC_ETH_MANAGED.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    contractAddress: addresses.V2.UniV3_USDC_ETH_MANAGED.NewPool,
    collateralAddress: addresses.V2.UniV3_USDC_ETH_MANAGED.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DPI_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.UniV3_DPI_ETH.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DPI_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_DPI_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_UST_USDT',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_UST_USDT.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_UST_USDT.NewPool,
    collateralAddress: addresses.V2.UniV3_UST_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM, addresses.LUNA],
    rewardTokenSymbols: ['iFARM', 'LUNA'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDC_USDT',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_USDC_USDT.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_USDC_USDT.NewPool,
    collateralAddress: addresses.V2.UniV3_USDC_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_WBTC_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_WBTC_ETH.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_WBTC_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_WBTC_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599" style="color: #15202B;">
        WBTC</a> and 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?" style="color: #15202B;">
        WETH</a> to Uniswap. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately. This vault is active when 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?" style="color: #15202B;">
        WETH</a> value is within 0.051 - 0.101 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599" style="color: #15202B;">
        WBTC</a>.
      </div>
    `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_ETH_USDT',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_ETH_USDT.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_ETH_USDT.NewPool,
    collateralAddress: addresses.V2.UniV3_ETH_USDT.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DAI_USDC',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_DAI_USDC.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DAI_USDC.NewPool,
    collateralAddress: addresses.V2.UniV3_DAI_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DAI_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_DAI_ETH.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DAI_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_DAI_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_UNI_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_UNI_ETH.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_UNI_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_UNI_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_FCASH_USDC',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_FCASH_USDC.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_FCASH_USDC.NewPool,
    collateralAddress: addresses.V2.UniV3_FCASH_USDC.NewVault,
    rewardAPY: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Get fCash{' '}
            <a target="_blank" rel="noopener noreferrer" href="https://fcash.farmdashboard.xyz/">
              here
            </a>
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDT_ETH_1400_2400',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [
        addresses.V2.UniV3_USDT_ETH_1400_2400.NewVault,
        'uniswapv3_eth',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_USDT_ETH_1400_2400.NewPool,
    collateralAddress: addresses.V2.UniV3_USDT_ETH_1400_2400.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7" style="color: #15202B;">
        USDT</a> and 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?" style="color: #15202B;">
        WETH</a> to Uniswap. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately. This vault is active when 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?" style="color: #15202B;">
        WETH</a> value is within 1.4K - 2.4K 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7" style="color: #15202B;">
        USDT</a>.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_USDC_ETH_1400_2400',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [
        addresses.V2.UniV3_USDC_ETH_1400_2400.NewVault,
        'uniswapv3_eth',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_USDC_ETH_1400_2400.NewPool,
    collateralAddress: addresses.V2.UniV3_USDC_ETH_1400_2400.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" style="color: #15202B;">
        USDC</a> and 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?" style="color: #15202B;">
        WETH</a> to Uniswap. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately. This vault is active when 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2?" style="color: #15202B;">
        WETH</a> value is within 1.4K - 2.4K 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" style="color: #15202B;">
        USDC</a>.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_DAI_ETH_1400_2400',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [
        addresses.V2.UniV3_DAI_ETH_1400_2400.NewVault,
        'uniswapv3_eth',
        strat30PercentFactor,
      ],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_DAI_ETH_1400_2400.NewPool,
    collateralAddress: addresses.V2.UniV3_DAI_ETH_1400_2400.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f" style="color: #15202B;">
        DAI</a> and 
        WETH to Uniswap. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately. This vault is active when 
        WETH value is within 1.4K - 2.4K 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f" style="color: #15202B;">
        DAI</a>.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvThreeCrypto',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvThreeCrypto.NewPool,
    collateralAddress: addresses.V2.crvThreeCrypto.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['tricrypto2'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc4ad29ba4b3c580e6d59105fff484999997675ff" style="color: #15202B;">
        crv3crypto</a> to Curve earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xd533a949740bb3306d119cc777fa900ba034cd52" style="color: #15202B;">
        CRV</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b" style="color: #15202B;">
        CVX</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xd533a949740bb3306d119cc777fa900ba034cd52" style="color: #15202B;">
        CRV</a>, 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b" style="color: #15202B;">
        CVX</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc4ad29ba4b3c580e6d59105fff484999997675ff" style="color: #15202B;">
        crv3crypto</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'crvCVXCRV',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.crvCVXCRV.NewPool,
    collateralAddress: addresses.V2.crvCVXCRV.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.CONVEX,
      params: ['cvxcrv'],
    },
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://curve.fi/factory/22/deposit"
            >
              curve.fi
            </a>
            and deposit <b style="text-decoration: underline;">CRV and/or cvxCRV</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'bal_BAL_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.bal_BAL_WETH.NewPool,
    collateralAddress: addresses.V2.bal_BAL_WETH.NewVault,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.bal_BAL_WETH.Underlying, 'balancerv2_eth'],
    },
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.balancer.fi/#/pool/${addresses.V2.bal_BAL_WETH.PoolId}"
            >
              balancer.fi
            </a>
            and deposit <b style="text-decoration: underline;">BAL</b> and <b style="text-decoration: underline;">WETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'bal_DAI_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.bal_DAI_WETH.NewPool,
    collateralAddress: addresses.V2.bal_DAI_WETH.NewVault,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.V2.bal_DAI_WETH.PoolId, CHAINS_ID.ETH_MAINNET],
    },
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.balancer.fi/#/pool/${addresses.V2.bal_DAI_WETH.PoolId}"
            >
              balancer.fi
            </a>
            and deposit <b style="text-decoration: underline;">DAI</b> and <b style="text-decoration: underline;">WETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'bal_USDC_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.bal_USDC_WETH.NewPool,
    collateralAddress: addresses.V2.bal_USDC_WETH.NewVault,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.V2.bal_USDC_WETH.PoolId, CHAINS_ID.ETH_MAINNET],
    },
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.balancer.fi/#/pool/${addresses.V2.bal_USDC_WETH.PoolId}"
            >
              balancer.fi
            </a>
            and deposit <b style="text-decoration: underline;">USDC</b> and <b style="text-decoration: underline;">WETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'bal_USDT_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.bal_USDT_WETH.NewPool,
    collateralAddress: addresses.V2.bal_USDT_WETH.NewVault,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.V2.bal_USDT_WETH.PoolId, CHAINS_ID.ETH_MAINNET],
    },
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.balancer.fi/#/pool/${addresses.V2.bal_USDT_WETH.PoolId}"
            >
              balancer.fi
            </a>
            and deposit <b style="text-decoration: underline;">USDT</b> and <b style="text-decoration: underline;">WETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'bal_WBTC_WETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.bal_WBTC_WETH.NewPool,
    collateralAddress: addresses.V2.bal_WBTC_WETH.NewVault,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.BALANCER,
      params: [addresses.V2.bal_WBTC_WETH.PoolId, CHAINS_ID.ETH_MAINNET],
    },
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.balancer.fi/#/pool/${addresses.V2.bal_WBTC_WETH.PoolId}"
            >
              balancer.fi
            </a>
            and deposit <b style="text-decoration: underline;">WBTC</b> and <b style="text-decoration: underline;">WETH</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_BUSD_USDC',
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_BUSD_USDC.NewPool,
    collateralAddress: addresses.V2.UniV3_BUSD_USDC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_BUSD_USDC.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_renBTC_wBTC',
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_renBTC_wBTC.NewPool,
    collateralAddress: addresses.V2.UniV3_renBTC_wBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3_APYVISION,
      params: [addresses.V2.UniV3_renBTC_wBTC.NewVault, 'uniswapv3_eth', strat30PercentFactor],
    },
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.uni_FOX_WETH.Underlying, 'uniswap_eth'],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'uni_FOX_WETH',
    type: POOL_TYPES.INCENTIVE_BUYBACK,
    contractAddress: addresses.V2.uni_FOX_WETH.NewPool,
    collateralAddress: addresses.V2.uni_FOX_WETH.NewVault,
    rewardAPY: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://fox.shapeshift.com/fox-farming/liquidity/add"
          >
          Shapeshift
          </a>
          and provide liquidity using <b style="text-decoration: underline;">FOX</b> and <b style="text-decoration: underline;">ETH</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.sushi_PHTR_FARM.Underlying, 'sushiswap_eth'],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_PHTR_FARM',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_PHTR_FARM.NewPool,
    collateralAddress: addresses.V2.sushi_PHTR_FARM.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.PHTR}/${addresses.FARM}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">PHTR-FARM</b> pair by depositing <b style="text-decoration: underline;">PHTR</b> and
            <b style="text-decoration: underline;">FARM</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.sushi_PHTR_ETH.Underlying, 'sushiswap_eth'],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_PHTR_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_PHTR_ETH.NewPool,
    collateralAddress: addresses.V2.sushi_PHTR_ETH.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.iFARM, addresses.PHTR],
    rewardTokenSymbols: ['iFARM', 'PHTR'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/add/${addresses.PHTR}/${addresses.WETH}"
            >
              Sushiswap
            </a>
            and supply liquidity to the <b style="text-decoration: underline;">PHTR-ETH</b> pair by depositing <b style="text-decoration: underline;">PHTR</b> and
            <b style="text-decoration: underline;">ETH</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_REI_ETH',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.UniV3_REI_ETH.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_REI_ETH.NewPool,
    collateralAddress: addresses.V2.UniV3_REI_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_REI_ETH_full_range',
    tradingApyFunction: {
      type: 'UNIV3_V2',
      params: [addresses.V2.UniV3_REI_ETH_full_range.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_REI_ETH_full_range.NewPool,
    collateralAddress: addresses.V2.UniV3_REI_ETH_full_range.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'UniV3_REI_wBTC',
    tradingApyFunction: {
      type: TRADING_APY_TYPES.UNIV3,
      params: [addresses.V2.UniV3_REI_wBTC.NewVault],
    },
    type: POOL_TYPES.UNIV3,
    contractAddress: addresses.V2.UniV3_REI_wBTC.NewPool,
    collateralAddress: addresses.V2.UniV3_REI_wBTC.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_JEUR_USDC_HODL.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JEUR_USDC_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JEUR_USDC_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JEUR_USDC_HODL.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.jarvis_JEUR_USDC_HODL.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fAURFEB22_USDC', 'fAURAPR22_USDC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://dmm.exchange/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c/0xa1219DBE76eEcBf7571Fed6b020Dd9154396B70e">
            KyberDMM
          </a>
          and add liquidity for jEUR-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_JGBP_USDC_HODL.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JGBP_USDC_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JGBP_USDC_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JGBP_USDC_HODL.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.jarvis_JGBP_USDC_HODL.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fAURFEB22_USDC', 'fAURAPR22_USDC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://dmm.exchange/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0x767058F11800FBA6A682E73A6e79ec5eB74Fac8c/0xbb2d00675B775E0F8acd590e08DA081B2a36D3a6">
            KyberDMM
          </a>
          and add liquidity for jGBP-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.jarvis_JCHF_USDC_HODL.Underlying, 'kyber_matic'],
    },
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_JCHF_USDC_HODL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_JCHF_USDC_HODL.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_JCHF_USDC_HODL.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.jarvis_JCHF_USDC_HODL.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC', 'fAURFEB22_USDC', 'fAURAPR22_USDC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://dmm.exchange/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0xbD1463F02f61676d53fd183C2B19282BFF93D099/0x439E6A13a5ce7FdCA2CC03bF31Fb631b3f5EF157">
            KyberDMM
          </a>
          and add liquidity for jCHF-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'jarvis_AUR_USDC',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.MATIC.V2.jarvis_AUR_USDC.NewPool,
    collateralAddress: addresses.MATIC.V2.jarvis_AUR_USDC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://dmm.exchange/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/0xfAdE2934b8E7685070149034384fB7863860D86e/0xA0fB4487c0935f01cBf9F0274FE3CdB21a965340">
            KyberDMM
          </a>
          and add liquidity for AUR-USDC
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'balancer_BTC',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.balancer_BTC.Underlying, 'balancerv2_matic'],
    },
    contractAddress: addresses.MATIC.V2.balancer_BTC.NewPool,
    collateralAddress: addresses.MATIC.V2.balancer_BTC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.balancer.fi/#/pool/${addresses.MATIC.V2.balancer_BTC.PoolId}">
            balancer
          </a>
          and invest <b style="text-decoration: underline;">WBTC</b> or <b style="text-decoration: underline;">renBTC</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'balancer_POLYBASE',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.balancer_POLYBASE.Underlying, 'balancerv2_matic'],
    },
    contractAddress: addresses.MATIC.V2.balancer_POLYBASE.NewPool,
    collateralAddress: addresses.MATIC.V2.balancer_POLYBASE.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.balancer_POLYBASE.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      The vault supplies 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x0297e37f1873d2dab4487aa67cd56b58e2f27875" style="color: #15202B;">
        B-POLYBASE</a> to Balancer earning 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3" style="color: #15202B;">  
        BAL</a> rewards. At every harvest, the earned 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3" style="color: #15202B;">  
      BAL</a> rewards are reinvested into more 
      <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x0297e37f1873d2dab4487aa67cd56b58e2f27875" style="color: #15202B;">
        B-POLYBASE</a> to compound your earnings. By participating to this vault, farmers are also entitled to miFARM rewards that can be claimed separately.
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'balancer_TRICRYPTO',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.balancer_TRICRYPTO.Underlying, 'balancerv2_matic'],
    },
    contractAddress: addresses.MATIC.V2.balancer_TRICRYPTO.NewPool,
    collateralAddress: addresses.MATIC.V2.balancer_TRICRYPTO.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.balancer_TRICRYPTO.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.balancer.fi/#/pool/${addresses.MATIC.V2.balancer_TRICRYPTO.PoolId}">
            balancer
          </a>
          and invest <b style="text-decoration: underline;">WBTC</b>, <b style="text-decoration: underline;">USDC</b>, or <b style="text-decoration: underline;">WETH</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'balancer_STABLE',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.MATIC.V2.balancer_STABLE.Underlying, 'balancerv2_matic'],
    },
    contractAddress: addresses.MATIC.V2.balancer_STABLE.NewPool,
    collateralAddress: addresses.MATIC.V2.balancer_STABLE.NewVault,
    oldPoolContractAddress: addresses.MATIC.V2.balancer_STABLE.OldPool,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM', 'WMATIC'],
    stakeAndDepositHelpMessage: `
    <div class="help-message">
      <b>Deposit and stake:</b>
      <ol class="numeric-list">
        <li>
          Go to&nbsp;
          <a target="_blank" rel="noopener noreferrer" href="https://polygon.balancer.fi/#/pool/${addresses.MATIC.V2.balancer_STABLE.PoolId}">
            balancer
          </a>
          and invest <b style="text-decoration: underline;">USDT</b>, <b style="text-decoration: underline;">miMATIC</b>, <b style="text-decoration: underline;">USDC</b> or <b style="text-decoration: underline;">DAI</b>
        </li>
        <li>
          Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
          &quot;Stake for rewards&quot; checked for staking
        </li>
      </ol>
    </div>
 `,
  },
  {
    tradingApyFunction: {
      type: TRADING_APY_TYPES.LP,
      params: [addresses.V2.sushi_YEL_ETH.Underlying, 'sushiswap_eth'],
    },
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'sushi_YEL_ETH',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.sushi_YEL_ETH.NewPool,
    collateralAddress: addresses.V2.sushi_YEL_ETH.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM', 'fYEL'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc83ce8612164ef7a13d17ddea4271dd8e8eebe5d" style="color: #15202B;">
        SLP(YEL-ETH)</a> to Sushiswap earning 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x7815bda662050d84718b988735218cffd32f75ea" style="color: #15202B;">
        YEL</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0x7815bda662050d84718b988735218cffd32f75ea" style="color: #15202B;">
        YEL</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://etherscan.io/token/0xc83ce8612164ef7a13d17ddea4271dd8e8eebe5d" style="color: #15202B;">
        SLP(YEL-ETH)</a> to compound your earnings. By participating to this vault, farmers are also entitled to iFARM rewards that can be claimed separately.
      </div>
   `,
  },
  {
    chain: CHAINS_ID.ETH_MAINNET,
    id: 'yelhold_YEL',
    type: POOL_TYPES.INCENTIVE,
    contractAddress: addresses.V2.yelhold_YEL.NewPool,
    collateralAddress: addresses.V2.yelhold_YEL.NewVault,
    rewardAPY: [],
    rewardTokens: [addresses.iFARM],
    rewardTokenSymbols: ['iFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        <b>Deposit and stake:</b>
        <ol class="numeric-list">
          <li>
            Go to&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://app.sushi.com/swap"
            >
             Sushiswap
            </a>
            and swap assets to <b style="text-decoration: underline;">YEL</b>
          </li>
          <li>
            Go back to this vault, hit &quot;MAX&quot; and then &quot;Deposit&quot;. Leave
            &quot;Stake for rewards&quot; checked for staking
          </li>
        </ol>
      </div>
   `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'ape_BANANA_MATIC',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.APE,
      params: [addresses.MATIC.V2.ape_BANANA_MATIC.ApePoolId, CHAINS_ID.MATIC_MAINNET],
    },
    contractAddress: addresses.MATIC.V2.ape_BANANA_MATIC.NewPool,
    collateralAddress: addresses.MATIC.V2.ape_BANANA_MATIC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x034293f21f1cce5908bc605ce5850df2b1059ac0" style="color: #15202B;"
        >APE-LP(BANANA-MATIC)</a>
         to Apeswap earning 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;"
        >BANANA</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;"
        >BANANA</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x034293f21f1cce5908bc605ce5850df2b1059ac0" style="color: #15202B;"
        >APE-LP(BANANA-MATIC)</a> to compound your earnings.
      </div>
    `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'ape_ETH_MATIC',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.APE,
      params: [addresses.MATIC.V2.ape_ETH_MATIC.ApePoolId, CHAINS_ID.MATIC_MAINNET],
    },
    contractAddress: addresses.MATIC.V2.ape_ETH_MATIC.NewPool,
    collateralAddress: addresses.MATIC.V2.ape_ETH_MATIC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x6cf8654e85ab489ca7e70189046d507eba233613" style="color: #15202B;"
        >APE-LP(ETH-MATIC)</a> to Apeswap earning 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;"
        >BANANA</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;"
        >BANANA</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x6cf8654e85ab489ca7e70189046d507eba233613" style="color: #15202B;"
        >APE-LP(ETH-MATIC)</a> to compound your earnings.
      </div>
    `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'ape_DAI_MATIC',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.APE,
      params: [addresses.MATIC.V2.ape_DAI_MATIC.ApePoolId, CHAINS_ID.MATIC_MAINNET],
    },
    contractAddress: addresses.MATIC.V2.ape_DAI_MATIC.NewPool,
    collateralAddress: addresses.MATIC.V2.ape_DAI_MATIC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xd32f3139a214034a0f9777c87ee0a064c1ff6ae2" style="color: #15202B;"
        >APE-LP(DAI-MATIC)</a> to Apeswap earning 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;"
        >BANANA</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;"
        >BANANA</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xd32f3139a214034a0f9777c87ee0a064c1ff6ae2" style="color: #15202B;"
        >APE-LP(DAI-MATIC)</a> to compound your earnings.
      </div>
    `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'ape_USDT_MATIC',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.APE,
      params: [addresses.MATIC.V2.ape_USDT_MATIC.ApePoolId, CHAINS_ID.MATIC_MAINNET],
    },
    contractAddress: addresses.MATIC.V2.ape_USDT_MATIC.NewPool,
    collateralAddress: addresses.MATIC.V2.ape_USDT_MATIC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x65d43b64e3b31965cd5ea367d4c2b94c03084797" style="color: #15202B;">
        APE-LP(USDT-MATIC)</a> to Apeswap earning 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;">
        BANANA</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;">
        BANANA</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x65d43b64e3b31965cd5ea367d4c2b94c03084797" style="color: #15202B;">
        APE-LP(USDT-MATIC)</a> to compound your earnings.
      </div>
    `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'ape_BTC_MATIC',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.APE,
      params: [addresses.MATIC.V2.ape_BTC_MATIC.ApePoolId, CHAINS_ID.MATIC_MAINNET],
    },
    contractAddress: addresses.MATIC.V2.ape_BTC_MATIC.NewPool,
    collateralAddress: addresses.MATIC.V2.ape_BTC_MATIC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xe82635a105c520fd58e597181cbf754961d51e3e" style="color: #15202B;"
        >APE-LP(BTC-MATIC)</a> to Apeswap earning 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;"
        >BANANA</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;"
        >BANANA</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0xe82635a105c520fd58e597181cbf754961d51e3e" style="color: #15202B;"
        >APE-LP(BTC-MATIC)</a> to compound your earnings.
      </div>
    `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'ape_DAI_USDC',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.APE,
      params: [addresses.MATIC.V2.ape_DAI_USDC.ApePoolId, CHAINS_ID.MATIC_MAINNET],
    },
    contractAddress: addresses.MATIC.V2.ape_DAI_USDC.NewPool,
    collateralAddress: addresses.MATIC.V2.ape_DAI_USDC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
        The vault supplies 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5b13b583d4317ab15186ed660a1e4c65c10da659" style="color: #15202B;">
        APE-LP(DAI-USDC)</a> to Apeswap earning 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;">
        BANANA</a> rewards. At every harvest, the earned 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c" style="color: #15202B;">
        BANANA</a> rewards are reinvested into more 
        <a target="_blank" rel="noopener noreferrer" href="https://polygonscan.com/token/0x5b13b583d4317ab15186ed660a1e4c65c10da659" style="color: #15202B;">
        APE-LP(DAI-USDC)</a> to compound your earnings.
      </div>
    `,
  },
  {
    chain: CHAINS_ID.MATIC_MAINNET,
    id: 'ape_BNB_MATIC',
    type: POOL_TYPES.INCENTIVE,
    tradingApyFunction: {
      type: TRADING_APY_TYPES.APE,
      params: [addresses.MATIC.V2.ape_BNB_MATIC.ApePoolId, CHAINS_ID.MATIC_MAINNET],
    },
    contractAddress: addresses.MATIC.V2.ape_BNB_MATIC.NewPool,
    collateralAddress: addresses.MATIC.V2.ape_BNB_MATIC.NewVault,
    rewardAPY: [],
    rewardAPR: null,
    rewardTokens: [addresses.MATIC.miFARM],
    rewardTokenSymbols: ['miFARM'],
    stakeAndDepositHelpMessage: `
      <div class="help-message">
      The vault supplies 
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://polygonscan.com/token/0x0359001070cf696d5993e0697335157a6f7db289"
        style="color: #15202B;"
      >APE-LP(BNB-MATIC)</a> to Apeswap earning 
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c"
        style="color: #15202B;"
      >BANANA</a> rewards. At every harvest, the earned 
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://polygonscan.com/token/0x5d47baba0d66083c52009271faf3f50dcc01023c"
        style="color: #15202B;"
      >BANANA</a> rewards are reinvested into more 
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://polygonscan.com/token/0x0359001070cf696d5993e0697335157a6f7db289"
        style="color: #15202B;"
      >APE-LP(BNB-MATIC)</a> to compound your earnings.
      </div>
    `,
  },
]
