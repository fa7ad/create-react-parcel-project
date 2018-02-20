import * as React from 'react'
import * as ReactDOM from 'react-dom'

import './index.css'
import App from './App'

const render = () :void => {
  ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
}

if (module && module.hot) {
  module.hot.accept(render)
}

render()
