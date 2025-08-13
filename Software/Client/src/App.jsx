import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './Pages/FrontPage';
import MallPage from './Pages/MallPage';
import ErrorPage from "./Pages/ErrorPage"; 
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
        <Route
          path="*"
          element={<ErrorPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
