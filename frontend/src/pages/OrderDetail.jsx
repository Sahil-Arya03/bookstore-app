import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import invoiceService from '../services/invoiceService';
import { formatCurrency } from '../utils/formatCurrency';

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ order: null, invoice: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderService.getOrderById(id),
      invoiceService.getInvoiceByOrderId(id).catch(() => ({ data: null }))
    ])
    .then(([orderRes, invoiceRes]) => setData({ order: orderRes.data, invoice: invoiceRes.data }))
    .catch(() => navigate('/orders'))
    .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  const { order, invoice } = data;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline mb-4">&larr; Back</button>
      
      <div className="bg-white p-6 border rounded mb-6">
        <h1 className="text-2xl font-bold mb-2">Order #{order.orderNumber}</h1>
        <div className="flex gap-4 text-sm mb-4">
          <span className="bg-gray-100 px-2 rounded">{order.status}</span>
          <span className="text-gray-500">Total: {formatCurrency(order.totalAmount)}</span>
        </div>

        <h2 className="font-bold mt-6 mb-2">Items</h2>
        <div className="space-y-2 border-b pb-4 mb-4">
          {order.orderItems?.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.bookTitle} (Qty: {item.quantity})</span>
              <span>{formatCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <h2 className="font-bold mb-2">Shipping Information</h2>
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{order.shippingAddress}</p>
      </div>

      {invoice && (
        <div className="bg-white p-6 border rounded">
          <h2 className="text-xl font-bold mb-4">Invoice #{invoice.invoiceNumber}</h2>
          <div className="text-sm flex justify-between py-1"><span>Subtotal:</span><span>{formatCurrency(invoice.amount)}</span></div>
          <div className="text-sm flex justify-between py-1 border-b"><span>Tax (18%):</span><span>{formatCurrency(invoice.tax)}</span></div>
          <div className="text-base font-bold flex justify-between py-2 mt-2"><span>Grand Total:</span><span>{formatCurrency(invoice.grandTotal)}</span></div>
        </div>
      )}
    </div>
  );
}

export default OrderDetail;
