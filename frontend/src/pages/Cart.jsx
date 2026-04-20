import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { formatCurrency } from '../utils/formatCurrency';

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const updateCart = (updatedCart) => { setCart(updatedCart); localStorage.setItem('cart', JSON.stringify(updatedCart)); };
  const updateQuantity = (id, quantity) => updateCart(cart.map(i => i.id === id ? { ...i, quantity } : i));
  const removeItem = (id) => updateCart(cart.filter(i => i.id !== id));
  const clearCart = () => updateCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="bg-white p-8 border rounded text-center">
          <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
          <Link to="/books" className="text-blue-600 hover:underline">Continue Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            {cart.map(item => <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />)}
          </div>
          
          <div className="bg-white p-6 border rounded text-right">
            <div className="text-2xl font-bold mb-4">Total: {formatCurrency(total)}</div>
            <div className="flex justify-end gap-4">
              <button onClick={clearCart} className="px-4 py-2 border rounded hover:bg-gray-50">Clear Cart</button>
              <button onClick={() => navigate('/checkout')} className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
