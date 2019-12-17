import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    customers: null
  };
  componentDidMount() {
    // Call our fetch function below once the component mounts
    this.callBackendAPI()
      .then(res => this.setState({ customers: res.customers }))
      .catch(err => console.log(err));

  }
  // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch("/customers");
    const body = await response.json();
    console.log(body);
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {JSON.stringify(this.state.customers)}
        </header>
        <table>
          <thead>
            <tr><th>no.</th><th>name</th><th>email</th></tr>
          </thead>
          <tbody>
            {this.state.customers && this.state.customers.map( customer => (
              <tr>
                <td>{customer.customerNum}</td>
                <td>{customer.firstName} {customer.lastName}</td>
                <td>{customer.email}</td>
              </tr> 
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
