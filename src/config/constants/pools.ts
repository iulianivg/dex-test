import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  // {
  //   sousId: 0,
  //   stakingToken: tokens.cake,
  //   earningToken: tokens.cake,
  //   contractAddress: {
  //     97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
  //     1: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   harvest: true,
  //   tokenPerBlock: '10',
  //   sortOrder: 1,
  //   isFinished: false,
  // },
  {
    sousId: 226,
    stakingToken: tokens.lqd,
    earningToken: tokens.lqd,
    contractAddress: {
      97: '',
      1: '0x3de0cbe93a1b311077cb995e811683f958e4b6f1',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    isFinished: false,
    sortOrder: 999,
    tokenPerBlock: '1.664419700',
  },
  {
    sousId: 227,
    stakingToken: tokens.lqdeth,
    earningToken: tokens.lqd,
    contractAddress: {
      97: '',
      1: '0x5e0543500908a6199fb93fb6dd6c9188a6e4f42f',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    isFinished: false,
    sortOrder: 999,
    tokenPerBlock: '4.954664',
  },
  {
    sousId: 228,
    stakingToken: tokens.weth,
    earningToken: tokens.lqd,
    contractAddress: {
      97: '',
      1: '0xce75f3cc108bc552d9ae083b3899d3d919aa8702',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    isFinished: false,
    sortOrder: 999,
    tokenPerBlock: '3.66615',
  }
  
]

export default pools
