import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saleApi } from '../../api/sales';
import { productApi } from '../../api/products';
import { branchApi } from '../../api/branches';
import { useToast } from '../../contexts/ToastContext';
import PageHeader from '../../common/PageHeader';
import Card from '../../common/Card';
import LoadingSpinner from '../../common/Loader';
import { 
  PlusIcon, 
  MinusIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

const CreateSale = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState(0);
  const [note, setNote] = useState('');
  
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchProducts();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, branchesRes] = await Promise.all([
        productApi.listProducts({ limit: 100, status: 'active' }),
        branchApi.listBranches({ limit: 100 })
      ]);
      setProducts(productsRes.data.products || []);
      setBranches(branchesRes.data.branches || []);
      if (branchesRes.data.branches?.length > 0) {
        setSelectedBranch(branchesRes.data.branches[0]._id);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = () => {
    const results = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchTerm))
    );
    setSearchResults(results.slice(0, 10));
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product._id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error('Not enough stock available');
        return;
      }
      setCart(cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (product.stock < 1) {
        toast.error('Product out of stock');
        return;
      }
      setCart([...cart, {
        productId: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: 1,
        stock: product.stock,
        taxRate: product.taxRate || 0
      }]);
    }
    
    setSearchTerm('');
    setSearchResults([]);
  };

  const updateQuantity = (productId, newQuantity) => {
    const item = cart.find(item => item.productId === productId);
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    if (newQuantity > item.stock) {
      toast.error('Not enough stock available');
      return;
    }
    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return cart.reduce((sum, item) => {
      const itemTax = (item.price * item.quantity) * (item.taxRate / 100);
      return sum + itemTax;
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const calculateChange = () => {
    const total = calculateTotal();
    return amountPaid - total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!selectedBranch) {
      toast.error('Please select a branch');
      return;
    }

    const total = calculateTotal();
    if (amountPaid < total) {
      toast.error('Insufficient payment amount');
      return;
    }

    try {
      setLoading(true);
      const saleData = {
        branchId: selectedBranch,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          taxRate: item.taxRate
        })),
        customer: customer.name ? customer : undefined,
        paymentMethod,
        amountPaid,
        change: calculateChange(),
        note: note || undefined,
        total
      };

      const response = await saleApi.createSale(saleData);
      toast.success('Sale completed successfully');
      navigate(`/sales/${response.data.sale._id}/receipt`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete sale');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !cart.length) {
    return <LoadingSpinner fullScreen />;
  }

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const total = calculateTotal();
  const change = calculateChange();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="New Sale"
        subtitle="Create a new sales transaction"
        backLink="/sales"
      />

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Products and Cart Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Search */}
            <Card title="Add Products">
              <div className="relative">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by product name, SKU, or barcode..."
                    className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                    {searchResults.map(product => (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() => addToCart(product)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-indigo-600">GH₵ {product.price}</div>
                          <div className="text-xs text-gray-500">Stock: {product.stock}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Cart Items */}
            <Card title="Sale Items">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Cart is empty</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Search and add products to start a sale
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cart.map((item) => (
                        <tr key={item.productId}>
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">SKU: {item.sku}</div>
                          </td>
                          <td className="px-4 py-4 text-right text-sm text-gray-900">
                            GH₵ {item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                              >
                                <MinusIcon className="h-4 w-4 text-gray-600" />
                              </button>
                              <span className="w-12 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-1 rounded-full hover:bg-gray-100"
                                disabled={item.quantity >= item.stock}
                              >
                                <PlusIcon className="h-4 w-4 text-gray-600" />
                              </button>
                            </div>
                            <div className="text-xs text-center text-gray-500">
                              Stock: {item.stock}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                            GH₵ {(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Summary and Payment Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Branch Selection */}
            <Card title="Branch">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </Card>

            {/* Customer Information */}
            <Card title="Customer Information (Optional)">
              <div className="space-y-3">
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Customer name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="Phone number"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="Email address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </Card>

            {/* Order Summary */}
            <Card title="Order Summary">
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">GH₵ {subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Tax</dt>
                  <dd className="text-sm font-medium text-gray-900">GH₵ {tax.toFixed(2)}</dd>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-bold text-indigo-600">GH₵ {total.toFixed(2)}</dd>
                </div>
              </dl>
            </Card>

            {/* Payment */}
            <Card title="Payment">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Paid (GH₵)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={total}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                {amountPaid >= total && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Change:</span>
                    <span className="font-medium text-green-600">GH₵ {change.toFixed(2)}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Add a note to this sale"
                  />
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || cart.length === 0 || amountPaid < total}
              className="w-full bg-indigo-600 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Complete Sale'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateSale;