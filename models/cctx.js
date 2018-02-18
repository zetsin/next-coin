export default {
  namespace: 'cctx',

  state: {
    tickers: []
  },

  actions: {
    fetchTickers: (coin) => {
      return (dispatch, getState) => {
        const ccxt = require ('ccxt')

        ccxt.exchanges.forEach(exchange => {
          exchange = new ccxt[exchange]()
          exchange.proxy = 'http://localhost:8080/'

          dispatch({
            type: 'cctx/addTicker',
            payload: {
              test: Math.random()
            }
          })

          // exchange.fetchTicker(`${coin}/USD`).then(ticker => {
          //   if(ticker) {
          //     ticker.id = exchange.id
          //     delete ticker.info

          //     console.log(ticker)
          //     dispatch({
          //       type: 'cctx/addTicker',
          //       payload: ticker
          //     })
          //   }
          // })
        })
      }
    }
  },

  reducers: {
    addTicker: (state, payload) => {
      return {
        ...state,
        tickers: [
          ...state.tickers,
          payload
        ]
      }
    },
    save: (state, payload) => {
      return {
        ...state,
        ...payload
      }
    }
  }
}