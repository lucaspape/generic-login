import logo from './logo.svg';
import './App.css';

import Login from './components/login/Login.js';
import Register from './components/register/Register.js';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>

        <Route exact path="/" component={Login}/>
      </Router>
    </div>
  );
}

export default App;
