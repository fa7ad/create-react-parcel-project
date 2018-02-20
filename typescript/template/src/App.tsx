import * as React from "react";
import "./App.css";

const randomColorHex = (): string => {
  const rand = (max: number): number => Math.floor(Math.random() * max);
  const color = (rand(255) << 16) + (rand(255) << 8) + rand(255);
  return "#" + `000000${color}`.slice(-6);
};

class App extends React.PureComponent {
  public state = {
    css: {
      backgroundColor: "#111"
    }
  };

  public render() {
    return (
      <div className="App" style={this.state.css}>
        <button onClick={this.changeColor}>Click ME!</button>
      </div>
    );
  }

  private changeColor = (e: React.FormEvent<HTMLButtonElement>) => {
    this.setState({
      css: {
        backgroundColor: randomColorHex()
      }
    });
  };
}

export default App;
