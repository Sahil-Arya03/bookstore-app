import axiosInstance from '../utils/axiosInstance';

/**
 * Invoice API service.
 */
const invoiceService = {
  /** Get all invoices (ADMIN) */
  getAllInvoices: () => axiosInstance.get('/api/invoices'),

  /** Get invoice by order ID */
  getInvoiceByOrderId: (orderId) => axiosInstance.get(`/api/invoices/${orderId}`),
};

export default invoiceService;
