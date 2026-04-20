import { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getAllOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 border-b">Order #</th>
              <th className="p-4 border-b">Customer</th>
              <th className="p-4 border-b">Total</th>
              <th className="p-4 border-b">Status</th>
              <th className="p-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{order.orderNumber}</td>
                <td className="p-4">{order.userName}</td>
                <td className="p-4 font-bold">{formatCurrency(order.totalAmount)}</td>
                <td className="p-4">{order.status}</td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border p-1 rounded bg-white text-sm"
                  >
                    {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
