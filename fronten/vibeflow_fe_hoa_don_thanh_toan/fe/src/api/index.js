/**
 * Centralized API Services Module (VibeFlow Sneaker)
 * Supports both standard international naming and localized aliases.
 */
import axiosClient from './axiosClient';
import authApi from './authApi';
import sanPhamApi from './sanPhamApi';
import chiTietSanPhamApi from './chiTietSanPhamApi';
import danhMucApi from './danhMucApi';
import thuongHieuApi from './thuongHieuApi';
import chatLieuApi from './chatLieuApi';
import kichThuocApi from './kichThuocApi';
import mauSacApi from './mauSacApi';
import xuatXuApi from './xuatXuApi';
import hinhAnhApi from './hinhAnhApi';
import hoaDonApi from './hoaDonApi';

export * from './authStorage';

// Standard International Aliases
export const productApi = sanPhamApi;
export const productDetailApi = chiTietSanPhamApi;
export const categoryApi = danhMucApi;
export const brandApi = thuongHieuApi;
export const materialApi = chatLieuApi;
export const sizeApi = kichThuocApi;
export const colorApi = mauSacApi;
export const originApi = xuatXuApi;
export const imageApi = hinhAnhApi;

// Export all modules
export {
  axiosClient,
  authApi,
  sanPhamApi,
  chiTietSanPhamApi,
  danhMucApi,
  thuongHieuApi,
  chatLieuApi,
  kichThuocApi,
  mauSacApi,
  xuatXuApi,
  hinhAnhApi,
  hoaDonApi,
};

export default axiosClient;
