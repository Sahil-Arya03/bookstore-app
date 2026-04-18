import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Spinner from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoute';

// Eager-loaded pages
import Home from './pages/Home';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';

// Lazy-loaded pages (protected & admin)
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderList = lazy(() => import('./pages/OrderList'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminBooks = lazy(() => import('./pages/AdminBooks'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminCategories = lazy(() => import('./pages/AdminCategories'));

/**
 * Root App component with routing configuration.
 * Uses React Router v6 with lazy loading for admin routes.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<Spinner text="Loading page..." />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<BookList />} />
                <Route path="/books/:id" element={<BookDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />

                {/* Protected Routes (authenticated users) */}
                <Route path="/checkout" element={
                  <ProtectedRoute><Checkout /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute><OrderList /></ProtectedRoute>
                } />
                <Route path="/orders/:id" element={
                  <ProtectedRoute><OrderDetail /></ProtectedRoute>
                } />

                {/* Admin Routes (ADMIN role only) */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
                } />
                <Route path="/admin/books" element={
                  <ProtectedRoute adminOnly><AdminBooks /></ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>
                } />
                <Route path="/admin/categories" element={
                  <ProtectedRoute adminOnly><AdminCategories /></ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
