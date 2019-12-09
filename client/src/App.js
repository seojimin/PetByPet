import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    data: null
  };
  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));

      this.setState({data:"제발 돼라" });
  }
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch("/server");
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>{this.state.data}</p>
        </header>
      </div>
    );
  }
}

export default App;
