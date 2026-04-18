import { useState, useEffect } from 'react';
import orderService from '../services/orderService';
import OrderCard from '../components/OrderCard';
import Spinner from '../components/Spinner';

/**
 * OrderList page showing the current user's orders (protected).
 */
const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-dark-900 mb-6">My Orders</h1>

      {loading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="text-6xl">📦</span>
          <h3 className="text-xl font-semibold text-dark-700 mt-4">No orders yet</h3>
          <p className="text-dark-500 mt-2">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
