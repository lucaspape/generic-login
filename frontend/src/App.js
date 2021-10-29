import logo from './logo.svg';
import './App.css';

import Login from './Login.js';
import Register from './Register.js';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/frontend/login" component={Login}/>
        <Route exact path="/frontend/register" component={Register}/>
      </Router>
    </div>
  );
}

export default App;
