import axiosInstance from '../utils/axiosInstance';

const orderService = {

  getAllOrders: () => axiosInstance.get('/api/orders'),

  getMyOrders: () => axiosInstance.get('/api/orders/my'),

  getOrderById: (id) => axiosInstance.get(`/api/orders/${id}`),

  placeOrder: (data) => axiosInstance.post('/api/orders', data),

  updateOrderStatus: (id, status) => axiosInstance.put(`/api/orders/${id}/status`, { status }),

  cancelOrder: (id) => axiosInstance.delete(`/api/orders/${id}`),
};

export default orderService;
