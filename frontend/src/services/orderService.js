import axiosInstance from '../utils/axiosInstance';

/**
 * Order API service.
 */
const orderService = {
  /** Get all orders (ADMIN) */
  getAllOrders: () => axiosInstance.get('/api/orders'),

  /** Get current user's orders */
  getMyOrders: () => axiosInstance.get('/api/orders/my'),

  /** Get order by ID */
  getOrderById: (id) => axiosInstance.get(`/api/orders/${id}`),

  /** Place a new order */
  placeOrder: (data) => axiosInstance.post('/api/orders', data),

  /** Update order status (ADMIN) */
  updateOrderStatus: (id, status) => axiosInstance.put(`/api/orders/${id}/status`, { status }),

  /** Cancel an order */
  cancelOrder: (id) => axiosInstance.delete(`/api/orders/${id}`),
};

export default orderService;
