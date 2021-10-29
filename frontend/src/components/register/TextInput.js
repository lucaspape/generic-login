import React from 'react';

class TextInput extends React.Component {
  constructor(){
    super();

    this.onInputChange = this.onInputChange.bind(this);
  }

  state = {
    value: ''
  }

  onInputChange(event){
    this.setState({ value: event.target.value });

    this.props.onChange(this.props.name, event.target.value);
  }

  render(){
    return(
      <div>
        <label>
          {this.props.display_name}:
          <input type={this.props.type} value={this.state.value} onChange={this.onInputChange}/>
        </label>
      </div>
    );
  }
}

export default TextInput;
