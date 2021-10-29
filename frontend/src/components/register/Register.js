import './Register.css';

import React from 'react';

import TextInput from '../TextInput/TextInput.js';

const axios = require('axios');

class Register extends React.Component {
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

    axios.post('api/register', this.state.values, { validateStatus: false }).then(response => {
      if(response.data.redirect){
        window.location.href = '/';
      }
    });
  }

  onTextFieldChange(name, value){
    let values = this.state.values;
    values[name] = value;

    this.setState({ values: values });
  }

  render(){
    if(!this.loaded){
      axios.get('api/fields', { validateStatus: false }).then(response => {
        let fields = [];

        response.data.forEach((field) => {
            fields.push(<TextInput name={field.name} display_name={field.display_name} type={field.type} onChange={this.onTextFieldChange}/>)
        });

        this.setState({input_fields: fields});
      });

      this.loaded = true;
    }

    return(
      <div className='register'>
        <form onSubmit={this.handleSubmit}>

          <div className='container'>
            {this.state.input_fields}

            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Register;
