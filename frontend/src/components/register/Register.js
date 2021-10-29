import './Register.css';

import React from 'react';
import { useRef } from 'react';

import TextInput from '../TextInput/TextInput.js';

const axios = require('axios');

class Register extends React.Component {
  state = {
    input_fields: [],
    values: {},
    reference_names: []
  }

  constructor(){
    super();

    this.loaded = false;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onTextFieldChange = this.onTextFieldChange.bind(this);
  }

  handleSubmit(event){
    event.preventDefault();

    let valid = true;

    this.state.reference_names.forEach((item) => {
      if(!this[item].current.validate()){
        valid = false;
      }
    });

    if(valid){
      axios.post('api/register', this.state.values, { validateStatus: false }).then(response => {
        if(response.data.redirect){
          window.location.href = '/';
        }
      });
    }else{
      console.log('At least one field not valid');
    }
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
        let reference_names = [];

        response.data.forEach((field) => {
            this[field.name] = React.createRef();
            reference_names.push(field.name);
            let confirm = field.type === 'password';
            fields.push(<TextInput ref={this[field.name]} confirm={confirm} name={field.name} display_name={field.display_name} type={field.type} onChange={this.onTextFieldChange}/>)
        });

        this.setState({input_fields: fields, reference_names: reference_names});
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
