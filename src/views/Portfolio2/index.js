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

import Page from 'components/Layout/Page'

import AppHeader4 from 'components/App/AppHeader5'
// import multicall from 'utils/multicall'
import TOKENABI from 'config/abi/erc20.json'
import allTokens from './allTokens.json'
import Web3 from 'web3'
import multicallabi from 'config/abi/Multicall.json'
import { Interface } from '@ethersproject/abi'
import {
  useParams
} from "react-router";
const axios = require('axios').default;
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import { symbolName } from 'typescript'

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
  let { urlChain, address } = useParams();


  const [tokens, setTokens] = React.useState([])
  const [networth, setNetworth] = React.useState()
  const [customaddr, setCustomaddr] = React.useState()
  const [forr, setForr] = React.useState()

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


  const [thesymbol, setThesymbol] = React.useState('')
  const [owned, setOwned] = React.useState('')
  const [dexurl, setDexurl] = React.useState('')
  const [chartdata, setChartdata] = React.useState({datasets:[]})
  const [chartdata2, setChartdata2] = React.useState({datasets:[]})


  const allEthBalance = async(acc) => {
    const web3eth = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"))
    const ethBalance = await web3eth.eth.getBalance(acc)
    const ethBlock = await web3eth.eth.getBlockNumber()

    const web3bsc = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.ninicoin.io"))
    const bscBalance = await web3bsc.eth.getBalance(acc)
    const bscBlock = await web3bsc.eth.getBlockNumber()

    const web3polygon = new Web3(new Web3.providers.HttpProvider("https://polygon-rpc.com/"))
    const polygonBalance = await web3polygon.eth.getBalance(acc)
    const polygonBlock = await web3polygon.eth.getBlockNumber()

    const web3avax = new Web3(new Web3.providers.HttpProvider("https://api.avax.network/ext/bc/C/rpc"))
    const avaxBalance = await web3avax.eth.getBalance(acc)
    const avaxBlock = await web3avax.eth.getBlockNumber()

    const web3fantom = new Web3(new Web3.providers.HttpProvider("https://rpc.ftm.tools/"))
    const ftmBalance = await web3fantom.eth.getBalance(acc)
    const ftmBlock = await web3fantom.eth.getBlockNumber()

    return ({ethBalance, bscBalance, polygonBalance, avaxBalance, ftmBalance, ethBlock, bscBlock, polygonBlock, avaxBlock, ftmBlock})
  }

  React.useEffect(async () => {
    try{
      if(account || customaddr){
        let calls = [];
        if(address !== '0x0'){
          calls = [{
            address: address,
            name: 'balanceOf',
            params: [account],
          }, 
          {
            address: address,
            name: 'decimals',
            params: [],
          },
          {
            address: address,
            name: 'symbol',
            params: [],
          }     
        ]
        }
        let multiCallToCall;
        let standardCall;
        let standardBalances = await allEthBalance(account);
        console.log('balances is ', standardBalances.bscBalance)
        let otherSymbol;
        let biqueryNetwork;
        let blocks = []
        let blockTime = 0
        let dayBlock = 0
        let currentBlock = 0;
        switch(urlChain){
          case "56":
            multiCallToCall = await bscMulticall(TOKENABI, calls);
            setDexurl(`https://bsccustom.liquidswap.trade/swap?inputCurrency=${address == '0x0' ? 'ETH' : address}&outputCurrency=${address == '0x0' ? '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d':'ETH'}&bg=212129&slippage=50&card=212129&dark=dark`)
            standardCall = 'binancecoin'
            otherSymbol = 'BNB'
            currentBlock = standardBalances.bscBlock
            standardBalances = standardBalances.bscBalance
            biqueryNetwork = 'bsc'
            blockTime = 3;
            dayBlock = Math.round(24 * 60 * 60 / blockTime);
              currentBlock = standardBalances.bscBlock

            break;
          case "137":
            multiCallToCall = await polygonMulticall(TOKENABI, calls);
            setDexurl(`https://polygoncustom.liquidswap.trade/swap?inputCurrency=${address == '0x0' ? 'ETH' : address}&outputCurrency=${address == '0x0' ? '0x2791bca1f2de4661ed88a30c99a7a9449aa84174':'ETH'}&bg=212129&slippage=50&card=212129&dark=dark`)
            standardCall = 'matic-network'
            otherSymbol = 'MATIC'
            currentBlock = standardBalances.polygonBlock
            standardBalances = standardBalances.polygonBalance
            biqueryNetwork = 'matic'
            blockTime = 0.9;
            dayBlock = Math.round(24 * 60 * 60 / blockTime);
            blocks.push(currentBlock, currentBlock - dayBlock, currentBlock - 2*dayBlock, currentBlock - 3*dayBlock, currentBlock - 4*dayBlock, currentBlock - 5*dayBlock)
            break;
          case "250":
            multiCallToCall = await ftmMulticall(TOKENABI, calls);
            setDexurl(`https://ftmcustom.liquidswap.trade/swap?inputCurrency=${address == '0x0' ? 'ETH' : address}&outputCurrency=${address == '0x0' ? '0x04068da6c83afcfa0e13ba15a6696662335d5b75':'ETH'}&bg=212129&slippage=50&card=212129&dark=dark`)
            standardCall = 'fantom'
            otherSymbol = 'FTM'
            currentBlock = standardBalances.ftmBlock
            standardBalances = standardBalances.ftmBalance
            biqueryNetwork = 'fantom'
            blockTime = 2.3;
            dayBlock = Math.round(24 * 60 * 60 / blockTime);
            blocks.push(currentBlock, currentBlock - dayBlock, currentBlock - 2*dayBlock, currentBlock - 3*dayBlock, currentBlock - 4*dayBlock, currentBlock - 5*dayBlock)
            break;
          case "43114":
            multiCallToCall = await avaxMulticall(TOKENABI, calls);
            setDexurl(`https://avaxcustom.liquidswap.trade/swap?inputCurrency=${address == '0x0' ? 'ETH' : address}&outputCurrency=${address == '0x0' ? '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664':'ETH'}&bg=212129&slippage=50&card=212129&dark=dark`)
            standardCall = 'avalanche-2'
            otherSymbol = 'AVAX'
            currentBlock = standardBalances.avaxBlock
            standardBalances = standardBalances.avaxBalance
            biqueryNetwork = 'avalanche'
            blockTime = 3;
             dayBlock = Math.round(24 * 60 * 60 / blockTime);
            blocks.push(currentBlock, currentBlock - dayBlock, currentBlock - 2*dayBlock, currentBlock - 3*dayBlock, currentBlock - 4*dayBlock, currentBlock - 5*dayBlock)
            break;
          default:
            multiCallToCall = await ethMulticall(TOKENABI, calls);
            setDexurl(`https://ethcustom.liquidswap.trade/swap?inputCurrency=${address == '0x0' ? 'ETH' : address}&outputCurrency=${address == '0x0' ? '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48':'ETH'}&bg=212129&slippage=50&card=212129&dark=dark`)
            standardCall = 'ethereum'
            otherSymbol = 'ETH'
            currentBlock = standardBalances.ethBlock

            standardBalances = standardBalances.ethBalance
            biqueryNetwork = 'ethereum'
            blockTime = 15;
            dayBlock = Math.round(24 * 60 * 60 / blockTime);
            blocks.push(currentBlock, currentBlock - dayBlock, currentBlock - 2*dayBlock, currentBlock - 3*dayBlock, currentBlock - 4*dayBlock, currentBlock - 5*dayBlock)

            break;
        }
        let theCoinGecko = allTokens[0][urlChain];
        if(address == '0x0'){
          theCoinGecko.push({
            'address':'0x0',
            'priceApi':standardCall
          })
        }

        theCoinGecko = theCoinGecko.find(obj => {
          return obj.address.toLowerCase() == address.toLowerCase()
        })



        let graphResults = await axios.get(`https://api.coingecko.com/api/v3/coins/${theCoinGecko.priceApi}/market_chart?vs_currency=usd&days=30&interval=daily`)

        const ownedAmount = address == '0x0' ? standardBalances / 10 ** 18 : toFixed(multiCallToCall[0] / 10 ** multiCallToCall[1])
        const theValues = []
        for(let i=0; i< graphResults.data.prices.length; i++){
          theValues.push(ownedAmount * graphResults.data.prices[i][1])
        }

        const data = {
          labels: [30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1],
          datasets: [
            {
              label: `${address == '0x0' ? otherSymbol : multiCallToCall[2]} Historical Wallet Data in USD (30 days)`,
              data: theValues,
              fill: true,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)"
            },
          ]
        };

        setChartdata(data)

        setThesymbol(address == '0x0' ? otherSymbol : multiCallToCall[2])
        setOwned(ownedAmount)

        const resultsGraphql = []

        // for(let i=0; i< blocks.length; i++){
          if(blocks.length !== 0 && address !== '0x0'){
            for(let i=0; i< blocks.length; i++){
              const graphqldata = await axios.post('https://graphql.bitquery.io', {
                query: `query{
                    ethereum(network: ${biqueryNetwork}) {
                      address(address: {is: "${account}"}) {
                        address
                        balances(height: {lteq: ${blocks[i]}}, currency:{in:["${address}"]}) {
                          currency {
                            symbol
                            address
                            name
                            decimals
                          }
                          value
                        }
                      }
                    }
                }`,
              }, {
                headers: {
                  'x-api-key':'BQYkRX3quegRg8ZJKqJieETQLFoEbWIh'
                }
              })
              console.log(graphqldata)
              resultsGraphql.push(
                graphqldata.data.data[biqueryNetwork].address[0].balances[0].value
              )
            }
          }


        console.log("graphql is ", resultsGraphql)

        const data2 = {
          labels: [5,4,3,2,1],
          datasets: [
            {
              label: `${address == '0x0' ? otherSymbol : multiCallToCall[2]} Historical Balance (5 days)`,
              data: resultsGraphql,
              fill: true,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)"
            },
          ]
        };
        setChartdata2(data2)

      }
    }catch(err){
      console.log(err)
    }
   

  },[account, customaddr])


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
                {/* <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label" style={{width:'100%'}}> <Text>Address </Text>           <input type="text" onChange={(event) => validateAddress(event.target.value)} className="form-control" id="exampleFormControlInput1" placeholder="0xe3C601b1FC6564ebf5603fCaD7956697761E39Db" />
                </label>
                </div> */}
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
                      <Heading as="h1" scale="xl" style={{textAlign:'right'}}>
                      {(owned)} {thesymbol}
                        </Heading>
                    </div>
                    <div className="col-12">
                    <Text>{forr}</Text>

                    </div>
                  </div>
                  <hr /> 
                  <div>
                    <div className="row">
                      <div className="col-12 col-md-6">
                      <Line data={chartdata} />
                      <Line data={chartdata2} />

                      </div>
                      <div className="col-12 col-md-6">
                      <iframe scrolling="no" height="500" width="350" style={{width:"350px",height:"500px", border: "none", borderRadius: "19px", boxShadow: "rgba(0, 0, 0, 0.1) 3px 3px 10px 4px", display: "block", margin:"0 auto"}} src={dexurl} />
                      </div>
                    </div>
                    {/* {tokens} */}
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
