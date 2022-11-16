import { ChainId, Token } from '@pancakeswap/sdk'

export const CAKE: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    18,
    'UNI',
    'UNI Token',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    18,
    'CAKE',
    'PancakeSwap Token',
  ),
}
export const BUSD: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    18,
    'BUSD',
    'Binance USD',
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
    18,
    'BUSD',
    'Binance USD',
  ),
}

export const WBNV = new Token(ChainId.MAINNET, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 18, 'WETH', 'Wrapped ETH')
export const DAI = new Token(ChainId.MAINNET, '0x6b175474e89094c44da98b954eedeac495271d0f', 18, 'DAI', 'Dai Stablecoin')
export const USDT = new Token(ChainId.MAINNET, '0xdac17f958d2ee523a2206206994597c13d831ec7', 6, 'USDT', 'Tether USD')
export const BTCB = new Token(ChainId.MAINNET, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 8, 'wBTC', 'Wrapped BTC')
export const LQD = new Token(ChainId.MAINNET, '0x7fe8dac51394157811c71bbf74c133a224a9ff44', 9, 'LQD', 'LiquidSwap')

export const UST = new Token(
  ChainId.MAINNET,
  '0xdac17f958d2ee523a2206206994597c13d831ec7',
  6,
  'USDT',
  'Tether',
)


export const USDC = new Token(
  ChainId.MAINNET,
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  6,
  'USDC',
  'USD Coin',
)


const tokens = {
  eth: {
    symbol: 'ETH',
    projectLink: 'https://www.binance.com/',
  },
  kishimoto: {
    symbol: 'KISHIMOTO',
    address: {
      1: '0xf5b1fd29d23e98db2d9ebb8435e1082e3b38fb65',
      97: ''
    },
    decimals: 9,
    projectLink: 'https://kishimotoinu.com'
  },
  lqdeth: {
    symbol:'LQD-ETH LP',
    address:{
      1:'0x0A90784A378191e29c1a13FA198118A0Df19Fe3D',
      97:''
    },
    decimals: 18,
    projectLink: '/'
  },
  saitamainu: {
    symbol: 'SAITAMA',
    address: {
      1: '0x8b3192f5eebd8579568a2ed41e6feb402f93f73f',
      97: ''
    },
    decimals: 9,
    projectLink: 'https://saitamatoken.com/'
  },
  cake: {
    symbol: 'UNI',
    address: {
      1: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  lqd: {
    symbol: 'LQD',
    address:{
      1:'0x7fe8dac51394157811c71bbf74c133a224a9ff44',
      97:''
    },
    decimals: 9,
    projectLink: '/'
  },
  usdt: {
    symbol: 'usdt',
    address: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      97: '',
    },
    decimals: 6,
    projectLink: 'https://coin98.com/',
  },
  weth: {
    symbol: 'WETH',
    address: {
      1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      97: '',
    },
    decimals: 18,
  },
  safemoon: {
    symbol: 'wavax',
    address: {
      1: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c71',
      97: '',
    },
    decimals: 18,
  },
}

export default tokens
