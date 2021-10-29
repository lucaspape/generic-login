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

    console.log(JSON.stringify(this.props));

    if(this.props.match.params.origin){
      axios.post('api/login?origin=' + this.props.match.params.origin, { username: this.state.username, password: this.state.password }, { validateStatus: false }).then(response => {
        console.log(response.data);
      });
    }else{
      console.log("Origin not defined!");

      console.log(this.props);
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

export default withRouter(Login);
