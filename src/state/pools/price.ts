import { useEffect, useState } from 'react'

type ApiResponse = {
  prices: {
    [key: string]: string
  }
}

/**
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */

const useGetPriceDataCustom = async (token : string) => {

    try{
        const api = `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`
        const response = await fetch(api)
        const res: ApiResponse = await response.json()      /// => res.binancecoin.usd
        
      
        return res[token].usd;
    }catch(err){
        return "0";
    }

}

export default useGetPriceDataCustom
