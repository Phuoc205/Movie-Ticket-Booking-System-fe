import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Voucher {
  id: string;
  code: string;
  discount: number;
  is_active: boolean;
  expired_at: string | null;
  quantity: number | null;
  used: number;
}

const ManageVouchers = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);
    const [newVoucher, setNewVoucher] = useState({ code: '', discount: 0, expired_at: '', quantity: ''});
    const [isSubmittingVoucher, setIsSubmittingVoucher] = useState(false);

    const fetch = async () => {
      setIsLoadingVouchers(true);
      try {
        const res = await api.get('/vouchers');
        setVouchers(res.data);
      } catch {
        toast.error('Lỗi load voucher');
      } finally {
        setIsLoadingVouchers(false);
      }
    };

    const handleAddVoucher = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmittingVoucher(true);
      try {
        await api.post('/vouchers', {
          code: newVoucher.code.toUpperCase(),
          discount: Number(newVoucher.discount),
          expired_at: newVoucher.expired_at || null,
          quantity: newVoucher.quantity ? Number(newVoucher.quantity) : null,
        });
        toast.success('Thêm voucher thành công');
        setNewVoucher({ code: '', discount: 0 , expired_at: '', quantity: ''});
        fetch();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Có lỗi khi thêm voucher');
      } finally {
        setIsSubmittingVoucher(false);
      }
    };

    const handleDeleteVoucher = async (id: string, code: string) => {
      if (!window.confirm(`Bạn có chắc muốn xóa voucher "${code}" không?`)) return;
      try {
        await api.delete(`/vouchers/${id}`);
        toast.success(`Đã xóa voucher ${code}`);
        fetch();
      } catch (error: any) {
        toast.error('Không thể xóa voucher');
      }
    };

    const getStatus = (v: Voucher) => {
      if (!v.is_active) return "DISABLED";

      if (v.expired_at && new Date(v.expired_at) < new Date()) {
        return "EXPIRED";
      }

      if (v.quantity !== null && v.used >= v.quantity) {
        return "OUT";
      }

      return "ACTIVE";
    };

    useEffect(() => {
      fetch();
    }, []);

    return (
        (
          <div className="animate-fade-in-up space-y-8">
            <div className="card-container !bg-gray-900/40">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-blue)] to-green-500 flex items-center justify-center shadow-[0_0_15px_var(--accent-glow)]">💸</span>
                Tạo Voucher Mới
              </h2>
              <form onSubmit={handleAddVoucher} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div>
                  <label className="input-label">Mã Giảm Giá (Code)</label>
                  <input
                    type="text"
                    required
                    value={newVoucher.code}
                    onChange={(e) => setNewVoucher({...newVoucher, code: e.target.value.toUpperCase()})}
                    className="input-field"
                    placeholder="VD: MAGIAMGIA50"
                  />
                </div>

                <div>
                  <label className="input-label">Phần trăm giảm (%)</label>
                  <input
                    type="number"
                    max="100"
                    min="1"
                    required
                    value={newVoucher.discount}
                    onChange={(e) => setNewVoucher({...newVoucher, discount: Number(e.target.value)})}
                    className="input-field"
                    placeholder="VD: 50"
                  />
                </div>

                <div>
                  <label className="input-label">Hạn sử dụng</label>
                  <input
                    type="datetime-local"
                    value={newVoucher.expired_at}
                    onChange={(e) =>
                      setNewVoucher({ ...newVoucher, expired_at: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    value={newVoucher.quantity}
                    onChange={(e) =>
                      setNewVoucher({ ...newVoucher, quantity: e.target.value })
                    }
                    className="input-field"
                    placeholder="Không giới hạn nếu để trống"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end pt-4 border-t border-[var(--border-card)]">
                  <button
                    type="submit"
                    disabled={isSubmittingVoucher}
                    className="btn-success min-w-[200px]"
                  >
                    {isSubmittingVoucher ? <div className="spinner-small mr-2"></div> : null}
                    {isSubmittingVoucher ? 'Đang Xử Lý' : 'Tạo Voucher'}
                  </button>
                </div>
              </form>
            </div>

            <div className="card-container !p-0 overflow-hidden mt-8">
              <div className="p-6 md:p-8 border-b border-[var(--border-card)] flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-lg">📋</span>
                  Danh Sách Voucher
                </h2>
                <span className="text-gray-400 text-sm font-medium">{vouchers.length} mã</span>
              </div>
              {isLoadingVouchers ? (
                <div className="flex justify-center py-16"><div className="spinner"></div></div>
              ) : vouchers.length === 0 ? (
                <div className="text-center py-16 text-gray-500">Chưa có voucher nào.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/40 text-gray-400 uppercase text-xs tracking-widest font-semibold">
                        <th className="p-5 border-b border-[var(--border-card)]">Mã Voucher (CODE)</th>
                        <th className="p-5 border-b border-[var(--border-card)] text-center">Giảm giá (%)</th>
                        <th className="p-5 border-b border-[var(--border-card)] text-center">Số lượng</th>
                        <th className="p-5 border-b border-[var(--border-card)] text-center">Đã dùng</th>
                        <th className="p-5 border-b border-[var(--border-card)] text-center">Hết hạn</th>
                        <th className="p-5 border-b border-[var(--border-card)] text-center">Trạng thái</th>
                        <th className="p-5 border-b border-[var(--border-card)] text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-card)] text-gray-300">
                      {vouchers.map(v => (
                        <tr key={v.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-5">
                            <span className="font-mono text-lg font-bold text-[var(--accent-blue)] bg-blue-900/30 px-3 py-1 rounded-md border border-[var(--accent-blue)]">
                              {v.code}
                            </span>
                          </td>
                          <td className="p-5 text-center font-bold text-green-400 text-xl">{v.discount}%</td>
                          <td className="p-5 text-center font-bold ">{v.quantity ?? "∞"}</td>
                          <td className="p-5 text-center font-bold ">{v.used}</td>
                          <td className="p-5 text-center font-bold ">
                            {v.expired_at
                              ? new Date(v.expired_at).toLocaleString("vi-VN")
                              : "Không giới hạn"}
                          </td>
                          <td className="p-5 text-center">
                            {(() => {
                              const status = getStatus(v);

                              if (status === "ACTIVE")
                                return <span className="text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-sm">Khả dụng</span>;

                              if (status === "EXPIRED")
                                return <span className="text-yellow-400 bg-green-500/10 px-3 py-1 rounded-full text-sm">Hết hạn</span>;

                              if (status === "OUT")
                                return <span className="text-red-400 bg-green-500/10 px-3 py-1 rounded-full text-sm">Hết lượt</span>;

                              return <span className="text-gray-400 bg-green-500/10 px-3 py-1 rounded-full text-sm">Tắt</span>;
                            })()}
                          </td>
                          <td className="p-5 text-center">
                            <button
                              onClick={() => handleDeleteVoucher(v.id, v.code)}
                              className="btn-danger !py-1.5 !px-4 text-sm"
                            >
                              🗑️ Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )
    );
};

export default ManageVouchers;