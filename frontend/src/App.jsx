// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NavBar from "./components/NavBar.jsx";
import RestaurantMenuPage from "./pages/RestaurantMenuPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";

// Use the global CartProvider
import { CartProvider } from "./context/CartContext.jsx";

// customer only
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SavedRestaurantsPage from "./pages/SavedRestaurantsPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/restaurant/:id" element={<RestaurantMenuPage />} />
            {/* <Route path="/cart" element={<CartPage />} /> -- removed */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/order/:id" element={<OrderDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/saved" element={<SavedRestaurantsPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
