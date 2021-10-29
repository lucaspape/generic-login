import logo from './logo.svg';
import './App.css';

import Login from './Login.js';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

function App() {
  console.log(this.props.match.params.origin)
  console.log(JSON.stringify(this.props.match));

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" render={(props) => <Login {...props} /> } />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
