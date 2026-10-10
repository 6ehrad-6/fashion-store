import React, { useState, useEffect } from 'react';
import { Search, Eye, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // بروزرسانی وضعیت سفارش
  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: status });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: status } : order
      ));
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, orderStatus: status });
      }
      alert('✅ وضعیت سفارش با موفقیت بروزرسانی شد!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('❌ خطا در بروزرسانی وضعیت سفارش!');
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id.includes(searchTerm) ||
    order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusOptions = [
    { value: 'pending', label: 'در انتظار', icon: Clock, color: 'text-yellow-400' },
    { value: 'processing', label: 'در حال پردازش', icon: Clock, color: 'text-blue-400' },
    { value: 'shipped', label: 'ارسال شده', icon: Truck, color: 'text-purple-400' },
    { value: 'delivered', label: 'تحویل شده', icon: CheckCircle, color: 'text-green-400' },
    { value: 'cancelled', label: 'لغو شده', icon: XCircle, color: 'text-red-400' },
  ];

  const getStatusInfo = (status) => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B51F4] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">مدیریت سفارشات</h1>
          <p className="text-white/60 text-sm mt-1">{orders.length} سفارش</p>
        </div>
      </div>

      {/* جستجو */}
      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
        <input
          type="text"
          placeholder="جستجوی سفارشات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#0B51F4]"
        />
      </div>

      {/* لیست سفارشات */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-right text-white/60 text-sm">#</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">کاربر</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">محصولات</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">مبلغ کل</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">وضعیت</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">تاریخ</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-white/40">
                    هیچ سفارشی وجود ندارد
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.orderStatus);
                  return (
                    <tr key={order._id} className="border-t border-white/5 hover:bg-white/5 transition">
                      <td className="px-4 py-3 text-white text-sm">#{order._id.slice(-6)}</td>
                      <td className="px-4 py-3 text-white text-sm">{order.user?.fullName || 'ناشناس'}</td>
                      <td className="px-4 py-3 text-white/60 text-sm">{order.items?.length || 0}</td>
                      <td className="px-4 py-3 text-white text-sm">{order.totalPrice?.toLocaleString()} تومان</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${statusInfo.color} bg-white/5`}>
                          <statusInfo.icon size={14} />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/60 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowDetailModal(true);
                            }}
                            className="p-2 hover:bg-[#0B51F4]/20 rounded-lg transition text-[#0B51F4]"
                            title="مشاهده جزئیات"
                          >
                            <Eye size={18} />
                          </button>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#0B51F4]"
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value} className="text-gray-800">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* مودال جزئیات سفارش */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#4E5055]/95 backdrop-blur-xl rounded-3xl border border-white/10 max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                جزئیات سفارش #{selectedOrder._id.slice(-6)}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* اطلاعات مشتری */}
              <div className="bg-white/10 rounded-2xl p-4">
                <h3 className="text-white/60 text-sm mb-2">اطلاعات مشتری</h3>
                <p className="text-white">{selectedOrder.user?.fullName}</p>
                <p className="text-white/60 text-sm">{selectedOrder.user?.email}</p>
                {selectedOrder.shippingAddress && (
                  <p className="text-white/60 text-sm mt-2">
                    {selectedOrder.shippingAddress.street}، {selectedOrder.shippingAddress.city}
                  </p>
                )}
              </div>

              {/* محصولات */}
              <div className="bg-white/10 rounded-2xl p-4">
                <h3 className="text-white/60 text-sm mb-2">محصولات</h3>
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm">{item.name}</p>
                      <p className="text-white/40 text-xs">
                        {item.quantity} × {item.price.toLocaleString()} تومان
                      </p>
                    </div>
                    <p className="text-white font-bold">
                      {(item.price * item.quantity).toLocaleString()} تومان
                    </p>
                  </div>
                ))}
              </div>

              {/* جمع کل */}
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="flex justify-between">
                  <span className="text-white/60">جمع کل</span>
                  <span className="text-white font-bold text-lg">
                    {selectedOrder.totalPrice?.toLocaleString()} تومان
                  </span>
                </div>
              </div>

              {/* تغییر وضعیت */}
              <div className="flex gap-2">
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrder._id, e.target.value);
                    setSelectedOrder({ ...selectedOrder, orderStatus: e.target.value });
                  }}
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#0B51F4]"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-gray-800">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;