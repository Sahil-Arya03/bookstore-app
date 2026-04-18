import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';
import { validateCheckout } from '../utils/validators';

/**
 * Checkout page for placing orders (protected route).
 */
const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({ shippingAddress: '', paymentMethod: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    if (stored.length === 0) navigate('/cart');
    setCart(stored);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateCheckout(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await orderService.placeOrder({
        orderItems: cart.map(item => ({ bookId: item.id, quantity: item.quantity })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
      });
      localStorage.removeItem('cart');
      navigate('/orders');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-dark-900 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-dark-900 mb-4">Shipping & Payment</h2>

            {apiError && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{apiError}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Shipping Address</label>
                <textarea name="shippingAddress" value={formData.shippingAddress} onChange={handleChange}
                  rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  placeholder="Enter your full shipping address" id="checkout-address" />
                {errors.shippingAddress && <p className="text-red-500 text-xs mt-1">{errors.shippingAddress}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-1">Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
                  id="checkout-payment">
                  <option value="">Select payment method</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="NET_BANKING">Net Banking</option>
                  <option value="UPI">UPI</option>
                  <option value="COD">Cash on Delivery</option>
                </select>
                {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg disabled:opacity-50 mt-2">
                {loading ? 'Placing Order...' : `Place Order • ${formatCurrency(total)}`}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 sticky top-24">
            <h2 className="text-lg font-semibold text-dark-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-dark-600 truncate mr-2">{item.title} × {item.quantity}</span>
                  <span className="font-medium text-dark-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between text-sm text-dark-500">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-dark-500 mt-1">
                <span>Tax (18%)</span>
                <span>{formatCurrency(total * 0.18)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-dark-900 mt-3 pt-3 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(total * 1.18)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
