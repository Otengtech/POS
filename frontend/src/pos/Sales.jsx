import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingCart, FaTrash, FaPlus, FaMinus, FaCreditCard, FaMoneyBill, FaQrcode } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const Sales = () => {
  const { userRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Mock products
  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Laptop', price: 999.99, stock: 15, barcode: '123456789' },
        { id: 2, name: 'Mouse', price: 29.99, stock: 50, barcode: '987654321' },
        { id: 3, name: 'Keyboard', price: 89.99, stock: 30, barcode: '456789123' },
        { id: 4, name: 'Monitor', price: 299.99, stock: 8, barcode: '789123456' },
        { id: 5, name: 'HDMI Cable', price: 12.99, stock: 100, barcode: '321654987' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      } else {
        toast.error('Insufficient stock!');
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    const item = cart.find(i => i.id === id);
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else if (newQuantity <= item.stock) {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    } else {
      toast.error('Insufficient stock!');
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    try {
      // API call here
      toast.success('Sale completed successfully!');
      setCart([]);
      setShowPaymentModal(false);
      setCustomerInfo({ name: '', email: '', phone: '' });
    } catch (error) {
      toast.error('Payment failed');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.barcode.includes(searchTerm)
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex h-[calc(100vh-1rem)]">
      {/* Products Section */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-lg transition-all ${
                  product.stock === 0 ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-gray-400'
                }`}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <FaShoppingCart className="text-3xl text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-gray-900 font-bold">${product.price}</p>
                <p className="text-xs text-gray-500">Stock: {product.stock}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 bg-gray-900 text-white border-b border-gray-800">
          <h2 className="font-bold flex items-center">
            <FaShoppingCart className="mr-2" /> Current Sale
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <FaShoppingCart className="text-6xl mx-auto mb-4 opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="bg-gray-50 border border-gray-200 p-3 rounded-lg animate-slide-up">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900 truncate">{item.name}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="w-8 text-center text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 bg-white border border-gray-300 rounded hover:bg-gray-100"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (10%):</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 mt-2">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Complete Payment</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-100 border border-gray-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-3xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                        paymentMethod === 'cash'
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FaMoneyBill />
                      <span>Cash</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                        paymentMethod === 'card'
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <FaCreditCard />
                      <span>Card</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'cash' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Received
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      placeholder="Enter amount"
                      min={calculateTotal()}
                      step="0.01"
                    />
                  </div>
                )}

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processPayment}
                    className="flex-1 px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Complete Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;