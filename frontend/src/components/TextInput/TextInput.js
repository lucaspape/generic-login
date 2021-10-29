import './TextInput.css';

import React from 'react';

class TextInput extends React.Component {
  constructor(){
    super();

    this.onInputChange = this.onInputChange.bind(this);
    this.onConfirmInputChange = this.onConfirmInputChange.bind(this);
  }

  state = {
    value: '',
    confirm_value: '',
    confirm_valid: true,
    confirm_message: '',
    valid: false,
    valid_message: ''
  }

  onInputChange(event){
    let valid = false;

    if(event.target.value){
      valid = true;
    }

    let confirm_valid = true;

    if(this.props.confirm){
      confirm_valid = event.target.value === this.state.confirm_value;
    }

    this.setState({ value: event.target.value, confirm_valid: confirm_valid, valid: valid });

    this.props.onChange(this.props.name, event.target.value);
  }

  onConfirmInputChange(event){
    this.setState({ confirm_value: event.target.value, confirm_valid: event.target.value === this.state.value });
  }

  validate(){
    if(!this.state.confirm_valid){
      this.setState({ confirm_message: 'Passwords do not match '});
    }else{
      this.setState({ confirm_message: ''});
    }

    if(!this.state.valid){
      this.setState({ valid_message: 'Not valid' });
    }else{
      this.setState({ valid_message: '' });
    }

    return this.state.confirm_valid && this.state.valid;
  }

  render(){
    if(!this.props.confirm){
      return(
        <div>
          <br/>
          <label>
            <span className='label'>{this.props.display_name}:</span>
            <input type={this.props.type} value={this.state.value} onChange={this.onInputChange}/>
            <span className='error'>{this.state.valid_message}</span>
          </label>
        </div>
      );
    }else{
      return(
        <div>
          <br/>
          <label>
            <span className='label'>{this.props.display_name}:</span>
            <input type={this.props.type} value={this.state.value} onChange={this.onInputChange}/>

            <span className='label'>Confirm {this.props.display_name}:</span>
            <input type={this.props.type} value={this.state.confirm_value} onChange={this.onConfirmInputChange}/>
            <span className='error'>{this.state.valid_message}</span>
            <span className='error'>{this.state.confirm_message}</span>
          </label>
        </div>
      );
    }
  }
}

export default TextInput;
