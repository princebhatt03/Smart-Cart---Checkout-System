import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './Pages/FrontPage';
import MallPage from './Pages/MallPage';
import UserRegister from './Pages/UserRegister';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<UserRegister />}
        />
        <Route
          path="/Front-Page"
          element={<FrontPage />}
        />
        <Route
          path="/mall/:mallName"
          element={<MallPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
