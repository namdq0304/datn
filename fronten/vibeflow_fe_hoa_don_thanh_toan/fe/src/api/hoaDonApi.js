import axiosClient from './axiosClient';

// Các endpoint khớp HoaDonController của backend VibeFlow.
const hoaDonApi = {
  getAll: () => axiosClient.get('/hoa-don'),
  getById: (id) => axiosClient.get(`/hoa-don/${id}`),
  create: (data) => axiosClient.post('/hoa-don', data),
  updateStatus: (id, data) => axiosClient.patch(`/hoa-don/${id}/trang-thai`, data),
  cancel: (id, lyDo) => axiosClient.post(`/hoa-don/${id}/huy`, { lyDo }),
  getPaymentMethods: () => axiosClient.get('/hoa-don/hinh-thuc-thanh-toan'),
  pay: (id, data) => axiosClient.post(`/hoa-don/${id}/thanh-toan`, data),
  getPayments: (id) => axiosClient.get(`/hoa-don/${id}/thanh-toan`),
};

export default hoaDonApi;
