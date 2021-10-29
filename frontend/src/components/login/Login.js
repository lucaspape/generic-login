import './Login.css';
import React from 'react'
import TextInput from '../TextInput/TextInput.js';

const axios = require('axios');

class Login extends React.Component {
  state = {
    input_fields: [],
    values: {}
  }

  constructor(){
    super();

    this.loaded = false;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onTextFieldChange = this.onTextFieldChange.bind(this);
  }

  handleSubmit(event){
    event.preventDefault();

    const origin = new URLSearchParams(this.props.location.search).get('origin');

    if(origin){
      axios.post('api/login?origin=' + origin, this.state.values, { validateStatus: false }).then(response => {
        if(response.data.redirect){
          window.location.href = response.data.redirect;
        }
      });
    }else{
      console.log("Origin not defined!");
    }
  }

  onTextFieldChange(name, value){
    let values = this.state.values;
    values[name] = value;

    this.setState({ values: values });
  }

  render(){
    if(!this.loaded){
      this.loaded = true;

      let input_fields = [];

      input_fields.push(<TextInput name='username' display_name='Username' type='text' onChange={this.onTextFieldChange}/>);
      input_fields.push(<TextInput name='password' display_name='Password' type='password' onChange={this.onTextFieldChange}/>);

      this.setState({ input_fields: input_fields });
    }

    return(
      <div className='login'>
        <form onSubmit={this.handleSubmit}>

          <div className='container'>
            {this.state.input_fields}

            <button type="submit">Login</button>
          </div>

          <div>
            <span className='create'>No account? Register <a href='/register'>here</a></span>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
