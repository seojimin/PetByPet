import React, { Component } from "react";
import {BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Signin from "./pages/signin"; 

class App extends Component {


  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Signin}></Route>
          <Route path="/signin" component={Signin}></Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
