import React, { useCallback, useEffect, useMemo, useState } from 'react';
import hoaDonApi from '../../../api/hoaDonApi';

const money = (value) => Number(value || 0).toLocaleString('vi-VN') + ' ₫';
const dateText = (value) => value ? new Date(value).toLocaleString('vi-VN') : '—';
const STATUS = {
  0: { label: 'Chờ thanh toán', cls: 'bg-amber-50 text-amber-700' },
  1: { label: 'Đã thanh toán', cls: 'bg-emerald-50 text-emerald-700' },
  2: { label: 'Đang chuẩn bị', cls: 'bg-blue-50 text-blue-700' },
  3: { label: 'Đang giao', cls: 'bg-violet-50 text-violet-700' },
  4: { label: 'Giao thất bại', cls: 'bg-orange-50 text-orange-700' },
  5: { label: 'Hoàn thành', cls: 'bg-green-50 text-green-700' },
  6: { label: 'Đã hủy', cls: 'bg-slate-100 text-slate-600' },
};

export default function InvoicePaymentTab() {
  const [invoices, setInvoices] = useState([]);
  const [methods, setMethods] = useState([]);
  const [selected, setSelected] = useState(null);
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showPay, setShowPay] = useState(false);
  const [methodId, setMethodId] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionCode, setTransactionCode] = useState('');

  const loadInvoices = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await hoaDonApi.getAll();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (e) { setError(e.message || 'Không tải được danh sách hóa đơn.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadInvoices();
    hoaDonApi.getPaymentMethods().then((data) => {
      const list = Array.isArray(data) ? data : [];
      setMethods(list);
      if (list.length) setMethodId(String(list[0].id));
    }).catch((e) => setError(e.message || 'Không tải được hình thức thanh toán.'));
  }, [loadInvoices]);

  const filtered = useMemo(() => invoices.filter((x) => {
    const matchesSearch = !search || `${x.maHoaDon || ''} ${x.tenKhachHang || ''}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (statusFilter === 'all' || String(x.trangThai) === statusFilter);
  }), [invoices, search, statusFilter]);

  const openDetail = async (invoice) => {
    setSelected(invoice); setError('');
    try {
      const [detail, history] = await Promise.all([
        hoaDonApi.getById(invoice.id), hoaDonApi.getPayments(invoice.id),
      ]);
      setSelected(detail); setPayments(Array.isArray(history) ? history : []);
    } catch (e) { setError(e.message || 'Không tải được chi tiết hóa đơn.'); }
  };

  const refreshSelected = async (id) => {
    const [detail, history] = await Promise.all([hoaDonApi.getById(id), hoaDonApi.getPayments(id)]);
    setSelected(detail); setPayments(Array.isArray(history) ? history : []);
    await loadInvoices();
  };

  const openPayment = () => {
    if (!selected || Number(selected.conPhaiTra) <= 0) return;
    setAmount(String(selected.conPhaiTra));
    setTransactionCode('');
    setShowPay(true);
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    if (!methodId || Number(amount) <= 0) { setError('Vui lòng chọn hình thức và nhập số tiền hợp lệ.'); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      await hoaDonApi.pay(selected.id, {
        hinhThucThanhToanId: Number(methodId),
        soTien: Number(amount),
        maGiaoDich: transactionCode.trim() || null,
      });
      setShowPay(false); setNotice('Đã ghi nhận thanh toán.');
      await refreshSelected(selected.id);
    } catch (e2) { setError(e2.message || 'Thanh toán thất bại.'); }
    finally { setBusy(false); }
  };

  const cancelInvoice = async () => {
    if (!selected || !window.confirm(`Bạn chắc chắn muốn hủy hóa đơn ${selected.maHoaDon}?`)) return;
    setBusy(true); setError('');
    try {
      await hoaDonApi.cancel(selected.id, 'Nhân viên hủy hóa đơn tại quầy');
      setNotice('Đã hủy hóa đơn và cập nhật tồn kho.');
      await refreshSelected(selected.id);
    } catch (e) { setError(e.message || 'Không thể hủy hóa đơn.'); }
    finally { setBusy(false); }
  };

  const changeStatus = async (nextStatus) => {
    if (!selected) return;
    setBusy(true); setError('');
    try {
      const updated = await hoaDonApi.updateStatus(selected.id, { trangThai: Number(nextStatus), lyDo: 'Cập nhật từ màn hình quản lý hóa đơn' });
      setSelected(updated); await loadInvoices();
      setNotice('Đã cập nhật trạng thái hóa đơn.');
    } catch (e) { setError(e.message || 'Cập nhật trạng thái thất bại.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 pb-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-wider text-violet-600">Bán hàng & thu ngân</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Quản lý hóa đơn</h1><p className="mt-1 text-sm text-slate-500">Dữ liệu được tải trực tiếp từ hệ thống.</p></div>
        <button onClick={loadInvoices} disabled={loading} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">↻ Làm mới</button>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
      {notice && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Tổng hóa đơn</p><p className="mt-1 text-2xl font-bold">{invoices.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Chờ thanh toán</p><p className="mt-1 text-2xl font-bold text-amber-600">{invoices.filter(x => x.trangThai === 0).length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Đã thanh toán / hoàn thành</p><p className="mt-1 text-2xl font-bold text-emerald-600">{invoices.filter(x => [1,5].includes(x.trangThai)).length}</p></div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã hóa đơn hoặc tên khách hàng..." className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"><option value="all">Tất cả trạng thái</option>{Object.entries(STATUS).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}</select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Mã hóa đơn</th><th className="px-4 py-3">Khách hàng</th><th className="px-4 py-3">Ngày tạo</th><th className="px-4 py-3 text-right">Tổng tiền</th><th className="px-4 py-3 text-right">Còn phải trả</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Chi tiết</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? <tr><td colSpan="7" className="p-8 text-center text-slate-500">Đang tải hóa đơn...</td></tr> : filtered.length === 0 ? <tr><td colSpan="7" className="p-8 text-center text-slate-500">Không có hóa đơn phù hợp.</td></tr> : filtered.map(x => <tr key={x.id} className="hover:bg-slate-50/70"><td className="px-4 py-3 font-mono font-semibold text-violet-700">{x.maHoaDon}</td><td className="px-4 py-3">{x.tenKhachHang || 'Khách vãng lai'}</td><td className="px-4 py-3 text-slate-500">{dateText(x.ngayTao)}</td><td className="px-4 py-3 text-right font-semibold">{money(x.thanhTien)}</td><td className="px-4 py-3 text-right">{money(x.conPhaiTra)}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS[x.trangThai]?.cls || 'bg-slate-100 text-slate-600'}`}>{STATUS[x.trangThai]?.label || 'Không rõ'}</span></td><td className="px-4 py-3"><button onClick={() => openDetail(x)} className="rounded-lg border border-violet-200 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-50">Xem</button></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs text-slate-500">Chi tiết hóa đơn</p><h2 className="text-xl font-bold text-slate-900">{selected.maHoaDon}</h2><p className="text-sm text-slate-500">{selected.tenKhachHang || 'Khách vãng lai'} · {dateText(selected.ngayTao)}</p></div><div className="flex flex-wrap gap-2"><button disabled={busy || selected.trangThai === 6 || Number(selected.conPhaiTra) <= 0} onClick={openPayment} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-40">Thanh toán</button><button disabled={busy || [5,6].includes(selected.trangThai)} onClick={cancelInvoice} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-40">Hủy hóa đơn</button><button onClick={() => setSelected(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Đóng</button></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[550px] text-sm"><thead className="text-xs text-slate-500"><tr><th className="py-3 text-left">Sản phẩm</th><th className="py-3 text-left">Mã chi tiết</th><th className="py-3 text-center">SL</th><th className="py-3 text-right">Đơn giá</th><th className="py-3 text-right">Thành tiền</th></tr></thead><tbody className="divide-y divide-slate-100">{(selected.chiTiet || []).map((item, i) => <tr key={item.id || i}><td className="py-3 font-medium">{item.tenSanPham} <span className="text-xs text-slate-500">{item.mauSac} / {item.kichThuoc}</span></td><td className="py-3 font-mono text-xs text-slate-500">{item.maChiTiet}</td><td className="py-3 text-center">{item.soLuong}</td><td className="py-3 text-right">{money(item.donGia)}</td><td className="py-3 text-right font-semibold">{money(item.thanhTien)}</td></tr>)}</tbody></table></div>
        <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 text-sm sm:ml-auto sm:max-w-sm"><div className="flex justify-between"><span className="text-slate-500">Tổng tiền</span><b>{money(selected.tongTien)}</b></div><div className="flex justify-between"><span className="text-slate-500">Giảm giá</span><b>- {money(selected.tienGiam)}</b></div><div className="flex justify-between"><span className="text-slate-500">Đã thanh toán</span><b className="text-emerald-700">{money(selected.daThanhToan)}</b></div><div className="flex justify-between border-t pt-2 text-base"><b>Còn phải trả</b><b className="text-violet-700">{money(selected.conPhaiTra)}</b></div></div>
        <div className="mt-5 border-t border-slate-100 pt-4"><h3 className="mb-2 font-bold">Lịch sử thanh toán</h3>{payments.length ? <div className="space-y-2">{payments.map(p => <div key={p.id} className="flex flex-wrap justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm"><span>{p.tenHinhThuc} · {dateText(p.ngayThanhToan)} {p.maGiaoDich ? `· ${p.maGiaoDich}` : ''}</span><b>{money(p.soTien)}</b></div>)}</div> : <p className="text-sm text-slate-500">Chưa có giao dịch thanh toán.</p>}</div>
        {selected.trangThai === 1 && <div className="mt-4 flex flex-wrap items-center gap-2 text-sm"><span className="text-slate-500">Cập nhật tiến độ:</span><select disabled={busy} onChange={e => changeStatus(e.target.value)} value={selected.trangThai} className="rounded-lg border border-slate-200 px-3 py-2"><option value="1">Đã thanh toán</option><option value="2">Đang chuẩn bị</option><option value="3">Đang giao</option><option value="5">Hoàn thành</option></select></div>}
      </div>}

      {showPay && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"><form onSubmit={submitPayment} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-2xl"><div><h3 className="text-lg font-bold">Thanh toán hóa đơn</h3><p className="text-sm text-slate-500">{selected.maHoaDon} · Còn phải trả {money(selected.conPhaiTra)}</p></div><label className="block text-sm font-medium">Hình thức thanh toán<select required value={methodId} onChange={e => setMethodId(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5">{methods.map(m => <option key={m.id} value={m.id}>{m.tenHinhThuc}</option>)}</select></label><label className="block text-sm font-medium">Số tiền thanh toán<input required type="number" min="1" max={Number(selected.conPhaiTra)} step="1" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label><label className="block text-sm font-medium">Mã giao dịch (nếu có)<input value={transactionCode} onChange={e => setTransactionCode(e.target.value)} placeholder="Ví dụ: GD001" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5" /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setShowPay(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Đóng</button><button disabled={busy} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Đang xử lý...' : 'Xác nhận thanh toán'}</button></div></form></div>}
    </div>
  );
}
