import React, { lazy } from 'react'
import { Router, Redirect, Route, Switch } from 'react-router-dom'
import { ResetCSS } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import useEagerConnect from 'hooks/useEagerConnect'
import { usePollBlockNumber } from 'state/block/hooks'
// import { usePollCoreFarmData } from 'state/farms/hooks'
// import { useFetchProfile } from 'state/profile/hooks'
import { DatePickerPortal } from 'components/DatePicker'
import GlobalStyle from './style/Global'
import Menu from './components/Menu'
import SuspenseWithChunkError from './components/SuspenseWithChunkError'
import { ToastListener } from './contexts/ToastsContext'
import history from './routerHistory'
// Views included in the main bundle
import Swap from './views/Swap'
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './views/AddLiquidity/redirects'
import RedirectOldRemoveLiquidityPathStructure from './views/RemoveLiquidity/redirects'
import { RedirectPathToSwapOnly, RedirectToSwap } from './views/Swap/redirects'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
// const Farms = lazy(() => import('./views/Farms'))
// const FarmAuction = lazy(() => import('./views/FarmAuction'))
// const Lottery = lazy(() => import('./views/Lottery'))

const POOLS = lazy(() => import('./views/Pools'))
const NotFound = lazy(() => import('./views/NotFound'))


const AddLiquidity = lazy(() => import('./views/AddLiquidity'))
const Liquidity = lazy(() => import('./views/Pool'))
const BuildDex = lazy(() => import('./views/BuildDex/index'))
const Portfolio = lazy(() => import('./views/Portfolio/index'))
const Portfolio2 = lazy(() => import('./views/Portfolio2/index'))

const PoolFinder = lazy(() => import('./views/PoolFinder'))
const RemoveLiquidity = lazy(() => import('./views/RemoveLiquidity'))

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const App: React.FC = () => {
  usePollBlockNumber()
  useEagerConnect()
  // useFetchProfile()
  // usePollCoreFarmData()

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <SuspenseWithChunkError fallback={<> </>}>
          <Switch>
                        {/* Using this format because these components use routes injected props. We need to rework them with hooks */}
                        {/* <Route path="/" exact component={Swap} />           */}
            <Route exact strict path="/swap" component={Swap} />
            <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
            <Route exact strict path="/send" component={RedirectPathToSwapOnly} />

            <Route exact strict path="/find" component={PoolFinder} />
            <Route exact strict path="/liquidity" component={Liquidity} />
            <Route exact strict path="/create" component={RedirectToAddLiquidity} />
            <Route exact path="/add" component={AddLiquidity} />
            <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact path="/create" component={AddLiquidity} />
            <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
            <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
            <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
            <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />

            {/* Redirect */}
            <Route path="/pool">
              <Redirect to="/liquidity" />
            </Route>

            <Route path="/pools">
              <POOLS />
            </Route>

            <Route path="/make-a-dex">
              <BuildDex />
            </Route>

            <Route path="/portfolio/:urlChain/:address">
              <Portfolio2 />
            </Route>

            <Route path="/portfolio">
              <Portfolio />
            </Route>

            


            <Route path="/">
              <Redirect to="/swap?outputCurrency=0x7fe8dac51394157811c71bbf74c133a224a9ff44" />
            </Route>

            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <ToastListener />
      <DatePickerPortal />
    </Router>
  )
}

export default React.memo(App)
