import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found. <Link to="/books" className="text-blue-600 hover:underline">Start shopping</Link></p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} to={`/orders/${order.id}`} className="block bg-white p-4 border rounded hover:border-blue-500 transition-colors">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">Order #{order.orderNumber}</span>
                <span className="bg-gray-100 px-2 py-1 text-sm rounded font-medium">{order.status}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>{formatDate(order.orderedAt)}</span>
                <span className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderList;
