import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, ShoppingBag, Package, DollarSign, 
  TrendingUp, Clock, CheckCircle, AlertCircle,
  Plus, Eye, BarChart3
} from 'lucide-react';
import api from '../../services/api';

const Dashboard = () => {
  // state برای ذخیره آمار
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // دریافت دیتا هنگام بارگذاری صفحه
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // تابع دریافت آمار از سرور
  const fetchDashboardData = async () => {
    try {
      // دریافت همزمان آمار و سفارشات اخیر
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/recent-orders'),
      ]);
      
      setStats(statsRes.data.data);
      setRecentOrders(ordersRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setLoading(false);
    }
  };

  // نمایش لودینگ
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B51F4] border-t-transparent"></div>
      </div>
    );
  }

  // کارت‌های آماری
  const statCards = [
    { 
      title: 'کاربران', 
      value: stats?.totalUsers || 0, 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      link: '/admin/users'
    },
    { 
      title: 'محصولات', 
      value: stats?.totalProducts || 0, 
      icon: Package, 
      color: 'from-purple-500 to-purple-600',
      link: '/admin/products'
    },
    { 
      title: 'سفارشات', 
      value: stats?.totalOrders || 0, 
      icon: ShoppingBag, 
      color: 'from-green-500 to-green-600',
      link: '/admin/orders'
    },
    { 
      title: 'فروش کل', 
      value: `${stats?.totalRevenue?.toLocaleString()} تومان`, 
      icon: DollarSign, 
      color: 'from-yellow-500 to-yellow-600',
      link: '/admin/orders'
    },
  ];

  return (
    <div className="p-6">
      {/* هدر داشبورد */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">داشبورد مدیریت</h1>
          <p className="text-white/60 text-sm mt-1">خلاصه کلی فروشگاه</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-[#0B51F4] text-white rounded-xl hover:scale-105 transition"
          >
            <Plus size={18} />
            <span>محصول جدید</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition border border-white/10"
          >
            <Eye size={18} />
            <span>مشاهده سفارشات</span>
          </Link>
        </div>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <card.icon size={32} className="text-white/60" />
            </div>
          </Link>
        ))}
      </div>

      {/* آمار اضافی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-3">
            <Clock className="text-[#0B51F4]" size={24} />
            <div>
              <p className="text-white/60 text-sm">سفارشات در انتظار</p>
              <p className="text-white text-xl font-bold">{stats?.pendingOrders || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={24} />
            <div>
              <p className="text-white/60 text-sm">سفارشات تحویل شده</p>
              <p className="text-white text-xl font-bold">{stats?.deliveredOrders || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-[#2ECC71]" size={24} />
            <div>
              <p className="text-white/60 text-sm">فروش ماه جاری</p>
              <p className="text-white text-xl font-bold">
                {stats?.monthlyRevenue?.toLocaleString()} تومان
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* آخرین سفارشات */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-white font-bold">آخرین سفارشات</h2>
          <Link to="/admin/orders" className="text-sm text-[#0B51F4] hover:text-[#0943c9] transition">
            مشاهده همه
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-right text-white/60 text-sm">#</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">کاربر</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">تعداد محصول</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">مبلغ</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">وضعیت</th>
                <th className="px-4 py-3 text-right text-white/60 text-sm">تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-white/40">
                    هیچ سفارشی وجود ندارد
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="border-t border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-white text-sm">#{order._id.slice(-6)}</td>
                    <td className="px-4 py-3 text-white text-sm">{order.user?.fullName || 'ناشناس'}</td>
                    <td className="px-4 py-3 text-white text-sm">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 text-white text-sm">{order.totalPrice?.toLocaleString()} تومان</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.orderStatus === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        order.orderStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.orderStatus === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {order.orderStatus === 'pending' ? 'در انتظار' :
                         order.orderStatus === 'processing' ? 'در حال پردازش' :
                         order.orderStatus === 'shipped' ? 'ارسال شده' :
                         order.orderStatus === 'delivered' ? 'تحویل شده' :
                         order.orderStatus === 'cancelled' ? 'لغو شده' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;