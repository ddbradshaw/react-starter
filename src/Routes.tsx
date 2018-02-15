import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import TodoPage from './containers/TodoPage'
import NotFoundPage from './containers/NotFoundPage'
import AboutPage from './containers/AboutPage'
import { ITodoStore } from './models/TodoStore'
import { Provider } from "mobx-react";

interface IRoutesProps {
  todoStore: ITodoStore
}

// This pages sets up the various routes to the application
// The router is wrapped with a provider to allow store injection down the chain
// The Provider was moved from the index to avoid HMR warnings
export default class Routes extends React.Component<IRoutesProps, undefined> {
  render() {
    return (
      <Provider todoStore={this.props.todoStore}>
        <Router>
          <Switch>
            <Route path='/' exact component={TodoPage}/>
            <Route path='/about' component={AboutPage}/>
            <Route path='*' component={NotFoundPage}/>
          </Switch>
        </Router>
      </Provider>
    );
  }
}