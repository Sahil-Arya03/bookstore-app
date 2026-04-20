import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';

function Checkout() {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({ shippingAddress: '', paymentMethod: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!stored.length) navigate('/cart');
    setCart(stored);
  }, [navigate]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shippingAddress || !formData.paymentMethod) {
      setError('Please fill out all fields');
      return;
    }

    setLoading(true);
    try {
      await orderService.placeOrder({
        orderItems: cart.map(i => ({ bookId: i.id, quantity: i.quantity })),
        ...formData
      });
      localStorage.removeItem('cart');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      
      <div className="bg-white p-6 border rounded mb-6">
        <h2 className="text-xl font-bold mb-4">Summary</h2>
        <div className="border-b pb-4 mb-4">
          {cart.map(i => <div key={i.id} className="flex justify-between text-sm py-1"><span>{i.title} x {i.quantity}</span><span>{formatCurrency(i.price * i.quantity)}</span></div>)}
        </div>
        <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCurrency(total * 1.18)} (inc 18% tax)</span></div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 border rounded space-y-4">
        <div>
          <label className="block mb-1 font-medium">Shipping Address</label>
          <textarea className="w-full border p-2 rounded" rows="3" value={formData.shippingAddress} onChange={e => setFormData(p => ({...p, shippingAddress: e.target.value}))} required></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium">Payment Method</label>
          <select className="w-full border p-2 rounded" value={formData.paymentMethod} onChange={e => setFormData(p => ({...p, paymentMethod: e.target.value}))} required>
            <option value="">Select...</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="CASH">Cash on Delivery</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
