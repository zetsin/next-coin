import cctx from './cctx'

export const CCTX = cctx.actions

export default {
  cctx: genReducer(cctx)
}

function genReducer(model) {
  return function(state = model.state, action) {
    const namespace = `${model.namespace}/`
    const index = action.type.indexOf(namespace)
    if(!index) {
      const type = action.type.slice(namespace.length)
      const reducer = model.reducers[type]
      if(reducer) {
        return reducer(state, action.payload)
      }
    }
    return state
  }
}
