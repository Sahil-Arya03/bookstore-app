import axiosInstance from '../utils/axiosInstance';

const invoiceService = {

  getAllInvoices: () => axiosInstance.get('/api/invoices'),

  getInvoiceByOrderId: (orderId) => axiosInstance.get(`/api/invoices/${orderId}`),
};

export default invoiceService;
