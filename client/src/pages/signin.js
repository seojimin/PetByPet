import React, { Component } from "react";

class Signin extends Component {
  state = {
    userId: null
  }
  
  setUserId = (userId) => {
    this.setState({ userId: userId });
  };

  handleLogin = () => {
    alert(this.state.userId);
  };

  render() {
    return (
      <div>
        <form id="signin-form">
          <label>아이디</label>
          <input id="userId" type="text" onChange={v => this.setUserId(v.target.value) }></input>
          <label>비밀번호</label>
          <input id="userPassword" type="password"></input>
          </form>
          <button onClick={this.handleLogin}>sign in</button>
      </div>
    );
  }
}

export default Signin;