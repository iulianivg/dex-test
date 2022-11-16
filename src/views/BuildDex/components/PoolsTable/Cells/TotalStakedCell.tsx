import React, { useMemo } from 'react'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { Pool } from 'state/types'
import { useCakeVault } from 'state/pools/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  pool: Pool
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalStakedCell: React.FC<TotalStakedCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { sousId, stakingToken, totalStaked, isAutoVault, stakingTokenPrice } = pool
  const { totalCakeInVault } = useCakeVault()
  // @ts-ignore
  const totalStakedUSD = getBalanceNumber(totalStaked, stakingToken.decimals)*Number(stakingTokenPrice);
  const isManualCakePool = sousId === 0

  const totalStakedBalance = useMemo(() => {
    if (isAutoVault) {
      return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
    }
    if (isManualCakePool) {
      const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(totalCakeInVault)
      return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [isAutoVault, totalCakeInVault, isManualCakePool, totalStaked, stakingToken.decimals])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          TVL
        </Text>
        {totalStaked && totalStaked.gte(0) ? (
          <div>
          <Flex height="20px" alignItems="center">
            <Balance fontSize="16px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          </Flex>
          <Flex height="20px" alignItems="center" style={{color:'white'}}>
           ~ $ <Balance fontSize="16px" value={totalStakedUSD} decimals={0} unit=" " />
          </Flex>
          </div>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
