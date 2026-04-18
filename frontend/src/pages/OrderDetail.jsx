import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import invoiceService from '../services/invoiceService';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Spinner from '../components/Spinner';

/**
 * OrderDetail page showing full order information, items, and invoice.
 */
const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    Promise.all([
      orderService.getOrderById(id),
      invoiceService.getInvoiceByOrderId(id).catch(() => null),
    ])
      .then(([orderRes, invoiceRes]) => {
        setOrder(orderRes.data);
        if (invoiceRes) setInvoice(invoiceRes.data);
      })
      .catch(() => navigate('/orders'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await orderService.cancelOrder(id);
      setOrder(prev => ({ ...prev, status: 'CANCELLED' }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  if (loading) return <Spinner />;
  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <button onClick={() => navigate(-1)} className="text-primary-600 hover:text-primary-700 font-medium mb-6 flex items-center gap-1">
        ← Back to Orders
      </button>

      {/* Order Header */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-dark-900">Order #{order.orderNumber}</h1>
            <p className="text-dark-500 mt-1">{formatDate(order.orderedAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>{order.status}</span>
            {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
              <button onClick={handleCancel} disabled={cancelling}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {order.orderItems?.map(item => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-medium text-dark-800">{item.bookTitle}</p>
                  <p className="text-xs text-dark-400">ISBN: {item.bookIsbn} • Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                  <p className="text-xs text-dark-400">{formatCurrency(item.unitPrice)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Info + Invoice */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-dark-900 mb-4">Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-dark-500">Payment</span><span className="font-medium">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-dark-500">Total</span><span className="font-bold text-primary-700">{formatCurrency(order.totalAmount)}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-dark-500 mb-1">Shipping Address</p>
              <p className="text-sm text-dark-800">{order.shippingAddress}</p>
            </div>
          </div>

          {invoice && (
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl shadow-md p-6 border border-primary-100">
              <h2 className="text-lg font-semibold text-dark-900 mb-4">🧾 Invoice</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-dark-500">Invoice #</span><span className="font-medium">{invoice.invoiceNumber}</span></div>
                <div className="flex justify-between"><span className="text-dark-500">Subtotal</span><span>{formatCurrency(invoice.amount)}</span></div>
                <div className="flex justify-between"><span className="text-dark-500">Tax (18%)</span><span>{formatCurrency(invoice.tax)}</span></div>
                <div className="flex justify-between pt-2 border-t border-primary-200 text-lg font-bold">
                  <span>Grand Total</span>
                  <span className="text-primary-700">{formatCurrency(invoice.grandTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
