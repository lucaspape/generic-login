import React from 'react'

const axios = require('axios');

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: ''
  }

  constructor(){
    super();

    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
    this.handleFirstNameInputChange = this.handleFirstNameInputChange.bind(this);
    this.handleLastNameInputChange = this.handleLastNameInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameInputChange(event){
    this.setState({ username: event.target.value });
  }

  handlePasswordInputChange(event){
    this.setState({ password: event.target.value });
  }

  handleEmailInputChange(event){
    this.setState({ email: event.target.value });
  }

  handleFirstNameInputChange(event){
    this.setState({ firstName: event.target.value });
  }

  handleLastNameInputChange(event){
    this.setState({ lastName: event.target.value });
  }

  handleSubmit(event){
    event.preventDefault();

    axios.post('api/register', { username: this.state.username, password: this.state.password, email: this.state.email, firstName: this.state.firstName, lastName: this.state.lastName }, { validateStatus: false }).then(response => {
      if(response.data.redirect){
        window.location.href = '/';
      }
    });
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

        <label>
          Email:
          <input type="text" value={this.state.email} onChange={this.handleEmailInputChange}/>
        </label>

        <label>
          First Name:
          <input type="text" value={this.state.firstName} onChange={this.handleFirstNameInputChange}/>
        </label>

        <label>
          Last Name:
          <input type="text" value={this.state.lastName} onChange={this.handleLastNameInputChange}/>
        </label>

        <input type="submit" value="Register"/>
      </form>
      </div>
    );
  }
}

export default Login;
