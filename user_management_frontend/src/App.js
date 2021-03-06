import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './App.css';
import Login from './login/login';
import Settings from './Settings/settings';
import Welcome from './welcome/welcome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path={'/settings'} element={<Settings />} />
        <Route path={'/login'} element={<Login />} />
        <Route path={'/welcome'} element={<Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;
