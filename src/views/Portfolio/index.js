import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Card, Text } from '@pancakeswap/uikit'
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
import AppHeader4 from 'components/App/AppHeader4'
// import multicall from 'utils/multicall'
import TOKENABI from 'config/abi/erc20.json'
import allTokens from './allTokens.json'
import Web3 from 'web3'
import multicallabi from 'config/abi/Multicall.json'
import { Interface } from '@ethersproject/abi'

const axios = require('axios').default;


const NUMBER_OF_POOLS_VISIBLE = 12

const WalletItem = styled(Flex)`

  :hover {
    background: ${({theme}) => theme.isDark ? "black" : "whitesmoke" } ;
  }
`

const Pools = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { account, ethereum, library } = useWeb3React()


  const [tokens, setTokens] = React.useState([])
  const [custom, setCustom] = React.useState([])

  const [networth, setNetworth] = React.useState()
  const [customaddr, setCustomaddr] = React.useState()
  const [forr, setForr] = React.useState()
  const [valuechain, setValuechain] = React.useState([])

  const [show, setShow] = React.useState('all')
  const [loading, setLoading] = React.useState(false)
  const [activefilter, setActivefilter ] = React.useState('')

  const validateAddress = async(addr) => {
    try{
      if(addr == '' && account){
        setCustomaddr('')
      }
      let web3 = new Web3('https://bsc-dataseed.binance.org/');

      const valueAddr = await web3.utils.isAddress(addr)
      if(valueAddr){
        setCustomaddr(addr)
      }
    } catch(err){
      console.log(err)
      // alert("an error has occured")
    }
  }

  
  const multicallHelper = async (abi,calls) => {
    const itf = new Interface(abi)
  
    const calldata = calls.map((call) => ({
      target: call.address.toLowerCase(),
      callData: itf.encodeFunctionData(call.name, call.params),
    }))

    return calldata 

  }

  function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function toFixed(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1]);
    if (e) {
        x *= Math.pow(10,e-1);
        x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
    }
  } else {
    var e = parseInt(x.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        x /= Math.pow(10,e);
        x += (new Array(e+1)).join('0');
    }
  }
  return x;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  const ethMulticall = async (TOKENABI, ethCalls) => {
    const web3 = new Web3(
      // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
      new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161")
    );

    const ethMulticall = new web3.eth.Contract(multicallabi, '0xeefba1e63905ef1d7acba5a8513c70307c1ce441');
    let aggregatedData = await multicallHelper(TOKENABI, ethCalls)
    const itf = new Interface(TOKENABI)

    let {returnData} = await ethMulticall.methods.aggregate(aggregatedData).call()
    const balanceTokens = returnData.map((call, i) => itf.decodeFunctionResult(ethCalls[i].name, call))
    return balanceTokens;
  }

  const bscMulticall = async (TOKENABI, ethCalls) => {
    const web3 = new Web3(
      // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
      new Web3.providers.HttpProvider("https://bsc-dataseed1.ninicoin.io")
    );

    const ethMulticall = new web3.eth.Contract(multicallabi, '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B');
    let aggregatedData = await multicallHelper(TOKENABI, ethCalls)
    const itf = new Interface(TOKENABI)

    let {returnData} = await ethMulticall.methods.aggregate(aggregatedData).call()
    const balanceTokens = returnData.map((call, i) => itf.decodeFunctionResult(ethCalls[i].name, call))
    return balanceTokens;
  }

  const polygonMulticall = async (TOKENABI, ethCalls) => {
    const web3 = new Web3(
      // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
      new Web3.providers.HttpProvider("https://polygon-rpc.com/")
    );

    const ethMulticall = new web3.eth.Contract(multicallabi, '0xa1B2b503959aedD81512C37e9dce48164ec6a94d');
    let aggregatedData = await multicallHelper(TOKENABI, ethCalls)
    const itf = new Interface(TOKENABI)

    let {returnData} = await ethMulticall.methods.aggregate(aggregatedData).call()
    const balanceTokens = returnData.map((call, i) => itf.decodeFunctionResult(ethCalls[i].name, call))
    return balanceTokens;
  }

  const avaxMulticall = async (TOKENABI, ethCalls) => {
    const web3 = new Web3(
      // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
      new Web3.providers.HttpProvider("https://api.avax.network/ext/bc/C/rpc")
    );

    const ethMulticall = new web3.eth.Contract(multicallabi, '0x10456B044E7B26D0ce2844AA59149Fb99a0e521A');
    let aggregatedData = await multicallHelper(TOKENABI, ethCalls)
    const itf = new Interface(TOKENABI)

    let {returnData} = await ethMulticall.methods.aggregate(aggregatedData).call()
    const balanceTokens = returnData.map((call, i) => itf.decodeFunctionResult(ethCalls[i].name, call))
    return balanceTokens;
  }

  const ftmMulticall = async (TOKENABI, ethCalls) => {
    const web3 = new Web3(
      // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
      new Web3.providers.HttpProvider("https://rpc.ftm.tools/")
    );

    const ethMulticall = new web3.eth.Contract(multicallabi, '0xb828c456600857abd4ed6c32facc607bd0464f4f');
    let aggregatedData = await multicallHelper(TOKENABI, ethCalls)
    const itf = new Interface(TOKENABI)

    let {returnData} = await ethMulticall.methods.aggregate(aggregatedData).call()
    const balanceTokens = returnData.map((call, i) => itf.decodeFunctionResult(ethCalls[i].name, call))
    return balanceTokens;
  }




  const allEthBalance = async(acc) => {
    const web3eth = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"))
    const ethBalance = await web3eth.eth.getBalance(acc)
    const web3bsc = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.ninicoin.io"))
    const bscBalance = await web3bsc.eth.getBalance(acc)
    const web3polygon = new Web3(new Web3.providers.HttpProvider("https://polygon-rpc.com/"))
    const polygonBalance = await web3polygon.eth.getBalance(acc)
    const web3avax = new Web3(new Web3.providers.HttpProvider("https://api.avax.network/ext/bc/C/rpc"))
    const avaxBalance = await web3avax.eth.getBalance(acc)
    const web3fantom = new Web3(new Web3.providers.HttpProvider("https://rpc.ftm.tools/"))
    const ftmBalance = await web3fantom.eth.getBalance(acc)
    return ({ethBalance, bscBalance, polygonBalance, avaxBalance, ftmBalance})
  }

  React.useEffect(async () => {
    try{
      if(account || customaddr){
        setLoading(true)
        let networth_local = 0;

        const ethCalls = []
        const bscCalls = []
        const polygonCalls = []
        const avaxCalls = []
        const ftmCalls = []

        let ids = ''
        const theAccount = customaddr || account
        setForr(theAccount)
        let ethBalance = await allEthBalance(theAccount)
        const bscBalance = ethBalance.bscBalance
        const polygonBalance = ethBalance.polygonBalance
        const avaxBalance = ethBalance.avaxBalance
        const ftmBalance = ethBalance.ftmBalance

        ethBalance = ethBalance.ethBalance
        // const ethBalance = await library.getBalance(theAccount)
        // iterate over ethereum 
        // console.log("LENGHT IS ", allTokens[0][1].length)

        for(let i=0; i<allTokens[0][1].length; i++){
          ethCalls.push({
            address: allTokens[0][1][i].address,
            name: 'balanceOf',
            params: [theAccount],
          })
          ids = ids+`%2C`+allTokens[0][1][i].priceApi;
        }
        for(let i=0; i<allTokens[0][56].length; i++){
          bscCalls.push({
            address: allTokens[0][56][i].address,
            name: 'balanceOf',
            params: [theAccount],
          })
          ids = ids+`%2C`+allTokens[0][56][i].priceApi;
        }
        for(let i=0; i<allTokens[0][137].length; i++){
          polygonCalls.push({
            address: allTokens[0][137][i].address,
            name: 'balanceOf',
            params: [theAccount],
          })
          ids = ids+`%2C`+allTokens[0][137][i].priceApi;
        }

        for(let i=0; i<allTokens[0][250].length; i++){
          ftmCalls.push({
            address: allTokens[0][250][i].address,
            name: 'balanceOf',
            params: [theAccount],
          })
          ids = ids+`%2C`+allTokens[0][250][i].priceApi;
        }


        for(let i=0; i<allTokens[0][43114].length; i++){
          avaxCalls.push({
            address: allTokens[0][43114][i].address,
            name: 'balanceOf',
            params: [theAccount],
          })
          ids = ids+`%2C`+allTokens[0][43114][i].priceApi;
        }

        let coingecko = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2C${ids}&vs_currencies=usd`
        const responsejson = await axios.get(coingecko)

        
       
        const balanceTokensEth = await ethMulticall(TOKENABI, ethCalls)
        const balanceTokensBsc = await bscMulticall(TOKENABI, bscCalls)
        const balanceTokensPolygon = await polygonMulticall(TOKENABI, polygonCalls)
        const balanceTokensAvax = await avaxMulticall(TOKENABI, avaxCalls)
        const balanceTokensFtm = await ftmMulticall(TOKENABI, ftmCalls)

        
        // const balanceTokens = await multicall(TOKENABI, ethCalls)
        // const actualValue = parseFloat(balanceTokens.toString());
        
        const finalValues = [];
        let amountChainEthOwned = 0;
        let amountChainBscOwned = 0;
        let amountChainPolygonOwned = 0;
        let amountChainFtmOwned = 0;
        let amountChainAvaxOwned = 0;



        for(let i=0; i<allTokens[0][1].length; i++){
          allTokens[0][1][i].amount = balanceTokensEth[i]
          allTokens[0][1][i].tokenPrice = responsejson.data[allTokens[0][1][i].priceApi].usd
          const amountOwned = balanceTokensEth[i].toString() / 10 ** allTokens[0][1][i].decimals
          allTokens[0][1][i].amountUsd = parseFloat(amountOwned * responsejson.data[allTokens[0][1][i].priceApi].usd)
          amountChainEthOwned = amountChainEthOwned + parseFloat(amountOwned * responsejson.data[allTokens[0][1][i].priceApi].usd)
        }

        for(let i=0; i<allTokens[0][56].length; i++){
          allTokens[0][56][i].amount = balanceTokensBsc[i]
          allTokens[0][56][i].tokenPrice = responsejson.data[allTokens[0][56][i].priceApi].usd
          const amountOwned = balanceTokensBsc[i].toString() / 10 ** allTokens[0][56][i].decimals
          allTokens[0][56][i].amountUsd = parseFloat(amountOwned * responsejson.data[allTokens[0][56][i].priceApi].usd)
          amountChainBscOwned = amountChainBscOwned + parseFloat(amountOwned * responsejson.data[allTokens[0][56][i].priceApi].usd);
        }

        for(let i=0; i<allTokens[0][137].length; i++){
          allTokens[0][137][i].amount = balanceTokensPolygon[i]
          allTokens[0][137][i].tokenPrice = responsejson.data[allTokens[0][137][i].priceApi].usd
          const amountOwned = balanceTokensPolygon[i].toString() / 10 ** allTokens[0][137][i].decimals
          allTokens[0][137][i].amountUsd = parseFloat(amountOwned * responsejson.data[allTokens[0][137][i].priceApi].usd)
          amountChainPolygonOwned = amountChainPolygonOwned + parseFloat(amountOwned * responsejson.data[allTokens[0][137][i].priceApi].usd)
        }

        for(let i=0; i<allTokens[0][250].length; i++){
          allTokens[0][250][i].amount = balanceTokensFtm[i]
          allTokens[0][250][i].tokenPrice = responsejson.data[allTokens[0][250][i].priceApi].usd
          const amountOwned = balanceTokensFtm[i].toString() / 10 ** allTokens[0][250][i].decimals
          allTokens[0][250][i].amountUsd = parseFloat(amountOwned * responsejson.data[allTokens[0][250][i].priceApi].usd)
          amountChainFtmOwned = amountChainFtmOwned + parseFloat(amountOwned * responsejson.data[allTokens[0][250][i].priceApi].usd)
        }

        for(let i=0; i<allTokens[0][43114].length; i++){
          allTokens[0][43114][i].amount = balanceTokensAvax[i]
          allTokens[0][43114][i].tokenPrice = responsejson.data[allTokens[0][43114][i].priceApi].usd
          const amountOwned = balanceTokensAvax[i].toString() / 10 ** allTokens[0][43114][i].decimals
          allTokens[0][43114][i].amountUsd = parseFloat(amountOwned * responsejson.data[allTokens[0][43114][i].priceApi].usd)
          amountChainAvaxOwned = amountChainAvaxOwned+parseFloat(amountOwned * responsejson.data[allTokens[0][43114][i].priceApi].usd);
        }
        
  
        let ethTokens = clone(allTokens[0][1])
        let bscTokens = clone(allTokens[0][56])
        let polygonTokens = clone(allTokens[0][137])
        let ftmTokens = clone(allTokens[0][250])
        let avaxTokens = clone(allTokens[0][43114])

        if(ethBalance>0){
          ethTokens.push(
              {
              "address":"0x0",
              "name":"ETH",
              "decimals":"18",
              "chain":"1",
              "img":"https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
              "amount":ethBalance,
              "amountUsd": parseFloat(responsejson.data['ethereum'].usd) * (ethBalance.toString() / 10 ** 18),
              "tokenPrice": parseFloat(responsejson.data['ethereum'].usd)
            }
          )
          amountChainEthOwned = amountChainEthOwned + parseFloat(responsejson.data['ethereum'].usd) * (ethBalance.toString() / 10 ** 18);
        }

        if(bscBalance>0){
          bscTokens.push(
              {
              "address":"0x0",
              "name":"BNB",
              "decimals":"18",
              "img":"https://etherscan.io/token/images/bnb_28_2.png",
              "amount":bscBalance,
              "amountUsd": parseFloat(responsejson.data['binancecoin'].usd) * (bscBalance.toString() / 10 ** 18),
              "tokenPrice": parseFloat(responsejson.data['binancecoin'].usd),
              "chain":"56"
            }
          )
          amountChainBscOwned = amountChainBscOwned + parseFloat(responsejson.data['binancecoin'].usd) * (bscBalance.toString() / 10 ** 18);
        }

        if(polygonBalance>0){
          polygonTokens.push(
              {
              "address":"0x0",
              "name":"MATIC",
              "decimals":"18",
              "img":"https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912",
              "amount":polygonBalance,
              "amountUsd": parseFloat(responsejson.data['matic-network'].usd) * (polygonBalance.toString() / 10 ** 18),
              "tokenPrice": parseFloat(responsejson.data['matic-network'].usd),
              "chain":"137"
            }
          )
          amountChainPolygonOwned = amountChainPolygonOwned + parseFloat(responsejson.data['matic-network'].usd) * (polygonBalance.toString() / 10 ** 18);
        }
        
        if(ftmBalance > 0){
          ftmTokens.push(
            {
            "address":"0x0",
            "name":"FTM",
            "decimals":"18",
            "img":"https://ftmscan.com/token/images/wFtm_32.png",
            "amount":ftmBalance,
            "amountUsd": parseFloat(responsejson.data['fantom'].usd) * (ftmBalance.toString() / 10 ** 18),
            "tokenPrice": parseFloat(responsejson.data['fantom'].usd),
            "chain":"250"
          }
        )
          amountChainFtmOwned = amountChainFtmOwned + parseFloat(responsejson.data['fantom'].usd) * (ftmBalance.toString() / 10 ** 18);
        }

        if(avaxBalance>0){
          avaxTokens.push(
              {
              "address":"0x0",
              "name":"AVAX",
              "decimals":"18",
              "img":"https://snowtrace.io/token/images/avax_32.png",
              "amount":avaxBalance,
              "amountUsd": parseFloat(responsejson.data['avalanche-2'].usd) * (avaxBalance.toString() / 10 ** 18),
              "tokenPrice": parseFloat(responsejson.data['avalanche-2'].usd),
              "chain":"43114"
            }
          )
          amountChainAvaxOwned = amountChainAvaxOwned + parseFloat(responsejson.data['avalanche-2'].usd) * (avaxBalance.toString() / 10 ** 18);
        }
        
        let finalTokens = []



        switch(show) {
          case "bsc":
            finalTokens = [];
            bscTokens.forEach(element => {
              finalTokens.push(element)
            });
            break;
          case "eth":
            finalTokens = [];
            ethTokens.forEach(element => {
              finalTokens.push(element)
            });
            break;
          case "polygon":
            finalTokens = [];
            polygonTokens.forEach(element => {
              finalTokens.push(element)
            });
            break;
          case "avax":
            finalTokens = [];
            avaxTokens.forEach(element => {
              finalTokens.push(element)
            });
            break;
          case "ftm":
            finalTokens = [];
            ftmTokens.forEach(element => {
              finalTokens.push(element)
            });
            break;
          default:
            ethTokens.forEach(element => {
              finalTokens.push(element)
            });
            bscTokens.forEach(element => {
              finalTokens.push(element)
            });
            polygonTokens.forEach(element => {
              finalTokens.push(element)
            });
            avaxTokens.forEach(element => {
              finalTokens.push(element)
            });
            ftmTokens.forEach(element => {
              finalTokens.push(element)
            });
            break;
        }

        // ethTokens  = ethTokens.sort(function (a, b) {  return b.amountUsd - a.amountUsd;  });
        // bscTokens  = bscTokens.sort(function (a, b) {  return b.amountUsd - a.amountUsd;  });
        finalTokens  = finalTokens.sort(function (a, b) {  return b.amountUsd - a.amountUsd;  });

        for(let i=0; i<finalTokens.length; i++){
          const amountOwned = finalTokens[i].amount.toString() / 10 ** finalTokens[i].decimals
          networth_local = networth_local+finalTokens[i].amountUsd
          if(amountOwned > 0){
          
          let topChainBanner;
          switch(finalTokens[i].chain){
            case "56":
              topChainBanner = <sup>           
              <span style={{color:'orange', background:'black',borderRadius:'25px', padding:'3px', fontSize:'10px'}}>BSC</span>
            </sup>
              break
            case "137":
                topChainBanner = <sup>           
                <span style={{color:'white', background:'#8247e5',borderRadius:'25px', padding:'3px', fontSize:'10px'}}>POL</span>
              </sup>
                break
            case "250":
                topChainBanner = <sup>           
                <span style={{color:'white', background:'#001f68',borderRadius:'25px', padding:'3px', fontSize:'10px'}}>FTM</span>
              </sup>
                break
            case "43114":
                topChainBanner = <sup>           
                <span style={{color:'white', background:'#e84142',borderRadius:'25px', padding:'3px', fontSize:'10px'}}>AVA</span>
              </sup>
                break
            default:
              topChainBanner = <sup>           
              <span style={{color:'white', background:'#215CAF',borderRadius:'25px', padding:'3px', fontSize:'10px'}}>ETH</span>
            </sup>
            break;
          }
            
          finalValues.push(
            <a href={account == theAccount  ? `/portfolio/${finalTokens[i].chain}/${finalTokens[i].address}` : '/portfolio'}>
            <WalletItem className="row" style={{marginTop:'1%', cursor:'pointer'}}>
              
              <div className="col-1" style={{textAlign:'center'}}>
              <img src={finalTokens[i].img} width="40px" alt="token image" /> 

              </div>
              <div className="col-3 col-md-2" style={{display:'flex', alignItems:'center'}}>
              <Text>    {topChainBanner}           {finalTokens[i].name} 

  </Text>

              </div>
              <div className="col" style={{display:'flex', alignItems:'center'}} >
              <Text style={{width:'100%',textAlign:'right'}}>{toFixed(amountOwned)} <span style={{fontWeight:'bold'}}>(${parseFloat(amountOwned * finalTokens[i].tokenPrice).toFixed(2)})</span></Text>
  
              </div>
            </WalletItem>
            </a>
          )
        }
      }
  
        // get eth balance 
        setValuechain([amountChainEthOwned.toFixed(2), amountChainBscOwned.toFixed(2), amountChainPolygonOwned.toFixed(2), amountChainFtmOwned.toFixed(2), amountChainAvaxOwned.toFixed(2)])
  
        setNetworth(networth_local)
        setTokens(finalValues)
        setLoading(false)

      }
    }catch(err){
      setLoading(false)
      console.log(err)
    }
   

  },[account, customaddr, show])


  const filterToken = async(theId) => {
    console.log(theId)
    if(activefilter == theId){
      setCustom([])
      setActivefilter('')
    } else {
      let filteredTokens = []
      tokens.forEach(element => {
        console.log(element.props.href, theId)
        let url = element.props.href.replace('/portfolio/','')
        url = url.split('/')[0]
        if(url == theId ){
          filteredTokens.push(element)
        }
  
      });
      setCustom(filteredTokens)
      setActivefilter(theId)
    }

  }


  return (
    <>
      <div>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xxl" color="primary" mb="24px" style={{textAlign:'center'}}>
              {t('Portfolio')}
            </Heading>
            <Heading scale="md" color="text" style={{textAlign:'center'}}>
              {t('Your digital networth in real time')}
            </Heading>
            {/* <Heading scale="md" color="text" style={{textAlign:'center'}}>
              {t('in one click')}
            </Heading> */}

          </Flex>
        </Flex>
      </div>
      <Page>
          <div className="row">
            <div className="col">
                <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label" style={{width:'100%'}}> <Text>Address </Text>           <input type="text" onChange={(event) => validateAddress(event.target.value)} className="form-control" id="exampleFormControlInput1" placeholder="0xe3C601b1FC6564ebf5603fCaD7956697761E39Db" />
                </label>
                </div>
                <div className="row">
                  <AppHeader4 />
                </div>
                <div className="row" style={{marginTop:'3%'}}>
                <Card style={{padding:'20px'}}>
                  <div className="row">
                    <div className="col">
                      <Heading as="h1" scale="xl">                           <img src="https://zapper.fi/images/icons/wallet.svg"  alt="wallet"  />
                 <span>  My Wallet </span></Heading>
                    </div>
                    <div className="col" >
                      {loading ?                     <div class="spinner-border text-light" role="status" style={{float:'right'}} /> :                       <Heading as="h1" scale="xl" style={{textAlign:'right'}}>${numberWithCommas(parseFloat(networth).toFixed(2))}</Heading>
}
                    </div>
                    <div className="col-12">
                    <Text>{forr}</Text>
                    </div>
                    <div className="col-12">
                      <div className="row" style={{marginTop:'3%'}}>
                        <div className="col-4 col-md-2" style={{cursor:'pointer', textAlign:'center'}} onClick={() => filterToken('56')}>
                          <span style={{color:'orange', background:'black',borderRadius:'25px', padding:'8px'}}>BSC ${valuechain[1]}</span>
                        </div>
                        <div className="col-4 col-md-2" style={{cursor:'pointer', textAlign:'center'}} onClick={() => filterToken('137')}>
                          <span style={{color:'white', background:'#8247e5',borderRadius:'25px', padding:'8px'}}>POL ${valuechain[2]}</span>                       
                         </div>
                         <div className="col-4 col-md-2" style={{cursor:'pointer', textAlign:'center'}} onClick={() => filterToken('250')}>
                         <span style={{color:'white', background:'#001f68',borderRadius:'25px', padding:'8px'}}>FTM ${valuechain[3]}</span>
                         </div>
                         <div className="col-4 col-md-2 d-none d-sm-block" style={{cursor:'pointer', textAlign:'center'}} onClick={() => filterToken('43114')}>
                         <span style={{color:'white', background:'#e84142',borderRadius:'25px', padding:'8px'}}>AVA ${valuechain[4]}</span>
                         </div>
                         <div className="col-4 col-md-2 d-none d-sm-block" style={{cursor:'pointer', textAlign:'center'}} onClick={() => filterToken('1')}>
                         <span style={{color:'white', background:'#215CAF',borderRadius:'25px', padding:'8px'}}>ETH ${valuechain[0]}</span> 
                         </div>
                      </div>
                      <div className="row d-sm-none" style={{marginTop:'9%'}}>
                      <div className="col-6 col-md-2" style={{cursor:'pointer', textAlign:'center'}}>
                         <span style={{color:'white', background:'#e84142',borderRadius:'25px', padding:'8px'}}>AVA ${valuechain[4]}</span>
                         </div>
                         <div className="col-6 col-md-2" style={{cursor:'pointer', textAlign:'center'}}>
                         <span style={{color:'white', background:'#215CAF',borderRadius:'25px', padding:'8px'}}>ETH ${valuechain[0]}</span> 
                         </div>
                      </div>
                    </div>
                  </div>
                  <hr /> 
                  <div>
                    
                    {loading ?  <div class="spinner-border text-light" style={{margin:'0 auto', display:'block'}} role="status" /> : activefilter == '' ? tokens : custom}
                  </div>
                </Card>
                </div>
            </div>

          </div>
      </Page>
    </>
  )
}

export default Pools
