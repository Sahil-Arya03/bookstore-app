import { formatCurrency } from '../utils/formatCurrency';

function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center gap-4 bg-white p-4 border rounded">
      <div className="flex-1">
        <h3 className="font-bold">{item.title}</h3>
        <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
      </div>

      <div className="flex gap-2 items-center">
        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="px-2 border rounded">&minus;</button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 border rounded">+</button>
      </div>

      <div className="font-bold w-24 text-right">
        {formatCurrency(item.price * item.quantity)}
      </div>

      <button onClick={() => onRemove(item.id)} className="text-red-500 hover:underline px-2">
        Remove
      </button>
    </div>
  );
}

export default CartItem;
