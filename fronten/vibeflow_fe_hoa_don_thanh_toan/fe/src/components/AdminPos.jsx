import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/mockData';
import { useAuthStore } from '../store';

// Constants & Utilities
import {
  DEFAULT_WALK_IN_CUSTOMER,
  DEFAULT_BEST_VOUCHER,
  DEFAULT_POS_PRODUCT,
} from './admin/constants';
import {
  INITIAL_COLORS,
  INITIAL_MATERIALS,
  INITIAL_BRANDS,
  INITIAL_SIZES,
  INITIAL_IMAGES,
  INITIAL_VOUCHERS,
  INITIAL_CAMPAIGNS,
  INITIAL_EMPLOYEES,
  INITIAL_CUSTOMERS,
} from './admin/initialData';
import { playBeep, playErrorBeep, formatCountdown } from './admin/utils';

// Layout Components
import AdminHeader from './admin/layout/AdminHeader';
import AdminSidebar from './admin/layout/AdminSidebar';
import AdminFooter from './admin/layout/AdminFooter';

// Tab Components
import DashboardTab from './admin/tabs/DashboardTab';
import PosTab from './admin/tabs/PosTab';
import ProductsTab from './admin/tabs/ProductsTab';
import OrdersTab from './admin/tabs/OrdersTab';
import CategoriesTab from './admin/tabs/CategoriesTab';
import DiscountsTab from './admin/tabs/DiscountsTab';
import EmployeesTab from './admin/tabs/EmployeesTab';
import CustomersTab from './admin/tabs/CustomersTab';
import ChatTab from './admin/tabs/ChatTab';
import InvoicePaymentTab from './admin/tabs/InvoicePaymentTab';
import hoaDonApi from '../api/hoaDonApi';

// Modal Components
import AddCategoryModal from './admin/modals/AddCategoryModal';
import AddVoucherModal from './admin/modals/AddVoucherModal';
import AddEmployeeModal from './admin/modals/AddEmployeeModal';
import AddCustomerModal from './admin/modals/AddCustomerModal';
import BarcodeModal from './admin/modals/BarcodeModal';
import ProductSelectModal from './admin/modals/ProductSelectModal';
import EditItemModal from './admin/modals/EditItemModal';
import DeliveryModal from './admin/modals/DeliveryModal';

export default function AdminPos({ session: propSession, onLogout: propLogout }) {
  const navigate = useNavigate();
  const storeSession = useAuthStore((s) => s.session);
  const storeLogout = useAuthStore((s) => s.logout);
  const session = propSession || storeSession;

  // Phân quyền hiển thị theo role
  const isAdmin = (session?.role || '').toUpperCase() === 'ADMIN';

  const handleLogout = () => {
    if (typeof propLogout === 'function') propLogout();
    storeLogout();
    navigate('/login');
  };

  const [activeTab, setActiveTab] = useState(isAdmin ? 'dashboard' : 'pos');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Digital Clock state
  const [currentClock, setCurrentClock] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dashboard Metrics & Filter State
  const [statsPeriod, setStatsPeriod] = useState('7days');

  // POS State: Quản lý tối đa 5 đơn tạm thời, mã không trùng nhau
  const [posBills, setPosBills] = useState([
    {
      id: 'HD1786874621397',
      code: 'HD1786874621397',
      name: 'Hóa Đơn 1',
      customer: null, // null = Khách vãng lai
      items: [
        {
          product: DEFAULT_POS_PRODUCT,
          size: '37',
          color: 'Đỏ',
          qty: 1,
          unitPrice: 2500000,
        },
      ],
      discount: 0,
      appliedVoucher: DEFAULT_BEST_VOUCHER,
      isDelivery: false,
      deliveryInfo: {
        recipientName: 'Trần Vũ Tùng Anh',
        recipientPhone: '0383854485',
        address: 'Chung cư Tỉnh Đội, đường Lam Sơn, Phường Vĩnh Yên, Tỉnh Phú Thọ',
        fee: 31000,
      },
      paymentMethod: 'cash', // 'cash' | 'transfer' | 'split'
      customerPaid: '',
      note: '',
      createdAt: '10:00',
    },
  ]);
  const [activeBillId, setActiveBillId] = useState('HD1786874621397');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState(null); // { type: 'success' | 'error', message: '' }
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showProductSelectModal, setShowProductSelectModal] = useState(false);
  const [productModalSearch, setProductModalSearch] = useState('');
  const [productModalBrand, setProductModalBrand] = useState('all');
  const [editingCartItemIdx, setEditingCartItemIdx] = useState(null);
  const [editItemSize, setEditItemSize] = useState('');
  const [editItemColor, setEditItemColor] = useState('');
  const [posCustomerSearch, setPosCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(298); // 4:58 (298 giây)
  const [isQrPaid, setIsQrPaid] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({
    recipientName: 'Trần Vũ Tùng Anh',
    recipientPhone: '0383854485',
    email: '',
    addressMode: 'custom', // 'default' | 'custom'
    province: 'Tỉnh Phú Thọ',
    ward: 'Phường Vĩnh Yên',
    specificAddress: 'Chung cư Tỉnh Đội, đường Lam Sơn',
  });
  const barcodeInputRef = useRef(null);
  const posSearchInputRef = useRef(null);
  const customerDropdownRef = useRef(null);

  // ── 1. DANH MỤC THUỘC TÍNH (MÀU SẮC, CHẤT LIỆU, THƯƠNG HIỆU, SIZE) ──
  const [categorySubTab, setCategorySubTab] = useState('colors'); // 'colors' | 'materials' | 'brands' | 'sizes'
  const [categorySearch, setCategorySearch] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatItem, setNewCatItem] = useState({ name: '', code: '', extra: '', hex: '#4F46E5', image: '' });

  const [colorsList, setColorsList] = useState(INITIAL_COLORS);
  const [materialsList, setMaterialsList] = useState(INITIAL_MATERIALS);
  const [brandsList, setBrandsList] = useState(INITIAL_BRANDS);
  const [sizesList, setSizesList] = useState(INITIAL_SIZES);
  const [imagesList, setImagesList] = useState(INITIAL_IMAGES);

  // ── 2. GIẢM GIÁ (PHIẾU GIẢM GIÁ, ĐỢT GIẢM GIÁ) ──
  const [discountSubTab, setDiscountSubTab] = useState('vouchers'); // 'vouchers' | 'campaigns'
  const [discountSearch, setDiscountSearch] = useState('');
  const [discountStatusFilter, setDiscountStatusFilter] = useState('all');
  const [discountTypeFilter, setDiscountTypeFilter] = useState('all');
  const [showAddVoucherModal, setShowAddVoucherModal] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    code: '',
    name: '',
    discount: 100000,
    type: 'fixed',
    minOrder: 1500000,
    endDate: '31/12/2026',
    usageLeft: 100,
  });

  const [vouchersList, setVouchersList] = useState(INITIAL_VOUCHERS);
  const [campaignsList, setCampaignsList] = useState(INITIAL_CAMPAIGNS);

  // ── 3. QUẢN LÝ NHÂN VIÊN ──
  const [employeesList, setEmployeesList] = useState(INITIAL_EMPLOYEES);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [employeeRoleFilter, setEmployeeRoleFilter] = useState('all');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'NHAN_VIEN',
    branch: '298 Cầu Giấy',
  });

  // ── 4. QUẢN LÝ KHÁCH HÀNG ──
  const [customersList, setCustomersList] = useState(INITIAL_CUSTOMERS);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerRankFilter, setCustomerRankFilter] = useState('all');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    gender: 'Nam',
    rank: 'Thành Viên Đồng',
  });

  // Orders state
  const [orderFilter, setOrderFilter] = useState('all');

  // Lấy đơn tạm đang hoạt động
  const currentBillObj =
    posBills.find((b) => b.id === activeBillId) ||
    posBills[0] || {
      id: 'HDT-01',
      code: 'HDT-01',
      name: 'Đơn Tạm 1',
      customer: null,
      items: [],
      discount: 0,
      appliedVoucher: DEFAULT_BEST_VOUCHER,
      isDelivery: false,
      deliveryInfo: { address: '', fee: 30000 },
      paymentMethod: 'cash',
      customerPaid: '',
      note: '',
    };

  const currentCustomer = currentBillObj.customer || DEFAULT_WALK_IN_CUSTOMER;
  const isWalkIn = !currentBillObj.customer || currentBillObj.customer.id === 'WALK_IN';
  const currentBill = currentBillObj.items || [];
  const totalItemCount = currentBill.reduce((sum, item) => sum + item.qty, 0);

  // Tính tiền hàng
  const billSubtotal = currentBill.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

  // Tính tiền giảm từ Voucher (nếu có)
  const voucherDiscount = currentBillObj.appliedVoucher
    ? currentBillObj.appliedVoucher.discountPercent
      ? Math.min(
          currentBillObj.appliedVoucher.maxDiscount || Infinity,
          Math.round((billSubtotal * currentBillObj.appliedVoucher.discountPercent) / 100)
        )
      : currentBillObj.appliedVoucher.discount || 0
    : 0;

  const totalDiscount = (currentBillObj.discount || 0) + voucherDiscount;
  const shippingFee = currentBillObj.isDelivery ? currentBillObj.deliveryInfo?.fee || 31000 : 0;
  const billTotal = Math.max(0, billSubtotal - totalDiscount + shippingFee);

  const customerPaidAmount = currentBillObj.customerPaid ? Number(currentBillObj.customerPaid) : 0;
  const changeDue = Math.max(0, customerPaidAmount - billTotal);

  // Cập nhật các trường dữ liệu của đơn tạm đang chọn
  const updateCurrentBillField = (fields) => {
    setPosBills((prev) =>
      prev.map((b) => (b.id === activeBillId ? { ...b, ...fields } : b))
    );
  };

  // Danh sách khách hàng lọc theo tìm kiếm trong POS
  const filteredPosCustomers = customersList.filter((c) => {
    if (!posCustomerSearch) return true;
    const term = posCustomerSearch.toLowerCase().trim();
    const cleanTerm = term.replace(/\D/g, '');
    const cleanPhone = (c.phone || '').replace(/\D/g, '');
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (cleanTerm && cleanPhone.includes(cleanTerm)) ||
      (c.phone && c.phone.includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.code && c.code.toLowerCase().includes(term))
    );
  });

  // Đóng dropdown khách hàng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target)) {
        setShowCustomerDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Countdown timer cho mã VietQR khi thanh toán chuyển khoản (298s đếm ngược)
  useEffect(() => {
    let timer;
    if ((showQrModal || currentBillObj.paymentMethod === 'transfer') && qrCountdown > 0) {
      timer = setInterval(() => {
        setQrCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showQrModal, currentBillObj.paymentMethod, qrCountdown]);

  const handleConfirmQrPayment = () => {
    playBeep();
    setIsQrPaid(true);
    updateCurrentBillField({
      paymentMethod: 'transfer',
      customerPaid: String(billTotal),
    });
    setShowQrModal(false);
  };

  // Tạo đơn tạm thời mới (Tối đa 5 đơn, mã không trùng nhau)
  const handleCreateNewBill = () => {
    if (posBills.length >= 5) {
      alert('⚠️ Đã đạt giới hạn tối đa 5 đơn tạm thời tại quầy!');
      return;
    }

    const nextCode = `HD${Date.now()}`;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newBill = {
      id: nextCode,
      code: nextCode,
      name: `Hóa Đơn ${posBills.length + 1}`,
      customer: null,
      items: [],
      discount: 0,
      appliedVoucher: DEFAULT_BEST_VOUCHER,
      isDelivery: false,
      deliveryInfo: {
        recipientName: '',
        recipientPhone: '',
        address: 'Chung cư Tỉnh Đội, đường Lam Sơn, Phường Vĩnh Yên, Tỉnh Phú Thọ',
        fee: 31000,
      },
      paymentMethod: 'cash',
      customerPaid: '',
      note: '',
      createdAt: timeStr,
    };

    setPosBills((prev) => [...prev, newBill]);
    setActiveBillId(newBill.id);
  };

  // Mở modal sửa size/màu sắc của sản phẩm trong giỏ
  const handleOpenEditItemModal = (idx) => {
    const item = currentBill[idx];
    if (!item) return;
    setEditingCartItemIdx(idx);
    setEditItemSize(item.size);
    setEditItemColor(item.color);
  };

  // Lưu chỉnh sửa size/màu sắc
  const handleSaveEditItem = () => {
    if (editingCartItemIdx === null) return;
    setPosBills((prev) =>
      prev.map((bill) => {
        if (bill.id !== activeBillId) return bill;
        const updated = [...bill.items];
        if (updated[editingCartItemIdx]) {
          updated[editingCartItemIdx] = {
            ...updated[editingCartItemIdx],
            size: editItemSize,
            color: editItemColor,
          };
        }
        return { ...bill, items: updated };
      })
    );
    setEditingCartItemIdx(null);
  };

  // Đóng / Hủy đơn tạm thời
  const handleCloseBill = (billIdToClose, e) => {
    if (e) e.stopPropagation();
    if (posBills.length <= 1) {
      if (currentBill.length > 0) {
        if (window.confirm('Đây là đơn tạm duy nhất. Bạn có muốn làm trống toàn bộ sản phẩm trong đơn này?')) {
          setPosBills((prev) =>
            prev.map((b) =>
              b.id === billIdToClose
                ? {
                    ...b,
                    items: [],
                    discount: 0,
                    customer: null,
                    appliedVoucher: null,
                    isDelivery: false,
                    customerPaid: '',
                    note: '',
                  }
                : b
            )
          );
        }
      }
      return;
    }

    const billToClose = posBills.find((b) => b.id === billIdToClose);
    if (billToClose && billToClose.items.length > 0) {
      if (!window.confirm(`Đơn [${billToClose.code}] đang có ${billToClose.items.length} món. Bạn có chắc muốn hủy đơn tạm này?`)) {
        return;
      }
    }

    setPosBills((prev) => {
      const remaining = prev.filter((b) => b.id !== billIdToClose);
      if (activeBillId === billIdToClose && remaining.length > 0) {
        setActiveBillId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Thêm sản phẩm vào đơn tạm hiện tại
  const handleAddPosProduct = (prod) => {
    setPosBills((prev) =>
      prev.map((bill) => {
        if (bill.id !== activeBillId) return bill;
        const existing = bill.items.find((x) => x.product.id === prod.id);
        if (existing) {
          return {
            ...bill,
            items: bill.items.map((x) => (x.product.id === prod.id ? { ...x, qty: x.qty + 1 } : x)),
          };
        }
        return {
          ...bill,
          items: [
            ...bill.items,
            { product: prod, size: prod.sizes[1] || '42', color: prod.colors[0], qty: 1, unitPrice: prod.price },
          ],
        };
      })
    );
  };

  // Xóa sản phẩm khỏi đơn tạm hiện tại
  const handleRemovePosItem = (idx) => {
    setPosBills((prev) =>
      prev.map((bill) => {
        if (bill.id !== activeBillId) return bill;
        return {
          ...bill,
          items: bill.items.filter((_, i) => i !== idx),
        };
      })
    );
  };

  // Cập nhật số lượng sản phẩm trong đơn tạm hiện tại
  const handleUpdatePosQty = (idx, delta) => {
    setPosBills((prev) =>
      prev.map((bill) => {
        if (bill.id !== activeBillId) return bill;
        const updated = [...bill.items];
        const newQty = updated[idx].qty + delta;
        if (newQty <= 0) updated.splice(idx, 1);
        else updated[idx].qty = newQty;
        return { ...bill, items: updated };
      })
    );
  };

  // Hủy / làm trống hóa đơn hiện tại
  const handleCancelCurrentBill = () => {
    if (currentBill.length === 0 && !currentBillObj.customer && !currentBillObj.note) {
      alert('Hóa đơn hiện tại đang trống!');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn hủy / làm trống toàn bộ đơn [${currentBillObj.code}]?`)) {
      updateCurrentBillField({
        items: [],
        discount: 0,
        customer: null,
        appliedVoucher: null,
        isDelivery: false,
        customerPaid: '',
        note: '',
      });
    }
  };

  // Thanh toán đơn tạm
  const handlePosCheckout = async () => {
    if (currentBill.length === 0) {
      alert('Hóa đơn trống! Vui lòng chọn sản phẩm vào đơn trước khi thanh toán.');
      return;
    }

    // Backend yêu cầu ID biến thể CHI_TIET_SAN_PHAM thật, không phải ID sản phẩm cha/mock.
    const missingVariant = currentBill.find((item) =>
      !(item.product?.chiTietSanPhamId || item.product?.variantId || item.product?.idChiTietSanPham)
    );
    if (missingVariant) {
      alert('Sản phẩm trong giỏ chưa có mã chi tiết sản phẩm (chiTietSanPhamId) từ database. Hãy kết nối danh sách biến thể thật trước khi thanh toán để tránh tạo hóa đơn sai tồn kho.');
      return;
    }

    try {
      const paymentMethods = await hoaDonApi.getPaymentMethods();
      const methodList = Array.isArray(paymentMethods) ? paymentMethods : [];
      const desiredName = currentBillObj.paymentMethod === 'transfer' ? 'chuyển khoản' : 'tiền mặt';
      const paymentMethod = methodList.find((m) =>
        String(m.tenHinhThuc || '').toLowerCase().includes(desiredName)
      ) || methodList[0];
      if (!paymentMethod) throw new Error('Backend chưa có hình thức thanh toán. Hãy thêm dữ liệu hình thức thanh toán trước.');

      const invoice = await hoaDonApi.create({
        khachHangId: currentCustomer?.khachHangId || currentCustomer?.backendId || null,
        tienGiam: Number(totalDiscount || 0),
        sanPham: currentBill.map((item) => ({
          chiTietSanPhamId: Number(item.product.chiTietSanPhamId || item.product.variantId || item.product.idChiTietSanPham),
          soLuong: Number(item.qty),
        })),
      });

      const amountToPay = Number(billTotal || 0);
      if (amountToPay > 0) {
        await hoaDonApi.pay(invoice.id, {
          hinhThucThanhToanId: paymentMethod.id,
          soTien: amountToPay,
          maGiaoDich: currentBillObj.paymentMethod === 'transfer' ? `POS-${Date.now()}` : null,
        });
      }

      alert(`Thanh toán thành công!\nMã hóa đơn: ${invoice.maHoaDon}\nTổng tiền: ${amountToPay.toLocaleString('vi-VN')} ₫`);
      if (posBills.length > 1) {
        setPosBills((prev) => {
          const remaining = prev.filter((b) => b.id !== activeBillId);
          setActiveBillId(remaining[0].id);
          return remaining;
        });
      } else {
        updateCurrentBillField({ items: [], discount: 0, customer: null, appliedVoucher: null, isDelivery: false, customerPaid: '', note: '' });
      }
    } catch (error) {
      alert(error?.message || 'Không thể tạo hóa đơn hoặc ghi nhận thanh toán. Vui lòng kiểm tra backend.');
    }
  };

  // Xử lý quét barcode để thêm sản phẩm vào đơn tạm hiện tại
  const handleBarcodeScan = (codeToScan) => {
    const raw = typeof codeToScan === 'string' ? codeToScan : barcodeInput;
    const cleanCode = (raw || '').trim();
    if (!cleanCode) return;

    // Tìm sản phẩm theo Barcode hoặc SKU
    const foundProd = INITIAL_PRODUCTS.find(
      (p) => p.barcode === cleanCode || p.sku.toLowerCase() === cleanCode.toLowerCase()
    );

    if (foundProd) {
      playBeep();
      handleAddPosProduct(foundProd);
      setScanFeedback({
        type: 'success',
        message: `Đã quét: ${foundProd.name} (Mã: ${foundProd.barcode}) ➔ Đã thêm vào ${currentBillObj.code}`,
      });
      setBarcodeInput('');
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    } else {
      playErrorBeep();
      setScanFeedback({
        type: 'error',
        message: `Không tìm thấy sản phẩm có mã barcode hoặc SKU: "${cleanCode}"`,
      });
    }

    // Tự tắt thông báo sau 3.5 giây
    setTimeout(() => {
      setScanFeedback(null);
    }, 3500);
  };

  // Phím tắt toàn cục cho POS: [F2] Tìm kiếm, [F3] Quét Barcode, [F9] Thanh toán
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab !== 'pos') return;

      if (e.key === 'F2') {
        e.preventDefault();
        posSearchInputRef.current?.focus();
      } else if (e.key === 'F3') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      } else if (e.key === 'F9') {
        e.preventDefault();
        handlePosCheckout();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, posBills, activeBillId]);

  const filteredOrders = INITIAL_ORDERS.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // Handlers for Modals
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatItem.name) return;
    if (categorySubTab === 'colors') {
      const newItem = {
        id: Date.now(),
        code: newCatItem.code || `COL-${Date.now().toString().slice(-4)}`,
        name: newCatItem.name,
        hex: newCatItem.hex || '#4F46E5',
        count: 0,
        status: true,
      };
      setColorsList([newItem, ...colorsList]);
    } else if (categorySubTab === 'materials') {
      const newItem = {
        id: Date.now(),
        code: newCatItem.code || `MAT-${Date.now().toString().slice(-4)}`,
        name: newCatItem.name,
        desc: newCatItem.extra || 'Chất liệu cao cấp thoáng khí',
        count: 0,
        status: true,
      };
      setMaterialsList([newItem, ...materialsList]);
    } else if (categorySubTab === 'brands') {
      const newItem = {
        id: Date.now(),
        code: newCatItem.code || `BRD-${Date.now().toString().slice(-4)}`,
        name: newCatItem.name,
        origin: newCatItem.extra || 'Nhập khẩu chính hãng',
        founder: '2020',
        count: 0,
        status: true,
      };
      setBrandsList([newItem, ...brandsList]);
    } else if (categorySubTab === 'sizes') {
      const newItem = {
        id: Date.now(),
        eu: newCatItem.name,
        us: newCatItem.code || '8.0',
        cm: parseFloat(newCatItem.extra) || 26.0,
        stock: 50,
        status: true,
      };
      setSizesList([...sizesList, newItem]);
    } else if (categorySubTab === 'images') {
      const newItem = {
        id: Date.now(),
        code: newCatItem.code || `IMG-${Date.now().toString().slice(-4)}`,
        title: newCatItem.name,
        url:
          newCatItem.image ||
          'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80',
        product: newCatItem.extra || 'Giày Sneaker Chính Hãng',
        type: 'Ảnh Thư Viện',
        size: '1.2 MB',
        status: true,
      };
      setImagesList([newItem, ...imagesList]);
    }
    setNewCatItem({ name: '', code: '', extra: '', hex: '#4F46E5', image: '' });
    setShowAddCategoryModal(false);
  };

  const handleAddVoucher = (e) => {
    e.preventDefault();
    if (!newVoucher.name) return;
    if (discountSubTab === 'vouchers') {
      const item = {
        id: Date.now(),
        code: (newVoucher.code || `VIBE${Date.now().toString().slice(-4)}`).toUpperCase(),
        name: newVoucher.name,
        discount: Number(newVoucher.discount) || 50000,
        type: newVoucher.type || 'fixed',
        minOrder: Number(newVoucher.minOrder) || 1000000,
        startDate: 'Hôm nay',
        endDate: newVoucher.endDate || '31/12/2026',
        usageLeft: Number(newVoucher.usageLeft) || 100,
        status: 'active',
      };
      setVouchersList([item, ...vouchersList]);
    } else {
      const item = {
        id: Date.now(),
        name: newVoucher.name,
        discountPercent: Number(newVoucher.discount) || 20,
        startDate: 'Hôm nay',
        endDate: newVoucher.endDate || '30 ngày tới',
        targetGroup: newVoucher.code || 'Toàn bộ sản phẩm',
        banner: '⚡ Sale Hot',
        status: 'active',
      };
      setCampaignsList([item, ...campaignsList]);
    }
    setNewVoucher({
      code: '',
      name: '',
      discount: 100000,
      type: 'fixed',
      minOrder: 1500000,
      endDate: '31/12/2026',
      usageLeft: 100,
    });
    setShowAddVoucherModal(false);
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.phone) return;
    const item = {
      id: Date.now(),
      code: `NV00${employeesList.length + 1}`,
      name: newEmployee.name,
      phone: newEmployee.phone,
      email: newEmployee.email || `${newEmployee.phone}@vibeflow.vn`,
      role: newEmployee.role,
      roleName: newEmployee.role === 'ADMIN' ? 'Quản Trị Viên' : 'Thu Ngân POS',
      branch: newEmployee.branch || '298 Cầu Giấy',
      status: true,
    };
    setEmployeesList([item, ...employeesList]);
    setNewEmployee({ name: '', phone: '', email: '', role: 'NHAN_VIEN', branch: '298 Cầu Giấy' });
    setShowAddEmployeeModal(false);
  };

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;
    const item = {
      id: Date.now(),
      code: `KH00${customersList.length + 1}`,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email || `${newCustomer.phone}@gmail.com`,
      dob: '2000-01-01',
      gender: newCustomer.gender || 'Nam',
      rank: newCustomer.rank || 'Thành Viên Đồng',
      points: 100,
      totalSpent: 0,
      ordersCount: 0,
      status: true,
    };
    setCustomersList([item, ...customersList]);
    updateCurrentBillField({ customer: item });
    setNewCustomer({ name: '', phone: '', email: '', gender: 'Nam', rank: 'Thành Viên Đồng' });
    setShowAddCustomerModal(false);
  };

  const handleOpenDeliveryModal = () => {
    const d = currentBillObj.deliveryInfo || {};
    const c = currentBillObj.customer;
    setDeliveryForm({
      recipientName: d.recipientName || (c?.name ? c.name : 'Trần Vũ Tùng Anh'),
      recipientPhone: d.recipientPhone || (c?.phone ? c.phone : '0383854485'),
      email: d.email || (c?.email ? c.email : ''),
      addressMode: d.addressMode || 'custom',
      province: d.province || 'Tỉnh Phú Thọ',
      ward: d.ward || 'Phường Vĩnh Yên',
      specificAddress: d.specificAddress || 'Chung cư Tỉnh Đội, đường Lam Sơn',
    });
    setShowDeliveryModal(true);
  };

  const handleSaveDeliveryModal = (e) => {
    if (e) e.preventDefault();
    let fullAddr = '';
    if (deliveryForm.addressMode === 'default') {
      fullAddr = 'Chung cư Tỉnh Đội, đường Lam Sơn, Phường Vĩnh Yên, Tỉnh Phú Thọ';
    } else {
      const parts = [
        deliveryForm.specificAddress?.trim(),
        deliveryForm.ward?.trim(),
        deliveryForm.province?.trim(),
      ].filter(Boolean);
      fullAddr = parts.join(', ');
    }

    updateCurrentBillField({
      deliveryInfo: {
        ...currentBillObj.deliveryInfo,
        recipientName: deliveryForm.recipientName,
        recipientPhone: deliveryForm.recipientPhone,
        email: deliveryForm.email,
        address: fullAddr,
        addressMode: deliveryForm.addressMode,
        province: deliveryForm.province,
        ward: deliveryForm.ward,
        specificAddress: deliveryForm.specificAddress,
      },
    });

    setShowDeliveryModal(false);
  };

  return (
    <div className="bg-slate-100/70 text-slate-800 min-h-screen flex flex-col font-sans selection:bg-violet-200 selection:text-violet-900">
      {/* Top Header */}
      <AdminHeader
        isAdmin={isAdmin}
        session={session}
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        handleLogout={handleLogout}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <AdminSidebar
          isAdmin={isAdmin}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          discountSubTab={discountSubTab}
          setDiscountSubTab={setDiscountSubTab}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        {/* Content Area & Footer Column Container */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-slate-100/60 p-4 sm:p-6 lg:p-8">
            {/* TAB 0: DASHBOARD — chỉ ADMIN */}
            {activeTab === 'dashboard' && isAdmin && (
              <DashboardTab statsPeriod={statsPeriod} setStatsPeriod={setStatsPeriod} />
            )}

            {/* TAB 1: POS SCREEN (Thiết kế chuẩn 100% theo ảnh mẫu) */}
            {activeTab === 'pos' && (
              <PosTab
                posBills={posBills}
                activeBillId={activeBillId}
                setActiveBillId={setActiveBillId}
                currentBillObj={currentBillObj}
                currentBill={currentBill}
                currentCustomer={currentCustomer}
                totalItemCount={totalItemCount}
                billSubtotal={billSubtotal}
                voucherDiscount={voucherDiscount}
                totalDiscount={totalDiscount}
                billTotal={billTotal}
                changeDue={changeDue}
                posCustomerSearch={posCustomerSearch}
                setPosCustomerSearch={setPosCustomerSearch}
                showCustomerDropdown={showCustomerDropdown}
                setShowCustomerDropdown={setShowCustomerDropdown}
                customerDropdownRef={customerDropdownRef}
                filteredPosCustomers={filteredPosCustomers}
                qrCountdown={qrCountdown}
                setQrCountdown={setQrCountdown}
                isQrPaid={isQrPaid}
                handleCreateNewBill={handleCreateNewBill}
                handleCloseBill={handleCloseBill}
                handleUpdatePosQty={handleUpdatePosQty}
                handleRemovePosItem={handleRemovePosItem}
                handleOpenEditItemModal={handleOpenEditItemModal}
                handleOpenDeliveryModal={handleOpenDeliveryModal}
                updateCurrentBillField={updateCurrentBillField}
                handleConfirmQrPayment={handleConfirmQrPayment}
                handleCancelCurrentBill={handleCancelCurrentBill}
                handlePosCheckout={handlePosCheckout}
                setShowBarcodeModal={setShowBarcodeModal}
                setShowProductSelectModal={setShowProductSelectModal}
                setShowAddCustomerModal={setShowAddCustomerModal}
              />
            )}

            {/* TAB 2: PRODUCTS MATRIX */}
            {activeTab === 'products' && <ProductsTab />}

            {/* TAB 3: ORDERS MANAGEMENT */}
            {activeTab === 'orders' && <InvoicePaymentTab />}

            {/* ── TAB: DANH MỤC (MÀU SẮC, CHẤT LIỆU, THƯƠNG HIỆU, SIZE) ── */}
            {activeTab === 'categories' && (
              <CategoriesTab
                setShowAddCategoryModal={setShowAddCategoryModal}
                categorySubTab={categorySubTab}
                setCategorySubTab={setCategorySubTab}
                categorySearch={categorySearch}
                setCategorySearch={setCategorySearch}
                colorsList={colorsList}
                setColorsList={setColorsList}
                materialsList={materialsList}
                setMaterialsList={setMaterialsList}
                brandsList={brandsList}
                setBrandsList={setBrandsList}
                sizesList={sizesList}
                setSizesList={setSizesList}
                imagesList={imagesList}
                setImagesList={setImagesList}
              />
            )}

            {/* ── TAB: GIẢM GIÁ (PHIẾU GIẢM GIÁ, ĐỢT GIẢM GIÁ) ── */}
            {activeTab === 'discounts' && (
              <DiscountsTab
                setShowAddVoucherModal={setShowAddVoucherModal}
                discountSubTab={discountSubTab}
                setDiscountSubTab={setDiscountSubTab}
                discountSearch={discountSearch}
                setDiscountSearch={setDiscountSearch}
                discountStatusFilter={discountStatusFilter}
                setDiscountStatusFilter={setDiscountStatusFilter}
                discountTypeFilter={discountTypeFilter}
                setDiscountTypeFilter={setDiscountTypeFilter}
                vouchersList={vouchersList}
                setVouchersList={setVouchersList}
                campaignsList={campaignsList}
                setCampaignsList={setCampaignsList}
              />
            )}

            {/* ── TAB: QUẢN LÝ NHÂN VIÊN ── */}
            {activeTab === 'employees' && (
              <EmployeesTab
                setShowAddEmployeeModal={setShowAddEmployeeModal}
                employeeSearch={employeeSearch}
                setEmployeeSearch={setEmployeeSearch}
                employeeRoleFilter={employeeRoleFilter}
                setEmployeeRoleFilter={setEmployeeRoleFilter}
                employeesList={employeesList}
                setEmployeesList={setEmployeesList}
              />
            )}

            {/* ── TAB: QUẢN LÝ KHÁCH HÀNG ── */}
            {activeTab === 'customers' && (
              <CustomersTab
                setShowAddCustomerModal={setShowAddCustomerModal}
                customerSearch={customerSearch}
                setCustomerSearch={setCustomerSearch}
                customerRankFilter={customerRankFilter}
                setCustomerRankFilter={setCustomerRankFilter}
                customersList={customersList}
                setCustomersList={setCustomersList}
              />
            )}

            {/* TAB 6: CHAT */}
            {activeTab === 'chat' && <ChatTab />}
          </main>

          {/* Admin POS Status Dock / Footer */}
          <AdminFooter currentClock={currentClock} session={session} />
        </div>
      </div>

      {/* ── MODAL: THÊM THUỘC TÍNH DANH MỤC ── */}
      <AddCategoryModal
        showAddCategoryModal={showAddCategoryModal}
        setShowAddCategoryModal={setShowAddCategoryModal}
        categorySubTab={categorySubTab}
        newCatItem={newCatItem}
        setNewCatItem={setNewCatItem}
        handleAddCategory={handleAddCategory}
      />

      {/* ── MODAL: TẠO PHIẾU / ĐỢT GIẢM GIÁ ── */}
      <AddVoucherModal
        showAddVoucherModal={showAddVoucherModal}
        setShowAddVoucherModal={setShowAddVoucherModal}
        discountSubTab={discountSubTab}
        newVoucher={newVoucher}
        setNewVoucher={setNewVoucher}
        handleAddVoucher={handleAddVoucher}
      />

      {/* ── MODAL: THÊM NHÂN VIÊN MỚI ── */}
      <AddEmployeeModal
        showAddEmployeeModal={showAddEmployeeModal}
        setShowAddEmployeeModal={setShowAddEmployeeModal}
        newEmployee={newEmployee}
        setNewEmployee={setNewEmployee}
        handleAddEmployee={handleAddEmployee}
      />

      {/* ── MODAL: THÊM KHÁCH HÀNG MỚI ── */}
      <AddCustomerModal
        showAddCustomerModal={showAddCustomerModal}
        setShowAddCustomerModal={setShowAddCustomerModal}
        newCustomer={newCustomer}
        setNewCustomer={setNewCustomer}
        handleAddCustomer={handleAddCustomer}
      />

      {/* ── MODAL: MÁY QUÉT BARCODE & CHỌN MÃ NHANH ── */}
      <BarcodeModal
        showBarcodeModal={showBarcodeModal}
        setShowBarcodeModal={setShowBarcodeModal}
        currentBillObj={currentBillObj}
        barcodeInput={barcodeInput}
        setBarcodeInput={setBarcodeInput}
        handleBarcodeScan={handleBarcodeScan}
      />

      {/* ── MODAL: CHỌN SẢN PHẨM VÀO ĐƠN HÀNG ── */}
      <ProductSelectModal
        showProductSelectModal={showProductSelectModal}
        setShowProductSelectModal={setShowProductSelectModal}
        currentBillObj={currentBillObj}
        productModalSearch={productModalSearch}
        setProductModalSearch={setProductModalSearch}
        productModalBrand={productModalBrand}
        setProductModalBrand={setProductModalBrand}
        handleAddPosProduct={handleAddPosProduct}
        currentBill={currentBill}
      />

      {/* ── MODAL: CHỈNH SỬA THUỘC TÍNH SẢN PHẨM TRONG GIỎ (SIZE, MÀU) ── */}
      <EditItemModal
        editingCartItemIdx={editingCartItemIdx}
        setEditingCartItemIdx={setEditingCartItemIdx}
        currentBill={currentBill}
        editItemSize={editItemSize}
        setEditItemSize={setEditItemSize}
        editItemColor={editItemColor}
        setEditItemColor={setEditItemColor}
        handleSaveEditItem={handleSaveEditItem}
      />

      {/* ── MODAL: CHỈNH SỬA THÔNG TIN GIAO HÀNG (Chuẩn 100% theo ảnh) ── */}
      <DeliveryModal
        showDeliveryModal={showDeliveryModal}
        setShowDeliveryModal={setShowDeliveryModal}
        deliveryForm={deliveryForm}
        setDeliveryForm={setDeliveryForm}
        handleSaveDeliveryModal={handleSaveDeliveryModal}
      />
    </div>
  );
}
