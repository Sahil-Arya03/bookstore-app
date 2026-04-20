import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { Link } from 'react-router-dom';

const OrderCard = ({ order }) => {
  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <Link to={`/orders/${order.id}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-dark-900">#{order.orderNumber}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-dark-500">{formatDate(order.orderedAt)}</p>
            <p className="text-sm text-dark-500 mt-1">{order.orderItems?.length || 0} item(s)</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary-700">{formatCurrency(order.totalAmount)}</p>
            <p className="text-xs text-dark-400 mt-1">{order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
