import { Routes, Route } from 'react-router-dom';
import FrontPage from './Pages/FrontPage';
import MallPage from './Pages/MallPage';
import ErrorPage from './Pages/ErrorPage';
import UserRegister from './Pages/UserRegister';
import CartPage from './Pages/CartPage';
import CheckoutPage from './Pages/Checkout';

function App() {
  return (
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
        path="/cart"
        element={<CartPage />}
      />
      <Route
        path="/checkout"
        element={<CheckoutPage />}
      />
      <Route
        path="*"
        element={<ErrorPage />}
      />
    </Routes>
  );
}

export default App;

// Testing Commit Purpose
