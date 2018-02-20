import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";
import "./index.css";

const render = (Com: React.ComponentClass): any =>
  ReactDOM.render(<Com />, document.getElementById("root") as HTMLElement);

declare var module: any;

if (module && module.hot) {
  module.hot.accept(render.bind(null, App));
}

render(App);
