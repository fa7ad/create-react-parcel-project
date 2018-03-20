import React from 'react'
import './App.css'

const randomColorHex = () => {
  const rand = max => Math.floor(Math.random() * max)
  const color = (rand(255) << 16) + (rand(255) << 8) + rand(255)
  return '#' + `000000${color.toString(16)}`.slice(-6)
}

class App extends React.PureComponent {
  state = {
    css: {
      backgroundColor: '#111'
    }
  }

  render () {
    return (
      <div className='App' style={this.state.css}>
        <button onClick={this.changeColor}>
          Click ME!
        </button>
      </div>
    )
  }

  changeColor = e => {
    this.setState({
      css: {
        backgroundColor: randomColorHex()
      }
    })
  }
}

export default App
