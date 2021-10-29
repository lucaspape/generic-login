import logo from './logo.svg';
import './App.css';

import Login from './Login.js';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={Login}/>
      </Router>
    </div>
  );
}

export default App;
