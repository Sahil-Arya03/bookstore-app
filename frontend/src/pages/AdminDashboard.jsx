import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';
import bookService from '../services/bookService';
import { formatCurrency } from '../utils/formatCurrency';
import Spinner from '../components/Spinner';

/**
 * Admin Dashboard with summary stats and quick links.
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState({ orders: 0, books: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([orderService.getAllOrders(), bookService.getBooks(0, 1)])
      .then(([ordersRes, booksRes]) => {
        const orders = ordersRes.data;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
        setStats({
          orders: orders.length,
          books: booksRes.data.totalElements,
          revenue: totalRevenue,
        });
        setRecentOrders(orders.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { icon: '📦', label: 'Total Orders', value: stats.orders, color: 'from-blue-500 to-blue-600', link: '/admin/orders' },
    { icon: '📚', label: 'Total Books', value: stats.books, color: 'from-purple-500 to-purple-600', link: '/admin/books' },
    { icon: '💰', label: 'Revenue', value: formatCurrency(stats.revenue), color: 'from-green-500 to-green-600', link: '/admin/orders' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-dark-900 mb-2">Admin Dashboard</h1>
      <p className="text-dark-500 mb-8">Manage your bookstore from here</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, i) => (
          <Link key={i} to={card.link}>
            <div className={`bg-gradient-to-r ${card.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
              <span className="text-3xl">{card.icon}</span>
              <p className="text-3xl font-bold mt-3">{card.value}</p>
              <p className="text-white/80 text-sm mt-1">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/books" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
          <span className="text-3xl">📖</span>
          <div><p className="font-semibold text-dark-900">Manage Books</p><p className="text-sm text-dark-500">Add, edit, delete books</p></div>
        </Link>
        <Link to="/admin/orders" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
          <span className="text-3xl">📋</span>
          <div><p className="font-semibold text-dark-900">Manage Orders</p><p className="text-sm text-dark-500">View and update statuses</p></div>
        </Link>
        <Link to="/admin/categories" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-4">
          <span className="text-3xl">🏷️</span>
          <div><p className="font-semibold text-dark-900">Manage Categories</p><p className="text-sm text-dark-500">Organize book categories</p></div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-dark-900 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-dark-500 border-b border-gray-100">
              <th className="px-3 py-2">Order #</th><th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Status</th><th className="px-3 py-2">Total</th>
            </tr></thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-3 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-3 py-3">{order.userName}</td>
                  <td className="px-3 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>{order.status}</span></td>
                  <td className="px-3 py-3 font-semibold">{formatCurrency(order.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
