import React, { Component } from 'react'

import { Link, Switch, Route } from 'react-router-dom'

/* Import Pages */
import OnePage from './pages/OnePage'
import TwoPage from './pages/TwoPage'
import ThreePage from './pages/ThreePage'
import NotFoundPage from './pages/NotFoundPage'

class App extends Component {
  render() {
    return (
      <div className="App">
        <nav className="App_Nav">
          <Link to="/one" className="App_Nav-item">Page one</Link>
          <Link to="/two" className="App_Nav-item">Page two</Link>
          <Link to="/three" className="App_Nav-item">Page three</Link>
          <Link to="/foobar" className="App_Nav-item">This page doesn't exist</Link>
        </nav>
        <div className="App_Content">
          <Switch>
            <Route path="/one" component={OnePage} />
            <Route path="/two" component={TwoPage} />
            <Route path="/three" component={ThreePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App
