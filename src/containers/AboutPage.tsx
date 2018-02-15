import * as React from "react";
import { Link } from 'react-router-dom';

export default class AboutPage extends React.Component {
  render() {
    return (
      <div className="main-wrapper">
        <h1>About</h1>
        <h2>Tech Stack Used For This App</h2>
        <ul>
          <li><a href="https://ant.design/docs/react/introduce">Ant Design Components</a></li>
          <li><a href="https://reactjs.org/docs/hello-world.html">React</a></li>
          <li><a href="https://github.com/mobxjs/mobx-state-tree">MobX-State-Tree</a></li>
          <li><a href="https://www.typescriptlang.org/docs/home.html">TypeScript</a></li>
          <li><a href="https://webpack.js.org/concepts/">WebPack</a></li>
          <li><a href="https://yarnpkg.com/lang/en/docs/">Yarn</a></li>
          <li><a href="https://facebook.github.io/jest/docs/en/getting-started.html">Jest</a></li>
          <li><a href="http://airbnb.io/enzyme/docs/api/">Enzyme</a></li>
          <li><a href="https://nodejs.org/en/docs/">Node</a></li>
        </ul>
        <Link to="/">Go back to the main page</Link>
      </div>
    );
  }
}