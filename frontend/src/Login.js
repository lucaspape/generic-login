import React from 'react'

const axios = require('axios');

class Login extends React.Component {
  state = {
    username: '',
    password: ''
  }

  constructor(){
    super();

    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameInputChange(event){
    this.setState({ username: event.target.value });
  }

  handlePasswordInputChange(event){
    this.setState({ password: event.target.value });
  }

  handleSubmit(event){
    event.preventDefault();

    const origin = new URLSearchParams(this.props.location.search).get('origin');

    if(origin){
      axios.post('api/login?origin=' + origin, { username: this.state.username, password: this.state.password }, { validateStatus: false }).then(response => {
        if(response.data.redirect){
          window.href = response.data.redirect;
        }
      });
    }else{
      console.log("Origin not defined!");
    }
  }

  render(){
    return(
      <div>
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input type="text" value={this.state.username} onChange={this.handleUsernameInputChange}/>
        </label>

        <label>
          Password:
          <input type="password" value={this.state.password} onChange={this.handlePasswordInputChange}/>
        </label>

        <input type="submit" value="Login"/>
      </form>
      </div>
    );
  }
}

export default Login;
