import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image, Text } from '@pancakeswap/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { useFetchPublicPoolsData, usePools } from 'state/pools/hooks'
import { usePollFarmsData } from 'state/farms/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { Pool } from 'state/types'
import Loading from 'components/Loading'
import PoolCard from './components/PoolCard'
import CakeVaultCard from './components/CakeVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'
import HelpButton from './components/HelpButton'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { ViewMode } from './components/ToggleView/ToggleView'
import { getAprData, getCakeVaultEarnings } from './helpers'




const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()


  const [selectedbg, setSelectedbg] = React.useState('#212129')
  const [cardcolor, setCardcolor] = React.useState('#212129')
  const [usraddr, setUsraddr] = React.useState('0x0')
  const [usraddr2, setUsraddr2] = React.useState('0x7fe8dac51394157811c71bbf74c133a224a9ff44')
  const [link, setLink] = React.useState('https://ethcustom.liquidswap.trade/swap?outputCurrency=0x7fe8dac51394157811c71bbf74c133a224a9ff44&dark=dark')
  const [slippage, setSlippage] = React.useState('0.5')
  const [dark, setDark] = React.useState('dark')
  const [defaultnet, setDefaultnet] = React.useState('eth')

  const changeLink = async() => {
    console.log(selectedbg)
    // @ts-ignore
    const slipapge = slippage * 100
    const color = selectedbg.replace('#','');
    let inputCurrency;
    let outputCurrency;
    if(usraddr==='0x0'){
      inputCurrency = 'ETH'
    } else {
      inputCurrency = usraddr;
    }
    if(usraddr2==='0x0'){
      outputCurrency = 'ETH'
    } else {
      outputCurrency = usraddr2;
    }

    const newLink = `https://${defaultnet}custom.liquidswap.trade/swap?inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}&bg=${color}&slippage=${slipapge}&card=${cardcolor.replace('#','')}&dark=${dark}`
    setLink(newLink)
    
  }

  const changeType = async(val) => {
    
    if(val === 'dark'){
      setDark('dark')
      setCardcolor('#212129')
      setSelectedbg('#212129')
    } else {
      setDark('light')
      setCardcolor('#ffffff')
      setSelectedbg('#ffffff')
    }
  }


  return (
    <>
      <div>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="primary" mb="24px" style={{textAlign:'center'}}>
              {t('Make Your Dex')}
            </Heading>
            {/* <Heading scale="md" color="text">
              {t('Just stake some tokens to earn.')}
            </Heading> */}
            {/* <Heading scale="md" color="text" style={{textAlign:'center'}}>
              {t('in one click')}
            </Heading> */}
          </Flex>
        </Flex>
      </div>
      <Page>
      <div style={{background:`rgb(33, 33, 41)`, backgroundSize:'cover', width:'100%', margin:'0 auto', display:'block', borderRadius:'15px'}}>
                <br /> <br />
                <p style={{fontSize:'14px',color:'#FB5843', textAlign:'center'}}><br /></p>


                
                <div className="row" style={{padding:'5%'}}>
                    
                <select className="form-select" aria-label="Default select example" style={{background:'transparent', color:'white'}} onChange={(event) => setDefaultnet(event.target.value)}>
                  <option value="eth" selected>ETH</option>
                  <option value="bsc">BSC</option>
                  <option value="polygon">POLYGON</option>
                  <option value="avax">AVAX</option>
                  <option value="ftm">FTM</option>

                </select>
                </div>

                  <div className="row" style={{padding:'5%'}}>
                    <div className="col-6">
                    <div id="emailHelp" className="form-text">Choose Theme</div>
                      <select className="form-select" aria-label="Default select example" style={{background:'transparent', color:'white'}} onChange={(event) => changeType(event.target.value)}>
                        <option selected="dark" value="dark">Dark</option>
                        <option value="light">Light</option>
                      </select>

                    </div>
                    <div className="col-6">
                    <div id="emailHelp" className="form-text">Custom BG?</div>
                    <input type="color" value={selectedbg} onChange={(event) => setSelectedbg(event.target.value)} className="form-control" id="exampleFormControlInput1"  style={{background:'transparent', height:'38px'}} placeholder="name@example.com" />
                    </div>
                    <div className="col-6">
                    <div id="emailHelp" className="form-text">From Token Address (use 0x0 for ETH/BNB/MATIC)</div>
                    <input type="text" onChange={(event) => setUsraddr(event.target.value)}  className="form-control" id="exampleFormControlInput1"  style={{background:'transparent', height:'38px', color:'white'}} placeholder="0x000000" />
                    </div>
                    <div className="col-6">
                    <div id="emailHelp" className="form-text">To Token Address (use 0x0 for ETH/BNB/MATIC)</div>
                    <input type="text" onChange={(event) => setUsraddr2(event.target.value)}  className="form-control" id="exampleFormControlInput1"  style={{background:'transparent', height:'38px', color:'white'}} placeholder="0x000000" />
                    </div>
                    <div className="col-6">
                    <div id="emailHelp" className="form-text">Default Slippage</div>
                    <input type="text" onChange={(event) => setSlippage(event.target.value)}  className="form-control" id="exampleFormControlInput1"  style={{background:'transparent', height:'38px', color:'white'}} placeholder="0.5" />
                    </div>
                    <div className="col-6">
                    <div id="emailHelp" className="form-text">Custom Card Color</div>
                    <input type="color" value={cardcolor} onChange={(event) => setCardcolor(event.target.value)} className="form-control" id="exampleFormControlInput1"  style={{background:'transparent', height:'38px'}} placeholder="name@example.com" />
                    </div>
                    <div className="col-12">
                    <div id="emailHelp" className="form-text">Create Preview</div>
                    <button type="button" className="btn btn-outline-light" style={{width:"100%"}} onClick={changeLink} >Build</button>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col" style={{width:'100%', margin:'0 auto'}}>
                  <iframe title="dex" id="rubic-widget-iframe" scrolling="no" style={{width:'350px', height:'500px', border: "none", borderRadius: "19px", boxShadow: "rgba(0, 0, 0, 0.1) 3px 3px 10px 4px", display: "block", margin:'0 auto'}} src={link} />
                  
                  <div className="row" style={{padding:'5%', color:'white'}}>
                    <h4 style={{fontSize:'1.5rem'}}>Code to Use</h4>
                    <h6 style={{fontWeight:'bold',color:'grey', fontSize:'1rem'}}>React.js Sites</h6>
                    <div style={{background:'black', padding:'15px'}}>
                      <code >
                      &lt;iframe scrolling=&quot;no&quot; height=&quot;500&quot; width=&quot;350&quot; style=&#123;&#123;width:&quot;350px&quot;,height:&quot;500px&quot;, border: &quot;none&quot;, borderRadius: &quot;19px&quot;, boxShadow: &quot;rgba(0, 0, 0, 0.1) 3px 3px 10px 4px&quot;, display: &quot;block&quot;, margin:&quot;0 auto&quot;&#125;&#125; src=&quot;{link}&quot; /&gt;

                      </code>
                    </div>

                    <h6 style={{fontWeight:'bold',color:'grey', fontSize:'1rem'}}>HTML & Other sites [inline css]</h6>
                    <div style={{background:'black', padding:'15px'}}>
                      <code>
                      &lt;iframe scrolling=&quot;no&quot; height=&quot;500&quot; width=&quot;350&quot; style=&quot;width:350px; border: none; border-radius: 19px; box-shadow: rgba(0, 0, 0, 0.1) 3px 3px 10px 4px; display: block; margin:0 auto&quot; src=&quot;{link}&quot; /&gt;

                      </code>
                    </div>
                  </div>
                  </div>
                  </div>
                  </div>
      </Page>
    </>
  )
}

export default Pools
