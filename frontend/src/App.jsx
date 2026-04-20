import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// All pages imported directly (no lazy loading for simplicity)
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminBooks from './pages/AdminBooks';
import AdminOrders from './pages/AdminOrders';
import AdminCategories from './pages/AdminCategories';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Anyone can visit these */}
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />

              {/* Must be logged in */}
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

              {/* Admin only */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/books" element={<ProtectedRoute adminOnly><AdminBooks /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute adminOnly><AdminCategories /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
