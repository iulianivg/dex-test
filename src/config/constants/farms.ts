import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  // {
  //   pid: 0,
  //   lpSymbol: 'CAKE',
  //   lpAddresses: {
  //     97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
  //     43114: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  //   },
  //   token: tokens.wavax, // .syrup
  //   quoteToken: tokens.wavax,
  // },
  // {
  //   pid: 251,
  //   lpSymbol: 'CAKE-BNB LP',
  //   lpAddresses: {
  //     97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
  //     43114: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0',
  //   },
  //   token: tokens.cake,
  //   quoteToken: tokens.wavax,
  // },
  // {
  //   pid: 252,
  //   lpSymbol: 'BUSD-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     43114: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
  //   },
  //   token: tokens.wavax,
  //   quoteToken: tokens.wavax,
  // },
  /**
   * V3 by order of release (some may be out of PID order due to multiplier boost)
   */
  // {
  //   pid: 434,
  //   lpSymbol: 'SKILL-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     43114: '0xc19dfd34d3ba5816df9cbdaa02d32a9f8dc6f6fc',
  //   },
  //   token: tokens.wavax,
  //   quoteToken: tokens.wavax,
  // },
]

export default farms
