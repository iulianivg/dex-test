import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import Settings from './Settings'
import Transactions from './Transactions'
import QuestionHelper from '../QuestionHelper'

interface Props {
  title: string
  subtitle: string
  helper?: string
  backTo?: string
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AppHeader3: React.FC<Props> = ({ title, subtitle, helper, backTo, noConfig = false }) => {
  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
        {backTo && (
          <IconButton as={Link} to={backTo}>
            <ArrowBackIcon width="32px" />
          </IconButton>
        )}
        <Flex flexDirection="column">
          <Heading as="h2" mb="8px">
          <div style={{padding:'5px'}}>
          <a href="/swap"> <span style={{fontSize:'16px', color:'#7A7A7A'}}>Swap</span>  </a>        <a href="/pool"> <span style={{fontSize:'16px', marginLeft:'5px', color:'#FB5843'}}>Liquidity</span> </a>
          <a href="https://synapseprotocol.com" target="_blank" rel="noreferrer" style={{textDecoration:'none'}}>
<span style={{fontSize:'16px', marginLeft:'5px', color:'#7A7A7A'}}>Bridge</span>
</a>
</div> 
          </Heading>
        </Flex>
      </Flex>
      {!noConfig && (
        <Flex>
          <Settings />
          {/* <Transactions /> */}
        </Flex>
      )}
    </AppHeaderContainer>
  )
}

export default AppHeader3
