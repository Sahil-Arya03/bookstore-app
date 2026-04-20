import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';
import bookService from '../services/bookService';
import { formatCurrency } from '../utils/formatCurrency';

function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, books: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([orderService.getAllOrders(), bookService.getBooks(0, 1)])
      .then(([ordersRes, booksRes]) => {
        const orders = ordersRes.data;
        const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.totalAmount : 0), 0);
        setStats({ orders: orders.length, books: booksRes.data.totalElements, revenue: totalRevenue });
        setRecentOrders(orders.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 border rounded shadow-sm text-center">
          <div className="text-gray-500 mb-1">Total Orders</div>
          <div className="text-3xl font-bold">{stats.orders}</div>
        </div>
        <div className="bg-white p-6 border rounded shadow-sm text-center">
          <div className="text-gray-500 mb-1">Total Books</div>
          <div className="text-3xl font-bold">{stats.books}</div>
        </div>
        <div className="bg-white p-6 border rounded shadow-sm text-center">
          <div className="text-gray-500 mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-green-600">{formatCurrency(stats.revenue)}</div>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <Link to="/admin/books" className="bg-blue-50 text-blue-700 px-4 py-2 rounded font-medium border border-blue-200">Manage Books</Link>
        <Link to="/admin/orders" className="bg-blue-50 text-blue-700 px-4 py-2 rounded font-medium border border-blue-200">Manage Orders</Link>
        <Link to="/admin/categories" className="bg-blue-50 text-blue-700 px-4 py-2 rounded font-medium border border-blue-200">Manage Categories</Link>
      </div>

      <div className="bg-white border rounded">
        <h2 className="text-xl font-bold p-4 border-b">Recent Orders</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-4 border-b">Order #</th>
              <th className="p-4 border-b">Customer</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4">{order.orderNumber}</td>
                <td className="p-4">{order.userName}</td>
                <td className="p-4"><span className="bg-gray-200 px-2 py-1 rounded text-xs">{order.status}</span></td>
                <td className="p-4 font-bold">{formatCurrency(order.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
