import React from 'react'
import { withRouter } from 'next/router'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux'
import thunk from 'redux-thunk'
import { MuiThemeProvider } from 'material-ui/styles'
import Reboot from 'material-ui/Reboot'
import getPageContext from './getPageContext'

import models from '../models'

const store = createStore(
  combineReducers(models),
  applyMiddleware(thunk),
  // applyMiddleware(store => next => action => {
  //   const result = next(action)
  //   return result instanceof Promise ? result.catch(err =>  store.dispatch(App.notify(err.message))) : Promise.resolve(result)
  // })
)

function withRoot(Component) {
  Component = connect(state => state)(Component)

  class WithRoot extends React.Component {
    pageContext = null

    static async getInitialProps(ctx) {
      if (Component.getInitialProps) {
        return Component.getInitialProps(ctx)
      }

      return {}
    }

    componentWillMount() {
      this.pageContext = this.props.pageContext || getPageContext()
    }

    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side')
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    }

    render() {
      // MuiThemeProvider makes the theme available down the React tree thanks to React context.
      return (
        <Provider store={store}>
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* Reboot kickstart an elegant, consistent, and simple baseline to build upon. */}
            <Reboot />
            <Component {...this.props} />
          </MuiThemeProvider>
        </Provider>
      )
    }
  }

  return withRouter(WithRoot)
}

export default withRoot