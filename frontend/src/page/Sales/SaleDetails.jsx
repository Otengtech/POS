import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { saleApi } from '../../api/sales';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../common/Loader';
import ConfirmDialog from '../../common/ConfirmDialog';
import StatusBadge from '../../common/StatusBadge';
import Card from '../../common/Card';
import PageHeader from '../../common/PageHeader';
import { 
  DocumentTextIcon,
  PrinterIcon,
  ArrowPathIcon,
  XCircleIcon,
  UserIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  CalendarIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline';

const SaleDetails = () => {
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voidDialog, setVoidDialog] = useState({ isOpen: false });
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchSaleDetails();
  }, [id]);

  const fetchSaleDetails = async () => {
    try {
      setLoading(true);
      const response = await saleApi.getSale(id);
      setSale(response.data.sale);
    } catch (error) {
      toast.error('Failed to fetch sale details');
      navigate('/sales');
    } finally {
      setLoading(false);
    }
  };

  const handleVoid = async () => {
    try {
      await saleApi.voidSale(id, 'Voided by user');
      toast.success('Sale voided successfully');
      fetchSaleDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to void sale');
    } finally {
      setVoidDialog({ isOpen: false });
    }
  };

  const handlePrintReceipt = () => {
    navigate(`/sales/${id}/receipt`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!sale) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Sale not found</p>
      </div>
    );
  }

  const canVoid = sale.status === 'completed';
  const canPrint = sale.status !== 'voided';

  const actions = (
    <div className="flex space-x-3">
      {canPrint && (
        <button
          onClick={handlePrintReceipt}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PrinterIcon className="h-4 w-4 mr-2" />
          Print Receipt
        </button>
      )}
      {canVoid && (
        <button
          onClick={() => setVoidDialog({ isOpen: true })}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <XCircleIcon className="h-4 w-4 mr-2" />
          Void Sale
        </button>
      )}
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title={`Sale #${sale.receiptNumber}`}
        subtitle={`Transaction details for ${new Date(sale.createdAt).toLocaleString('en-GH')}`}
        backLink="/sales"
        actions={actions}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Sale Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <Card title="Items">
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sale.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.productId?.name || 'Product'}
                        </div>
                        <div className="text-xs text-gray-500">SKU: {item.productId?.sku}</div>
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-900">
                        GH₵ {item.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                        GH₵ {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      Subtotal
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      GH₵ {sale.subtotal?.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                      Tax
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      GH₵ {sale.tax?.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right text-base font-bold text-gray-900">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right text-base font-bold text-indigo-600">
                      GH₵ {sale.total?.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* Payment Details */}
          <Card title="Payment Details">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CreditCardIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Payment Method
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                  {sale.paymentMethod?.replace('_', ' ')}
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Amount Paid</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  GH₵ {sale.amountPaid?.toFixed(2)}
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Change</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  GH₵ {sale.change?.toFixed(2)}
                </dd>
              </div>
              
              {sale.note && (
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Note</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {sale.note}
                  </dd>
                </div>
              )}
            </dl>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Card */}
          <Card>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sale Status</h3>
              <StatusBadge status={sale.status} type="default" />
              
              {sale.voidReason && (
                <div className="mt-4 p-3 bg-red-50 rounded-md">
                  <p className="text-sm text-red-800">
                    <span className="font-medium">Void Reason:</span> {sale.voidReason}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Customer Information */}
          {sale.customer && (
            <Card title="Customer Information">
              <dl className="space-y-3">
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{sale.customer.name}</span>
                </div>
                {sale.customer.phone && (
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm text-gray-900">{sale.customer.phone}</span>
                  </div>
                )}
                {sale.customer.email && (
                  <div className="flex items-center">
                    <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-900">{sale.customer.email}</span>
                  </div>
                )}
              </dl>
            </Card>
          )}

          {/* Branch Information */}
          {sale.branchId && (
            <Card title="Branch">
              <div className="flex items-center">
                <BuildingStorefrontIcon className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{sale.branchId.name}</div>
                  <div className="text-xs text-gray-500">{sale.branchId.location}</div>
                </div>
              </div>
            </Card>
          )}

          {/* Transaction Details */}
          <Card title="Transaction Details">
            <dl className="space-y-3">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Date & Time</div>
                  <div className="text-sm text-gray-900">
                    {new Date(sale.createdAt).toLocaleString('en-GH')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <ReceiptRefundIcon className="h-4 w-4 text-gray-400 mr-2" />
                <div>
                  <div className="text-xs text-gray-500">Receipt Number</div>
                  <div className="text-sm text-gray-900 font-mono">{sale.receiptNumber}</div>
                </div>
              </div>

              {sale.processedBy && (
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <div className="text-xs text-gray-500">Processed By</div>
                    <div className="text-sm text-gray-900">{sale.processedBy.name}</div>
                  </div>
                </div>
              )}
            </dl>
          </Card>
        </div>
      </div>

      {/* Void Confirmation Dialog */}
      <ConfirmDialog
        isOpen={voidDialog.isOpen}
        onClose={() => setVoidDialog({ isOpen: false })}
        onConfirm={handleVoid}
        title="Void Sale"
        message={`Are you sure you want to void sale #${sale.receiptNumber}? This action cannot be undone.`}
        confirmText="Void Sale"
        type="danger"
      />
    </div>
  );
};

export default SaleDetails;